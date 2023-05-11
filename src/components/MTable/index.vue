<template>
  <div>
    <el-table ref="table" v-loading="$store.state.loading" :height="$props.height||innerHeight" v-bind="$props" :data="dataRender" @selection-change="selectionChange" @row-click="rowClick" v-on="$listeners">
      <template v-for="(item,index) in columnsRender">
        <el-table-column :key="index" :sortable="sortable" v-bind="item">
          <template v-if="item.slotScope" v-slot="{row, $index}">
            <!-- 插槽 -->
            <slot v-if="item.slotScope" :name="item.slotScope" :scope="{row, $index}" />
          </template>
          <template v-else-if="item.dictionary" slot-scope="{row}">
            {{ $utils.dictionaryTran(item.dictionary,row[item.prop]) }}
          </template>
          <template v-else-if="item.propName" slot-scope="{row}">
            {{ row[item.propName] }}
          </template>
          <template v-else-if="item.type === 'upload'" slot-scope="{row}">
            <div v-if="row[item.prop]" style="line-height:0">
              <el-avatar shape="square" :size="30" :src="row[item.prop][0]&&row[item.prop][0].url" @click.native="handlePictureCardPreview" />
            </div>
          </template>
          <template v-else-if="item.buttons" v-slot="{row, $index}">
            <!-- <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button> -->
            <el-button v-for="(btn,idx) in item.buttons" :key="idx" :disabled="btn.disabledRender?btn.disabledRender(row):btn.disabled" v-bind="btn" @click.stop="btn.act?act(btn.act,row, $index):btn.click(row, $index)">{{ btn.label }}</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" v-on="$listeners" @pagination="refresh" />

    <el-dialog title="图片预览" :visible.sync="dialogVisible" top="60px" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { Table } from 'element-ui'

export default {
  name: 'MTable',
  components: { Pagination },
  // extends: Table,
  props: Object.assign({ ...Table.props },
    {
      // 表格列
      columns: {
        type: Array,
        default() {
          return []
        }
      },
      // height: {
      //   type: [Number, String],
      //   default: '400px'
      // },
      border: {
        type: Boolean,
        default: true
      },
      sortable: {
        type: Boolean,
        default: false
      },
      rowKey: {
        type: [String, Function],
        default: 'id'
      },
      initLoad: {
        type: Boolean,
        default: true
      },
      url: {
        type: String,
        default: ''
      },
      url_del: {
        type: String,
        default: ''
      },
      method: {
        type: String,
        default: 'get'
      },
      query: {
        type: Object,
        default: function() {
          return {}
        }
      },
      selection: {
        type: Boolean,
        default: true
      },
      index: {
        type: Boolean,
        default: true
      },
      // 操作列/自定义列
      actionColumn: {
        type: Object,
        default: () => {
          return {
            label: '操作', sortable: false, fixed: 'right', width: 150,
            buttons: [
              {
                label: '修改', type: 'text', auth: 'edit',
                act: 'edit' // 调用组件内部方法用act，外部用click
                // click: row => {
                //   this.open(row)
                // }
              },
              {
                label: '删除', type: 'text', auth: 'del',
                act: 'del'
                // click: row => {
                //   this.del(row.id)
                // }
              }
            ]
          }
        }
      }
    }
  ),
  data() {
    return {
      innerHeight: (window.innerHeight - 222), // table 高度
      dialogVisible: false,
      dialogImageUrl: '',
      listLoading: false,
      list: [],
      total: 0,
      page: 1,
      limit: 10,
      selectedRows: []
    }
  },
  computed: {
    dataRender() {
      const { url, list, data } = this
      return url ? list : data
    },
    columnsRender() {
      const selectionCol = { type: 'selection', sortable: false, align: 'center', width: 40 }
      const indexCol = { type: 'index', label: '序号', align: 'center', width: 50 }
      const { columns, selection, index } = this
      const cols = [...columns]
      if (index) {
        cols.unshift(indexCol)
      }
      if (selection) {
        cols.unshift(selectionCol)
      }
      cols.push(this.actionColumn)
      return cols
    }
  },
  watch: {
    // url(val) {
    //   console.log('url:', val)
    //   if (val) {
    //     this.search()
    //   } else {
    //     // todo
    //   }
    // },
    dataRender() {
      // console.log('this.url:', this.url)
      if (!this.url) {
        this.total = this.dataRender.length
      }
    }
  },
  created() {
    for (const key in Table.methods) {
      if (!this[key]) {
        this[key] = (...args) => {
          this.$refs.table[key](...args)
        }
      }
    }
    this.resize()
    if (this.url) {
      this.initLoad && this.search()
    } else {
      this.total = this.dataRender.length
    }
  },
  mounted() {
    console.log('table.created:', this)
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    search(opt = {}) {
      this.selectedRows = []
      this.page = opt.page || 1
      const { query, url, method, page, limit } = this
      if (!url) {
        return
      }
      const params = Object.assign({ page, limit }, query, opt)
      this.opt = params
      const data = method === 'get' ? { params } : params
      this.$http[method](url, data).then(res => {
        // console.log(res)
        this.total = res.data.total
        this.list = res.data.records
      }).catch(() => {
        this.localLoading = false
      })
    },
    refresh(opt = {}) {
      // console.log('refresh:', opt)
      this.search({ ...this.opt, ...opt })
    },
    act(key, row, index) {
      this[key]({ ...row }, index)
    },
    edit(row, index) {
      this.$emit('open', row, index)
    },
    // 如配置中不存在url_del则安index下标静态删除表格数据，反之请求接口
    del({ id }, index) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '警告', { type: 'warning' }).then(() => {
        if (this.url_del) {
          this.$http.request({
            url: this.url_del,
            data: { id },
            method: 'post'
          }).then(() => {
            this.refresh()
          })
        } else {
          if (typeof index === 'object') {
          // 从后往前遍历要删除的元素下标，防止数组塌陷
            for (let i = index.length - 1; i >= 0; i--) {
              this.data.splice(index[i], 1)
              this.selectedRows.splice(index[i], 1)
            }
          } else {
            this.data.splice(index, 1)
            this.selectedRows.splice(index, 1)
          }
        }
      })
    },
    selectionChange(rows) {
      this.selectedRows = rows
      const index = []
      rows.forEach((o, i) => {
        const idx = this.dataRender.indexOf(o)
        if (idx > -1) {
          index.push(idx)
        }
      })
      index.sort((a, b) => a - b)
      this.selectedIndex = index
      // console.log('index:', index)
    },
    rowClick(row, column, event) {
      this.toggleRowSelection(row)
    },
    handlePictureCardPreview(e) {
      // console.log(e)
      this.dialogVisible = true
      this.dialogImageUrl = e.target.src
    },
    resize() {
      this.innerHeight = window.innerHeight - 222
    }
  }
}
</script>

<style scoped>
</style>

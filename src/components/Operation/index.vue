<template>
  <div>
    <el-row :gutter="gutter">
      <el-col :span="18" style="min-height:1px">
        <el-row v-if="less.length>0" :gutter="gutter" type="flex">
          <el-col :span="18">
            <m-form ref="searchForm" v-bind="$props" :columns="less" @submit="submit" />
          </el-col>
          <el-col :span="5" :offset="1">
            <el-button @click="submit()">查询</el-button>
            <el-button @click="resetForm()">重置</el-button>
            <el-button v-if="more.length>0" type="text" @click="drawer=true">展开 <i class="el-icon-arrow-down" /></el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6" class="text-right margin-bottom">
        <MDropdown :buttons="buttons.concat(addButtons)" :selected-rows="selectedRows" trigger="click" />
      </el-col>
    </el-row>

    <el-drawer title="搜索更多" :visible.sync="drawer" size="400px" direction="rtl">
      <div class="padding flex flex-col height-full">
        <div class="flex-1 over-hide over-y-auto scrollBar">
          <m-form ref="searchForm_more" v-bind="$props" :span="24" :columns="more" @submit="submit" />
        </div>
        <div class="text-center">
          <el-button type="primary" native-type="submit" @click="submit()">查询</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </div>
      </div>
    </el-drawer>

  </div>
</template>

<script>
const formName = ['searchForm', 'searchForm_more']
export default {
  name: 'MTable',
  props:
  {
    // 表格列
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    selectedRows: {
      type: Array,
      default() {
        return []
      }
    },
    buttons: {
      type: Array,
      default() {
        return [
          {
            label: '新增', type: 'primary',
            click: () => {
              this.open()
            }
          },
          {
            label: '删除', type: 'default',
            click: () => {
              this.del()
            },
            disabledRender: (rows) => {
              return !(rows.length)
            }
          }
        ]
      }
    },
    // 额外加按钮
    addButtons: {
      type: Array,
      default() {
        return []
      }
    },
    labelWidth: {
      type: [String],
      default: '90px'
    },
    gutter: {
      type: [Number],
      default: 10
    },
    span: {
      type: [Number],
      default: 8
    }
  },
  data() {
    return {
      drawer: false,
      formData: {}
    }
  },
  computed: {
    dataRender() {
      const { url, list, data } = this
      return url ? list : data
    },
    columnsRender() {
      const { columns } = this
      const cols = [...columns.filter(o => o.type)]
      return cols
    },
    less() {
      const { columnsRender } = this
      const list = [...columnsRender]
      return list.splice(0, 3)
    },
    more() {
      const { columnsRender } = this
      const list = [...columnsRender]
      return list.length > 3 ? list.splice(-list.length + 3) : []
    }
  },
  watch: {
    url(val) {
      if (val) {
        this.getList()
      }
    },
    dataRender() {
      if (!this.url) {
        this.total = this.dataRender.length
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    submit() {
      const formData = {}
      let flag = true
      formName.forEach(o => {
        const form = this.$refs[o]
        form && form.submit((values) => {
          if (values) {
            Object.assign(formData, values)
          } else {
            flag = false
          }
        })
      })
      if (flag) {
        this.drawer = false
        this.$emit('search', formData)
      }
    },
    resetForm() {
      formName.forEach(o => {
        this.$refs[o] && this.$refs[o].$refs.form.resetFields()
      })
      // this.$emit('refresh')
      this.$emit('search', {})
    },
    open() {
      this.$emit('open')
    },
    del() {
      this.$emit('del')
    }
  }
}
</script>


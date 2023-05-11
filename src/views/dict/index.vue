
<template>
  <div class="app-container">
    <Page ref="page" :config="config" />
    <!-- 编辑键值 -->
    <drag-dialog :title="opt_config.title" :visible.sync="opt_config.visible">
      <Page ref="opt_page" :config="opt_config" @save="saveRow" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="opt_config.visible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="save">保 存</el-button>
      </div>
    </drag-dialog>
  </div>
</template>
<script>
export default {

  data() {
    return {
      config: {
        columns: [
          // { label: 'ID', prop: 'id' },
          { type: 'input', label: '类型', prop: 'type', rules: { required: true }},
          { type: 'input', label: '描述', prop: 'remark' }
        ],
        form: {
          url: '/vue-admin-simple/dict/save'
        },
        table: {
          url: '/vue-admin-simple/dict/list',
          url_del: '/vue-admin-simple/dict/del',
          sortable: false,
          actionColumn: {
            label: '操作', fixed: 'right', width: 150,
            buttons: [
              {
                label: '键值', type: 'text',
                // auth: 'edit',
                click: (row, index) => {
                  this.editOpt(row, index)
                }
              },
              {
                label: '修改', type: 'text', auth: 'edit', act: 'edit' },
              {
                label: '删除', type: 'text', auth: 'del', act: 'del' }
            ]
          }
        }
      },
      opt_config: {
        visible: false,
        columns: [
          { type: 'input', label: '标签', prop: 'label', rules: { required: true }},
          { type: 'input', label: '键值', prop: 'value', rules: { required: true }},
          { type: 'input', label: '排序', prop: 'sort' }
        ],
        table: {
          height: 'auto',
          data: []
        },
        operation: {
          columns: []
        }
      }
    }
  },
  created() {

  },
  methods: {
    editOpt(row) {
      this.opt_config.visible = true
      this.opt_config.title = '字典：' + row.type
      this.current_row = row
      this.opt_config.table.data = [...row.options] || []
      // this.row = row
      // this.$refs.form.open()
    },
    saveRow(row, index) {
      if (index !== undefined) {
        Object.assign(this.opt_config.table.data[index], row)
      } else {
        this.opt_config.table.data.push(row)
      }
    },
    save() {
      this.current_row.options = this.opt_config.table.data
      this.$http.post('/vue-admin-simple/dict/save', this.current_row).then(() => {
        this.$store.dispatch('app/getDict')
        this.opt_config.visible = false
        this.refresh()
      })
    },
    refresh() {
      this.$refs.page.$refs.table.refresh()
    }
  }
}
</script>


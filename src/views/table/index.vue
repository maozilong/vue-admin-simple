<template>
  <div class="app-container">
    <Page ref="page" :config="config">
      <template v-slot:status="{scope}">
        <el-tag :type="scope.row.status | statusFilter">{{ $utils.dictionaryTran('article_status',scope.row.status) }}</el-tag>
      </template>
    </Page>
  </div>
</template>

<script>
// const conf =
export default {
  components: { },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'gray'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      config: {
        columns: [
          { label: 'ID', prop: 'id' },
          { label: '名称', prop: 'title', type: 'input',
            // value: '默认值',
            rules: { required: true },
            attr: {
              placeholder: '请输入一个吸引人的标题'
            },
            input: (val, form) => {
              // console.log('input:', val, form)
              form.setFields({ author: { attr: { disabled: !val }}})
            },
            // 搜索条件的属性，默认去掉rules、function
            search: {
              attr: {
                placeholder: '名称搜索试试'
              }
            }
          },
          { label: '作者', prop: 'author', type: 'input' },
          { label: '分类', prop: 'cate_id', propName: 'cate_name', type: 'select',
            request: {
              url: '/vue-admin-simple/cate/list',
              params: { enabled: '1', limit: 999 },
              transformResponse: (res) => {
                res.data.records = res.data.records.map(o => {
                  return { value: o.id, label: o.name }
                })
                return res
              }
            },
            attr: {
              multiple: true
              // props: { value: 'id', label: 'name' }
            }
          },
          { label: '状态', prop: 'status', type: 'select', dictionary: 'article_status', slotScope: 'status' },
          { label: '日期', prop: 'display_time', type: 'date-picker', attr: { valueFormat: 'yyyy-MM-dd' },
            search: { attr: { type: 'daterange', valueFormat: 'yyyy-MM-dd' }}
          },
          { label: '头像', prop: 'img', type: 'upload', attr: { limit: 1 }},
          { label: '详情', prop: 'remark', type: 'input', span: 24, width: 300, attr: { type: 'textarea', rows: '5' }}
        ],
        operation: {
          buttons: [
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
                return !(rows.length && rows.every(o => o.status !== '1'))
              }
            }
          ],
          addButtons: [
            {
              label: '操作...', type: 'default',
              children: [
                {
                  label: '导入导出', type: 'default',
                  children: [
                    {
                      label: '导入', type: 'default', icon: 'el-icon-upload',
                      click: row => {
                        // todo
                        console.log('import...')
                      },
                      disabledRender: (rows) => {
                        return !(rows.length)
                      }
                    },
                    {
                      label: '导出', type: 'default', icon: 'el-icon-download',
                      click: row => {
                        // todo
                        console.log('export...')
                      },
                      disabledRender: (rows) => {
                        return !(rows.length)
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        form: {
          url: '/vue-admin-simple/article/save'
        },
        table: {
          url: '/vue-admin-simple/article/list',
          url_del: '/vue-admin-simple/article/del',
          actionColumn: {
            label: '操作', fixed: 'right', width: 150,
            buttons: [
              {
                label: '修改',
                type: 'text',
                auth: 'edit',
                click: row => {
                  this.open(row)
                }
              },
              {
                label: '删除',
                type: 'text',
                auth: 'del',
                act: 'del',
                disabledRender: (row) => {
                  return row.status === '1'
                }
              }
            ]
          }
        }
      }
    }
  },
  created() {
  },
  methods: {
    save(data) {
      this.$http.post('/vue-admin-simple/article/save', data).then(() => {
        this.$refs.page.$refs.form.visible = false
        this.$refs.page.$refs.table.refresh()
      })
    },
    open(row) {
      console.log(row)
      this.$refs.page.$refs.form.open(row)
    },
    del() {
      this.$refs.page.del()
    }
  }
}
</script>

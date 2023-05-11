
<template>
  <div class="app-container">
    <Page ref="page" :config="config" />
  </div>
</template>
<script>
export default {

  data() {
    return {
      config: {
        columns: [
          { label: 'ID', prop: 'id' },
          { type: 'input', label: '编码', prop: 'code', rules: { required: true }},
          { type: 'input', label: '名称', prop: 'name', rules: { required: true },
            formatter: (row, col) => {
              return row.code + ' - ' + row.name
            }
          },
          { type: 'radio', label: '启用', prop: 'enabled', dictionary: 'yes_no', value: '1',
            change: (val, form) => {
              console.log('change:', val, form)
            }
          },
          { type: 'input', label: '备注', prop: 'remark', span: 24, attr: { type: 'textarea', rows: '2' }}
        ],
        form: {
          url: '/vue-admin-simple/cate/save'
        },
        table: {
          url: '/vue-admin-simple/cate/list',
          url_del: '/vue-admin-simple/cate/del'
        }
      }
    }
  },
  created() {
  },
  methods: {
  }
}
</script>


<template>
  <div class="app-container">
    <m-form ref="form" v-bind="form" @submit="submit" />
    <el-button :loading="$store.state.loading" type="primary" icon="el-icon-check" @click="submit">提 交</el-button>
    <el-button icon="el-icon-refresh-right" @click="resetForm">重 置</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        labelWidth: '110px',
        span: 8,
        columns: [
          { type: 'input', label: '标题', prop: 'title',
            value: '默认值',
            rules: { required: true },
            attr: {
              placeholder: '请输入一个吸引人的标题'
            },
            input: (val, form) => {
              // console.log('input:', val, form)
              form.setFields({
                cate_id: { attr: { disabled: !val }}
                // number: { hide: !val }
              })
            }
          },
          { type: 'radio', label: '单选框', prop: 'radio', dictionary: 'yes_no',
            change: (val, form) => {
              console.log('change:', val, form)
            }
          },
          { type: 'checkbox', label: '多选框', prop: 'checkbox', dictionary: 'yes_no' },
          { type: 'select', label: '状态', prop: 'status', dictionary: 'article_status', slotScope: 'status' },
          { type: 'select', label: '分类', prop: 'cate_id', propName: 'cate_name',
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
          { type: 'cascader', label: '级联选择', prop: 'cascader',
            options: [{ value: 'zhinan', label: '指南',
              children: [{ value: 'shejiyuanze', label: '设计原则',
                children: [{ value: 'yizhi', label: '一致' }, { value: 'fankui', label: '反馈' }]
              }]
            }]
          },
          { type: 'input-number', hide: false, label: '计数器', prop: 'number', value: 1, attr: { min: 1, max: 10 }},
          { type: 'switch', label: '开关', prop: 'switch', attr: { activeColor: '#13ce66' }},
          { type: 'rate', label: '评分', prop: 'rate' },
          { type: 'color-picker', label: '颜色选择', prop: 'color' },
          { type: 'slider', label: '滑块', prop: 'slider', attr: { }},
          { type: 'date-picker', label: '日期', prop: 'date', attr: { }},
          { type: 'date-picker', label: '日期时间', prop: 'date_time', attr: { type: 'datetime' }},
          { type: 'date-picker', label: '时间范围', prop: 'datetimerange', attr: { type: 'datetimerange' }},
          { type: 'upload', label: '头像', prop: 'img', attr: { limit: 1 }},
          { type: 'input', label: '详情', prop: 'remark', span: 24, width: 300, attr: { type: 'textarea', rows: '5' }}
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.submit(data => {
        console.log(JSON.stringify(data))
        this.$message(JSON.stringify(data))
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped>
</style>


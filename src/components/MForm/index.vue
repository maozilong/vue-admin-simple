<template>
  <div>
    <el-form ref="form" v-bind="$props" :model="formData" status-icon v-on="$listeners">
      <el-row :gutter="gutter">
        <el-col v-for="(item,index) in columnsRender" v-show="!item.hide" :key="index" :span="item.span||span">
          <el-form-item v-if="item.type" v-bind="item">
            <el-select v-if="item.type==='select'" v-model="formData[item.prop]" v-bind="item.attr" v-on="item.on">
              <el-option v-for="opt in item.options" :key="opt.value" v-bind="opt" />
            </el-select>
            <el-radio-group v-else-if="item.type==='radio'" v-model="formData[item.prop]" v-bind="item.attr" v-on="item.on">
              <el-radio v-for="opt in item.options" :key="opt.value" v-bind="opt" :label="opt.value">{{ opt.label }}</el-radio>
            </el-radio-group>
            <el-checkbox-group v-else-if="item.type==='checkbox'" v-model="formData[item.prop]" v-bind="item.attr" v-on="item.on">
              <el-checkbox v-for="opt in item.options" :key="opt.value" v-bind="opt" :label="opt.value">{{ opt.label }}</el-checkbox>
            </el-checkbox-group>
            <MUpload v-else-if="item.type==='upload'" v-model="formData[item.prop]" v-bind="item.attr" />
            <component :is="'el-'+item.type" v-else v-model="formData[item.prop]" :options="item.options" v-bind="item.attr" v-on="item.on" @keyup.enter.native="item.attr.type!=='textarea'&&submit()" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { deepMerge } from '@/utils'
import { Form } from 'element-ui'

export default {
  name: 'MForm',
  // components: { Pagination },
  inheritAttrs: false,
  props: Object.assign({ ...Form.props },
    {
      // 列
      columns: {
        type: Array,
        default() {
          return [
            // {}
          ]
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
    }
  ),
  data() {
    return {
      columnsRender: [],
      formData: {} // 表单数据
    }
  },
  computed: {
  },
  watch: {
    // columns(val) {
    //   console.log('columns.change...')
    //   this.createForm()
    // }
  },
  created() {
    // console.log('mf.created')
    this.createForm()
  },
  mounted() {
  },
  methods: {
    createForm(row = {}) {
      this.formData = { ...row }
      this.columns.forEach(o => {
        this.$set(this.formData, o.prop, row[o.prop] !== undefined ? row[o.prop] : o.value)
        if (o.propName) {
          this.$set(this.formData, o.propName, row[o.propName])
        }
        // 这里可以默认一些东西
        const attr = {}
        if (!o.attr) o.attr = {}
        attr.placeholder = (o.type === 'input' ? '请输入' : '请选择') + o.label
        if (o.type === 'date-picker') {
          attr.valueFormat = 'yyyy-MM-dd'
        }
        if (o.type === 'upload') {
          o.span = o.span || 24
          Object.assign(attr, { })
        }
        if (o.type === 'select') {
          attr.filterable = true
          // if (o.attr.multiple && !(o.value instanceof Array)) {
          //   this.formData[o.prop] = []
          // }
          if (o.request) {
            this.loadData(o)
          }
        }
        if (o.type === 'checkbox') {
          this.formData[o.prop] = this.formData[o.prop] || []
        }

        const sel = ['select', 'radio', 'checkbox']
        if (sel.includes(o.type)) {
          o.attr.props = Object.assign({ value: 'value', label: 'label' }, o.attr.props)
          Object.assign(o, { options: [], change: () => {} }, { ...o })
        }
        if (o.dictionary) {
          const dict = this.$store.state.app.dictionary[o.dictionary]
          if (dict) {
            o.options = dict.options || []
          } else {
            console.warn(`字段[${o.prop}-${o.label}]未匹配到字典类型：${o.dictionary}`)
          }
        }
        o.attr = { ...attr, ...o.attr }
        if (o.rules && !o.rules.message) {
          o.rules.message = attr.placeholder
        }
      })
      this.columnsRender = this.columns.map(o => {
        const { attr } = o
        return { ...o, attr: { clearable: true, ...attr }}
      })
      // 处理组件事件
      this.columnsRender.forEach(o => {
        if (!o.on) o.on = {}
        Object.keys(o).forEach((k) => {
          if (typeof o[k] === 'function') {
            o.on[k] = (val) => {
              if (o.propName) {
                const obj = o.options.filter(item => {
                  if (o.attr.multiple) {
                    return val.includes(item.value)
                  } else {
                    return val === item.value
                  }
                }).map(l => l.label)
                this.formData[o.propName] = obj.join(',')
              }
              o[k](val, this)
            }
            // 手动触发一次
            o[k](this.formData[o.prop], this)
          }
        })
      })
    },
    submit(cb) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (cb) {
            cb(this.formData)
          } else {
            this.$emit('submit', this.formData)
          }
        } else {
          console.log('error submit!!')
        }
      })
    },

    /**
     * 设置form，{fieldName: {label:'表单文字',value:'字段值'}}
     */
    setFields(opt) {
      Object.keys(opt).forEach(k => {
        const item = this.columnsRender.filter(o => o.prop === k)[0]
        // console.log(item)
        if (item) {
          deepMerge(item, opt[k])
        } else {
          console.warn(k, '不存在')
        }
      })
    },
    // 继承原form方法
    resetFields() {
      this.$refs.form.resetFields()
      this.createForm()
    },
    validate(callback) {
      this.$refs.form.validate(callback)
    },
    validateField(prop, callback) {
      this.$refs.form.validateField(prop, callback)
    },
    clearValidate(prop) {
      this.$refs.form.clearValidate(prop)
    },

    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    loadData(o) {
      this.$http(o.request).then(res => {
        const options = (res.data.records || res.data).map(opt => {
          const value = opt[o.attr.props.value]
          const label = opt[o.attr.props.label]
          return { value, label }
        })
        this.setFields({ [o.prop]: { options }})
      })
    }
  }
}
</script>

<style scoped>
::v-deep .el-upload-dragger{width: 100%;height: 100%;}
</style>

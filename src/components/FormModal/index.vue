<template>
  <div>
    <drag-dialog :title="title" :visible.sync="visible" :append-to-body="true">
      <m-form ref="form" v-bind="$props" title="" @submit="submit" />
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="visible = false">取 消</el-button>
        <el-button :loading="$store.state.loading" type="primary" icon="el-icon-check" @click="save">保 存</el-button>
      </div>
    </drag-dialog>
  </div>
</template>

<script>
import { Form } from 'element-ui'

export default {
  name: 'FormModal',
  inheritAttrs: false,
  // components: { Pagination },
  props: Object.assign({ ...Form.props },
    {
      // save API
      url: {
        type: [String],
        default: ''
      },
      method: {
        type: [String],
        default: 'post'
      },
      // 表格列
      columns: {
        type: Array,
        default() {
          return [
            // {}
          ]
        }
      }
    }
  ),
  data() {
    return {
      visible: false,
      index: undefined, // 编辑table的当前行
      formData: {}
    }
  },
  computed: {
    title() {
      const { index, $attrs } = this
      return $attrs.title || (index === undefined ? '新增' : '编辑')
    }
  },
  watch: {
  },
  created() {
    // this.$message('这是一条消息提示')
  },
  mounted() {
    // console.log('mounted:', this.$listeners)
  },
  methods: {
    open(row = {}, index) {
      this.index = index
      this.visible = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.$refs.form.createForm(row)
      })
    },
    submit(formData) {
      if (!this.$listeners.save) {
        this.saveData(formData)
      } else {
        this.visible = false
        this.$emit('save', { ...formData }, this.index)
      }
    },
    save() {
      this.$refs.form.submit((formData) => {
        if (formData) {
          this.submit({ ...formData })
        }
      })
      // setTimeout(() => {
      //   this.loading = false
      // }, 500)
    },
    saveData(data) {
      this.$http[this.method](this.url, data).then(() => {
        this.visible = false
        this.$emit('refresh')
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

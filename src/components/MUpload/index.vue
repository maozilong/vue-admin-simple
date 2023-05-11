<template>
  <div>
    <el-upload
      list-type="picture-card"
      :drag="true"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="onSuccess"
      :on-error="onError"
      :on-exceed="onExceed"
      :http-request="uploadFile"
      :file-list="value"
      v-bind="$props"
      :class="{hideUpload:value.length >= limit}"
      v-on="$listeners"
    >
      <i title="将文件拖到此处，或点击上传" class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" title="图片预览" top="1vh" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'MUpload',
  // components: { Pagination },
  props: Object.assign({ /* ...Upload.props*/ },
    {
      action: {
        type: String,
        default: '/file/upload'
      },
      limit: {
        type: Number,
        default: 1
      },
      value: {
        type: Array,
        default() {
          return []
        }
      },
      headers: {
        type: Object,
        default() {
          return {
            // 'X-Token': getToken(),
            // Authorization: 'Bearer 60ee6903-c4e4-4e24-be0f-df1d93e8d108'
          }
        }
      }
    }
  ),
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  watch: {
    value(val) {
      console.log('watch.value:', val)
      // this.$emit('input', val)
    }
  },
  created() {
    console.log('props:', this.$props)
  },
  mounted() {
  },
  methods: {
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      // this.value = fileList
      this.$emit('input', fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    onExceed(files, fileList) {
      console.log('onExceed:', files, fileList)
      this.$message({
        message: `最多不能超过${this.limit}个文件`,
        type: 'error',
        duration: 5 * 1000
      })
    },
    onSuccess(res, file, fileList) {
      console.log(res, file, fileList)
      if (res.code === 20000) {
        this.value.push(res.data)
        this.$emit('input', this.value)
      } else {
        fileList.pop()
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 3 * 1000
        })
        this.onError(res, file, fileList)
        return false
      }
    },
    onError(err, file, fileList) {
      console.log('upload.error:', err, file, fileList)
    },

    // 自定义上传，用以模拟上传图片
    uploadFile(config) {
      // console.log(config)
      // 构造 FormData 对象，添加需要提交的文件和其他参数
      const formData = new FormData()
      formData.append('file', config.file)
      this.$http.post('/file/upload', formData).then(res => {
        this.onSuccess(res, config.file, this.value)
      })
    }
  }
}
</script>

<style scoped>
::v-deep .el-upload-dragger{width: 100%;height: 100%;}
::v-deep .hideUpload .el-upload--picture-card {
  display: none;
}
::v-deep .el-upload-list__item{
     transition:none !important;
     -webkit-transition:nonne !important;
}
::v-deep .el-upload-list__item-name{
     transition:none !important;
     -webkit-transition:nonne !important;
}
</style>

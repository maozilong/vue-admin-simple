
<template>
  <el-dialog :title="title" :fullscreen="fullscreen" top="60px" v-bind="$attrs" :close-on-click-modal="false" class="draggable-dialog" v-on="$listeners">
    <!-- <i class="el-icon-full-screen" /> -->
    <div class="el-icon-full-screen" @click="fullScreenHandle" />
    <slot />
    <div slot="footer">
      <slot name="footer" />
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: [String],
      default: ''
    }
  },
  data() {
    return {
      fullscreen: false,
      drag: true,
      mouseX: 0,
      mouseY: 0,
      isDragging: false,
      wrapperX: 0,
      wrapperY: 0
    }
  },
  watch: {
    wrapperY(val) {
      this.wrapper.style.top = this.wrapperY + 'px'
    },
    wrapperX(val) {
      this.wrapper.style.left = this.wrapperX + 'px'
    },
    '$attrs.visible'(val) {
      if (val) {
        this.wrapperY = 0
        this.wrapperX = 0
      }
    }
  },
  mounted() {
    if (this.drag) {
      this.header = this.$el.querySelector('.el-dialog__header')
      this.wrapper = this.$el.querySelector('.el-dialog')
      this.header.style.cursor = 'move'
      // this.header.style.userSelect = 'none'
      this.header.addEventListener('mousedown', this.onMouseDown)
      document.addEventListener('mouseup', this.onMouseUp)
      document.addEventListener('mousemove', this.onMouseMove)
    }
  },
  beforeDestroy() {
    if (this.drag) {
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
    }
  },
  methods: {
    fullScreenHandle() {
      this.fullscreen = !this.fullscreen
    },
    onMouseDown(event) {
      this.isDragging = true
      this.mouseX = event.clientX
      this.mouseY = event.clientY
      this.wrapperX = parseInt(getComputedStyle(this.wrapper).left) || 0
      this.wrapperY = parseInt(getComputedStyle(this.wrapper).top) || 0
    },
    onMouseUp() {
      this.isDragging = false
    },
    onMouseMove(event) {
      if (this.isDragging) {
        const deltaX = event.clientX - this.mouseX
        const deltaY = event.clientY - this.mouseY
        this.wrapperX += deltaX
        this.wrapperY += deltaY
        this.mouseX = event.clientX
        this.mouseY = event.clientY
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.el-icon-full-screen{
  color: #909399;
  position: absolute;
  top: 13px;
  right: 40px;
  cursor: pointer;
}
</style>

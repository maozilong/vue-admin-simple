<template>
  <div class="">
    <el-dropdown v-for="(btn,idx) in buttons" :key="idx" v-bind="$attrs">
      <el-button :disabled="btn.disabledRender?btn.disabledRender(selectedRows):btn.disabled" v-bind="btn" @click.stop="btn.click&&btn.click()">{{ btn.label }} <span v-if="btn.children&&btn.children.length"> <i class="el-icon-arrow-down" /></span></el-button>
      <el-dropdown-menu slot="dropdown" :class="{hide:!btn.children||!btn.children.length}">
        <el-dropdown-item v-for="(btn2,idx2) in btn.children" :key="idx2">
          <MDropdown :buttons="[btn2]" :selected-rows="selectedRows" v-bind="$attrs" />
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'MDropdown',
  inheritAttrs: false,
  props: {
    buttons: {
      type: Array,
      required: true
    },
    selectedRows: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
.el-dropdown-menu__item{
  padding: 3px 8px;
}
</style>

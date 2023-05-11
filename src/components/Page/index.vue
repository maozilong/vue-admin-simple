<template>
  <div>
    <operation v-bind="conf.operation" :selected-rows="selectedRows" v-on="$listeners" @search="search" @refresh="refresh" @open="open" @del="del" />
    <m-table ref="table" v-bind="conf.table" v-on="$listeners" @open="open" @selection-change="selectionChange">
      <template v-for="(item) in conf.table.columns.filter(o=>o.slotScope)" v-slot:[item.slotScope]="{scope}">
        <!-- 自定义列 -->
        <slot v-if="item.slotScope" :name="item.slotScope" :scope="{...scope}" />
      </template>
    </m-table>
    <form-modal ref="form" v-bind="conf.form" v-on="$listeners" @refresh="refresh" />
  </div>
</template>

<script>
export default {
  name: 'Page',
  components: {
  },
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      selectedRows: [],
      conf: this.one23(this.config)
    }
  },
  created() {
    // this.conf = this.one23(this.config)
  },
  methods: {
    /**
     * 把columns配置分成3份，
     * @param {*} config
     * @returns operation, table, form
     */
    one23(config) {
      const { operation = {}, table = {}, form = {}, columns } = config
      const cols = [...columns]
      // 搜索条件的属性，默认去掉rules、监听事件、默认值
      if (!operation.columns) {
        operation.columns = cols.map(_o => {
          const o = { ..._o }
          const { search } = o
          delete o.rules
          delete o.search
          delete o.value
          if (o.type === 'upload') {
            delete o.type
          }
          Object.keys(o).forEach((k) => {
            if (typeof o[k] === 'function') {
              delete o[k]
            }
          })
          return { ...o, ...search }
        })
      }
      table.columns = cols.map(o => {
        const { table } = o
        delete o.table
        return { ...o, ...table }
      })
      form.columns = cols.map(o => {
        const { form } = o
        delete o.form
        return { ...o, ...form }
      })
      return { operation, table, form }
    },
    // 搜索
    search(formData) {
      console.log('search:', formData)
      if (!this.$listeners.search) {
        this.$refs.table.search(formData)
      } else {
        this.$emit('search', formData)
      }
    },
    refresh() {
      if (!this.$listeners.refresh) {
        // this.$refs.table.page = 1
        this.$refs.table.refresh()
      } else {
        this.$emit('refresh')
      }
    },
    // 添加、编辑
    open(row, index) {
      if (!this.$listeners.open) {
        this.$refs.form.open(row, index)
      } else {
        this.$emit('open', row, index)
      }
    },
    // 批量删除
    del() {
      const ids = this.$refs.table.selectedRows.map(o => o.id)
      const selectedIndex = this.$refs.table.selectedIndex
      if (!this.$listeners.del) {
        this.$refs.table.del({ id: ids }, selectedIndex)
      } else {
        this.$emit('del', ids, selectedIndex)
      }
    },
    selectionChange(rows) {
      // console.log('selectionChange:', rows)
      this.selectedRows = rows
    }
  }
}
</script>


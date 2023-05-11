# vue-admin-simple

> 这是一个简易的 vue admin 前后端分离-管理后台。它使用 Vue2 + Element UI，花裤衩/vue-admin-template手脚架技术栈开发，并对Element UI的表单、表格进行二次封装，支持用户自定义表单配置并进行数据操作。开发一个实现增删改查的页面只需要配置几行代码即可，大大减少重复工作量。

## 快速开始 Build Setup

```bash
# 克隆项目
git clone https://gitee.com/maozilong/vue-admin-simple.git
# 进入项目目录
cd vue-admin-simple
# 安装依赖
npm install
# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org
# 启动服务
npm run dev
```
浏览器访问 [http://localhost:9528](http://localhost:9528)

# 超页面<Page>组件说明

```html
<Page ref="page" :config="config" />
```
## 超页面-属性

```html
page: {
  columns: [  // 超页面项[Object]，必选, 搜索条件、table、表单公用字段
    {
      ...{}, // 参数参考m-form,m-table组件，有些属性重写，详情往下看。

      // 搜索条件的属性，默认去掉rules、监听事件、默认值、upload类型
      search: {  // 有配置则重写搜索栏配置
        attr: { placeholder: '输入名称搜索' } // 如：希望搜索栏的占位符为：输入名称搜索
      },
    }
  ],
  form: {}, // 重写m-form配置
  table: {}, // 重写m-table配置
  operation: {}, // 重写operation配置
}
```
## 超页面-事件

```html
// ...继承m-form、m-table、operation组件的所有事件
// 搜索，opt：搜索条件，若父组件没有监听，则给m-table自动处理
search(opt)

// 刷新数据，opt：搜索条件，若父组件没有监听，则给m-table自动处理
refresh(opt)

// 打开FormModal，若父组件没有监听，则给FormModal组件自动处理
open(row, index) // row, 选择的行；index，m-table下标

// 删除行数据obj.id:数据行id，若父组件没有监听，则给m-table自动处理
del() // 参考m-table.del(obj, index)方法
```

## 超页面-示例

> 40几行代码完成一个带有增删改查操作的页面。（支持批量删除）

```html
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

```

# 表单<m-form>组件说明

```
<m-form ref="form" v-bind="form" />
```
## 表单-属性

```
form: {
  ...{}, // 继承Element UI Form的所有属性
  columns: [  // 表单项[Object]，必选,
    {
      ...{}, // 继承Form-Item所有属性，有些属性重写，详情往下看。
      type: 'input', // 类型，支持所有Form类型组件，去掉‘el-’前缀，如：input,select,checkbox,switch...
      label: '用户名', // 标签文本
      prop: 'name', // 绑定的字段值
      propName: 'propName', // 为显示名称字段，如select类型时候，保存的是id，显示却是name
      value: '张三', // 表单字段默认值
      span: 8, // col 布局的值，默认 8
      options: [], // 可选项数据源，键名可通过 Props 属性配置 增加3个类型支持：select,checkbox,radio
      dictionary: '', // 选项为字典数据时使用，支持的类型：select,checkbox,radio
      slotScope: '', // 插槽，暂时只支持table
      attr: { // 绑定的属性，继承type对应Form组件的所有属性
        placeholder: '请(输入|选择)${label}', // 未设置时的默认值
        valueFormat: 'yyyy-MM-dd' // 当date-picker类型时默认：yyyy-MM-dd
        props: { value: 'id', label: 'name' } // 增加3个类型支持：select,checkbox,radio
      },
      request: {config: axios}, // 远程请求配置，获取树结构，甚至列表接口。详情参考axios用法。 
      change: (val, form) => { // 值变化回调，支持type对应Form组件的所有事件，如：input,change,focus...
        // 返回参数说明： val,对应事件的返回值；form，当前表单
        form.setFields({
          [prop]: { attr: { disabled: !val }}
        })
      },
    }
  ] ,
}
```
## 表单-方法

```
// ...继承form所有方法

// 初始化表单，formData：表单数据
createForm(formData)

// 验证并提交表单，返回表单数据
submit(callback: Function(formData))

// 根据字段名prop设置表单属性：option: {[prop]: {label:'表单文字',value:'字段值'}}
setFields(option)
```

## 表单-示例

```
<template>
  <div class="app-container">
    <m-form ref="form" v-bind="form" @submit="submit" />
    <el-button type="primary" icon="el-icon-check" @click="submit">提 交</el-button>
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
          { type: 'input', label: '标题', prop: 'title', value: '默认值', rules: { required: true },
            input: (val, form) => {
              form.setFields({
                status: { attr: { disabled: !val }}
              })
            }
          },
          { type: 'checkbox', label: '多选框', prop: 'checkbox', dictionary: 'yes_no' },
          { type: 'select', label: '状态', prop: 'status', dictionary: 'article_status' },
          { type: 'date-picker', label: '时间', prop: 'datetime', attr: { type: 'datetime' }}
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.submit(data => {
        this.$message(JSON.stringify(data))
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

```

# 表格<m-table>组件说明

```
<m-form ref="table" v-bind="table" />
```
## 表格-属性

```
table: {
  ...{}, // 继承Element UI table的所有属性，有些属性重写，详情查看组件。
  initLoad: true, // 是否初始请求数据，默认true
  url: '', // 请求数据接口
  method: 'get', // 请求数据接口方法，默认get
  query: {}, // 请求数据接口参数
  url_del: '', // 删除接口
  data: [], // 不存在url则用原数据
  selection: true, // 开启selection列，默认true
  index: true, // 开启index列，默认true
  columns: [  // 表格项[Object]，必选,
    {
      ...{}, // 继承Table-column所有属性，有些属性重写，详情往下看。
      label: '用户名', // 标签文本
      prop: 'name', // 绑定的字段值
      propName: 'propName', // 为显示名称字段，如select类型时候，保存的是id，显示却是name
      dictionary: '', // 选项为字典数据时使用
      slotScope: '', // 自定义插槽名称
    }
  ],
  actionColumn: [  // 自定义操作列，默认有编辑，删除
    ...{}, // 继承Table-column所有属性
    buttons: [ // 里面的操作按钮
      ...{}, // 继承el-button所有属性
      label: '', // 名称
    ]
  ],
}
```
## 表格-方法

```
// ...继承table所有方法
// 搜索，opt：搜索条件
search(opt)

// 刷新数据，opt：搜索条件
refresh(opt)

// 删除行数据obj.id:数据行id，数组则批量删除；index：数据行下标，也可以是数据
del(obj, index) // 如配置中不存在url_del则安index下标静态删除表格数据，反之请求接口
```

## 表格-示例

```
<template>
  <div class="app-container">
    <m-table ref="table" v-bind="table" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      table: {
        data: [],
        columns: [
          { type: 'input', label: '标题', prop: 'title', value: '默认值', rules: { required: true } },
          { type: 'checkbox', label: '多选框', prop: 'checkbox', dictionary: 'yes_no' },
          { type: 'select', label: '状态', prop: 'status', dictionary: 'article_status' },
          { type: 'date-picker', label: '时间范围', prop: 'datetime', attr: { type: 'datetime' }}
        ]
      }
    }
  }
}
</script>
```

# 操作<operation>组件说明

```
<operation ref="operation" v-bind="operation" />
```
## 操作组件-属性
操作组件分两部分：
1、搜索条件，参考m-form表单
2、操作按钮，
```
operation: {
  ...{},
  columns: [], // 搜索条件，参考m-form表单
  buttons: [  // 自定义操作列，默认有编辑，删除
    ...{}, // 继承el-button所有属性
    label: '', // 名称
    disabledRender: (rows) => { // 控制disabled状态，rows是table的选择项
      return !(rows.length)
    },
    children: [
      // 子级操作按钮，无限级，参数同父级
    ]
  ],
  addButtons: [] // 默认[]，参数配置同上，叠加默认按钮组
}
```
## 操作组件-方法

```
// 提交，formData：搜索条件
submit() // 触发一个带搜索条件数据的search(formData)事件，

// 重置搜索条件，并出发search事件
resetForm()

// 触发open事件
open()
// 触发del事件
del()

```

# 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

更多信息请参考 [vue-admin-template使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/)


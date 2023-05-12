[简体中文](./README.md) | English

# Introduction

> vue-admin-simple is a simple Vue admin management system with front-end and back-end separation architecture. It's developed using Vue2 + Element UI, leveraging the scaffolding technology from flower pants/vue-admin-template. Element UI form and table components are optimized and encapsulated to support custom form configurations and data operations. Only a few lines of code are needed to develop pages that implement CRUD operations, greatly reducing redundant workloads.


## Demo
[Online Preview](http://www.easytouser.com/demo/vue-admin)

## Quick Start

```bash
# Clone project
git clone https://gitee.com/maozilong/vue-admin-simple.git
# Go to the project directory
cd vue-admin-simple
# Install dependencies
npm install
# Start server
npm run dev
# Visit http://localhost:9528 in your browser
```

# Page Component

```html
<Page ref="page" :config="page" />
```
## Page Component Properties

```javascript
page: {
  ...{}, // Inherits all attributes of Form and Table components in Element UI.
  span: 8, // The col layout of the entire form. Default value is 8.
  columns: [  // Page item[Object], required parameter, shared by search conditions, table, and forms; configure only once.
    {
      ...{}, // Inherits all attributes of Form-Item or Table-column components; some attributes are overwritten, see below.
      type: 'input', // Type of component; supports all Form-type components. Remove the "el-" prefix, such as input,select,checkbox,switch...
      label: 'Username', // Label text.
      prop: 'name', // Bound field value.
      propName: 'propName', // Display name field, for example, when the select type is used, the id is saved, but the display name is the name.
      value: 'Zhang San', // Default value of form field.
      span: '', // The value of the current col layout. Default is the form's span.
      options: [], // Optional data source; the key name can be configured through Props attribute. Adds support for three types: select, checkbox, and radio.
      dictionary: '', // When the option is a dictionary data, it is used. Supported types: select, checkbox, radio.
      slotScope: '', // Slot; currently only supports table.
      attr: { // Bound attributes; inherits all attributes of Form component corresponding to type.
        placeholder: 'Please enter ${label}', //Default value when it is not set
        valueFormat: 'yyyy-MM-dd' // Default is 'yyyy-MM-dd' when it's a date-picker type.
        props: { value: 'id', label: 'name' } // Adds support for three types: select, checkbox, radio.
      },
      request: {config: axios}, // Remote request configuration that obtains tree structure and even list interface. See Axios documentation for details. 
      change: (val, form) => { // Value-change callback; supports all events of the Form component corresponding to type and Table-column events.
        // Parameter description: val, the return value of the corresponding event; form, current form.
        form.setFields({
          [prop]: { attr: { disabled: !val }}
        })
      },
      // Search condition properties; default excludes rules, monitoring events, default values, and upload types.
      search: {  // If there is a configuration, overwrite the search bar configuration.
        attr: { placeholder: 'Enter name to search.' } // For example, if you want the search bar placeholder to be: Enter name to search.
      },
      table: {}, // Overwrite with configuration.
      form: {}, // Overwrite with configuration.
    }
  ],
  form: {}, // Configuration reference for m-form.
  table: {}, // Configuration reference for m-table.
  operation: {}, // Configuration reference for operation.
}
```
## Page Component Events

```javascript
// Inherits all events of m-form, m-table, and operation components.
// Search; opt: search criteria. If the parent component is not monitoring, it will be automatically handled by the m-table.
search(opt)

// Refresh data; opt: search criterias. If the parent component is not monitoring, it will be automatically handled by the m-table.
refresh(opt)

// Open FormModal; if the parent component is not monitoring, it will be automatically handled by the FormModal component.
open(row, index) // row, selected row. Index, m-table index.

// Delete row data obj.id: data row ID. If the parent component is not monitoring, it will be automatically handled by the m-table.
del() // Refer to the m-table.del(obj, index) method.
```

## Page - Example

> A page with CRUD operations (supporting batch deletion) can be implemented in less than 40 lines of code.

```vue
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
          { type: 'input', label: 'Code', prop: 'code', rules: { required: true }},
          { type: 'input', label: 'Name', prop: 'name', rules: { required: true },
            formatter: (row, col) => {
              return row.code + ' - ' + row.name
            }
          },
          { type: 'radio', label: 'Enabled', prop: 'enabled', dictionary: 'yes_no', value: '1',
            change: (val, form) => {
              console.log('change:', val, form)
            }
          },
          { type: 'input', label: 'Remark', prop: 'remark', span: 24, attr: { type: 'textarea', rows: '2' }}
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

# m-form Component Description

```html
<m-form ref="form" v-bind="form" />
```
## m-Form Properties

```javascript
form: {
  ...{}, // Inherit all Element UI form properties
  span: 8, // The value of the `col` property for the entire form layout, default: 8
  columns: [  // Form item configuration attributes object, required field
    {
      ...{}, // Inherit all Form-Item properties, some properties are overwritten, to be continued below.
      type: 'input', // Type of form item. Support all component types of Form-Item by removing 'el-' prefix, e.g. input, select, checkbox, switch, etc.
      label: 'Username', // Label text of form item
      prop: 'name', // Bound field value of form item
      propName: 'propName', // Display name field, usually used in Select type form item when saving id and displaying name
      value: 'John Doe', // Default value of form item field
      span: '', // The value of "col" property for current column layout, the default value is taken from the `form.span` property.
      options: [], // Optional options data source. Key names can be configured as props. Additional support for 3 component types: select, checkbox, radio.
      dictionary: '', // Use this when options are dictionary data. Supported types: select, checkbox, radio.
      slotScope: '', // Slot attribute. Currently only used in table element.
      attr: { // Attributes binding to the form item, inherits all properties of the corresponding Form component according to its type.
        placeholder: 'Please (enter|choose) ${label}', // Default value when no value is set.
        valueFormat: 'yyyy-MM-dd' // Default format for date-picker type: 'yyyy-MM-dd'.
        props: { value: 'id', label: 'name' } // Additional support for 3 component types: select, checkbox, radio.
      },
      request: {config: axios}, // Remote request configuration for fetching tree structure or list items. Refer to Axios for further details.
      change: (val, form) => { // Callback function when the value of form item changes. Supports all Form component events such as input, change, focus, etc.
        // Explanation of returned parameters: val is the return value of the corresponding event; form is the current form object
        form.setFields({
          [prop]: { attr: { disabled: !val }}
        })
      },
    }
  ] ,
}
```
## m-Form Methods

```javascript
// ...Inherit all form methods.

// Initialize form with formData.
createForm(formData)

// Validate and submit form data. Returns the valid form data.
submit(callback: Function(formData))

// Set form properties according to the field name 'prop'. Option: { [prop]: { label: 'Form Label', value: 'Field Value' }}
setFields(option)

```

## m-form Example

```vue
<template>
  <div class="app-container">
    <m-form ref="form" v-bind="form" @submit="submit" />
    <el-button type="primary" icon="el-icon-check" @click="submit">Submit</el-button>
    <el-button icon="el-icon-refresh-right" @click="resetForm">Reset</el-button>
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
          { type: 'input', label: 'Title', prop: 'title', value: 'default value', rules: { required: true },
            input: (val, form) => {
              form.setFields({
                status: { attr: { disabled: !val }}
              })
            }
          },
          { type: 'checkbox', label: 'Checkbox', prop: 'checkbox', dictionary: 'yes_no' },
          { type: 'select', label: 'Status', prop: 'status', dictionary: 'article_status' },
          { type: 'date-picker', label: 'Time', prop: 'datetime', attr: { type: 'datetime' }}
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

# m-table Component Documentation

```html
<m-form ref="table" v-bind="table" />
```
## m-Table - Properties

```javascript
table: {
  ...{}, // Inherits all properties of ElementUI table. Some properties may be overwritten. Refer to the component for more details.
  initLoad: true, // Optional. Determines whether or not data should be loaded initially. Default is "true".
  url: '', // Required when fetching data from a remote server. Specifies the URL of the data API.
  method: 'get', // Optional. Specifies the HTTP method for the URL. Default is "get".
  query: {}, // Optional. Specifies query parameters for the API call.
  url_del: '', // Optional. Specifies an API endpoint for deleting records.
  data: [], // Required when no URL is specified. Stores the data inside the component.
  selection: true, // Optional. Enables/disables the selection column. Default value is "true".
  index: true, // Optional. Enables/disables the index column. Default value is "true".
  columns: [  // Required. Defines table columns as objects.
    {
      ...{}, // Inherits all properties of Table-column. Some properties may be overwritten. Refer to the component for more details.
      label: 'Username', // Optional. Specifies the label text.
      prop: 'name', // Required. Binds to the field value in the data source.
      propName: 'propName', // Optional. Specifies the display name field, such as it can save an id but display the corresponding name.
      dictionary: '', // Optional. For select options that use dictionary data.
      slotScope: '', // Optional. For custom slot naming.
    }
  ],
  actionColumn: [  // Optional. Customizes the operation column with edit and delete buttons by default.
    ...{}, // Inherits all properties of Table-column. Refer to the component for more details.
    buttons: [ // Key to define operation buttons
      ...{}, // Inherits all properties of el-button. Refer to the component for more details.
      label: '', // Button label text.
    ]
  ],
}

```
## m-Table - Methods

```javascript
// ...Inherits all methods of the table component.

// Search for data with the specified options.
search(opt)

// Reloads data with the specified options.
refresh(opt)

// Deletes the specified row(s). If no url_del property is specified, delete it only from the DataTable instance; otherwise, delete it through the server API endpoint.
del(obj, index)

```

## m-Table - Example

```vue
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
          { type: 'input', label: 'Title', prop: 'title', value: 'Default value', rules: { required: true } },
          { type: 'checkbox', label: 'Checkbox', prop: 'checkbox', dictionary: 'yes_no' },
          { type: 'select', label: 'Status', prop: 'status', dictionary: 'article_status' },
          { type: 'date-picker', label: 'Date range', prop: 'datetime', attr: { type: 'datetime' }}
        ]
      }
    }
  }
}
</script>
```

# operation Component Documentation

```javascript
<operation ref="operation" v-bind="operation" />
```
## Component - Properties
The operation component consists of two parts:

1.Search criteria, referring to the m-form component
2.Buttons for performing various operations.

```javascript
operation: {
  ...{},
  columns: [], // Search criteria, referring to the m-form component
  buttons: [  // Optional. Customizes the operation buttons with edit and delete buttons by default.
    ...{}, // Inherits all properties of el-button. Refer to the component for more details.
    label: '', // Button label text.
    disabledRender: (rows) => { // Function that controls the disabled status of the button. Rows refers to the selected rows in datatable.
      return !(rows.length)
    },
    children: [
      // Child operation buttons.
    ]
  ],
  addButtons: [] // Optional. Default value is an empty array. Appends to the custom and default button groups.
}

```
## Component - Methods

```javascript
// Submits search criteria data.
submit() // Triggers a "search(formData)" event with the current form data as the parameter.

// Resets the search criteria and triggers a "search" event.
resetForm()

// Triggers an "open" event.
open()
// Triggers a "del" event.
del()


```

# Other
> There are additional components included with this package like DragDialog, FormModal, MDropdown and MUpload

> along with a localDb module that can emulate local database operations based on axios and mocking data. see:utils/mockDb/localDb.js

> This code has been built using the Element UI library!

# Release

```bash
# Build for staging environment
npm run build:stage

# Build for production environment
npm run build:prod
```

For more information, you can refer to the [vue-admin-template documentation](https://panjiachen.github.io/vue-element-admin-site/zh/)



// 一些常量
var CONSTPARAMS = {
  ZERO: 0,
  MINUS1: { code: -1, msg: '请求失败' },
  POSITIVE1: 20000,
  MYTRUE: true,
  MYFALSE: false,
  MYNULL: null
}

// JSON字符串转化为对象
function _JSON2Obj(jsonStr) {
  if (typeof jsonStr === 'object') {
    console.error('can not translate Object to Object in _JSON2Obj function')
    return null
  }
  return window.JSON.parse(jsonStr)
}
// JSON对象转化为JSON字符串
function _Obj2JSON(obj) {
  if (typeof jsonStr === 'string') {
    console.error('can not translate string to string in _Obj2JSON function')
    return null
  }
  return window.JSON.stringify(obj)
}
function _isBlank(value) {
  return (value === undefined || value === null || value.trim && value.trim() === '')
}
// 查询localstorage中有没有虚拟的表名
function _hasTable(tableName) {
  if (window.localStorage) {
    if (window.localStorage.getItem(tableName)) {
      return CONSTPARAMS.MYTRUE
    } else {
      window.console.warn('table "' + tableName + '" is not exist')
      return CONSTPARAMS.MYFALSE
    }
  } else {
    window.console.error("Your browser doesn't support localStorage")
    return CONSTPARAMS.MYFALSE
  }
}
// 从localstorage中获取值
function _getItem(tableName) {
  if (tableName) {
    if (_hasTable(tableName)) {
      return _JSON2Obj(window.localStorage.getItem(tableName))
    }
  } else {
    console.error(tableName + 'empty')
    return CONSTPARAMS.MYNULL
  }
}
// 向localstorage中存入值
function _setItem(tableData, tableName) {
  if (tableName) {
    if (tableData) {
      window.localStorage.setItem(tableName, _Obj2JSON(tableData))
      return CONSTPARAMS.POSITIVE1
    } else {
      console.error(tableData + 'null')
      return CONSTPARAMS.MINUS1
    }
  } else {
    console.error(tableName + 'empty')
    return CONSTPARAMS.MINUS1
  }
}

// 根据主键检查表中是不是存在重复值
function _uniqueCheck(tableData, options, objData) {
  var result = true
  for (var i = 0; i < tableData.length; i++) {
    if (objData[options.primaryKey] !== undefined && tableData[i][options.primaryKey] == objData[options.primaryKey]) {
      result = false
      break
    }
  }
  return result
}
// 从一个对象中提取出指定的字段值,并返回一个对象
function _getNewObjectFromObject(obj, paramsArr) {
  if (paramsArr.length < 2) {
    obj.id = obj.id || Date.now()
    return obj
  }
  var newObject = {}
  for (var item in obj) {
    for (var i = 0; i < paramsArr.length; i++) {
      if (paramsArr[i] == item) {
        newObject[item] = obj[item]
      }
    }
  }
  return newObject
}
// 检查主键是不是存在于add方法的paramsArr字段中
function _hasPrimaryKey(paramsArr, options) {
  var result = true
  var i = 0
  for (;i < paramsArr.length; i++) {
    if (options.primaryKey == paramsArr[i]) {
      break
    }
  }
  if (i == paramsArr.length) {
    result = false
  }
  return result
}
// 检查add方法中objData是不是存在paramsArr中的字段
function _hasParamsInDataObj(dataObj, paramsArr) {
  var result = true
  for (var i = 0; i < paramsArr.length; i++) {
    if (!dataObj.hasOwnProperty(paramsArr[i])) { // paramsArr中的所有字段在dataObj中必须存在,有一个不存在就中指程序
      window.console.error(paramsArr[i] + ' must in dataObj')
      result = false
      break
    }
  }
  return result
}
// 检查函数中的参数是否存在
function _checkParamsExist() {
  var result = true
  var params = arguments
  for (var i = 0; i < params.length; i++) {
    if (typeof params[i] === 'undefined') {
      result = false
      window.console.error('The function lacks some parameters')
      break
    }
  }
  return result
}

module.exports = {
  /*
        关于表格的初始化设置
         */
  options: {
    // 默认的主键,不可重复
    primaryKey: 'id'
  },

  /**
         *
         * @param tableName 模拟表格的名称
         * @param dataObj 增加的对象
         * @param paramsArr 要添加到表中的字段
         * 主键存在更新，不存在则添加
         */
  save: function(tableName, dataObj, paramsArr = ['id']) {
    if (_hasTable(tableName)) {
      var tableData = _getItem(tableName)
      if (paramsArr.length > 0) {
        if (_hasPrimaryKey(paramsArr, this.options)) {
          // 检查dataObj是不是存在所需字段
          if (1 || _hasParamsInDataObj(dataObj, paramsArr)) {
            // 检查重复值是否存在
            if (_uniqueCheck(tableData, this.options, dataObj)) {
              var newObj = _getNewObjectFromObject(dataObj, paramsArr)
              tableData.push(newObj)
              console.log('effect 1 rows:', newObj)
              _setItem(tableData, tableName)
              return { code: CONSTPARAMS.POSITIVE1, data: newObj }
            } else {
              // 存在重复值， 更新
              const { id } = dataObj
              return this.update(tableName, dataObj, { id })
              // window.console.error('There are duplicate values in the table primaryKey : ' + dataObj[this.options.primaryKey])
              // return CONSTPARAMS.MINUS1
            }
          } else {
            // dataObj中有没存在的值
            return CONSTPARAMS.MINUS1
          }
        } else {
          console.error('paramsArr must has primaryKey')
          return CONSTPARAMS.MINUS1
        }
      } else {
        console.error('paramsArr must has primaryKey')
        return CONSTPARAMS.MINUS1
      }
    } else {
      return CONSTPARAMS.MINUS1
    }
  },

  /**
         *
         * @param tableName 模拟表格的名称
         * @param whereObj 删除条件,如需全部删除,请传入空对象,{id:String|Array}
         */
  delete: function(tableName, whereObj) {
    if (!_checkParamsExist(tableName, whereObj)) {
      return CONSTPARAMS.MINUS1
    }
    if (_hasTable(tableName)) {
      var tableData = _getItem(tableName)
      var result = [] // 另外一个新的数组
      var row = null
      var deleteFlag = true
      var deleteNum = 0
      for (var i = 0; i < tableData.length; i++) {
        row = tableData[i]
        for (var item in whereObj) { // 查询whereObj中的值和tableData中的值是否一样
          if (row.hasOwnProperty(item)) {
            if (whereObj[item] instanceof Array) {
              deleteFlag = whereObj[item].includes(row[item])
              // console.log(deleteFlag, row[item])
              break
            }
            if (whereObj[item] != row[item]) {
              deleteFlag = false
              break
            }
          } else {
            window.console.error(item + ' is not exist in ' + tableName + ',please update your whereObj')
            return CONSTPARAMS.MINUS1
          }
        }
        // 不可以执行删除
        if (!deleteFlag) {
          result.push(row)
        } else {
          deleteNum++
        }
        row = null
        deleteFlag = true
      }
      if (deleteNum > 0) { // 有需要删除的数据
        // 将数据存入进去localstorage
        _setItem(result, tableName)
        return { code: CONSTPARAMS.POSITIVE1, data: deleteNum, msg: '删除成功' }
      } else {
        return CONSTPARAMS.MINUS1
      }
    } else {
      return CONSTPARAMS.MINUS1
    }
  },

  /**
         *
         * @param tableName 模拟表格的名称
         * @param whereObj 更新条件
         * @param dataObj 更新数据
         */
  update: function(tableName, dataObj, whereObj) {
    if (!_checkParamsExist(tableName, dataObj, whereObj)) {
      return CONSTPARAMS.MINUS1
    }
    if (_hasTable(tableName)) {
      var tableData = _getItem(tableName)
      var row = null
      var updateFlag = true
      var updateNum = 0
      for (var i = 0; i < tableData.length; i++) {
        row = tableData[i]
        for (var item in whereObj) { // 查询whereObj中的值和tableData中的值是否一样
          if (row.hasOwnProperty(item)) {
            if (whereObj[item] != row[item]) {
              updateFlag = false
              break
            }
          } else {
            window.console.error(item + ' is not exist in table,please update your whereObj')
            return CONSTPARAMS.MINUS1
          }
          // if (whereObj[item] != row[item]) {
          //   updateFlag = false
          //   break
          // }
        }
        // 执行更新
        if (updateFlag) {
          for (var item in dataObj) {
            // 主键不可更新
            if (item != this.options.primaryKey) {
              row[item] = dataObj[item]
            }
          }
          tableData[i] = row
          updateNum++
        }
        row = null
        updateFlag = true
      }
      if (updateNum > 0) {
        // 将数据存入进去localstorage
        _setItem(tableData, tableName)
        console.info(`update effect ${updateNum} rows.`)
        return { code: CONSTPARAMS.POSITIVE1, data: updateNum, msg: '操作成功' }
      } else {
        return CONSTPARAMS.MINUS1
      }
    } else {
      return CONSTPARAMS.MINUS1
    }
  },

  /**
         *
         * @param tableName 模拟表格的名称
         * @param whereObj 查询条件
         * @param 保留关键词 page,limit
         */
  select: function(tableName, whereObj = {}) {
    if (!_checkParamsExist(tableName, whereObj)) {
      return CONSTPARAMS.MINUS1
    }
    var result = []
    var total = 0
    const { page = 1, limit } = whereObj
    delete whereObj.page
    delete whereObj.limit
    if (_hasTable(tableName)) {
      var tableData = _getItem(tableName)
      var row = null
      var selectFlag = true
      // console.log('where:', whereObj)
      for (var i = 0; i < tableData.length; i++) {
        row = tableData[i]
        for (var item in whereObj) { // 查询whereObj中的值和tableData中的值是否一样
          if (1 || row.hasOwnProperty(item)) {
            whereObj[item] += ''
            if (!_isBlank(whereObj[item]) && (row[item] === undefined ||
                (row[item] + '').toUpperCase().indexOf(whereObj[item].toUpperCase()) === -1)) {
              // if (!_isBlank(whereObj[item]) && (row[item] === undefined || !(row[item] + '').match(whereObj[item]))) {
              selectFlag = false
              break
            }
          } else {
            window.console.warn(item + ' is not exist in table,please update your whereObj')
            // return CONSTPARAMS.MINUS1
          }
        }
        if (selectFlag) {
          result.push(row)
        }
        row = null
        selectFlag = true
      }
    }
    total = result.length
    if (!_isBlank(limit)) {
      result = result.slice(limit * (page - 1), limit * page)
    }
    return { code: CONSTPARAMS.POSITIVE1, data: { total, records: result }, msg: '查询成功' }
  },
  /**
         *
         * @param tableName 模拟表格的名称
         */
  dropTable: function(tableName) {
    if (!_checkParamsExist(tableName)) {
      return CONSTPARAMS.MINUS1
    }
    var result = false
    if (_hasTable(tableName)) {
      window.localStorage.removeItem(tableName)
      result = true
    } else {
      result = false
    }
  },

  /**
   *
   * @param tableName 模拟表格的名称
   * @param data 初始数据
   * @returns {*}
   */
  createTable: function(tableName, data = []) {
    if (!_hasTable(tableName)) {
      window.localStorage.setItem(tableName, _Obj2JSON(data))
    }
  },
  /**
   *  mock [{ url: 'indexOf 匹配', type: 'get', response: () => {} }]
   */
  mock: []
}

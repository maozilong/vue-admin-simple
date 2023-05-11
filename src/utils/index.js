import store from '@/store'
require('@/utils/mockDb/index')
// localDb.createTable('article')
// console.log('localDb.......:', localDb.select('article', {}))

/**
 * 字典翻译
 */
export const dictionaryTran = (name, value) => {
  value = (typeof value === 'string' || value instanceof Array) ? value : value + '' // 如果不是string，转成字符串(如果是数组，不用转为字符串)
  const dictionary = store.state.app.dictionary && store.state.app.dictionary[name] // getStore({ name: 'dictionary', type: 'session' })
  let dictionaryName = '--'
  const array = []
  const isArray = value && typeof value === 'object'
  if (!value) {
    return dictionaryName
  }
  dictionary && (isArray && (dictionary.options.filter(item => {
    if (value.includes(item.value)) {
      array.push(item.label)
    }
  })) || dictionary.options.some(item => {
    if (value === item.value) {
      dictionaryName = item.label
      return true
    }
  })
  )
  return isArray && array.join(',') || dictionaryName
}
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  if (!url) {
    return {}
  }
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {Object} obj1, obj2
 * @returns {Object}
 */
export function deepMerge(obj1, obj2) {
  let key
  for (key in obj2) {
    // 如果target(也就是obj1[key])存在，且是对象的话再去调用deepMerge，否则就是obj1[key]里面没这个对象，需要与obj2[key]合并
    // 如果obj2[key]没有值或者值不是对象，此时直接替换obj1[key]
    obj1[key] =
      obj1[key] &&
        obj1[key].toString() === '[object Object]' &&
        (obj2[key] && obj2[key].toString() === '[object Object]')
        ? deepMerge(obj1[key], obj2[key])
        : (obj1[key] = obj2[key])
  }
  return obj1
}

export class Bus {
  constructor() {
    this.PubSubCache = {
      $uid: 0
    }
  }
  on(type, handler) {
    const cache = this.PubSubCache[type] || (this.PubSubCache[type] = {})
    handler.$uid = handler.$uid || this.PubSubCache.$uid++
    cache[handler.$uid] = handler
  }
  emit(type, ...param) {
    const cache = this.PubSubCache[type]
    let key
    if (!cache) return
    for (key in cache) {
      cache[key].call(this, ...param)
    }
  }
  off(type, handler) {
    let counter = 0
    let $type
    const cache = this.PubSubCache[type]
    if (handler == null) {
      if (!cache) return true
      return !!this.PubSubCache[type] && (delete this.PubSubCache[type])
    } else {
      !!this.PubSubCache[type] && (delete this.PubSubCache[type][handler.$uid])
    }
    for ($type in cache) {
      counter++
    }
    return !counter && (delete this.PubSubCache[type])
  }
}

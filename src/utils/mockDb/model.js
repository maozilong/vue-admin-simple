const localDb = require('./localDb')
const DATA = require('./DATA')
module.exports = {
  create: (table) => {
    const __local_db = '__local_db_'
    localDb.createTable(__local_db + table, DATA[table] || [])
    const api = ['list', 'save', 'del']
    const jql = { list: 'select', save: 'save', del: 'delete' }
    return api.map(k => {
      return {
        url: `/vue-admin-simple/${table}/${k}`,
        type: k === 'list' ? 'get' : 'post',
        response: (config) => {
          const { params, data } = config
          // console.log('response.config', config)
          const res = localDb[jql[k]](__local_db + table, k === 'list' ? params : data)
          return res
        }
      }
    })
  }
}

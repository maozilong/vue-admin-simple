const localDb = require('./localDb')
// import localDb from './localDb'
// require('./localDb')

const user = require('./user')
const model = require('./model')

localDb.mock = [
  ...user
]

const table = ['article', 'dict', 'cate']
table.forEach(t => {
  localDb.mock.push(...model.create(t))
})

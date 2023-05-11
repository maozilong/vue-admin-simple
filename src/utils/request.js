import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import { getToken } from '@/utils/auth'
const localDb = require('@/utils/mockDb/localDb')

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  adapter: (config) => {
    delete config.adapter
    const mock = localDb.mock.find(o => config.url.indexOf(o.url) > -1 && o.type === config.method.toLocaleLowerCase())
    if (mock) {
      console.info('Mock finished loading:', config.method, config.url)
      if (typeof config.data === 'string') {
        config.data = JSON.parse(config.data)
      }
      config.params = JSON.parse(JSON.stringify(config.params || '{}'))
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ status: 200, data: mock.response(config) })
        }, 80)
      })
    }
    return axios(config)
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    store.state.loading = true
    NProgress.start() // start progress bar
    console.log('req:', config.url, config.data || '', config.params)
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    store.state.loading = false
    NProgress.done()
    const res = response.data
    console.log('res:', res)
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000 && res.code != 0) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    store.state.loading = false
    NProgress.done()
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

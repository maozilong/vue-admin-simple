import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-simple/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-simple/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-simple/user/logout',
    method: 'post'
  })
}

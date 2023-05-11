import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-simple/table/list',
    method: 'get',
    params
  })
}

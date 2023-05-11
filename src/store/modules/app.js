import Cookies from 'js-cookie'
import request from '@/utils/request'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  dictionary: { }
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_DICT: (state, dict) => {
    state.dictionary = dict
  }

}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  getDict({ commit }, data) {
    request({
      url: '/vue-admin-simple/dict/list',
      method: 'get',
      params: { limit: 9999 }
    }).then(res => {
      const dict = {}
      res.data.records.forEach(o => {
        const { type, remark, options } = o
        dict[type] = { remark, options }
      })
      commit('SET_DICT', dict)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

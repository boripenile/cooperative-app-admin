import axios from 'axios'
import { apiBaseUrl } from '../../constants/config'

const state = {
  isLoadRoles: false,
  allRoleItems: null,
  roleItems: null,
  roleError: ''
}

const getters = {
  isLoadRoles: state => state.isLoadRoles,
  allRoleItems: state => state.allRoleItems,
  roleError: state => state.roleError,
  roleItems: state => state.roleItems
}

const mutations = {
  getRoleItemSuccess (state, items) {
    state.isLoadRoles = true
    state.allRoleItems = items
    state.roleItems = items
  },
  getRoleItemError (state, error) {
    state.isLoadRoles = false
    state.roleError = error
    state.allRoleItems = null
    state.roleItems = null
  },
  addRoleItem (state, newItem) {
    const newId = Math.max(...state.allRoleItems.map(item => item.id)) + 1
    state.allRoleItems.splice(0, 0, { id: newId, ...newItem })
    state.roleItems = state.allRoleItems
  }

}

const actions = {
  getRoleItems ({ commit }) {
    axios
      .get(`${apiBaseUrl}/roles`)
      .then(r => r.data)
      .then(res => {
          console.log(res)
        if (res.status === 200) {
          commit('getRoleItemSuccess', res.data)
        } else {
          commit('getRoleItemError', 'error:getRoleItem')
        }
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

import axios from 'axios'
import { apiBaseUrl, cooperativeApi } from '../../constants/config'
// import { mapGetters } from 'vuex'

const state = {
  isLoadPermissions: false,
  allPermissionItems: null,
  permissionItems: null,
  permissionError: ''
}

const getters = {
  isLoadPermissions: state => state.isLoadPermissions,
  allPermissionItems: state => state.allPermissionItems,
  permissionError: state => state.permissionError,
  permissionItems: state => state.permissionItems
}

const mutations = {
  getPermissionItemSuccess (state, items) {
    state.isLoadPermissions = true
    state.allPermissionItems = items
    state.permissionItems = items
  },
  getPermissionItemError (state, error) {
    state.isLoadPermissions = false
    state.permissionError = error
    state.allPermissionItems = null
    state.permissionItems = null
  },
  addPermissionItem (state, newItem) {
    const newId = Math.max(...state.allPermissionItems.map(item => item.id)) + 1
    state.allPermissionItems.splice(0, 0, { id: newId, ...newItem })
    state.permissionItems = state.allPermissionItems
  }

}

const actions = {
  getPermissionItems ({ commit } ) {
    const user = localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null
    if (user != null) {
      axios
      .get(`${apiBaseUrl}/permissions`, {
        headers: {
          'Authorization': 'Bearer ' + user.token
        }
      })
      .then(r => r.data)
      .then(res => {
        if (res.status === 200) {
          commit('getPermissionItemSuccess', res.data)
        } else {
          commit('getPermissionItemError', 'error:getPermissionItem')
        }
      })
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

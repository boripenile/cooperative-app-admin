import firebase from 'firebase/app'
import 'firebase/auth'
import { currentUser } from '../../constants/config'
import { stringify } from 'querystring'
import { apiBaseUrl } from '../../constants/config'
import axios from 'axios'

export default {
  state: {
    currentUser: localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null,
    loginError: null,
    processing: false
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError
  },
  mutations: {
    setUser (state, payload) {
      state.currentUser = payload
      state.processing = false
      state.loginError = null
    },
    setLogout (state) {
      state.currentUser = null
      state.processing = false
      state.loginError = null
    },
    setProcessing (state, payload) {
      state.processing = payload
      state.loginError = null
    },
    setError (state, payload) {
      state.loginError = payload
      state.currentUser = null
      state.processing = false
    },
    clearError (state) {
      state.loginError = null
    }
  },
  actions: {
    login ({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      axios
        .post(`${apiBaseUrl}/login/auth`, {
        'uniqueParameter': payload.email,
        'password': payload.password
      })
      .then(
        response => {
          const data = response.data.data
          const item = {uid: data.user.id, user: data.user, token: data.token, ...currentUser}
          
          localStorage.setItem('user', JSON.stringify(item))
          commit('setUser', { uid: data.user.id, user: data.user, token: data.token, ...currentUser })
        }
      )
      .catch(err => {
        console.log(err)
        localStorage.removeItem('user')
        if (err.response.data) {
          commit('setError', err.response.data.message)
        } else {
          commit('setError', 'Invalid username/password. Please retry')
        }
      })
    },
    signOut ({ commit }) {
      localStorage.removeItem('user')
      commit('setLogout')
    }
  }
}

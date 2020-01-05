import axios from 'axios'

let loadFunction = config => {
  return config
}
let finishFunction = response => {
  return response
}
let errorFunction = error => {
  return Promise.reject(error)
}

const axiosSocietyApi = axios.create({
  baseURL: 'http://localhost:8082/v1'
})

axiosSocietyApi.interceptors.request.use(loadFunction)

axiosSocietyApi.interceptors.response.use(finishFunction, errorFunction)

let clients = {
  $http: {
    get () {
      return {
        societyapi: axiosSocietyApi
      }
    },
    post () {
      return {
        societyapi: axiosSocietyApi
      }
    },
    put () {
      return {
        societyapi: axiosSocietyApi
      }
    },
    patch () {
      return {
        societyapi: axiosSocietyApi
      }
    },
    delete () {
      return {
        societyapi: axiosSocietyApi
      }
    }
  }
}

export default (Vue) => {
  Object.defineProperties(Vue.prototype, clients)
}
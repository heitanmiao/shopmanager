import axios from 'axios'
const Http = {}
Http.install = function (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  Vue.prototype.$http = axios
  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if (config.url !== 'login') {
      const token = localStorage.getItem('token')
      // this.$http.defaults.headers.common['Authorization'] = token
      config.headers.Authorization = token
    }
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })
}
export default Http

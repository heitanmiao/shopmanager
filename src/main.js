// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import Http from '@/plugins/http'
import MyBread from '@/components/cusBread.vue'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/index.css'
import moment from 'moment'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Http)
Vue.filter('fmdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})
Vue.component(MyBread.name, MyBread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

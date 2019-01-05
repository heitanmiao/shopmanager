import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/user.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          path: '/user',
          component: Users
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

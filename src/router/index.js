import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/user.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'

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
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
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

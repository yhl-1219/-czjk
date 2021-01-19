import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/index',
    name: 'index',
    redirect: '/checkitem',
    component: () => import('../views/index.vue'),
    children: [
      {
        path: '/checkitem',
        name: 'checkitem',
        component: () => import('../views/appoment/checkitem.vue')
      },
      {
        path: '/checkgroup',
        name: 'checkgroup',
        component: () => import('../views/appoment/checkgroup.vue')
      },
     
      {
        path: '/ordersetting',
        name: 'ordersetting',
        component: () => import('../views/appoment/ordersetting.vue')
      },
      {
        path: '/setmeal',
        name: 'setmeal',
        component: () => import('../views/appoment/setmeal.vue')
      },
      {
        path: '/report_setmeal',
        name: 'report_setmeal',
        component: () => import('../views/report/report_setmeal.vue')
      },
      {
        path: '/report_member',
        name: 'report_member',
        component: () => import('../views/member/report_member.vue')
      },
      {
        path: '/report_business',
        name: 'report_business',
        component: () => import('../views/report/report_business.vue')
      },
      {
        path: '/system_menu',
        name: 'system_menu',
        component: () => import('../views/system/system_menu.vue')
      },
      {
        path: '/system_role',
        name: 'system_role',
        component: () => import('../views/system/system_role.vue')
      },
      {
        path: '/system_user',
        name: 'system_user',
        component: () => import('../views/system/system_user.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

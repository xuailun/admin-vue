import Vue from 'vue'
import Router from 'vue-router'
import {getUserInfo} from '@/assets/js/auth'

import Login from '@/components/login/login' // @ 是 src 路径的别名，webpack 配置的
import Home from '@/components/home/home' // @ 是 src 路径的别名，webpack 配置的

// 用户管理组件
import UserList from '@/components/user-list/user-list'

// 角色管理组件
import RoleList from '@/components/role-list/role-list'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home', // home 组件会渲染到 App.vue 根组件的 router-view 中
      path: '/',
      component: Home,
      // 我们可以通过配置自路由的方式让某个组件渲染到父路由组件
      // 1. 在父路由组件中添加 <router-view></router-view> 出口标记
      // 2. 在父路由中通过 children 来声明自路由
      //    children 是一个数组
      //    children 数组中配置一个一个子路由对象
      // 当你访问 user-list 组件的时候，则路由会先渲染它的父路由组件
      // 然后将 user-list 组件渲染到父路由的 router-view 标记中
      children: [
        {
          name: 'user-list',
          path: '/users',
          component: UserList
        },
        {
          name: 'role-list',
          path: '/roles',
          component: RoleList
        }
      ]
    }
  ]
})

// 1. 添加路由拦截器(导航钩子, 守卫)
//    接下来所有的视图都必须经过这道关卡
//    一旦进入这道关卡, 你得告诉路由守卫
//    to 我们要去哪里
//    from 我从那儿来
//    next 用来放行的
router.beforeEach((to, from, next) => {
  // 1. 添加全局路由导航守卫
  // 2. 拿到当前请求的视图路径标识
  // 2.1 如果登录组件, 则直接放行
  // 2.2 如果非登录组件, 则检查 Token 令牌
  //    2.2.1 有令牌就过去
  //    2.2.2 无令牌, 则让其登录去
  if (to.name === 'login') {
    // 如果登录组件, 则直接放行
    next()
  } else {
    // // 检查登陆状态令牌
    // const token = window.localStorage.getItem('admin-token')
    // 检查是否具有当前登录的用户信息状态
    if (!getUserInfo()) { // 2.2.2 无令牌, 则让其登录去
      next({
        name: 'login'
      })
    } else { // 2.2.2 有令牌就允许通过
      next()
    }
  }
})

export default router

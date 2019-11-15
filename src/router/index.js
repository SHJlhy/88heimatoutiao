import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/layout'
import Login from '@/views/login'
import Home from '@/views/home'
import Publish from '@/views/publish'
import Article from '@/views/article'
import NProgress from 'nprogress'
Vue.use(VueRouter)
// 因为登录页在一开始的时候就要加载页面，不需要按需加载，直接放在路由中

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    children: [
      { path: '',
        component: Home
      },
      { path: '/publish',
        component: Publish
      },
      { path: '/article',
        component: Article
      }

    ]

  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  // 如果去的是登录页面 不需要拦截
  if (to.path === '/login') {
    // 允许通行到登录页，并终止执行下面的代码
    return next()
  }

  // 不是登录页面 判断有没有token
  // 获取token
  const token = localStorage.getItem('token')
  if (token) {
    // 如果有token 允许跳转
    next()
  } else {
    // 如果没有token 不允许跳转，跳转到登录页面
    next('/login')
  }
})

router.afterEach((to, from, next) => {
  NProgress.done()
})

export default router

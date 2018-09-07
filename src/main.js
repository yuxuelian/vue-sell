import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
// 导入路由配置文件 router/index.js
import routes from './router'

// 全局导入公共样式
import './common/stylus/index.styl'

Vue.config.productionTip = false

// 3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
  routes
})

// 如果开始跳转
router.beforeEach((to, from, next) => {
  next()
})

// 路由跳转结束
router.afterEach((to, from) => {
})

/* eslint-disable no-new */
new Vue({
  // 挂载点
  el: '#app',
  // 路由表
  router,
  // 状态保存
  // store,
  // 注册一个组件
  components: {
    App
  },
  // 挂载组件
  template: '<App/>',
  beforeCreate() {
  },
  created() {
  },
  beforeMount() {
  },
  mounted() {
  },
  beforeUpdate() {
  },
  updated() {
  },
  beforeDestroye() {
  },
  destroyed() {
  }
})

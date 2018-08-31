/* jshint esversion: 6 */
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
// 导入路由配置文件 router/index.js
import routes from './router'
import axios from 'axios'

const RES_OK = 0

Vue.config.productionTip = false

// 3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
  routes
})

// 如果开始跳转
router.beforeEach(function (to, from, next) {
  console.log(`-----------beforeEach---${to}  ${from}----------`)
  next()
})

// 路由跳转结束
router.afterEach(function (to, from) {
  console.log(`-----------afterEach---${to}  ${from}----------`)
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
  beforeCreate () {
    console.log('组件 beforeCreate 完成')
  },
  created () {
    console.log('组件 created 完成')
    axios.get('api/sell/ratings', {
      params: {}
    })
      .then(function (response) {
        console.log(response)
        if (response.data.errno === RES_OK) {
          console.log(response.data.data)
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  beforeMount () {
    console.log('组件 beforeMounte 完成')
  },
  mounted () {
    console.log('组件 mounted 完成')
  },
  beforeUpdate () {
    console.log('组件 beforeUpdate 完成')
  },
  updated () {
    console.log('组件 updated 完成')
  },
  beforeDestroye () {
    console.log('组件 beforeDestroye 完成')
  },
  destroyed () {
    console.log('组件 destroyed 完成')
  }
})

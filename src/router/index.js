import Vue from 'vue'
import VueRouter from 'vue-router'
import Goods from '../components/goods/v-goods'
import Ratings from '../components/ratings/v-ratings'
import Seller from '../components/seller/v-seller'

Vue.use(VueRouter)

const routes = [
  {
    name: 'Goods',
    path: '/goods',
    component: Goods,
    alias: '/goods1',
    props: true
  },
  {
    name: 'Ratings',
    path: '/ratings',
    component: Ratings,
    alias: '/ratings1',
    props: true
  },
  {
    name: 'Seller',
    path: '/seller',
    component: Seller,
    alias: '/seller1',
    props: true
  },
  // 重定向
  {
    path: '/',
    redirect: '/goods',
    props: true
  }
]

export default routes

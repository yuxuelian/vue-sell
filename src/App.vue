<template>
  <div id="app">
    <!-- 将seller对象传递给header子组件 -->
    <v-header v-bind:seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
import VHeader from './components/v-header/v-header'
import axios from 'axios'

const RES_OK = 0

// 导出组件
export default {
  name: 'App',
  data() {
    return {
      seller: {}
    }
  },
  components: {
    'v-header': VHeader
  },
  created() {
    axios
      .get('api/sell/seller', {
        params: {}
      })
      .then((response) => {
        if (response.data.code === RES_OK) {
          this.seller = response.data.data
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>

<style scoped lang="stylus">
  @import "./common/stylus/mixin";
  .tab
    display flex
    flex-direction row
    height 40px
    line-height 40px
    border-1px(rgba(7, 17, 27, 0.2))
    .tab-item
      flex 1
      & > a
        display block
        text-align center
        font-size 14px
        color rgb(77, 85, 93)
        &.active
          color rgb(240, 20, 20)
</style>

<template>
  <div id="app">
    <v-header/>
    <div class="tab">
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
    <router-view></router-view>
  </div>
</template>

<script>
import VHeader from './components/v-header/v-header'

// 导出组件
export default {
  name: 'App',
  components: {
    'v-header': VHeader
  }
}
</script>

<style scoped lang="stylus">
.tab
  display flex
  flex-direction row
  height 40px
  line-height 40px
  .tab-item
    flex 1
    border-bottom 1px solid rgba(7, 17, 27, 0.2)
    &>a
      display block
      text-align center
      font-size 14px
      color rgb(77, 85, 93)
      &.active
        color rgb(240, 20, 20)
</style>

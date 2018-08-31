<template>
  <div class="v-header">
    <!-- 内容区 -->
    <div class="content-wrapper">
      <!-- 左侧头像 -->
      <div class="avatar">
        <img v-bind:src="seller.avatar" alt="头像">
      </div>
      <!-- 右侧三行 -->
      <div class="content">
        <!-- 第一行 -->
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <!-- 第二行 -->
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <!-- 第三行 -->
        <div v-if="seller.supports" class="support">
            <span class="icon" :class="classMap[seller.supports[0].type]"></span>
            <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <!-- 公告 -->
    <div class="bullentin-wrapper"></div>
  </div>
</template>

<script>
export default {
  name: 'v-header',
  props: {
    // 接收由父组件传递过来的seller对象
    seller: {
      type: Object
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin';

.v-header
  color #FFF
  background #999
  .content-wrapper
    padding 24px 12px 18px 24px
    font-size 0
    position relative
    .avatar
      display inline-block
      vertical-align top
      img
        border-radius 2px
        width 64px
        height 64px
    .content
      display inline-block
      font-size 14px
      margin-left 16px
      .title
        margin 2px 0 8px 0
        .brand
          vertical-align top
          width 30px
          height 18px
          display inline-block
          bg-image('brand')
          background-size 30px 18px
          background-repeat no-repeat
        .name
          margin-left 6px
          font-size 16px
          font-weight 700
          line-height 18px
      .description
        margin-bottom 10px
        line-height 12px
        font-size 12px
      .support
        .icon
          vertical-align top
          display inline-block
          height 12px
          width 12px
          margin-right 4px
          margin-top 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_1')
          &.discount
            bg-image('discount_1')
          &.guarantee
            bg-image('guarantee_1')
          &.invoice
            bg-image('invoice_1')
          &.special
            bg-image('special_1')
        .text
          line-height 12px
          font-size 12px
    .support-count
      position absolute
      right 12px
      bottom 18px
      color #FFF
      height 24px
      font-size 10px
      line-height 24px
      padding: 0 8px
      border-radius 14px
      background-color rgba(0,0,0,0.2)
      text-align center
      .count
        font-size 10px
        vertical-align top
      .icon-keyboard_arrow_right
        font-size 10px
        line-height 24px
        margin-left 2px
</style>

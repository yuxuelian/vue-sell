<template>
  <div class="shopcart">
    <!--购物车内容-->
    <div class="content" @click="toggleList">
      <div class="content-left">
        <!--logo部分-->
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
          </div>
          <!--选择的商品总数-->
          <div class="num" v-show="totalCount>0">{{totalCount>99?'99+':totalCount}}</div>
        </div>
        <!--总价-->
        <div class="price" :class="{'highlight':totalPrice>0}">¥{{totalPrice}}</div>
        <!--配送费-->
        <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="this.totalPrice<this.minPrice?'no-enough':'enough'">{{payDesc}}
        </div>
      </div>
    </div>
    <!--购物车小球动画-->
    <div class="ball-container">
      <transition name="drop"
                  v-on:before-enter="beforeEnter"
                  v-on:enter="enter"
                  v-on:after-enter="afterEnter"
                  v-for="(item,index) in balls"
                  :key="index">
        <div v-show="item.show" class="ball">
          <div class="inner inner-hock"></div>
        </div>
      </transition>
    </div>
    <!--购物车详情列表-->
    <transition name="shopcart-list">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="clearCart">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food border-1px" v-for="(food,index) in selectFoods" :key="index">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>¥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <!--drop方法用来触发小球弹跳动画-->
                <cartcontrol :food="food" @cartAdd="drop"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <!--购物车列表遮罩-->
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
// import Velocity from 'velocity-animate'
import cartcontrol from '../cartcontrol/cartcontrol'
import BScroll from 'better-scroll'

export default {
  name: 'shopcart',
  components: {
    cartcontrol
  },
  props: {
    // 所选食物列表,由父组件传入
    selectFoods: {
      type: Array,
      default() {
        return []
      }
    },
    // 配送费
    deliveryPrice: {
      type: Number
    },
    // 最小费用
    minPrice: {
      type: Number
    }
  },
  data() {
    return {
      balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
      dropBalls: [],
      fold: false
    }
  },
  watch: {},
  computed: {
    // 商品总价计算
    totalPrice() {
      let total = 0
      // for (let i = 0; i < this.selectFoods.length; i++) {
      //   let food = this.selectFoods[i]
      //   total += food.count * food.price
      // }
      // 这种循环方式更简洁
      this.selectFoods.forEach((food) => {
        total += food.count * food.price
      })
      return total
    },
    // 商品总数计算
    totalCount() {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    // 商品结算按钮状态计算
    payDesc() {
      if (this.totalPrice === 0) {
        return `¥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        return `还差¥${this.minPrice - this.totalPrice}起送`
      } else {
        return '去结算'
      }
    },
    // 是否显示购物车列表
    listShow() {
      if (this.totalCount > 0 && this.fold) {
        this.$nextTick(() => {
          if (!this.scroll) {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
        return true
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.fold = false
      return false
    }
  },
  methods: {
    hideList() {
      this.fold = false
    },
    // 清空购物车
    clearCart() {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    // 点击购物车
    toggleList() {
      if (this.totalCount > 0) {
        this.fold = !this.fold
      }
    },
    // 执行一次小球弹跳动画
    drop(el) {
      // 遍历取出第一个没有执行动画的小球 并放入dropBalls
      for (let i = 0, length = this.balls.length; i < length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          // 将这个球显示出来,触发动画钩子函数
          ball.show = true
          // 获取到了从cartcontrol组件中经共同父组件传递过来的dom对象 并保存到小球中去
          ball.el = el
          this.dropBalls.push(ball)
          break
        }
      }
    },
    beforeEnter(el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `translateY(${y}px)`
          let inner = el.getElementsByClassName('inner-hock')[0]
          inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
          inner.style.transform = `translateX(${x}px)`
        }
      }
    },
    enter(el) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0, 0, 0)'
        el.style.transform = 'translateY(0)'
        let inner = el.getElementsByClassName('inner-hock')[0]
        inner.style.webkitTransform = 'translate3d(0, 0, 0)'
        inner.style.transform = 'translateX(0)'
      })
    },
    afterEnter(el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    }
  },
  created() {
  },
  mounted() {
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin";

  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      background-color #141d27
      font-size 0
      color rgba(255, 255, 255, 0.4)
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          vertical-align top
          position relative
          top -10px
          margin 0 12px
          padding 6px
          height 56px
          width 56px
          box-sizing border-box
          border-radius 50%
          background-color #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            background-color #2b343c
            text-align center
            &.highlight
              background-color #0087E3
            .icon-shopping_cart
              font-size 24px
              color #80858a
              line-height 44px
              &.highlight
                color white
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            font-size 10px
            line-height 16px
            text-align center
            font-weight 700
            color white
            background-color red
            border-radius 8px
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display inline-block
          vertical-align top
          margin-top 12px
          line-height 24px
          box-sizing border-box
          padding-right 12px
          border-right 1px solid rgba(255, 255, 255, 0.1)
          font-size 16px
          font-weight 700
          &.highlight
            color white
        .desc
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height 24px
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          text-align center
          line-height 48px
          font-weight 700
          font-size 12px
          &.not-enough
            background-color #2b333b
          &.enough
            background-color #00b43c
            color white
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        transition all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background rgb(0, 160, 220)
          transition all 0.4s linear
    .shopcart-list
      position absolute
      top 0
      left 0
      z-index -1
      width 100%
      transform: translate3d(0, -100%, 0);
      &.shopcart-list-enter-active
        transition all .4s linear
        transform translateY(-100%)
      &.shopcart-list-leave-active
        transition all .4s linear
      &.shopcart-list-enter, &.shopcart-list-leave-to
        transform translateY(0)
      .list-header
        line-height 40px
        padding 0 18px
        height 40px
        border-bottom 1px solid rgba(7, 17, 27, 0.1)
        background-color #f3f5f7
        .title
          float left
          font-size 14px
          color rgb(7, 17, 27)
        .empty
          float right
          color rgb(0, 160, 220)
          font-size 12px
      .list-content
        background-color white
        overflow hidden
        max-height 217px
        padding 0 18px
        .food
          position relative
          box-sizing border-box
          border-1px(rgba(7, 17, 27, 0.1))
          padding 12px 0
          .name
            font-size 14px
            color rgb(7, 17, 27)
            line-height 24px
          .price
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240, 20, 20)
            position absolute
          .cartcontrol-wrapper
            right 0
            bottom 6px
            position absolute
    .list-mask
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -40
      backdrop-filter: blur(10px)
      opacity: 1
      background: rgba(7, 17, 27, 0.6)
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s
      &.fade-enter, &.fade-leave-active
        opacity: 0
        background: rgba(7, 17, 27, 0)
</style>

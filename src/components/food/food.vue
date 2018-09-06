<template>
  <transition name="food">
    <div class="food" v-show="showFlag" ref="foodEl">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" width="100%" height="100%"/>
        </div>
        <div class="content">
          <!--食物名称-->
          <h1 class="title">{{food.name}}</h1>
          <!--销售详情-->
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <!--售价-->
          <div class="price">
            <span class="now">¥{{food.price}}</span><span class="old" v-if="food.oldPrice">¥{{food.oldPrice}}</span>
          </div>
          <!--购物数量控制器-->
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" @cartAdd="cartAdd"></cartcontrol>
          </div>
          <transition name="buy">
            <!--加入购物车按钮-->
            <div class="buy" v-show="!food.count||food.count===0" @click.stop.prevent="buy">加入购物车
            </div>
          </transition>
        </div>
        <splite v-if="food.info"></splite>
        <div class="info" v-if="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <splite></splite>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect
            :select-type="selectType"
            :only-content="onlyContent"
            :desc="desc"
            :ratings="food.ratings"
            @ratingTypeSelect="ratingTypeSelect"
            @toggleOnlyContent="toggleOnlyContent"
          ></ratingselect>
          <!--评价详细列表-->
          <div class="rating-wrapper">
            <ul v-if="food.ratings&&food.ratings.length>0">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings"
                  :key="rating.username"
                  class="rating-item">
                <div class="user">
                  <span class="username">{{rating.username}}</span>
                  <img :src="rating.avatar" class="avatar" width="12" height="12"/>
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text"><span
                  :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-if="!food.ratings||food.ratings.length===0">暂无评价</div>
          </div>
        </div>
      </div>

      <!--返回按钮-->
      <div class="back" @click="back($event)">
        <i class="icon-arrow_lift"></i>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import BScroll from 'better-scroll'
import cartcontrol from '../cartcontrol/cartcontrol'
import {formatDate} from '../../common/js/date'
import splite from '../splite/splite'
import ratingselect from '../ratingselect/ratingselect'

// eslint-disable-next-line no-unused-vars
const POSITIVE = 0
// eslint-disable-next-line no-unused-vars
const NEGATIVE = 1
const ALL = 2

export default {
  name: 'food',
  components: {ratingselect, splite, cartcontrol},
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      // 标记是否显示当前商品详情
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  watch: {},
  computed: {},
  filters: {
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    // 是否需要显示该行评论
    needShow(rateType, text) {
      if (this.onlyContent && !text) {
        // 只看有内容的评价,没有内容的那行就不显示
        return false
      }

      // 看所有
      if (this.selectType === ALL) {
        return true
      }
      // 否则进行筛选
      return this.selectType === rateType
    },
    // 切换是否只看有内容的评价
    toggleOnlyContent(onlyContent) {
      // 这次赋值会触发dom更新
      this.onlyContent = onlyContent
      // 监听dom更新
      this.$nextTick(() => {
        // dom更新完成后刷新一下scroll  让scroll重新计算高度,否则新添加的dom元素不会得到滑动控制
        this.scroll.refresh()
      })
    },
    // 子组件通知父组件修改 selectType
    ratingTypeSelect(type) {
      // 这次赋值会触发dom更新
      this.selectType = type
      // 监听dom更新
      this.$nextTick(() => {
        // dom更新完成后刷新一下scroll  让scroll重新计算高度,否则新添加的dom元素不会得到滑动控制
        this.scroll.refresh()
      })
    },
    // 点击加入购物车
    buy(event) {
      if (!event._constructed) {
        return
      }
      // 加入购物车也触发一次小球动画
      this.$emit('cartAdd', event.target)
      Vue.set(this.food, 'count', 1)
    },
    // 向父组件派发添加到购物车的事件
    cartAdd(targetDom) {
      // 将拿到的这个dom元素传递给shopcart组件
      // 再次向父组件派发这个事件
      this.$emit('cartAdd', targetDom)
    },
    show() {
      this.showFlag = true
      this.selectType = ALL
      // this.selectType = POSITIVE
      // this.selectType = NEGATIVE
      this.onlyContent = true
      // $nextTick dom更新完成  可以测量准确的高度
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.foodEl, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    back(event) {
      // if (!event._constructed) {
      //   return
      // }
      this.showFlag = false
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
  .food
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 30
    width 100%
    background-color white
    &.food-enter-active
      transition all .3s linear
      translateX(0)
    &.food-leave-active
      transition all .3s linear
      translateX(100%)
    &.food-enter, &.food-leave-to
      transform translateX(100%)
    .food-content
      .image-header
        position relative
        width 100%
        height 0
        padding-top 100%
        img
          position absolute
          left 0
          top 0
      .content
        position relative
        padding 18px
        .title
          line-height 14px
          margin-bottom 8px
          font-size 14px
          font-weight 700
          color rgb(7, 17, 27)
        .detail
          margin-bottom 18px
          line-height 10px
          font-size 0
          .sell-count, .rating
            font-size 10px
            color rgb(147, 153, 159)
          .sell-count
            margin-right 12px
        .price
          font-weight 700
          line-height 24px
          .now
            margin-right 8px
            font-size 14px
            line-height 24px
            color rgb(240, 20, 20)
          .old
            text-decoration line-through
            font-size 10px
            color rgb(147, 153, 159)
        .cartcontrol-wrapper
          position absolute
          right 12px
          bottom 12px
        .buy
          position absolute
          right 18px
          bottom 18px
          z-index 10
          height 24px
          line-height 24px
          padding 0 12px
          box-sizing border-box
          font-size 10px
          border-radius 12px
          color white
          background-color rgb(0, 160, 220)
          &.buy-enter-active, &.buy-leave-active
            transition all .3s linear
            opacity 1
          &.buy-enter, &.buy-leave-to
            opacity 0
      .info
        padding 18px
        .title
          margin-bottom 6px
          font-size 14px
          font-weight 700
          line-height 14px
          color rgb(7, 17, 27)
        .text
          line-height 24px
          padding 0 8px
          font-size 12px
          color rgb(77, 85, 93)
      .rating
        padding-top 18px
        .title
          margin-left 18px
          font-size 14px
          font-weight 700
          line-height 14px
          color rgb(7, 17, 27)
        .rating-wrapper
          .rating-item
            position relative
            padding 16px 16px
            border-1px(rgba(7, 17, 27, 0.1))
            .user
              position absolute
              right 16px
              top 16px
              font-size 0
              line-height 12px
              .username
                margin-right 6px
                vertical-align top
                display inline-block
                color rgb(147, 153, 159)
                font-size 10px
              .avatar
                vertical-align top
                display inline-block
                border-radius 6px
            .time
              margin-bottom 6px
              line-height 12px
              font-size 10px
              color rgb(147, 153, 159)
            .text
              line-height 16px
              font-size 12px
              color rgb(7, 17, 27)
              .icon-thumb_up, .icon-thumb_down
                margin-right 4px
                line-height 16px
                font-size 12px
              .icon-thumb_up
                color rgb(0, 160, 220)
              .icon-thumb_down
                color rgb(147, 153, 159)
          .no-rating
            padding 16px 0
            font-size 12px
            color rgb(147, 153, 159)
            margin-left 16px
    .back
      position fixed
      top 10px
      left 0px
      .icon-arrow_lift
        display block
        padding 10px
        font-size 20px
        color white

  /*
  food-enter-active 显示的最终状态
  food-leave-active 隐藏的最终状态
  food-enter food-leave-to 动画执行的跨度
  */
</style>

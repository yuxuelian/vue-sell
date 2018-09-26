<template>
  <div class="ratings" ref="ratingsEl">
    <div class="ratings-content">
      <div class="overview">
        <!--左边文案-->
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <!--右边评分-->
        <div class="overview-right">
          <div class="score-wrapper score-wrapper-first">
            <span class="title">服务态度</span>
            <div class="star-wrapper">
              <star :size="36" :score="seller.serviceScore"></star>
            </div>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <div class="star-wrapper">
              <star :size="36" :score="seller.foodScore"></star>
            </div>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery-time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect
        :select-type="selectType"
        :only-content="onlyContent"
        :desc="desc"
        :ratings="ratings"
        @ratingTypeSelect="ratingTypeSelect"
        @toggleOnlyContent="toggleOnlyContent"
      ></ratingselect>
      <div class="ratings-wrapper">
        <ul>
          <li v-show="needShow(rating.rateType,rating.text)"
              v-for="(rating,index) of ratings"
              :key="index"
              class="rating-item border-1px">
            <div class="avatar">
              <img :src="rating.avatar" class="avatar-img" width="28" height="28"/>
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}
              <div class="recommend" v-if="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="item in rating.recommend" :key="item.key">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {formatDate} from '../../common/js/date'
import star from '../star/star'
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'
import BScroll from 'better-scroll'
import axios from 'axios'

const RES_OK = 0
// eslint-disable-next-line no-unused-vars
const POSITIVE = 0
// eslint-disable-next-line no-unused-vars
const NEGATIVE = 1
const ALL = 2

export default {
  name: 'ratings',
  components: {ratingselect, split, star},
  filters: {
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      ratings: [],
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '满意',
        negative: '不满意'
      }
    }
  },
  watch: {},
  computed: {},
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
    // 初始化滚动
    _initScroll() {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.ratingsEl, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    },
    // 加载数据
    _loadData() {
      axios
        .get('/api/sell/ratings', {
          params: {}
        })
        .then((response) => {
          if (response.data.code === RES_OK) {
            // 更新数据，触发dom更新
            this.ratings = response.data.data
            // 设置dom更新完成回调
            // 初始化滚动
            this.$nextTick(() => {
              this._initScroll()
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  created() {
    // 联网加载一次数据
    this._loadData()
  },
  mounted() {
  },
  transitions: {}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin";

  .ratings
    position absolute
    top 174px
    left 0
    bottom 0
    width 100%
    overflow hidden
    .ratings-content
      .overview
        display flex
        padding 12px 0
        .overview-left
          flex 2
          border-right 1px solid rgba(7, 17, 27, 0.1)
          text-align center
          padding 6px 0
          .score
            margin-top 8px
            margin-bottom 6px
            font-size 24px
            line-height 28px
            color rgb(255, 153, 0)
          .title
            margin-bottom 8px
            line-height 12px
            font-size 12px
            color rgb(7, 17, 27)
          .rank
            line-height 10px
            font-size 10px
            color rgb(147, 153, 159)
            padding-bottom 6px
        .overview-right
          flex 3
          padding-left 16px
          padding-top 8px
          padding-bottom 8px
          .score-wrapper-first
            margin-top 8px
          .score-wrapper
            margin-bottom 8px
            .title
              display inline-block
              vertical-align top
              line-height 16px
              font-size 12px
              color rgb(7, 17, 27)
            .star-wrapper
              vertical-align top
              display inline-block
              margin-left 6px
            .score
              vertical-align top
              display inline-block
              line-height 16px
              margin-left 6px
              font-size 12px
              color rgb(255, 153, 0)
            .delivery-time
              vertical-align top
              margin-left 6px
              line-height 16px
              color rgb(147, 153, 159)
              font-size 12px
      .ratings-wrapper
        padding: 0 18px
        .rating-item
          display: flex
          padding: 18px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .avatar
            flex: 0 0 28px
            width: 28px
            margin-right: 12px
            .avatar-img
              border-radius: 50%
          .content
            position: relative
            flex: 1
            .name
              margin-bottom: 4px
              line-height: 12px
              font-size: 10px
              color: rgb(7, 17, 27)
            .star-wrapper
              margin-bottom: 6px
              font-size: 0
              .star
                display: inline-block
                vertical-align: top
                margin-right: 6px
              .delivery
                display: inline-block
                vertical-align: top
                font-size: 10px
                line-height: 12px
                color: rgb(147, 153, 159)
            .text
              line-height: 18px
              margin-bottom: 8px
              color: rgb(7, 17, 27)
              font-size: 12px
            .recommend
              line-height: 16px
              font-size: 0
              .icon-thumb_up, .item
                display: inline-block
                margin: 0 8px 4px 0
                font-size: 9px
              .icon-thumb_up
                color: rgb(0, 160, 220)
              .item
                padding: 0 6px
                border: 1px solid rgba(7, 17, 27, 0.1)
                border-radius: 1px
                color: rgb(147, 153, 159)
                background: #fff
            .time
              position: absolute
              top: 0
              right: 0
              line-height: 12px
              font-size: 10px
              color: rgb(7, 17, 27)
</style>

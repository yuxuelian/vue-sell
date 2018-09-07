<template>
  <div class="ratings">
    <div class="ratings-content" ref="ratingsContent">
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
      <splite></splite>
      <ratingselect
        :select-type="selectType"
        :only-content="onlyContent"
        :desc="desc"
        @ratingTypeSelect="ratingTypeSelect"
        @toggleOnlyContent="toggleOnlyContent"
      ></ratingselect>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import star from '../star/star'
import splite from '../splite/splite'
import ratingselect from '../ratingselect/ratingselect'
import BScroll from 'better-scroll'

// eslint-disable-next-line no-unused-vars
const POSITIVE = 0
// eslint-disable-next-line no-unused-vars
const NEGATIVE = 1
const ALL = 2

export default {
  name: 'ratings',
  components: {ratingselect, splite, star},
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
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
    // 切换是否只看有内容的评价
    toggleOnlyContent(onlyContent) {
      // 这次赋值会触发dom更新
      this.onlyContent = onlyContent
      // 监听dom更新
      this.$nextTick(() => {
        // dom更新完成后刷新一下scroll  让scroll重新计算高度,否则新添加的dom元素不会得到滑动控制
        // this.scroll.refresh()
      })
    },
    // 子组件通知父组件修改 selectType
    ratingTypeSelect(type) {
      // 这次赋值会触发dom更新
      this.selectType = type
      // 监听dom更新
      this.$nextTick(() => {
        // dom更新完成后刷新一下scroll  让scroll重新计算高度,否则新添加的dom元素不会得到滑动控制
        // this.scroll.refresh()
      })
    }
  },
  created() {
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.ratingsContent, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    })
  },
  mounted() {
  },
  transitions: {}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

  .ratings
    position absolute
    top 174px
    left 0
    bottom 0
    width 100%
    overflow hidden
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
</style>

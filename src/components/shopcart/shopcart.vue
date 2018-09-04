<template>
  <div class="shopcart">
    <div class="content">
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
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'shopcart',
  components: {},
  props: {
    selectFoods: {
      type: Array,
      default() {
        return []
      }
    },
    deliveryPrice: {
      type: Number
    },
    minPrice: {
      type: Number
    }
  },
  data() {
    return {}
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
    }
  },
  methods: {},
  created() {
  },
  mounted() {
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
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
</style>

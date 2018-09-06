<template>
  <div class="goods">
    <!--左边分类菜单-->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) of goods" :key="item.name" class="menu-item"
            :class="{'menu-item-selected':currentIndex === index}"
            @click="selectMenu(index,$event)" ref="menuList">
          <span class="text border-1px">
            <span v-show="item.type !== -1" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!--右边商品列表-->
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li class="foods-list" v-for="item of goods" :key="item.name" ref="foodList">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="food in item.foods" :key="food.name"
                class="food-item border-1px">
              <!--商品图标-->
              <div class="icon">
                <img :src="food.icon" width="57" height="57"/>
              </div>
              <!--商品内容-->
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">¥{{food.price}}</span><span class="old" v-if="food.oldPrice">¥{{food.oldPrice}}</span>
                </div>
              </div>
              <!--购物的按钮组件 cartAdd 监听子组件向我(this)传的值-->
              <div class="cartcontrol-wrapper">
                <!--cartAdd方法监听cartcontrol里边的添加按钮的点击事件-->
                <cartcontrol :food="food" @cartAdd="cartAdd"></cartcontrol>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!--底部购物车组件-->
    <shopcart ref="shopcart" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"
              :selectFoods="selectFoods"></shopcart>
    <food :food="selectedFood" ref="food" @cartAdd="cartAdd"></food>
  </div>
</template>

<script type="text/ecmascript-6">
import shopcart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'
import food from '../food/food'
import BScroll from 'better-scroll'
import axios from 'axios'

const RES_OK = 0

export default {
  name: 'v-goods',
  components: {
    food,
    shopcart,
    cartcontrol
  },
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  watch: {},
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (this.scrollY >= height1 && this.scrollY < height2) {
          this._followScroll(i)
          return i
        }
      }
    },
    selectFoods() {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created() {
    this._loadData()
  },
  mounted() {
  },
  methods: {
    // 点击食物列表
    selectFood(food, event) {
      if (!event._constructed) {
        return
      }
      this.selectedFood = food
      this.$refs.food.show()
    },
    cartAdd(targetDom) {
      // 将拿到的这个dom元素传递给shopcart组件
      this._drop(targetDom)
    },
    // 点击menuItem的时候触发
    selectMenu(index, event) {
      if (!event._constructed) {
        return
      }
      let foodList = this.$refs.foodList
      let el = foodList[index]
      // 300 表示有一个滑动过度效果
      this.foodsScroll.scrollToElement(el, 300)
    },
    _drop(targetDom) {
      // 父组件调用子组件方法
      this.$refs.shopcart.drop(targetDom)
    },
    // 加载数据
    _loadData() {
      axios
        .get('/api/sell/goods', {
          params: {}
        })
        .then((response) => {
          if (response.data.code === RES_OK) {
            // 更新数据，触发dom更新
            this.goods = response.data.data
            // 设置dom更新完成回调
            this.$nextTick(() => {
              // 初始化滚动
              this._initScroll()
              // 计算一下列表的高度
              this._calculateHeight()
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
      // probeType  3  表示swipe的时候也继续监听
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      })
      // 监听滚动事件
      this.foodsScroll.on('scroll', (pos) => {
        // 更新ScrollY的高度，触发currentIndex实时去计算位置
        // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
        if (pos.y <= 0) {
          this.scrollY = Math.abs(Math.round(pos.y))
        }
      })
    },
    // 计算每类食物列表相对于顶部的高度
    _calculateHeight() {
      let foodList = this.$refs.foodList
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    // 使menu列表跟随滚动
    _followScroll(index) {
      let menuList = this.$refs.menuList
      let el = menuList[index]
      this.menuScroll.scrollToElement(el, 300, 0, -100)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin";
  .goods
    display flex
    overflow hidden
    position absolute
    width 100%
    top 174px
    bottom 46px
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background-color #f3f5f7
      .menu-item
        display table
        height 54px
        width 56px
        line-height 14px
        padding 0 12px
        .icon
          vertical-align top
          display inline-block
          height 12px
          width 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display table-cell
          width 56px
          vertical-align middle
          font-size 12px
          border-1px(rgba(7, 17, 27, 0.1))
        &.menu-item-selected
          color red
          font-weight 700
          background-color white
    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147, 153, 159)
        background-color #f3f5f7
      .food-item
        display flex
        flex-direction row
        padding-bottom 18px
        margin 18px
        margin-bottom 0
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
        .name
          margin 2px 0 8px 0
          height 14px
          line-height 14px
          font-size 14px
          color rgb(7, 17, 27)
        .desc, .extra
          line-height 10px
          font-size 10px
          color rgb(147, 153, 159)
        .desc
          margin-bottom 8px
        .extra
          .count
            margin-right 12px
        .price
          font-weight 700
          line-height 24px
          .now
            margin-right 8px
            font-size 14px
            color rgb(240, 20, 20)
          .old
            text-decoration line-through
            font-size 10px
        .cartcontrol-wrapper
          position absolute
          right 0
          bottom 10px
</style>

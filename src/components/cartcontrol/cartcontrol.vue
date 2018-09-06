<template>
  <div class="cartcontrol">
    <transition>
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0"
           @click.stop.prevent="decreaseCount($event)"></div>
    </transition>
    <transition>
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    </transition>
    <!--click.stop阻止单击事件冒泡 click.prevent阻止默认事件(如submit提交后的刷新页面事件)   click.stop.prevent串联同时阻止-->
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCount($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'

export default {
  name: 'cartcontrol',
  components: {},
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {}
  },
  watch: {},
  computed: {},
  methods: {
    addCount(event) {
      if (!event._constructed) {
        return
      }
      if (!this.food.count) {
        // 注意  这里新增的字段不会受到Vue框架的接管,变化时不会引起dom的更新
        // this.food.count = 1
        // 所以上面这局代码应该替换为下面这句代码
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      // 当前组件向它所在的父组件传值
      // 第二个参数this.childValue是需要传的值
      this.$emit('cartAdd', event.target)
    },
    decreaseCount(event) {
      if (!event._constructed) {
        return
      }
      if (this.food.count && this.food.count > 0) {
        this.food.count--
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
  .cartcontrol
    position relative
    font-size 0
    .cart-decrease, .cart-add
      display inline-block
      vertical-align top
      font-size 24px
      line-height 24px
      padding 6px
      color rgb(0, 160, 220)
    .cart-count
      position absolute
      font-size 10px
      width 12px
      color rgb(147, 153, 159)
      top 12px
      left 36px
      text-align center
      transform-origin center center
      &.v-enter-active
        transition all .3s linear
      &.v-leave-active
        transition all .3s linear
      &.v-enter, &.v-leave-to
        transform translateX(30px) rotateZ(360deg)
        opacity 0
    .cart-add
      margin-left 12px
    .cart-decrease
      z-index -10
      transform-origin center center
      &.v-enter-active
        transition all .3s linear
      &.v-leave-active
        transition all .3s linear
      &.v-enter, &.v-leave-to
        transform translateX(48px) rotateZ(360deg)
        opacity 0
</style>

<template>
  <div class="cartcontrol">
    <transition
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:leave="leave"
      v-bind:css="false">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0"
           @click="decreaseCount($event)"></div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click="addCount($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import Velocity from 'velocity-animate'

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
    beforeEnter(el) {
      el.style.opacity = 0
      el.style.translateX = '0px'
    },
    enter(el, done) {
      Velocity(el, {translateX: '24px', rotateZ: '180deg', opacity: 0}, {duration: 300})
      Velocity(el, {translateX: '0px', rotateZ: '0deg', opacity: 1}, {complete: done})
    },
    leave(el, done) {
      Velocity(el, {translateX: '0px', rotateZ: '0deg', opacity: 1}, {duration: 300})
      Velocity(el, {translateX: '24px', rotateZ: '180deg', opacity: 0}, {complete: done})
    },
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
    font-size 0
    .cart-decrease, .cart-add
      display inline-block
      vertical-align top
      font-size 24px
      line-height 24px
      padding 6px
      color rgb(0, 160, 220)
    .cart-count
      display inline-block
      vertical-align top
      font-size 10px
      width 12px
      padding-top 6px
      line-height 24px
      text-align center
      color rgb(147, 153, 159)

  /*.cart-decrease*/
  /*.cart-add*/
</style>

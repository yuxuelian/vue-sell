<template>
  <div class="star" :class="starType">
    <span v-for="(itemClass,index) of itemClasses" :class="itemClass" :key="index"
          class="star-item"></span>
  </div>
</template>

<script>
const LENGTH = 5
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'
export default {
  components: {},
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  data() {
    return {}
  },
  watch: {},
  computed: {
    starType() {
      return `star-${this.size}`
    },
    // 返回每颗星对应的Class
    itemClasses() {
      let result = []
      let score = Math.floor(this.score * 2) / 2
      // 是否有小数
      let hasDecimal = score % 1 !== 0
      let integer = Math.floor(score)
      // 满星部分
      for (let i = 0; i < integer; i++) {
        result.push(CLS_ON)
      }
      // 一个半星
      if (hasDecimal) {
        result.push(CLS_HALF)
      }
      while (result.length < LENGTH) {
        result.push(CLS_OFF)
      }
      return result
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
  @import '../../common/stylus/mixin'
  .star
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 8px
        background-size 20px 20px
        &:last-child
          margin-right 0
        &.on
          bg-image('star48_on')
        &.half
          bg-image('star48_half')
        &.off
          bg-image('star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 4px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image('star36_on')
        &.half
          bg-image('star36_half')
        &.off
          bg-image('star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 2px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('star24_on')
        &.half
          bg-image('star24_half')
        &.off
          bg-image('star24_off')
</style>

<template>
  <div class="header">
    <div class="header-top-wrapper">
      <div class="left">
        <img :src="seller.avatar" alt="">
      </div>
      <div class="right">
        <div class="name">
          <span class="brand"></span>{{seller.name}}
        </div>
        <div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
        <div class="support" v-if="seller.supports">
          <span class="support-icon" :class="classMap[seller.supports[0].type]"></span>
          {{seller.supports[0].description}}
        </div>
      </div>
      <div class="support-count" v-if="seller.supports">
        <span class="count" >{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper">
      <span class="bulletin-icon"></span>
      <div class="text">{{seller.bulletin}}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    props:{
      seller:{
        type:Object
      }
    },
    created(){
      this.classMap = ['decrease','discount','special','invoice','guarantee'];
    },
    data(){
      return {

      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  //@import '../../common/stylus/mixin.styl'
  //@import '../../common/stylus/icon.styl'
  @import '../../common/stylus/index.styl'
  .header
    background-color :rgba(7,17,27,0.5)
    color:rgb(255,255,255)
    .header-top-wrapper
      position :relative
      .left
        //float:left
        display :inline-block
        padding:24px 16px 18px 24px
        img
          //vertical-align :top
          width: 64px
          height:64px
          border-radius: 2px
      .right
        display :inline-block
        vertical-align :top
        .name
          padding:26px 0 8px
          font-size:16px
          font-weight:bold
          line-height:18px
          .brand
            display :inline-block
            width: 30px
            height: 18px
            bg-image('brand')
            background-size:30px 18px
            background-repeat:no-repeat
            margin-right:6px
            vertical-align:top
        .description
          padding-bottom:10px
          font-size:12px
          line-height:12px
        .support
          font-size:10px
          line-height:12px
          .support-icon
            display:inline-block
            width: 12px
            height:12px
            background-size:12px 12px
            background-repeat:no-repeat
            margin-right:4px
            vertical-align :top
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
      .support-count
        position:absolute
        right: 12px
        bottom: 14px
        padding:0 8px
        height: 24px
        line-height: 24px
        font-size: 10px
        background-color :rgba(0,0,0,0.2)
        border-radius :7px
    .bulletin-wrapper
      height: 28px


</style>

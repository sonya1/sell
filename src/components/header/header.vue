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
      <div class="support-count" v-if="seller.supports" @click="showDetail">
        <span class="count" >{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-icon"></span>
      <span class="text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%"/>
    </div>
    <!--sticky footer 布局-->
    <transition name="fade">
      <div class="detail" v-show="detailShow" transition="fade">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="title">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>

            <div class="line-header">
              <div class="line"></div>
              <div class="line-title">优惠信息</div>
              <div class="line"></div>
            </div>

            <ul class="youhui" v-if="seller.supports">
              <li class="one-info"  v-for="(item,index) in seller.supports">
                <span class="support-icon" :class="classMap[seller.supports[index].type]"></span>
                {{item.description}}
              </li>
            </ul>

            <div class="line-header">
              <div class="line"></div>
              <div class="line-title">商家公告</div>
              <div class="line"></div>
            </div>

            <div class="bulletin">
              <p class="bulletin-text">{{seller.bulletin}}</p>
            </div>
          </div>

        </div>
        <div class="detail-close" @click="closeDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import Star from "../star/star"
  export default{
    components:{
      Star
    },
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
        detailShow:false
      }
    },
    methods:{
      showDetail(){
        this.detailShow = true;
      },
      closeDetail(){
        this.detailShow = false;
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  //@import '../../common/stylus/mixin.styl'
  //@import '../../common/stylus/icon.styl'
  @import '../../common/stylus/index.styl'
  .header
    position:relative
    background-color :rgba(7,17,27,0.5)
    color:rgb(255,255,255)
    overflow:hidden
    .header-top-wrapper
      display:flex
      justify-content :flex-start
      position :relative
      padding:24px 12px 18px 24px
      font-size:0
      .left
        flex:0 0 auto
        margin-right:16px
        img
          width: 64px
          height:64px
          border-radius: 2px
      .right
        flex:1
        .name
          padding:1px 0 8px
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
      position:relative
      height: 28px
      padding:0 22px 0 12px
      line-height: 28px
      text-overflow :ellipsis
      overflow:hidden
      white-space :nowrap
      background:rgba(7,17,27,0.2)
      .bulletin-icon
        display:inline-block
        vertical-align :top
        width: 22px
        height:12px
        bg-image("bulletin")
        background-size:22px 12px
        margin-right:4px
        margin-top:8px
      .text
        font-size: 10px
        line-height:28px
        vertical-align :top
      & i
        /*margin-right: 12px
        line-height: 28px*/
        position:absolute
        right: 12px
        top: 8px
    .background
      position:absolute
      top: 0
      left:0
      width: 100%
      height:100%
      z-index :-1
      filter:blur(10px)
    .detail
      position:fixed
      top: 0
      left:0
      width: 100%
      height: 100%
      //filter:blur(10px)
      overflow :auto
      transition:all 0.5s
      backdrop-filter:blur(10px)
      z-index :500
      background: rgba(7,17,27,0.8);
      &.fade-transition
        opacity:1
        background:rgba(7,17,27,0.8)
      &.fade-enter,&.fade-leave
        opacity :0
        background:rgba(7,17,27,0)
      .detail-wrapper
        min-height: 100%
        .detail-main
          margin-top:64px
          padding-bottom:64px
          //margin-bottom:64px
          .title
            font-size: 16px
            font-weight: 700
            line-height: 16px
            text-align: center
            margin-bottom:16px
          .star-wrapper
            text-align: center
          .line-header
            display:flex
            margin:28px auto 24px auto
            width:80%
            .line
              flex: 1
              position:relative
              top:-6px
              border-bottom:1px solid rgba(255,255,255,0.2)
            .line-title
              font-size: 14px
              font-weight:700
              line-height: 14px
              padding:0 12px
          ul.youhui
            width:80%
            margin:0 auto
            li.one-info
              padding:0 12px
              font-size: 12px
              font-weight: 200
              line-height: 16px
              margin-bottom:12px
              &:last-child
                margin-bottom:0
              .support-icon
                display:inline-block
                width: 16px
                height:16px
                background-size:16px 16px
                background-repeat:no-repeat
                margin-right:6px
                vertical-align :top
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.invoice
                  bg-image('invoice_2')
                &.special
                  bg-image('special_2')
          .bulletin
            width: 80%
            margin:0 auto
            .bulletin-text
              font-size: 12px
              font-weight: 200
              line-height: 24px
              padding:0 12px
      .detail-close
        width: 32px
        height:32px
        margin:-64px auto 0px auto
        font-size: 32px
        position:relative
</style>

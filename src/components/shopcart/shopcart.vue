<template>
  <div class="shopcart">
    <div class="content">
      <div class="left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
          </div>
          <div class="count" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="right">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
    </div>

    <div class="ball-container">
      <div v-for="ball in balls">
        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
          <div v-show="ball.show" class="ball">
            <div class="inner"></div>
          </div>
        </transition>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      selectFoods: {
        type: Array,
        default () {
          return [
            {
              count: 0,
              price: 0
            }
          ];
        }
      }
    },
    data(){
      return {
        balls:[
          {show:false},
          {show:false},
          {show:false},
          {show:false},
          {show:false}
        ],
        dropBalls:[]
      }
    },
    computed:{
      totalCount(){
        let count = 0;
        for(let i=0;i<this.selectFoods.length;i++){
          let good = this.selectFoods[i];
          count += good.count;
        }
        return count;
      },
      totalPrice(){
        let price = 0;
        for(let i=0;i<this.selectFoods.length;i++){
          let good = this.selectFoods[i];
          price += good.count * good.price;
        }
        return price;
      },
      payDesc(){
        let desc = "";
        if(this.totalPrice === 0){
          desc = `￥${this.minPrice}元起送`;
        }else if(this.totalPrice < this.minPrice){
          let diff = this.minPrice - this.totalPrice;
          desc = `还差${diff}元起送`;
        }else{
          desc = "去结算";
        }
        return desc;
      },
      payClass(){
        if(this.totalPrice < this.minPrice){
          return 'not-enough';
        }else{
          return 'enough';
        }
      }
    },
    methods:{
      drop(el){
        //console.log(el);
        for(let i=0;i<this.balls.length;i++){
          let ball = this.balls[i];
          if(!ball.show){
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index"
  .shopcart
    position:fixed
    left: 0
    bottom:0
    z-index :50
    width:100%
    height: 48px
    background:#141d27
    .content
      display:flex
      font-size:0
      color:rgba(255,255,255,0.4)
      .left
        flex:1
        .logo-wrapper
          display :inline-block
          vertical-align: top
          width: 56px
          height: 56px
          padding: 6px
          margin:0 12px 2px
          background:#141d27
          box-sizing :border-box
          border-radius :50%
          position:relative
          top: -10px
          left:0
          .logo
            background :#2b343c
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              font-size: 24px
              color:#80858a
              line-height: 44px
              &.highlight
                color: #fff
          .count
            position:absolute
            top: 0
            right:0
            width: 24px
            height:16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            background :red
            color: #ffffff
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display :inline-block
          vertical-align: top
          font-size :16px
          font-weight: 700
          line-height: 24px
          margin:12px 0
          padding-right:12px
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          &.highlight
            color: #fff
        .desc
          display :inline-block
          vertical-align: top
          font-size :10px
          font-weight: 200
          line-height: 24px
          margin:12px 0px 12px 12px
      .right
        flex:0 0 105px
        width: 105px
        .pay
          height:48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          background :#2b333b
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        display :fixed
        left: 32px
        bottom: 22px
        z-index :200
        &.drop-transition
          transition:all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
        .inner
          width: 16px
          height: 16px
          border-radius:50%
          background:rgb(0,160,220)
          transition:all 0.4s linear

</style>

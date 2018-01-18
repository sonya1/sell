<template>
  <div>
    <div class="shopcart" >
      <div class="content" @click="toggleList">
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
          <div class="pay" :class="payClass" @click="pay">{{payDesc}}</div>
        </div>
      </div>

      <div class="ball-container">
        <div v-for="ball in balls">
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <div v-show="ball.show" class="ball">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="list-item border-1px" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="cartcontrol-wrapper">
                  <cartControl :food="food" @add="addFood"></cartControl>
                </div>
                <span class="price">￥{{food.price * food.count}}</span>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from "better-scroll";
  import CartControl from "../cartcontrol/cartcontrol";
  export default {
    components:{
      CartControl
    },
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
        dropBalls:[],
        fold:true
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
      },
      listShow(){
        if(!this.totalCount){
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if(show){
          this.$nextTick(()=>{
            if(!this.scroll){
              this.scroll = new BScroll(this.$refs.listContent,{
                click:true
              });
            }else{
              this.scroll.refresh();
            }
          });
        }
        return show;
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
      },
      beforeDrop(el){
        let count = this.balls.length;
        while(count--){
          let ball = this.balls[count];
          if(ball.show){
            //小球当前相对于视口的位置
            let rect = ball.el.getBoundingClientRect();
            //x,y为开始点到目标点 两点之间的连线，xy方向的差值
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';  //使之显示
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      dropping(el,done){
        let rf = el.offsetHeight;  //触发 使浏览器重绘
        this.$nextTick(()=>{
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);

        });
      },
      afterDrop(el){
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList(){
        if(!this.totalCount){
          return;
        }
        this.fold = !this.fold;
      },
      hideList(){
        this.fold = true;
      },
      empty(){
        this.selectFoods.forEach((food)=>{
          food.count = 0;
        });
      },
      pay(){
        if(this.totalPrice < this.minPrice){
          return;
        }
        window.alert(`支付${this.totalPrice}元`);
      },
      addFood(target){
        this.drop(target);
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
    .content
      display:flex
      background:#141d27
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
        position :fixed
        left: 32px
        bottom: 22px
        z-index :200
        transition:all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
        .inner
          width: 16px
          height: 16px
          border-radius:50%
          background:rgb(0,160,220)
          transition:all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top:0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        width: 100%
        background :#f3f5f7
        border-bottom:1px solid rgba(7,17,27,0.1)
        .title
          display :inline-block
          font-size 14px
          font-weight: 200
          line-height: 40px
          color:rgb(7,17,27)
          padding-left :18px
        .empty
          float:right
          padding-right:18px
          font-size 12px
          line-height: 40px
          color:rgb(0,160,220)
      .list-content
        padding:0 18px
        max-height: 217px
        overflow:hidden
        background:#fff
        .list-item
          height: 48px
          padding:12px 0
          box-sizing :border-box
          //border-bottom:1px solid rgba(7,17,27,0.1)
          border-1px(rgba(7,17,27,0.1))
          .name
            font-size 14px
            line-height: 24px
            color:rgb(7,17,27)
          .price
            float :right
            font-size 14px
            font-weight: 700
            line-height: 24px
            color:rgb(240,20,20)
            margin-right: 12px
          .cartcontrol-wrapper
            float:right
            margin-top:-5px
  .list-mask
    position :fixed
    top: 0
    left: 0
    width: 100%
    height:100%
    z-index :40
    backdrop-filter: blur(10px)
    opacity :1
    background:rgba(7,17,27,0.6)
    &.fade-enter-active,&.fade-leave-active
      transition:all 0.5s
    &.fade-enter,&.fade-leave-active
      opacity :0
      background :rgba(7,17,27,0)
</style>

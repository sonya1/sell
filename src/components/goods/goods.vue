<template>
  <div>
    <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul class="menu-list">
        <li class="menu-item" v-for="(good,index) in goods" :class="{'current':currentIndex===index}"
        @click="selectMenu(index,$event)" ref="menuList">
          <span class="text border-1px">
            <span v-show="good.type>0" class="icon" :class="classMap[good.type]"></span>
             {{good.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li class="food-list" v-for="good in goods" ref="foodList">
          <h1 class="title">{{good.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="food in good.foods" class="food-item border-1px">
              <div class="icon">
                <img :src="food.icon" alt="" width="57" height="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="new-price">￥{{food.price}}</span>
                  <span class="old-price" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartControl :food="food" @add="addFood"></cartControl>
                </div>

              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopCart ref="shopcart" :selectFoods="selectFoods" :minPrice="seller.minPrice" :deliveryPrice="seller.deliveryPrice"></shopCart>
  </div>
    <food :food="selectedFood" ref="food" @add="addFood"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from "better-scroll";
  import ShopCart from "../shopcart/shopcart";
  import CartControl from "../cartcontrol/cartcontrol";
  import Food from '../food/food';

  const ERR_OK = 0;
  const debug = process.env.NODE_ENV !== 'production';

  export default {
    components:{
      ShopCart,
      CartControl,
      Food
    },
    props:{
      seller:{
        type:Object
      }
    },
    data(){
      return {
        goods:[],
        listHeight:[],
        scrollY:0,
        selectedFood:{}
      };
    },
    computed:{
      currentIndex(){
        for(let i=0;i<this.listHeight.length;i++){
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i+1];
          if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
            //console.log("return", i);
            //this._followScroll(i);
            return i;
          }
        }
        //console.log("return",0);
        return 0;
      },
      selectFoods(){
        let selectFoods = [];
        this.goods.forEach((goods)=>{
          goods.foods.forEach((food)=>{
            if(food.count){
              selectFoods.push(food);
            }
          });
        });
        return selectFoods;
      }
    },
    created(){
      this.classMap = ['decrease','discount','special','invoice','guarantee'];

      this.$http.get('/api/goods').then((res)=>{
        res = res.body;
        if(res.errno === ERR_OK){
          this.goods = res.data;
          console.log("in components/goods.vue[goods]=" + res.data);
          this.$nextTick(()=>{
            this._initScroll();
            this._calculateHeight();
          });
        }

      });
    },
    methods:{
      addFood(target){
        this._drop(target);
      },
      _drop(target){
        //体验优化，异步执行下落动画，点击加号会触发两个动画
        this.$nextTick(()=>{
          this.$refs.shopcart.drop(target);
        });
      },
      selectMenu(index,event){
        //event._constructed是better-scroll中定义的
        //better-scroll会在移动端阻止默认事件，
        // 而重新对事件进行派发dispatch，
        // 而在pc端中却没有阻止默认事件，
        // 用此属性来判断是pc端还是移动端
        if(!event._constructed){
          //console.log("in PC.");
          return;
        }
        //console.log("in phone.");
        let foodList = this.$refs.foodList;
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      _initScroll(){
        this.menuScroll = new BScroll(this.$refs.menuWrapper,{
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
          //实时监听scrollY的位置，暴露给scroll函数监听中的pos。
          probeType:3,
          click: true
        });
        this.foodsScroll.on('scroll',(pos)=>{
          if(pos.y <=0 ){
            this.scrollY = Math.abs(Math.round(pos.y));
          }
        });
      },
      _calculateHeight(){
        let foodList = this.$refs.foodList;
        let height =0;
        this.listHeight.push(height);
        for(let i=0;i<foodList.length;i++){
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      selectFood(food,event){
        if(!event._constructed){
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      },
      _followScroll(index) {
        let menuList = this.$refs.menuList;
        let el = menuList[index];
        this.meunScroll.scrollToElement(el, 300, 0, -100);
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index"
  .goods
    display:flex
    position:absolute
    top: 174px
    left: 0
    bottom:46px
    width:100%
    overflow :hidden
    .menu-wrapper
      flex:0 0 80px
      width:80px
      background:#f3f5f7
      .menu-item
        display :table
        width: 56px
        height:54px
        line-height: 14px
        padding:0 12px
        &.current
          position:relative
          z-index: 10
          margin-top: -1px
          background :#fff
          font-weight:700
          .text
            border-none()
        .icon
          display:inline-block
          width: 12px
          height:12px
          background-size:12px 12px
          background-repeat:no-repeat
          margin-right:2px
          vertical-align :top
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
          display:table-cell
          vertical-align :middle
          font-size 12px
          font-weight: 200
          text-align:center
          border-1px(rgba(7,17,27,0.1))
    .foods-wrapper
      flex:1
      .title
        padding-left: 14px
        font-size: 12px
        color:rgb(147,153,159)
        line-height: 26px
        background: #f3f5f7
        height: 26px
        border-left:2px solid #d9dde1
      & .food-item
        display:flex
        justify-content :flex-start
        margin:18px
        padding-bottom:18px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          padding-bottom :0
        .icon
          flex:0 0 57px
          padding-right:10px
        .content
          flex:1
          padding-top:2px
          .name
            font-size: 14px
            color:rgb(7,17,27)
            line-height: 14px
            margin-bottom:8px
          .desc,.extra
            font-size: 10px
            color:rgb(147,153,159)
            line-height:14px
            margin-bottom:8px
          .extra
            .count
                margin-right:12px
          .price
            font-weight:700px
            line-height: 24px
            font-size: 0px
            .new-price
              font-size: 14px
              color:rgb(240,20,20)
              margin-right:8px
            .old-price
              text-decoration :line-through
              font-size: 10px
              color:rgb(147,153,159)
          .cartcontrol-wrapper
            position:absolute
            right: 0
            bottom:12px
</style>

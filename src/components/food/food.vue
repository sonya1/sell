<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="pic border-1px">
          <img :src="food.image" alt="">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="food-header">
          <div class="name">{{food.name}}</div>
          <div class="desc">
            <span class="count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="desc2">
            <span class="new-price">￥{{food.price}}</span>
            <span class="old-price" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            <div class="btn" v-show="!food.count || food.count===0">
              <div class="text" @click.stop.prevent="addFirst($event)">加入购物车</div>
            </div>
            <div class="cartcontrol-wrapper" v-show="food.count>0">
              <cartControl :food="food"  @add="addFood" ref="cartcontrol"></cartControl>
            </div>
          </div>
        </div>

        <split v-show="food.info"></split>
        <div v-show="food.info" class="food-info">
          <h2 class="title">商品介绍</h2>
          <p class="text">{{food.info}}</p>
        </div>

        <split></split>
        <div class="food-rating">
          <h2 class="title">商品评价</h2>
          <ratingSelect :selectType="selectType"
                        :onlyContent="onlyContent"
                        :desc="desc"
                        :ratings="food.ratings"
                        @select="selectRating"
                        @toggle="toggleContent">
          </ratingSelect>

          <ul v-show="food.ratings && food.ratings.length">
            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
              <div class="list-header">
                <span class="time">{{rating.rateTime | formatDate}}</span>
                <span class="user">
                  <span class="username">{{rating.username}}</span>
                  <span class="avatar">
                    <img :src="rating.avatar" alt="" width="12" height="12">
                  </span>
                </span>
              </div>
              <div class="list-content">
                <span class="icon" :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                <span class="text">{{rating.text}}</span>
              </div>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
            暂无评价
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from "vue";
  import BScroll from "better-scroll";
  import CartControl from "../cartcontrol/cartcontrol";
  import Split from "../split/split"
  import RatingSelect from "../ratingSelect/ratingselect"
  import {formatDate} from "../../common/js/date";

  const ALL = 2;

  export default{
    components:{
      CartControl,
      Split,
      RatingSelect
    },
    props:{
      food:{
        type:Object
      }
    },
    filters:{
      formatDate(time){
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm');
      }
    },
    data(){
      return {
        showFlag:false,
        selectType:ALL,
        onlyContent:false,
        desc:{
          all:'全部',
          positive:"推荐",
          negative:"吐槽"
        }
      };
    },
    methods:{
      needShow(type,text){
        if(this.onlyContent && !text){
          return false;
        }
        if(this.selectType === ALL){
          return true;
        }else{
          return type === this.selectType;
        }
      },
      selectRating(type){
        this.selectType = type;
        this.$nextTick(()=>{
          this.scroll.refresh();
        });
      },
      toggleContent(){
        this.onlyContent = !this.onlyContent;
        this.$nextTick(()=>{
          this.scroll.refresh();
        });
      },
      addFirst(event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('add', event.target);
        Vue.set(this.food, 'count', 1);
      },
      addFood(target){
        this.$emit('add',target);
      },
      show(){
        this.showFlag = true;
        //this.selectType = ALL;
        //this.onlyContent = true;
        this.$nextTick(()=>{
          if(!this.scroll){
            this.scroll = new BScroll(this.$refs.food,{
              click:true
            });
          }else{
            this.scroll.refresh();
          }
        });
      },
      hide(){
        this.showFlag = false;
      }
    }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index"

  .food
    position :fixed
    width: 100%
    top: 0
    left: 0
    bottom: 48px
    background :#fff
    z-index :30
    transform: translate3d(0, 0, 0)
  &.move-enter-active,&.move-leave-active
      transition:all 0.2s linear
    &.move-enter,&.move-leave-active
      transform:translate3d(100%,0,0)
    .pic
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      & img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display :block
          padding: 10px
          font-size: 20px
          color:#fff
    .title
      //color:#000
      padding-bottom:6px
      font-size: 14px
      font-weight: 700
      color:rgb(7,17,27)
      line-height:14px
    .food-header
      padding:0 18px
      .name
        padding:18px 0 8px 0
        font-size: 14px
        font-weight: 700
        color:rgb(7,17,27)
        line-height:14px
      .desc
        padding-bottom:18px
        font-size: 10px
        color:rgb(147,153,159)
        line-height:10px
        .count
          margin-right:12px
      .desc2
        padding-bottom:18px
        .new-price
          font-size: 14px
          font-weight: 700
          color:rgb(240,20,20)
          line-height:24px
        .old-price
          font-size: 10px
          font-weight: 700
          color:rgb(147,153,159)
          line-height:24px
          text-decoration :line-through
        .btn
          float :right
          width: 74px
          height: 24px
          background :rgb(0,160,220)
          border-radius 24px
          .text
            color: #fff
            font-size: 10px
            line-height:24px
            text-align: center
        .cartcontrol-wrapper
          float :right
          margin-top: -5px
    .food-info
      padding:18px
      .text
        padding:0 8px
        font-size: 12px
        font-weight:200
        color:rgb(77,85,93)
        line-height: 24px
    .food-rating
      .title
        padding: 18px 0 0 18px
      .rating-item
        margin:0 18px
        padding:12px 0
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
        .list-header
          height:12px
          margin-bottom: 6px
          .time
            float :left
            font-size:10px
            color:rgb(147,153,159)
            line-height: 12px
          .user
            float :right
            .username
              font-size:10px
              color:rgb(147,153,159)
              line-height: 12px
              margin-right: 6px
            .avatar
              display :inline-block
              width: 12px
              height: 12px
              border-radius :50%
        .list-content
          font-size:0
          .icon-thumb_up, .icon-thumb_down
            display :inline-block
            vertical-align: top
            margin-right: 4px
            line-height: 12px
            font-size: 12px
          .icon-thumb_up
            color: rgb(0, 160, 220)
          .icon-thumb_down
            color: rgb(147, 153, 159)
          .text
            display :inline-block
            vertical-align: top
            font-size:12px
            color:rgb(7,17,27)
            line-height: 12px
      .no-rating
        padding: 16px 16px
        font-size: 12px
        color: rgb(147, 153, 159)
</style>

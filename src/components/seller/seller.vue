<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <div class="overview-top">
          <div class="title">{{seller.name}}</div>
          <div class="star-wrapper">
            <star :size="36" :score="seller.score"></star>
          </div>
          <span class="ratingCount">({{seller.ratingCount}})</span>
          <span class="sellCount">月售{{seller.sellCount}}单</span>
          <div class="love" @click="toggleFavorite">
            <i class="icon-favorite" :class="{'active':favorite}"></i>
            <div class="text">{{favoriteText}}</div>
          </div>
        </div>
        <div class="overview-bottom">
          <div class="block">
            <p class="key">起送价</p>
            <p class="value">{{seller.minPrice}}
              <span class="small">元</span>
            </p>
          </div>
          <div class="block">
            <p class="key">商家配送</p>
            <p class="value">{{seller.deliveryPrice}}
              <span class="small">元</span>
            </p>
          </div>
          <div class="block">
            <p class="key">平均配送时间</p>
            <p class="value">{{seller.deliveryTime}}
              <span class="small">分钟</span>
            </p>
          </div>
        </div>
      </div>

      <split></split>

      <div class="bulletin">
        <h2 class="title">公告与活动</h2>
        <p class="text">{{seller.bulletin}}</p>
        <ul v-if="seller.supports">
          <li class="youhui-item"  v-for="(item,index) in seller.supports">
            <span class="support-icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>

      <split></split>

      <div class="pics">
        <h2 class="title">商家实景</h2>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item"  v-for="pic in seller.pics"><img :src="pic" alt=""></li>
          </ul>
        </div>
      </div>

      <split></split>
      <div class="info">
        <h2 class="title">商家信息</h2>
        <ul>
          <li class="info-item" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from "better-scroll";
  import split from "../split/split";
  import star from "../star/star";
  import {saveToLocal,loadFromLocal} from "../../common/js/store";

  export default{
    props:{
      seller:{
        type:Object
      }
    },
    components:{
      split,
      star
    },
    created(){
      this.classMap = ['decrease','discount','special','invoice','guarantee'];
    },
    watch:{
      'seller'(){
        this.$nextTick(()=>{
          this._initScroll();
          this._initPics();
        });
      }
    },
    mounted(){
      this.$nextTick(()=>{
        this._initScroll();
        this._initPics();
      });
    },
    data(){
      return {
        favorite: (()=>{
          return loadFromLocal(this.seller.id,'favorite',false)
        })()
      };
    },
    computed:{
      favoriteText(){
        return  this.favorite?"已收藏":"收藏";
      }
    },
    methods:{
      toggleFavorite(event){
        if(!event._constructed){
          return;
        }
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id, 'favorite', this.favorite);

      },
      _initScroll(){
        if(!this.scroll){
          this.scroll = new BScroll(this.$refs.seller,{
            click:true
          });
        }else{
          this.scroll.refresh();
        }
      },
      _initPics(){
        if(this.seller.pics){
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length - margin;
          this.$refs.picList.style.width = width + 'px';
          //console.log("width",width);
          this.$nextTick(()=>{
            if(!this.picScroll){
              this.picScroll = new BScroll(this.$refs.picWrapper,{
                scrollX:true,
                eventPassthough:'vertical'
              });
            }else{
              this.picScroll.refresh();
            }
          });
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index"
  .seller
    position:absolute
    top: 174px
    bottom:0
    left: 0
    width: 100%
    overflow hidden
    .overview,.bulletin,.pics,.info
      padding:18px
      .title
        font-size: 14px
        color:rgb(7,17,27)
        line-height: 14px
        margin-bottom 8px
    .overview
      .overview-top
        position:relative
        border-bottom 1px solid rgba(7,17,27,0.1)
        .star-wrapper
          display inline-block
          margin:0 8px 18px 0
        .ratingCount,.sellCount
          font-size: 10px
          color:rgb(77,85,93)
          line-height: 18px
        .ratingCount
          margin-right: 12px
        .love
          position absolute
          top: 5px
          right: 0;
          width: 50px;
          //background:red
          .icon-favorite
            display block
            font-size:24px
            color:#d4d6d9
            line-height: 24px
            margin-bottom: 4px
            text-align: center
          .active
            color:red
          .text
            font-size:10px
            color:rgb(77,85,93)
            line-height: 10px
            text-align: center
      .overview-bottom
        display flex
        .block
          flex:1
          margin-top 18px
          font-size:0
          text-align: center
          border-right:1px solid rgba(7,17,27,0.1)
          &:last-child
            border-right:0
          .key
            font-size:10px
            color:rgb(147,153,159)
            line-height: 10px
            margin-bottom: 4px
          .value
            font-size:24px
            font-weight: 200
            color:rgb(7,17,27)
            line-height: 24px
            .small
              font-size: 10px
    .bulletin
      padding-bottom 0
      .text
        padding:0 12px
        font-size: 12px
        font-weight: 200
        color:rgb(240,20,20)
        line-height: 24px
        margin-bottom: 16px
      .youhui-item
        padding:16px 12px
        font-size: 12px
        font-weight: 200
        line-height: 16px
        color:rgb(7,17,27)
        border-top :1px solid rgba(7,17,27,0.1)
        &:last-child
          border-bottom:0
        .support-icon
          display:inline-block
          width: 16px
          height:16px
          background-size:16px 16px
          background-repeat:no-repeat
          margin-right:6px
          vertical-align :top
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.guarantee
            bg-image('guarantee_4')
          &.invoice
            bg-image('invoice_4')
          &.special
            bg-image('special_4')
        .text
          font-size: 12px
          font-weight: 200
          line-height: 16px
          color:rgb(7,17,27)
    .pics
      .pic-wrapper
        width: 100%
        overflow hidden
        white-space nowrap
        .pic-list
          font-size:0
          .pic-item
            display inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin:0
            & img
              width: 120px
              height: 90px
    .info
      .info-item
        padding:16px 12px
        border-top :1px solid rgba(7,17,27,0.1)
        font-size: 12px
        font-weight: 200
        color:rgb(7,17,27)
        line-height: 16px
        &:last-child
          border-bottom :0

</style>

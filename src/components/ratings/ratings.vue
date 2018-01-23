<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="rating-header">
        <div class="header-left">
          <div class="score">{{seller.score}}</div>
          <div class="score-desc">综合评分</div>
          <div class="rankRate">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="header-right">
          <div class="line">
            <span class="title">服务态度</span>
            <div class="star-wrapper">
              <star :size="36" :score="seller.serviceScore"></star>
            </div>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="line">
            <span class="title">商品评分</span>
            <div class="star-wrapper">
              <star :size="36" :score="seller.foodScore"></star>
            </div>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="line">
            <span class="title">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <div class="rating-content">
        <ratingSelect :selectType="selectType"
                    :onlyContent="onlyContent"
                    :desc="desc"
                    :ratings="ratings"
                    @select="selectRating"
                    @toggle="toggleContent">
        </ratingSelect>
        <ul v-show="ratings && ratings.length">
          <li v-show="needShow(rating.rateType,rating.text)"
              v-for="rating in ratings"
              class="rating-item border-1px">
            <div class="left">
              <img :src="rating.avatar" alt="" class="avatar">
            </div>
            <div class="right">
              <div class="list-header">
                <div class="top">
                  <span class="username">{{rating.username}}</span>
                  <span class="time">{{rating.rateTime | formatDate}}</span>
                </div>
                <div class="star-wrapper">
                  <star :size="24" :score="rating.score"></star>
                </div>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <div class="list-content">
                <p class="text">{{rating.text}}</p>
                <span class="icon" :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                <span class="recommend" v-for="reco in rating.recommend">{{reco}}</span>
              </div>
            </div>
          </li>
        </ul>
        <div class="no-rating" v-show="!ratings || !ratings.length">
          暂无评价
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from "better-scroll";
  import Star from "../star/star";
  import Split from "../split/split";
  import RatingSelect from "../ratingSelect/ratingselect";
  import {formatDate} from "../../common/js/date";

  const ERR_OK = 0
  const ALL = 2;

  export default {
    components:{
      Star,
      Split,
      RatingSelect
    },
    data(){
      return {
        selectType:ALL,
        onlyContent:false,
        desc:{
          all:'全部',
          positive:"满意",
          negative:"不满意"
        },
        ratings:[]
      };
    },
    props:{
      seller:{
        type:Object
      }
    },
    filters:{
      formatDate(time){
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm');
      }
    },
    created(){
      this.$http.get("/api/ratings").then((res)=>{
        res = res.body;
        if(res.errno === ERR_OK){
          this.ratings = res.data;
          console.log("in ratings [ratings]=",res.data);
          this.$nextTick(()=>{
            this.scroll = new BScroll(this.$refs.ratings,{
              click:true
            });
          });
        }
      });
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
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ratings
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .rating-header
      display flex
      padding:18px 0
      .header-left
        flex:0 0 137px
        width: 137px
        text-align: center
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          font-size: 24px
          color:rgb(255,153,0)
          line-height: 28px
          padding-bottom:6px
        .score-desc
          font-size: 12px
          color:rgb(7,17,27)
          line-height: 12px
          padding-bottom:8px
        .rankRate
          font-size: 10px
          color:rgb(7,17,27)
          line-height: 10px
          padding-bottom:6px
      .header-right
        flex:1
        padding:0 24px
        border-left:1px solid rgba(7,17,27,0.1)
        font-size:0
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .line
          padding-bottom:8px
          .title
            font-size: 12px
            color:rgb(7,17,27)
            line-height: 18px
            padding-right :12px
          .star-wrapper
            display :inline-block
            margin-right:12px
          .score
            font-size: 12px
            color:rgb(255,153,0)
            line-height: 18px
          .time
            font-size: 12px
            color:rgb(147,153,159)
            line-height: 18px
        &:last-child
          padding-bottom:0

    .rating-content
      .rating-item
        display flex
        padding: 0 18px
        margin:18px 0
        .left
          flex:0 0 28px
          width:28px
          margin-right 12px
          .avatar
            border-radius :50%
            width: 28px
            height:28px
        .right
          flex:1
          .list-header
            font-size:0
            .top
              margin-bottom:4px
              .username
                display inline-block
                vertical-align top
                font-size: 10px
                color:rgb(7,17,27)
                line-height: 12px
              .time
                float:right
                display inline-block
                vertical-align top
                font-size: 10px
                font-weight: 200
                color:rgb(147,153,159)
                line-height: 12px
            .star-wrapper
              display inline-block
              margin:0 6px 6px 0
            .delivery
              font-size: 10px
              font-weight: 200
              color:rgb(147,153,159)
              line-height: 12px
          .list-content
            font-size:0
            .text
              font-size: 12px
              color:rgb(7,17,27)
              line-height: 18px
              margin-bottom:8px
            .icon
              display :inline-block
              vertical-align: top
              margin-right: 8px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(183,187,191)
            .recommend
              display inline-block
              text-align: center
              border:1px solid rgba(7,17,27,0.1)
              border-radius 1px
              background-color rgb(255,255,255)
              padding:0 6px
              font-size: 9px
              color:rgb(147,153,159)
              line-height: 16px
              margin:0 8px 4px 0
</style>

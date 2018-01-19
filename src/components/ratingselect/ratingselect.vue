<template>
  <div class="ratingselect">
    <div class="list">
      <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">
        {{desc.all}}
        <span class="count">{{ratings.length}}</span>
      </span>
      <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">
        {{desc.positive}}
        <span class="count">{{positives.length}}</span>
      </span>
      <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">
        {{desc.negative}}
        <span class="count">{{negatives.length}}</span>
      </span>
    </div>

    <div @click="toggleContent" class="switch" :class="{'on':onlyContent===true}">
      <span class="icon-check_circle" @click=""></span>
      <span class="text">只看有内容的评价</span>
    </div>

    <ul v-show="ratings && ratings.length">
      <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in ratings" class="rating-item">
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
    <div class="no-rating" v-show="!ratings || !ratings.length">
      暂无评价
    </div>


  </div>
</template>

<script type="text/ecmascript-6">
  import {formatDate} from "../../common/js/date";

  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
  export default {
    filters:{
      formatDate(time){
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm');
      }
    },
    props:{
      ratings:{
        type:Array,
        default(){
          return [];
        }
      },
      selectType:{
        type:Number,
        default:ALL
      },
      onlyContent:{
        type:Boolean,
        default:false
      },
      desc:{
        type:Object,
        default(){
          return {
            all:'全部',
            positive:'满意',
            negative:'不满意'
          };
        }
      }
    },
    computed:{
      positives(){
        return this.ratings.filter((rating)=>{
          return rating.rateType === POSITIVE;
        });
      },
      negatives(){
        return this.ratings.filter((rating)=>{
          return rating.rateType === NEGATIVE;
        });
      }
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
      select(type,event){
        if(!event._constructed){
          return;
        }
        this.selectType = type;
        this.$emit('select',type);
      },
      toggleContent(event) {
        if (!event._constructed) {
          return;
        }
        //this.onlyContent = !this.onlyContent;
        this.$emit('toggle');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index"
  .ratingselect
    .list
      padding-bottom:18px
      margin:18px 18px 0
      border-bottom:1px solid rgba(7,17,27,0.1)
      .block
        display :inline-block
        padding:8px 12px
        font-size: 12px
        line-height: 16px
        border-radius :1px
        margin-right :8px
        color:rgb(77,85,93)
      .active
        color: #ffffff
      .count
        margin-left: 2px
        font-size: 8px
      .positive
        background:rgba(0,160,220,0.2)
        &.active
          background: rgb(0,160,220)
      .negative
        background:rgba(77,85,93,0.2)
        &.active
          background: rgb(77,85,93)
    .switch
      padding:12px 18px
      //margin:0 18px
      border-bottom :1px solid rgba(7,17,27,0.1)
      &.on
        .icon-check_circle
          color:#00c850
      .icon-check_circle
        display:inline-block
        vertical-align :top
        margin-right: 4px
        font-size: 24px
        color:rgb(147,153,159)
        line-height: 24px
      .text
        display:inline-block
        vertical-align :top
        font-size: 12px
        color:rgb(147,153,159)
        line-height: 24px
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

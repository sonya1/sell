<template>
  <div>
    <my-header :seller="seller"></my-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">
          商品
        </router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">
          评论
        </router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">
          店家
        </router-link></div>
    </div>
    <keep-alive>
      <router-view :seller="seller" keep-alive></router-view>
    </keep-alive>

  </div>
</template>

<script type="text/ecmascript-6">
import MyHeader from './components/header/header';
import {urlParse} from "./common/js/util";

const ERR_OK = 0
const debug = process.env.NODE_ENV !== 'product';


export default {
  components:{
    MyHeader
  },
  data(){
    return {
      seller : {
        id:(()=>{
          let queryParam = urlParse();
          return queryParam.id;
        })()
      }
    };
  },
  created(){

    this.$http.get('/api/seller')
      .then((res)=>{
          //console.log("res",res);
          res = res.body;
        if(res.errno === ERR_OK){
          this.seller = res.data;
          console.log("in App.vue[seller]=",res.data);
        }
      });
  }

}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>


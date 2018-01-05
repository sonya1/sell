<template>
  <div id="app">
    <my-header :seller="seller"></my-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link :to="{path:'/goods'}">
          商品
        </router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{path:'/ratings'}">
          评论
        </router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{path:'/seller'}">
          店家
        </router-link></div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import MyHeader from './components/header/header'

const ERR_OK = 0
export default {
  components:{
    MyHeader
  },
  data(){
    return {
      seller : {}
    }
  },
  created(){
    this.$http.get('/api/seller')
      .then((res)=>{
          //console.log("res",res);
          res = res.body;
        if(res.errno === ERR_OK){
          this.seller = res.data;
          console.log("res.data-->",res.data);
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
  // border-bottom: 1px solid rgba(7, 17, 27, 0.1)
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


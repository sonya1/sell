// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Router from 'vue-router'
import Resource from 'vue-resource'
import SellerPage from './components/seller/seller'
import GoodsPage from './components/goods/goods'
import RatingsPage from './components/ratings/ratings'
//import './common/stylus/index.styl'
import 'common/stylus/index.styl'

Vue.use(Router)
Vue.use(Resource)

let router = new Router({
  linkActiveClass: 'active',
  mode:'history',
  routes:[
    {
      path:'/',
      component:App,
      redirect:'/goods'
    },
    {
      path:'/seller',
      component:SellerPage
    },
    {
      path:'/goods',
      component:GoodsPage
    },
    {
      path:'/ratings',
      component:RatingsPage
    }
  ]
});




Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

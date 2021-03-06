var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.port;

var app = express();

var router = express.Router();

router.get('/',function(req,res,next){
  req.url = '/index.html';
  next();
});

app.use(router);

var appData = require('./data.json');

const seller = appData.seller;
const goods = appData.goods;
const ratings = appData.ratings;

app.get('/api/seller', (req, res) => {
  res.json({
    errno: 0,
    data: seller
  })//接口返回json数据，上面配置的数据seller就赋值给data请求后调用
});
app.get('/api/goods', (req, res) => {
  res.json({
    errno: 0,
    data: goods
  })
});
app.get('/api/ratings', (req, res) => {
  res.json({
    errno: 0,
    data: ratings
  })
});


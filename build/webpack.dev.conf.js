'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)


const express = require('express');
const app = express();
const appData = require('../data.json');
const seller = appData.seller;
const goods = appData.goods;
const ratings = appData.ratings;

const apiRoutes = express.Router();
/*apiRoutes.get('/',function(req,res){
  res.json({
    msg:"hello ! Welcome to sonya api!"
  });
});
apiRoutes.get('/seller',function(req,res){
  res.json({
    errno:0,
    data:seller
  });
});

apiRoutes.get('/goods',function(req,res){
  res.json({
    errno:0,
    data:goods
  });
});

apiRoutes.get('/ratings',function(req,res){
  res.json({
    errno:0,
    data:ratings
  });
});*/
app.use('/api',apiRoutes);


/*--sonya add --express */
/*
var express = require('express')
var bodyParser = require('body-parser')
var apiServer = express()

apiServer.use(bodyParser.urlencoded({ extended: true }))
//extended为false表示使用querystring来解析数据，这是URL-encoded解析器
// parse application/json
apiServer.use(bodyParser.json())//添加json解析器
var apiRouter = express.Router();
var fs = require('fs');
apiRouter.get('/',function(req,res){
  res.json({message:'hooray!welcome to our api!'});
});
apiRouter.route('/:apiName')
  .all(function(req,res){
    fs.readFile('./data.json','utf8',function(err,data){
      if(err) throw err;
      var data = JSON.parse(data);
      if(data[req.params.apiName]){
        //console.log('aaaaa!');
        res.json(data[req.params.apiName])
      }else{
        res.send('no such api name');
      }
    })
  })

apiServer.use('/api',apiRouter);
apiServer.listen(8081, () => {
  console.log('Listening at http://localhost:' + (8081) + '\n');
})
*/
/*-----end sonya*/



const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    before(app) {
      app.get('/api/seller', (req, res) => {
        res.json({
          errno: 0,
          data: seller
        })//接口返回json数据，上面配置的数据seller就赋值给data请求后调用
      }),
      app.get('/api/goods', (req, res) => {
        res.json({
          errno: 0,
          data: goods
        })
      }),
      app.get('/api/ratings', (req, res) => {
        res.json({
          errno: 0,
          data: ratings
        })
      })
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)

      //sonya
      /*app.listen(port, function (err) {
        if (err) {
          console.log(err)
          return
        }
        console.log('Listening at http://localhost:' + port + '\n')
      })*/
    }
  })
})

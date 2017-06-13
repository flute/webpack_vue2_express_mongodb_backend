var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }/*,{
  	css: ExtractTextPlugin.extract({
        use: ['css-loader'],
        fallback: 'vue-style-loader',
        publicPath:'../' 
    }*/)
  })
}

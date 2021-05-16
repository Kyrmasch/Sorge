const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');
const resolve = require('path').resolve;
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');

const config = {
    context: __dirname,
    entry: __dirname + '/index.js',
    output:{
        path: resolve('../publics'),
        filename: 'sorge.js',
        publicPath: resolve('../publics')
    },
    resolve: {
        extensions: ['.js','.jsx','.css']
    },
    module: {
        rules: [
          {
            test: /\.js?$/,
            exclude: /node_modules/,
            use: ["babel-loader"]
          },
          {
            test: /\.(css|scss)?$/,
            use:[
              "style-loader",
              "css-loader",    
            ]
          },
          {
            test: /\.(jpg|jpeg|png|svg|avi|mp3|gif)?$/,
            loaders: ['file-loader']
          }
        ],
    },
    performance: {
      hints: process.env.NODE_ENV === 'production' ? "warning" : false
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
};
module.exports = config;
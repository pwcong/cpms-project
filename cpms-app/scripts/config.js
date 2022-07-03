const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

const rootPath = (exports.rootPath = path.join(__dirname, '..'));
const srcPath = (exports.srcPath = path.join(rootPath, 'src'));
const distPath = (exports.distPath = path.join(rootPath, 'dist'));
exports.viewPath = path.join(srcPath, 'views');

let environment = 'local';
if (process.env.NODE_ENV === 'production') {
  environment = process.env.BUILD_ENV || 'sit';
}

exports.environment = environment;

const buildTarget = (exports.buildTarget = process.env.BUILD_TARGET || 'cordova');

const baseConfig = (exports.baseConfig = {
  entry: {
    index: path.join(srcPath, 'index.js'),
  },
  output: {
    path: distPath,
  },
  resolve: {
    alias: {
      '@': srcPath,
    },
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      ENVIRONMENT: environment,
      BUILD_TARGET: buildTarget,
    }),
    new HTMLWebpackPlugin({
      title: 'CPMS',
      template: path.join(srcPath, 'index.ejs'),
      favicon: path.join(rootPath, 'static/favicon.ico'),
      meta: {},
    }),
    new HtmlWebpackTagsPlugin({
      tags: [
        {
          path: 'https://webapi.amap.com/maps?v=1.4.15&key=66c039ccc1eb3b908ea450529cd5768e',
          type: 'js',
        },
        'cordova.js',
      ],
      append: false,
    }),
  ],
});

exports.devConfig = merge(baseConfig, {});
exports.prodConfig = merge(baseConfig, {});

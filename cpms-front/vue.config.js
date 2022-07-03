const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const system = require('./src/config/system');
const modifyVars = require('./src/config/theme');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const isDev = process.env.NODE_ENV === 'development';
const proxyAPI = 'https://acloud-sit.tcl.com/';

let environment = 'local';
if (!isDev) {
  environment = process.env.BUILD_ENV || 'sit';
}

module.exports = {
  productionSourceMap: false,
  publicPath: isDev ? '/' : system.baseUrl,
  configureWebpack: {
    plugins: [
      new HardSourceWebpackPlugin(),
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: require('./public/vendor/vendor-manifest.json'),
      }),
      new webpack.EnvironmentPlugin({
        ENVIRONMENT: environment,
      }),
    ],
  },
  chainWebpack(config) {
    config.plugin('html').tap((args) => {
      args[0].baseUrl = isDev ? '' : system.baseUrl;
      args[0].isDev = isDev;
      return args;
    });
    config.plugins.delete('prefetch');
    // ie兼容
    config.entry('main').add('babel-polyfill');
    // 处理svg图片
    config.module.rule('svg').exclude.add(resolve('src/assets/svg')).end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end();

    if (!isDev) {
      // 开启gzip
      config
        .plugin('compressionPlugin')
        .use(
          new CompressionPlugin({
            test: /\.js$|\.html$|.\css/, // 匹配文件名
            threshold: 10240, // 对超过10k的数据压缩
            deleteOriginalAssets: false, // 不删除源文件
          })
        )
        .end();
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars,
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true,
      },
    },
  },
  devServer: {
    port: 5101,
    proxy: {
      '/local': {
        // 本地联调测试改为IP地址
        target: 'http://10.88.82.77:8030/',
        pathRewrite: {
          '^/local': '/api',
        },
        changeOrigin: true,
      },
      '/api': {
        target: proxyAPI,
        changeOrigin: true,
      },
      // 图片
      '/minio/poros': {
        target: proxyAPI,
      },
    },
  },
};

const WebpackBar = require('webpackbar');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.baseWebpackConfig = {
  entry: {},
  output: {
    filename: 'js/[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'imgs/[name].[hash].[ext]',
        },
      },
      {
        test: /\.svg$/,
        loader: 'file-loader',
        options: {
          name: 'imgs/[name].[hash].[ext]',
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        loader: 'file-loader',
        options: {
          name: 'media/[name].[hash].[ext]',
        },
      },
      {
        test: /\.(zip|rar|7z)$/,
        loader: 'file-loader',
        options: {
          name: 'archive/[name].[hash].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[hash].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.vue'],
  },
  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
        },
      },
    },
  },
  plugins: [new CleanWebpackPlugin(), new WebpackBar(), new FriendlyErrorsPlugin(), new VueLoaderPlugin()],
};

exports.buildCssLoadersConfig = function (isProd) {
  const commonCssLoaders = [
    isProd
      ? {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../',
          },
        }
      : 'style-loader',
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [['postcss-preset-env', {}]],
        },
      },
    },
  ];

  return {
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [...commonCssLoaders, 'sass-loader'],
        },
        {
          test: /\.less$/,
          use: [
            ...commonCssLoaders,
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                  modifyVars: {
                    red: '#e50113',
                    'checkbox-checked-icon-color': '#e50113',
                    'switch-on-background-color': '#e50113',
                    'text-link-color': '#e50113',
                    'tabbar-item-active-color': '#e50113',
                    'radio-checked-icon-color': '#e50113',
                  },
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: commonCssLoaders,
        },
      ],
    },
    plugins: isProd
      ? [
          new MiniCssExtractPlugin({
            filename: 'css/[name].[hash].css',
            allChunks: true,
          }),
        ]
      : [],
  };
};

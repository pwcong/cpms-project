const portfinder = require('portfinder');
const address = require('address');
const chalk = require('chalk');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const webpackDevServer = require('webpack-dev-server');
const webpackDevConfig = require('../config/webpack.dev.conf');
const { devConfig, rootPath } = require('./config');

function start(config, webpackConfig) {
  config = Object.assign({}, config);

  webpackConfig = merge(webpackDevConfig, webpackConfig, {
    devServer: config.devServer || {},
  });

  webpackDevServer.addDevServerEntrypoints(webpackConfig, webpackConfig.devServer);
  const compiler = webpack(webpackConfig);
  const server = new webpackDevServer(compiler, webpackConfig.devServer);

  const { host, port } = webpackConfig.devServer;

  server.listen(port, host, (err) => {
    if (!err) {
      console.log(
        chalk.green(
          '\n> Your application is running here:\n' +
            `  http://0.0.0.0:${port}/\n` +
            `  http://127.0.0.1:${port}/\n` +
            `  http://${address.ip()}:${port}/`
        )
      );
    }
  });
}

function main() {
  portfinder.getPort(
    {
      port: 5102,
    },
    (err, port) => {
      if (!!err) {
        console.log(chalk.red('Fail to get port'));
        return;
      }
      const config = {
        devServer: {
          contentBase: [rootPath],
          host: '0.0.0.0',
          port,
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
              target: 'https://acloud-sit.tcl.com/',
              changeOrigin: true,
            },
            // 图片
            '/minio/poros': {
              target: 'https://acloud-sit.tcl.com/',
            },
          },
        },
      };
      const webpackConfig = {};

      start(config, merge(devConfig, webpackConfig));
    }
  );
}

main();

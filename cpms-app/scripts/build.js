const fs = require('fs-extra');
const path = require('path');
const prettier = require('prettier');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const ZipWebpackPlugin = require('zip-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pkg = require('../package.json');
const webpackProdConfig = require('../config/webpack.prod.conf');
const { prodConfig, rootPath, distPath, environment } = require('./config');

function build(config, webpackConfig) {
  config = Object.assign({}, config);

  webpackConfig = merge(webpackProdConfig, webpackConfig);

  webpack(webpackConfig, (err, stats) => {
    if (err) {
      return;
    }

    console.log(
      stats.toString({
        chunks: false, // Makes the build much quieter
        colors: true, // Shows colors in the console
      })
    );
  });
}

function main() {
  const version = pkg.version;

  const cubeModule = {
    releaseNote: pkg.description,
    build: version
      .split('.')
      .map((d) => Number(d))
      .reverse()
      .reduce((p, c, i) => p + c * Math.pow(1000, i), 0),
    name: pkg.name,
    identifier: pkg.identifier,
    action: '',
    index: 'index.html',
    version,
    testVersion: version,
    productionVersion: version,
  };

  const filepath = path.join(rootPath, 'CubeModule.json');

  fs.writeFileSync(
    filepath,
    prettier.format(JSON.stringify(cubeModule), {
      parser: 'json',
    }),
    {
      encoding: 'utf8',
    }
  );

  const config = {};
  const webpackConfig = {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: filepath, to: distPath },
          {
            from: path.join(rootPath, 'static'),
            to: path.join(distPath, 'static'),
          },
        ],
      }),
      new ZipWebpackPlugin({
        path: distPath,
        filename: `${cubeModule.identifier}-${cubeModule.name}-${
          environment === 'production'
            ? cubeModule.productionVersion
            : cubeModule.testVersion
        }-${environment}.zip`,
      }),
    ],
  };
  build(config, merge(prodConfig, webpackConfig));
}

main();

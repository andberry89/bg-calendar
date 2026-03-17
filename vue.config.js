const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
const pkg = require('./package.json');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __APP_VERSION__: JSON.stringify(pkg.version)
      })
    ]
  }
});

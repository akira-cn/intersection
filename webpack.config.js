module.exports = function (env = {}) {
  const webpack = require('webpack'),
    path = require('path'),
    fs = require('fs'),
    packageConf = JSON.parse(fs.readFileSync('package.json', 'utf-8'))

  const version = packageConf.version,
    proxyPort = 9091,
    plugins = [],
    jsLoaders = []

  if(env.production) {
    // compress js in production environment

    // plugins.push(
    //   new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //       warnings: false,
    //       drop_console: false
    //     }
    //   })
    // )
  }

  if(fs.existsSync('./.babelrc')) {
    // use babel
    const babelConf = JSON.parse(fs.readFileSync('.babelrc'))
    jsLoaders.push({
      loader: 'babel-loader',
      options: babelConf
    })
  }

  return {
    entry: './lib/index.js',
    output: {
      filename: env.production ? `intersection-${version}.js` : 'index.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/js/',
      //library: 'intersection',
      //libraryTarget: 'umd'
    },

    plugins,

    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules\/(?!await-signal)|bower_components)/,
        use: jsLoaders
      }]
    },

    devServer: {
      proxy: {
        '*': `http://127.0.0.1:${proxyPort}`
      }
    },
    //devtool: 'inline-source-map',
  }
}

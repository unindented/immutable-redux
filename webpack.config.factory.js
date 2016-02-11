'use strict'

var webpack = require('webpack')

module.exports = function (options) {
  return {
    entry: {
      'ImmutableRedux': './src/'
    },

    output: {
      path: './dist/',
      pathinfo: options.test,

      filename: 'immutable-redux' + (options.environment === 'production' ? '.min' : '') + '.js',

      library: '[name]',
      libraryTarget: 'umd'
    },

    externals: (!options.test ? {
      immutable: {
        root: 'Immutable',
        amd: 'immutable',
        commonjs: 'immutable',
        commonjs2: 'immutable'
      }
    } : {}),

    debug: options.test,
    devtool: (options.test ? 'eval' : null),

    resolve: {
      modulesDirectories: [
        'node_modules'
      ]
    },

    resolveLoader: {
      modulesDirectories: [
        'node_modules'
      ]
    },

    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(lib|node_modules)[\\\/]/,
          loader: options.coverage ? 'isparta' : 'babel'
        }
      ]
    },

    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(options.environment)
        }
      })
    ].concat(options.environment === 'production' ? [
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          screw_ie8: true,
          warnings: false
        }
      })
    ] : [])
  }
}

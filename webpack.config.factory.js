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
        'actions',
        'reducers',
        'constants',
        'middlewares',
        'utils',
        'web_modules',
        'node_modules'
      ]
    },

    resolveLoader: {
      modulesDirectories: [
        'web_modules',
        'node_modules'
      ]
    },

    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(dist|node_modules)[\\\/]/,
          loader: 'babel'
        }
      ],

      postLoaders: (options.coverage ? [
        {
          test: /\.jsx?$/,
          exclude: /(dist|node_modules|test)[\\\/]/,
          loader: 'istanbul-instrumenter'
        }
      ] : [])
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

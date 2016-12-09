const path = require('path')
const webpack = require('webpack')

module.exports = function (options) {
  const environment = options.environment
  const isProduction = (environment === 'production')
  const root = path.resolve(__dirname, '../../')
  const output = path.resolve(root, './dist/')

  return {
    entry: {
      'ImmutableRedux': './src/'
    },

    output: {
      path: output,
      pathinfo: options.test,

      filename: 'immutable-redux' + (isProduction ? '.min' : '') + '.js',

      library: '[name]',
      libraryTarget: 'umd'
    },

    externals: {
      immutable: {
        root: 'Immutable',
        amd: 'immutable',
        commonjs: 'immutable',
        commonjs2: 'immutable'
      }
    },

    debug: options.test,
    devtool: (options.test ? 'eval' : null),

    resolve: {
      extensions: ['', '.ts', '.js'],

      root: [
        root
      ],

      modulesDirectories: [
        'node_modules'
      ]
    },

    resolveLoader: {
      extensions: ['', '.js'],

      modulesDirectories: [
        'node_modules'
      ]
    },

    module: {
      loaders: [
        {
          test: /\.ts$/,
          exclude: /(lib|node_modules)[\\/]/,
          loader: 'ts'
        }
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(options.environment)
        }
      })
    ].concat(isProduction ? [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      })
    ] : []),

    ts: {
      compilerOptions: {
        declaration: false
      }
    }
  }
}

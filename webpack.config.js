const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  resolveLoader: {
    alias: {
      'react-docs': path.join(__dirname, 'loaders/react-docs.js')
    },
    root: path.join(__dirname, 'node_modules')
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  entry: {
    components: ['./src/index'],
    demo: [
      'webpack-dev-server/client?http://0.0.0.0:8080',
      'webpack/hot/only-dev-server',
      './demo/js/main',
    ],
  },
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      chunks: ['vendors', 'app'],
      template: 'demo/index.html',
      filename: 'index.html'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(scss|css)$/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.js?$/,
        exclude: /node_modules|vendor/,
        loaders: ['react-hot-loader/webpack', 'babel-loader']
      }
    ]
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, './node_modules/bourbon-neat')]
  }
};

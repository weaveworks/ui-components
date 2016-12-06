const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let externals;
let entry = {
  docs: [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/only-dev-server',
    './docs/js/main',
  ]
};

let output = {
  path: path.join(__dirname, '/dist/'),
  filename: '[name].js'
};

let plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    chunks: ['app'],
    template: 'docs/index.html',
    filename: 'index.html'
  })
];

const loaders = [
  {
    test: /\.json$/,
    loader: 'json-loader'
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
];

if (process.env.RELEASE) {
  externals = {
    lodash: true,
    react: true,
    'react-dom': true
  };
  entry = './src/webpack-build';
  output = {
    library: 'weaveworks-ui-components',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '/dist/'),
    filename: 'weaveworks-ui-components.js'
  };
  // Compile sass into css
  loaders.push({
    test: /\.(scss|css)$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
  });
  plugins = [new ExtractTextPlugin('weaveworks-ui-components.css')];
} else {
  // Normal sass loader. This complains if it runs in the RELEASE job, so only apply it if RELEASE
  // is falsey.
  loaders.push({
    test: /\.(scss|css)$/,
    loader: 'style-loader!css-loader!sass-loader'
  });
}

module.exports = {
  externals,
  devtool: 'eval-source-map',
  resolveLoader: {
    alias: {
      'react-docs': path.join(__dirname, 'loaders/react-docs.js'),
      example: path.join(__dirname, 'loaders/examples.js')
    },
    root: path.join(__dirname, 'node_modules')
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  entry,
  output,
  plugins,
  module: {
    loaders
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, './node_modules/bourbon-neat')]
  }
};

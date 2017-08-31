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

const output = {
  path: path.join(__dirname, '/dist/'),
  filename: '[name].js',
  publicPath: '/'
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
    test: /\.(otf|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'url-loader?limit=10000&mimetype=application/font-woff'
  },
  {
    test: /\.(ttf|eot|svg|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader?name=[name].[ext]'
  },
  {
    test: /\.js?$/,
    exclude: /node_modules|vendor/,
    loaders: ['react-hot-loader/webpack', 'babel-loader']
  }
];

if (process.env.RELEASE) {
  entry = {
    docs: './docs/js/main'
  };
  // Compile sass into css
  loaders.push({
    test: /\.(scss|css)$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
  });
  plugins = [
    new ExtractTextPlugin('docs.css'),
    new HtmlWebpackPlugin({
      chunks: ['docs'],
      template: 'docs/index.html',
      filename: 'index.html'
    })
  ];
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
      'react-docs': path.join(__dirname, 'src/loaders/react-docs.js'),
      example: path.join(__dirname, 'src/loaders/examples.js')
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
    includePaths: [
      path.resolve(__dirname, './node_modules/bourbon-neat')
    ]
  }
};

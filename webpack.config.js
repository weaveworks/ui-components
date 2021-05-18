const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

let externals;
let optimization;
let mode = 'development';
let entry = {
  docs: [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/only-dev-server',
    './docs/js/main',
  ],
};

const output = {
  path: path.join(__dirname, '/dist/'),
  filename: '[name].js',
  publicPath: '/',
};

let plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    chunks: ['app'],
    template: 'docs/index.html',
    filename: 'index.html',
  }),
  new BundleAnalyzerPlugin({
    analyzerMode: process.env.ANALYZE_BUNDLE ? 'server' : 'disabled',
    analyzerHost: '127.0.0.1',
    analyzerPort: 8888,
    openAnalyzer: true,
  }),
];

const rules = [
  {
    test: /\.(otf|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
        },
      },
    ],
  },
  {
    test: /\.(ttf|eot|svg|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    ],
  },
  {
    test: /\.jsx?$/,
    exclude: /node_modules|vendor/,
    use: ['babel-loader', 'stylelint-custom-processor-loader'],
  },
];

if (process.env.RELEASE) {
  mode = 'production';

  entry = {
    docs: './docs/js/main',
  };

  // Compile sass into css
  rules.push({
    test: /\.(scss|css)$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            includePaths: [
              path.resolve(__dirname, './node_modules/bourbon-neat'),
            ],
          },
        },
      ],
    }),
  });

  plugins = [
    new ExtractTextPlugin('docs.css'),
    new HtmlWebpackPlugin({
      chunks: ['docs'],
      template: 'docs/index.html',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ];

  optimization = {
    minimizer: [new TerserPlugin()],
  };
} else {
  // Normal sass loader. This complains if it runs in the RELEASE job, so only apply it if RELEASE
  // is falsey.
  rules.push({
    test: /\.(scss|css)$/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'sass-loader',
        options: {
          includePaths: [
            path.resolve(__dirname, './node_modules/bourbon-neat'),
          ],
        },
      },
    ],
  });
}

module.exports = {
  mode,
  externals,
  devtool: process.env.NODE_ENV !== 'production' ? 'eval-source-map' : false,
  resolveLoader: {
    alias: {
      'react-docs': path.join(__dirname, 'src/loaders/react-docs.js'),
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  entry,
  output,
  plugins,
  optimization,
  module: {
    rules,
  },
};

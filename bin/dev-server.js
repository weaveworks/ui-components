const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.config');

new WebpackDevServer(webpack(config), {
  hot: true,
  noInfo: false,
  historyApiFallback: true,
  stats: 'errors-only',
}).listen(8080, '0.0.0.0', err => {
  if (err) {
    throw err;
  }
});

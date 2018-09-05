const withTypescript = require('@zeit/next-typescript');
const Dotenv = require('dotenv-webpack');

const path = require('path');

module.exports = withTypescript({
  distDir: '../build',
  exportPathMap() {
    return {
      '/': { page: '/' },
    };
  },
  webpack: config => {
    const plugins = config.plugins || [];

    // eslint-disable-next-line no-param-reassign
    config.resolve.modules = [path.resolve(__dirname, 'src'), 'node_modules'];

    // eslint-disable-next-line no-param-reassign
    config.plugins = [
      ...plugins,
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true,
      }),
    ];

    return config;
  },
});

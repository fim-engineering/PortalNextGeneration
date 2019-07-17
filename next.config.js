/* eslint-disable */
require('dotenv').config()
const webpack = require('webpack')
const withCss = require('@zeit/next-css')
const withSourceMaps = require('@zeit/next-source-maps');

const path = require('path')
const Dotenv = require('dotenv-webpack')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

module.exports = withSourceMaps(withCss({
  target: 'serverless',
  webpack: (config, { isServer }) => {
    if (isServer) {
      const antStyles = /antd\/.*?\/style\/css.*?/
      const origExternals = [...config.externals]
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback()
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ]

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader',
      })
    }

    config.plugins = config.plugins || []

    config.plugins = [
      ...config.plugins,

      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true
      })
    ]

    config.resolve.alias['@components'] = path.join(__dirname, 'components');
    config.resolve.alias['@HoC'] = path.join(__dirname, 'HoC');
    config.resolve.alias['@helper'] = path.join(__dirname, 'helper');
    config.resolve.alias['@LocalStorage'] = path.join(__dirname, 'helper/LocalStorage');
    config.resolve.alias['@Cookie'] = path.join(__dirname, 'helper/Cookie');
    config.resolve.alias['@canUseDOM'] = path.join(__dirname, 'helper/canUseDOM');
    config.resolve.alias['@tracker'] = path.join(__dirname, 'helper/tracker');
    config.resolve.alias['@constant'] = path.join(__dirname, 'constant');

    config.plugins.push(
      new FilterWarningsPlugin({ 
        // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250#issuecomment-415345126
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/, 
      })
    );

    return config
  },
}))
/* eslint-disable */
require('dotenv').config()
const webpack = require('webpack')
const withCss = require('@zeit/next-css')

const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = withCss({
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
    config.resolve.alias['@helper'] = path.join(__dirname, 'helper');
    config.resolve.alias['@LocalStorage'] = path.join(__dirname, 'helper/LocalStorage');
    config.resolve.alias['@Cookie'] = path.join(__dirname, 'helper/Cookie');
    config.resolve.alias['@canUseDOM'] = path.join(__dirname, 'helper/canUseDOM');
    config.resolve.alias['@constant'] = path.join(__dirname, 'constant');


    return config
  },
})
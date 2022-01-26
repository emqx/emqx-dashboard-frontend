'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

const getVersion = () => {
  const matched = process.env.npm_package_version.match(/^\d\.\d/)
  return matched ? `v${matched[0]}` : 'latest'
}

const VUE_APP_VERSION = getVersion()

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_VERSION: `"${VUE_APP_VERSION}"`,
})

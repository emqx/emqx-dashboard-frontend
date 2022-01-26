'use strict'

const getVersion = () => {
  const matched = process.env.npm_package_version.match(/^\d\.\d/)
  return matched ? `v${matched[0]}` : 'latest'
}

const VUE_APP_VERSION = getVersion()

module.exports = {
  NODE_ENV: '"production"',
  VUE_APP_VERSION: `"${VUE_APP_VERSION}"`,
}

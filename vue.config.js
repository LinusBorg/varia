module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    const path = require('path')
    config.resolve.alias.delete('@/')
    config.resolve.alias.set('@', path.join(__dirname, 'examples'))
    config.resolve.alias.set('~', path.join(__dirname, 'src'))
  },
}

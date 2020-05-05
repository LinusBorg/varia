const postcss = require('rollup-plugin-postcss')
const autoprefixer = require('autoprefixer')
const path = require('path')
module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        plugins: [autoprefixer()],
        inject: false,
        // only write out CSS for the first bundle (avoids pointless extra files):
        extract: !!options.writeMeta && path.resolve('dist/index.css'),
      })
    )
    return config
  },
}

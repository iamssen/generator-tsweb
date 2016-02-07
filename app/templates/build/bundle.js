var Builder = require('systemjs-builder')

var builder = new Builder({
  baseURL: "."
})
builder.loadConfigSync('./config.js')
builder.bundle('<%= bundles %>', 'dist/vendor.js')
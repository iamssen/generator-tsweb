var Builder = require('systemjs-builder')

var builder = new Builder({
  baseURL: ".",
  paths: {
    "contexts:*": "contexts.web/*"
  }
})
builder.loadConfigSync('./config.js')
builder.bundle('app - dist/vendor.js', 'dist/app.web.js')
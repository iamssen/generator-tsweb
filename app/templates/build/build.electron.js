var Builder = require('systemjs-builder')

var builder = new Builder({
  baseURL: __dirname + '/..',
  paths: {
    "contexts:*": "contexts.electron/*"
  }
})
builder.loadConfigSync('./config.js')
builder.bundle('app - dist/vendor.js', 'dist/app.electron.js')
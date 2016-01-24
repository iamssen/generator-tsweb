var gulp = require('gulp')
var Builder = require('systemjs-builder')

gulp.task('build.vendor', function () {
  var builder = new Builder({
    baseURL: "."
  })
  builder.loadConfigSync('./config.js')
  builder.bundle('<%= bundles %>', 'dist/vendor.js')
})

gulp.task('build.web', function () {
  var builder = new Builder({
    baseURL: ".",
    paths: {
      "impl:*": "app/impl.web/*"
    }
  })
  builder.loadConfigSync('./config.js')
  builder.bundle('app - dist/vendor.js', 'dist/app.web.js')
})

gulp.task('build.electron', function () {
  var builder = new Builder({
    baseURL: __dirname,
    paths: {
      "impl:*": "app/impl.electron/*"
    }
  })
  builder.loadConfigSync('./config.js')
  builder.bundle('app - dist/vendor.js', 'dist/app.electron.js')
})

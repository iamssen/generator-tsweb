var gulp = require('gulp')
var Builder = require('systemjs-builder')

gulp.task('build.vendor', function () {
  var builder = new Builder({
    baseURL: "."
  })
  builder.loadConfigSync('./config.js')
  builder.bundle('es6-shim + es6-promise + reflect-metadata + zone.js/lib/browser/zone-microtask + angular2/core + angular2/common + angular2/platform/browser + angular2/router + angular2/http + rxjs + angular2-reflow + d3 + jquery + moment', 'dist/vendor.js')
})

gulp.task('build.web', function () {
  var builder = new Builder({
    baseURL: ".",
    paths: {
      "contexts:*": "contexts.web/*"
    }
  })
  builder.loadConfigSync('./config.js')
  builder.bundle('app - dist/vendor.js', 'dist/app.web.js')
})

gulp.task('build.electron', function () {
  var builder = new Builder({
    baseURL: __dirname,
    paths: {
      "contexts:*": "contexts.electron/*"
    }
  })
  builder.loadConfigSync('./config.js')
  builder.bundle('app - dist/vendor.js', 'dist/app.electron.js')
})

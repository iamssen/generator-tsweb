System.config({
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  typescriptOptions: {
    "module": "system",
    "declaration": false,
    "noImplicitAny": false,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  },
  paths: {
    "npm:*": "jspm_packages/npm/*",
    "github:*": "jspm_packages/github/*"
  },
  rootURL: "/",
  separateCSS: true,

  packages: {
    "app": {
      "defaultExtension": "ts",
      "main": "app/boot",
      "meta": {
        "*.ts": {
          "loader": "ts"
        },
        "*.js": {
          "loader": "ts"
        }
      }
    },
    "service": {
      "defaultExtension": "ts",
      "meta": {
        "*.ts": {
          "loader": "ts"
        },
        "*.js": {
          "loader": "ts"
        }
      }
    }
  }
})
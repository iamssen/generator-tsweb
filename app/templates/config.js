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
      "main": "boot",
      "meta": {
        "*.ts": {
          "loader": "ts"
        },
        "*.js": {
          "loader": "ts"
        }
      }
    },
    "contexts.web": {
      "defaultExtension": "ts",
      "meta": {
        "*.ts": {
          "loader": "ts"
        },
        "*.js": {
          "loader": "ts"
        }
      }
    },
    "contexts.electron": {
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
});

System.config({
  defaultJSExtensions: true,
  transpiler: "typescript",
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
      "main": "boot"
    },
    "contexts.web": {
      "defaultExtension": "ts"
    },
    "contexts.electron": {
      "defaultExtension": "ts"
    }
  }
});

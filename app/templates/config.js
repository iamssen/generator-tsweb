System.config({
	baseURL: "/",
	defaultJSExtensions: true,
	transpiler: "typescript",
	typescriptOptions: {
		"module": "commonjs",
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
		}
	}
});
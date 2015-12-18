'use strict';

var chalk = require('chalk');
var path = require('path');
var yo = require('yeoman-generator');
var ejs = require('ejs');

module.exports = yo.Base.extend({
	constructor: function () {
		yo.Base.apply(this, arguments);
	},

	//initializing: function () {
	//	console.log('index.js..initializing()');
	//},

	prompting: function () {
		var done = this.async();
		var prompts = [
			{
				type: 'text',
				name: 'appname',
				message: 'What is your app name?',
				default: path.basename(process.cwd())
			},
			{
				type: 'checkbox',
				name: 'includeModules',
				message: 'Choose include modules.',
				choices: [
					{
						name: 'RxJs',
						value: 'rxjs',
						checked: true
					},
					{
						name: 'jQuery',
						value: 'jquery',
						checked: true
					},
					{
						name: 'Lodash',
						value: 'lodash',
						checked: true
					},
					{
						name: 'Pixi.js',
						value: 'pixi.js',
						checked: false
					},
					{
						name: 'D3',
						value: 'd3',
						checked: false
					},
					{
						name: 'D3 Tooltip',
						value: 'd3tip',
						checked: false
					},
					{
						name: 'Tween.js',
						value: 'tween.js',
						checked: false
					}
				]
			}
		];

		this.prompt(prompts, (answers) => {
			// appname
			this.appname = answers.appname;

			// jspmModules, tsdModules, npmModules
			var modules = (answers && answers.includeModules && answers.includeModules.length > 0) ? answers.includeModules : [];

			var tsdFilter = pkg => ['es6-promise', 'jquery', 'lodash', 'pixi.js', 'd3', 'tween.js'].indexOf(pkg) > -1;
			var npmFilter = pkg => ['rxjs', 'd3tip', 'angular2'].indexOf(pkg) > -1;

			this.jspmModules = ['css', 'es6-promise', 'es6-shim', 'angular2'].concat(modules);
			this.tsdModules = ['es6-promise', 'systemjs'].concat(modules).filter(tsdFilter);
			this.npmModules = ['angular2'].concat(modules).filter(npmFilter);

			done();
		});
	},

	writing: {
		app: function () {
			this.directory('app', 'app', null);
			this.copy('_gitignore', '.gitignore');
			this.copy('config.js', 'config.js');
			this.copy('index.html', 'index.html');
			//this.copy('package.json', 'package.json');
			this.copy('tsd.json', 'tsd.json');
			this.mkdir('dist');
		},
		packageJson: function () {
			var source = this.read('package.json');
			var data = JSON.parse(ejs.render(source, this));

			var vendor = ['angular2/core', 'angular2/common', 'angular2/platform/browser', 'angular2/router', 'angular2/http'];
			var modules = ['rxjs', 'jquery', 'lodash', 'pixi.js', 'd3', 'd3tip', 'tween.js'];

			this.jspmModules.forEach((module) => {
				if (modules.indexOf(module) > -1) {
					vendor.push(module);
					if (module == 'd3tip') vendor.push('d3tip/d3tip.css!');
				}
			});

			data.scripts.bundle = 'jspm bundle ' + vendor.join(' + ') + ' dist/vendor.js';

			this.fs.writeJSON('package.json', data);
		}
	},

	install: function () {
		if (this.npmModules && this.npmModules.length > 0) {
			this.npmInstall(this.npmModules);
		}

		var jspmFilter = pkg => (['es6-promise', 'd3tip'].indexOf(pkg) > -1) ? 'npm:' + pkg : pkg;
		var jspmModules = this.jspmModules.map(jspmFilter);

		if (jspmModules && jspmModules.length > 0) {
			this.spawnCommand('jspm', ['install']).on('close', () => {
				this.spawnCommand('jspm', ['install'].concat(jspmModules)).on('close', () => {
					this.spawnCommand('npm', ['run', 'bundle']);
				});
			});
		}

		if (this.tsdModules && this.tsdModules.length > 0) {
			this.spawnCommand('tsd', ['install'].concat(this.tsdModules, ['--resolve', '--save']));
		}
	}
	//,
	//
	//end: function () {
	//	this.spawnCommand('npm', ['run', 'bundle']);
	//}
});
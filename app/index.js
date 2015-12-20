'use strict';

var chalk = require('chalk');
var path = require('path');
var yo = require('yeoman-generator');
var ejs = require('ejs');

let moduleList = [
	{
		name: 'typescript',
		jspm: 'typescript'
	},
	{
		name: 'css',
		jspm: 'css'
	},
	{
		name: 'clean-css',
		jspm: 'npm:clean-css'
	},
	{
		name: 'es6-promise',
		jspm: 'npm:es6-promise',
		tsd: 'es6-promise',
		bundle: ['es6-promise']
	},
	{
		name: 'es6-shim',
		jspm: 'es6-shim'
	},
	{
		name: 'angular2',
		jspm: 'angular2',
		npm: 'angular2',
		bundle: ['angular2/core', 'angular2/common', 'angular2/platform/browser', 'angular2/router', 'angular2/http']
	},
	{
		name: 'rxjs',
		jspm: 'rxjs',
		npm: 'rxjs',
		bundle: ['rxjs'],
		optional: {
			name: 'RxJs',
			checked: true
		}
	},
	{
		name: 'jquery',
		jspm: 'jquery',
		tsd: 'jquery',
		bundle: ['jquery'],
		optional: {
			name: 'jQuery',
			checked: true
		}
	},
	{
		name: 'lodash',
		jspm: 'lodash',
		tsd: 'lodash',
		bundle: ['lodash'],
		optional: {
			name: 'Lodash',
			checked: true
		}
	},
	{
		name: 'pixi.js',
		jspm: 'pixi.js',
		tsd: 'pixi.js',
		bundle: ['pixi.js'],
		optional: {
			name: 'Pixi.js',
			checked: false
		}
	},
	{
		name: 'd3',
		jspm: 'd3',
		tsd: 'd3',
		bundle: ['d3'],
		optional: {
			name: 'D3',
			checked: false
		}
	},
	{
		name: 'd3tip',
		jspm: 'npm:d3tip',
		npm: 'd3tip',
		bundle: ['d3tip', 'd3tip/dist/d3tip.css!'],
		optional: {
			name: 'D3 Tooltip',
			checked: false
		}
	},
	{
		name: 'tween.js',
		jspm: 'tween.js',
		tsd: 'tween.js',
		bundle: ['tween.js'],
		optional: {
			name: 'Tween.js',
			checked: false
		}
	}
]

module.exports = yo.Base.extend({
	constructor: function () {
		yo.Base.apply(this, arguments);
	},

	//initializing: function () {
	//},

	prompting: function () {
		let done = this.async();

		let moduleNames = {};
		let f = -1;
		let fmax = moduleList.length;

		while (++f < fmax) {
			let module = moduleList[f];
			moduleNames[module.name] = f;
		}

		let modules = [];
		let choices = [];

		moduleList.forEach(module => {
			if (!module.optional) {
				modules.push(module);
			} else {
				choices.push({
					name: module.optional.name,
					value: module.name,
					checked: module.optional.checked
				});
			}
		});

		let prompts = [
			{
				type: 'text',
				name: 'appname',
				message: 'What is your app name?',
				default: path.basename(process.cwd())
			},
			{
				type: 'checkbox',
				name: 'choosed',
				message: 'Choose additional modules.',
				choices: choices
			}
		];

		this.prompt(prompts, (answers) => {
			this.appname = answers.appname;

			if (answers && answers.choosed && answers.choosed.length > 0) {
				modules = modules.concat(answers.choosed.map(name => moduleList[moduleNames[name]]));
			}

			this.modules = modules;

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
			let source = this.read('package.json');
			let data = JSON.parse(ejs.render(source, this));
			let bundle = [];

			this.modules.forEach(module => {
				if (module.bundle && module.bundle.length > 0) {
					bundle = bundle.concat(module.bundle);
				}
			});

			data.scripts.bundle = 'jspm bundle ' + bundle.join(' + ') + ' dist/vendor.js';

			this.fs.writeJSON('package.json', data);
		}
	},

	install: function () {
		let npm = [];
		let jspm = [];
		let tsd = [];

		this.modules.forEach(module => {
			if (module.npm != undefined) npm.push(module.npm);
			if (module.jspm != undefined) jspm.push(module.jspm);
			if (module.tsd != undefined) tsd.push(module.tsd);
		});

		this.npmInstall(npm, {'saveDev': true});
		this.spawnCommand('jspm', ['install'].concat(jspm)).on('close', () => {
			this.spawnCommand('npm', ['run', 'bundle']);
		});
		this.spawnCommand('tsd', ['install'].concat(tsd, ['--resolve', '--save']));
	}
	//,
	//
	//end: function () {
	//	this.spawnCommand('npm', ['run', 'bundle']);
	//}
});
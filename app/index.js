'use strict';
let chalk = require('chalk');
let path = require('path');
let yo = require('yeoman-generator');
let ejs = require('ejs');
let moduleList = require('./modules.json');

module.exports = yo.Base.extend({
  constructor: function () {
    yo.Base.apply(this, arguments);
  },

  //initializing: function () {},

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

      // variables
      let bundles = [];

      this.modules.forEach(module => {
        if (module.bundle && module.bundle.length > 0) {
          bundles = bundles.concat(module.bundle);
        }
      });

      this.bundles = bundles.join(' + ');

      done();
    });
  },

  writing: {
    app: function () {
      [
        'app',
        'assets',
        'contexts.electron',
        'contexts.web'
      ].forEach(directory => {
        this.directory(directory, directory, null);
      });

      [
        '_gitignore',
        'config.electron.js',
        'config.js',
        'config.web.js',
        'favicon.ico',
        'gulpfile.js',
        'index.electron.html',
        'index.html',
        'index.js',
        'package.json',
        'tsd.json'
      ].forEach(file => {
        this.copy(file, (file.charAt(0) === '_') ? `.${file.substr(1)}` : file);
      });

      this.mkdir('dist');
    }
    //packageJson: function () {
    //  let source = this.read('package.json');
    //  let data = JSON.parse(ejs.render(source, this));
    //  let bundle = [];
    //
    //  this.modules.forEach(module => {
    //    if (module.bundle && module.bundle.length > 0) {
    //      bundle = bundle.concat(module.bundle);
    //    }
    //  });
    //
    //  data.scripts.bundle = 'jspm bundle ' + bundle.join(' + ') + ' dist/vendor.js';
    //
    //  this.fs.writeJSON('package.json', data);
    //}
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

    console.log('-------- start install --------');
    console.log('npm', ['install'].concat(npm, ['--save-dev', '--silent']).join(' '))
    console.log('jspm', ['install'].concat(jspm).join(' '))
    console.log('tsd', ['install'].concat(tsd, ['--resolve', '--save']).join(' '))
    this.spawnCommand('npm', ['install'].concat(npm, ['--save-dev', '--silent'])).on('close', () => {
      this.spawnCommand('npm', ['run', 'bundle']);
    });
    this.spawnCommand('jspm', ['install'].concat(jspm)).on('close', () => {
    });
    this.spawnCommand('tsd', ['install'].concat(tsd, ['--resolve', '--save']));
  }

  //end: function () {
  //	this.spawnCommand('npm', ['run', 'bundle']);
  //}
});
'use strict';
const chalk = require('chalk');
const yeoman = require('yeoman-generator');
const yosay = require('yosay');
const fsp = require('fs-promise');
const path = require('path');
const pkg = require('../package.json');
const spawn = require('child_process').spawn;

const PACKAGE_JSON = 'package.json';

const JEKYLL = 'Jekyll';
const NODE = 'Node.js';
const RAILS = 'Ruby on Rails';
const STATIC = 'Static';

const LAYOUTS = [
  JEKYLL,
  STATIC,
  NODE,
  // RAILS
];

module.exports = yeoman.Base.extend({

  initializing: function () {
    this.pkg = require('../package.json');
    // TODO: Add arguments, commands, and usage instructions
  },

  prompting: function () {
    this.log(yosay(
      'Welcome to the ' + chalk.red(pkg.name) + '!'
    ));
  },

  configuring: {
  },

  writing: function () {
    const layout = this.options.layout;
    switch (layout) {

      case JEKYLL:
      case 'jekyll':
        return this._setupJekyll();

      case NODE:
      case 'node':
      case 'nodejs':
        return this._setupNode();

      default:
        throw new Error('unknown layout: "' + layout + '"');
    }
  },

  install: function() {
    return fsp.exists(PACKAGE_JSON)
      .then(exists => {
        if (exists) {
          if (this.options.layout === JEKYLL) {
          }
        }
      });
  },

  end: function() {
    switch (this.options.layout) {
      case JEKYLL:
      case 'jekyll':
        return fsp.exists(PACKAGE_JSON)
          .then(exists => {
            this.log([
              '',
              "If you don't have Jekyll installed globally,",
              "you can install it with Bundler:",
              '',
              chalk.bold('  bundle'),
              '',
              "then, run Jekyll via:",
              '',
              chalk.bold('  bundle exec jekyll serve'),
              '',
            ].join('\n'));

            if (exists) {
              this.log([
                '',
                'It looks like you are using Jekyll and Node',
                '(because there is a package.json in this directory).',
                '',
                'You can add the above commands to your "scripts" portion',
                'of your package.json.',
              ].join('\n'));
            }
          });
    }
  },

  _determineLayout: function () {

    if (this.options.layout) {
      return;
    }

    return this._guessLayout().then(guess => {
      var index = LAYOUTS.indexOf(guess);
      return this.prompt([
        {
          name: 'layout',
          type: 'list',
          message: 'What type of project is this?',
          choices: LAYOUTS,
          default: index > -1 ? index : 0,
          store: true
        }
      ])
      .then(options => {
        Object.assign(this.options, options);

        if (this.options.layout === JEKYLL) {
          return this.prompt([
            {
              name: 'installJekyll',
              type: 'confirm',
              message: 'Do you already have Jekyll installed?',
              default: true,
              store: false
            }
          ])
          .then(options => {
            Object.assign(this.options, options);
          });
        }
      });
    });

  },

  _setupNode: function() {
    const deps = ['uswds'];

    if (this.options.layout === NODE) {
      deps.push('node-sass');
    }

    this.npmInstall(deps, {
      save: true
    });
  },

  _copySource: function(from, to) {
    const base = path.join(__dirname, '../node_modules/uswds');
    return this.fs.copy(path.join(base, from), to);
  },

  _setupJekyll: function () {
    var promises = [

      // Jekyll _config.yml
      this.fs.copyTpl(
        this.templatePath('config.yml'),
        '_config.yml',
        this.options
      ),

      // data files
      this.fs.copy(this.templatePath('_data'), '_data'),

      // sass files
      this.fs.copy(this.templatePath('_sass'), '_sass'),
      this._copySource('src/stylesheets', '_sass/uswds'),

      // assets dir
      this.fs.copy(this.templatePath('assets'), 'assets'),

      // fonts, images
      this._copySource('dist/fonts', 'assets/fonts'),
      this._copySource('dist/img', 'assets/img'),

      // javascript
      this._copySource('dist/js', 'assets/js'),
    ];

    promises = promises.concat([
      '_includes',
      '_layouts',
      'pages',
      'Gemfile',
      'CONTRIBUTING.md',
      'LICENSE.md',
      'README.md',
    ].map(filename => {
      return this.fs.copy(this.templatePath(filename), filename);
    }));

    return Promise.all(promises);
  },

  _spawn: function (command, args, opts) {
    return new Promise((resolve, reject) => {
      spawn(command, args, opts)
        .on('error', error => console.error(error))
        .on('exit', (code, signal) => {
          (code > 0) ? reject(code) : resolve();
        });
    });
  },

  _guessLayout: function() {

    const clues = {
      '_config.yml':  JEKYLL,
      'Gemfile':      RAILS,
      'package.json': NODE,
    };

    const lookups = Object.keys(clues)
      .map(file => {
        return fsp.exists(file)
          .then(exists => exists ? clues[file] : false);
      });

    return Promise.all(lookups)
      .then(layouts => layouts.reduce((guess, layout) => guess || layout));
  },

});

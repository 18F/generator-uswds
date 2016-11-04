'use strict';
const chalk = require('chalk');
const yeoman = require('yeoman-generator');
const yosay = require('yosay');
const fsp = require('fs-promise');
const path = require('path');
const pkg = require('../package.json');
const spawn = require('child_process').spawn;

const JEKYLL = 'Jekyll';
const STATIC = 'Static';
const NODE = 'Node.js';
const RAILS = 'Ruby on Rails';

const LAYOUTS = [
  STATIC,
  JEKYLL,
  NODE,
  RAILS
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

    return this.prompt([
        {
          name: 'name',
          message: 'What is your project called',
          default: 'My cool project',
          store: true
        },
        {
          name: 'description',
          message: 'Optionally, enter a one-sentence project description',
          default: '',
          store: true
        }
      ])
      .then(options => {
        Object.assign(this.options, options);
      })
      .then(() => this._determineLayout());
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

  configuring: {
  },

  writing: function () {
    const layout = this.options.layout;
    switch (layout) {

      case NODE:
      case 'node':
      case 'nodejs':
        return this._scaffoldNode();

      case JEKYLL:
      case 'jekyll':
        return this._scaffoldJekyll();

      case RAILS:
      case 'rails':
      case 'ruby':
        return this._scaffoldRails();

      default:
        throw new Error('unknown layout: "' + layout + '"');
    }
  },

  _scaffoldNode: function() {
    return this.npmInstall(['uswds'], {
      save: true
    });
  },

  _copySource: function(from, to) {
    const base = path.join(__dirname, '../node_modules/uswds');
    return this.fs.copy(path.join(base, from), to);
  },

  _scaffoldJekyll: function () {
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

  _scaffoldRuby: function () {
    return this._gemInstall({
      'us_web_design_standards': 'https://github.com/18F/us_web_design_standards_gem.git'
    })
    .then(() => {
      // what now?
    });
  },

  _scaffoldRails: function () {
    return this._gemInstall({
      'uswds-rails': 'https://github.com/18F/uswds-rails-gem.git'
    })
    .then(() => {
      // what now?
    });
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

  _gemInstall: function (gems) {
    const promises = Object.keys(gems).map(gem => {
      const spec = gems[gem];
      var args;
      if (spec.indexOf('http') === 0) {
        args = ['specific_install', spec];
      } else {
        args = ['install'];
      }
      return this._spawn('gem', args);
    });

    return Promise.all(promises);
  },

  _guessLayout: function() {

    var clues = {
      '_config.yml':  'Jekyll',
      'Rakefile':     'Rails',
      'Gemfile':      'Ruby',
      'package.json': 'Node',
    };

    return Promise.all(
      Object.keys(clues).map(file => {
        return fsp.exists(file)
          .then(exists => exists ? clues[file] : false);
      })
    )
    .then(layouts => {
      return layouts.reduce((guess, layout) => {
        return guess || layout;
      });
    });

  },

});

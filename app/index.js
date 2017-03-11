'use strict';
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const yeoman = require('yeoman-generator');
const yosay = require('yosay');

const pkg = require('../package.json');

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

  configuring: function() {
    const prompts = [];

    if (this.options.jekyll === undefined) {
      prompts.push({
        message: 'Would you like to use Jekyll to generate your site?',
        type: 'confirm',
        name: 'jekyll',
        default: true,
      });
    }

    if (this.options.sass === undefined) {
      prompts.push({
        message: 'Would you like to use Sass to customize the Standards?',
        type: 'confirm',
        name: 'sass',
        default: true,
      });
    }

    return this.prompt(prompts, {store: true})
      .then(opts => {
        Object.assign(this.options, opts);
      });
  },

  writing: function() {
    // this.directory(this.templatePath('base'), '.');

    if (this.options.jekyll) {

      // XXX ensure that the git submodule metadata directory isn't
      // copied over, which could be either messy or destructive
      this.fs.copy([
        this.templatePath('jekyll'),
        '!.git',
      ], '.');

      if (this.options.sass) {
        this.directory('jekyll-sass', '.');
      }

    } else  {

      this.directory(this._sourcePath('dist'), 'assets/uswds');
      this.directory(this.templatePath('static'), '.');

      if (this.options.sass) {
        this.directory('static-sass', '.');
        this.fs.delete('package.ext.json');
        const extensions = JSON.parse(
          fs.readFileSync(
            this.templatePath('static-sass/package.ext.json')
          )
        );
        this.fs.extendJSON('package.json', extensions);
      }

    }
  },

  install: function() {
    // return this.npmInstall();
  },

  end: function() {
    // console.warn('Building your site...');
    // return this.spawnCommand('npm', ['run', 'build']);
  },

  _sourcePath: function(filename) {
    return path.join(__dirname, '../node_modules/uswds', filename);
  },

});

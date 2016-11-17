'use strict';
const chalk = require('chalk');
const yeoman = require('yeoman-generator');
const yosay = require('yosay');
const path = require('path');
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
    Object.assign(this.options, {
      name: 'My great project',
      description: 'This is a description of my project',
      sass: true
    });

    const prompts = [
      /*
      {
        message: 'Would you like to use Sass to customize the Standards?',
        type: 'confirm',
        name: 'sass',
      }
      */
    ];

    return this.prompt(prompts, {store: true})
      .then(opts => {
        Object.assign(this.options, opts);
      });
  },

  writing: function () {
    const templateBase = 'static';

    const template = filename => {
      return this.templatePath(path.join(templateBase, filename));
    };

    const source = filename => this._sourcePath(filename);

    const dest = filename => {
      return filename
        ? this.destinationPath(filename)
        : this.destinationPath();
    };

    const copy = (from, to) => {
      this.fs.copy(from, to);
    };

    const dir = (from, to) => {
      this.directory(from, to);
    };

    const rm = filename => {
      this.fs.delete(filename);
    };

    const move = (from, to) => {
      this.fs.move(from, to);
    };

    const tasks = [
      dir('static', '.'),
      dir(source('dist/fonts'), 'fonts/vendor/uswds'),
      dir(source('dist/img'), 'images/vendor/uswds'),
      dir(source('dist/js'), 'js/vendor'),
    ];

    if (this.options.sass) {
      tasks.push(
        dir(source('src/stylesheets'), dest('sass/vendor/uswds'))
      );
    } else {
      tasks.push(
        dir(source('dist/css'), 'css/vendor/uswds'),
        rm(dest('sass'))
      );
    }

    return Promise.all(tasks);
  },

  install: function() {
    return this.npmInstall();
  },

  end: function() {
    console.warn('Building your site...');
    return this.spawnCommandSync('npm', ['run', 'build']);
  },

  _sourcePath: function(filename) {
    return path.join(__dirname, '../node_modules/uswds', filename);
  },

});

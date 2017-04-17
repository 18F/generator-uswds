'use strict';
const yo = require('yeoman-test');
const path = require('path');

const APP_PATH = path.join(__dirname, '../../app');

module.exports = (options) => {

  return function() {
    return yo.run(options.path || APP_PATH)
      .withOptions(options.options || {})
      .withArguments(options.args || [])
      .withPrompts(options.prompts || {})
      .inTmpDir(() => {})
      .then(dir => {
        // console.warn('dir:', dir);
        this.dir = dir;
        this.path = file => path.join(this.dir, file);
      });
  };
};

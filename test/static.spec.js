const path = require('path');
const yotest = require('yeoman-test');
const assert = require('yeoman-assert');

const run = function() {
  return yotest.run(path.join(__dirname, '../app'))
    .withOptions(this.options || {})
    .withArguments(this.arguments || [])
    .withPrompts(this.prompts || {})
    .toPromise();
};

// run once
before(run);

describe('static site layout', function() {

  const defaultFiles = [
    'package.json',

    // css
    'css/README.md',
    'css/main.css',
    'css/main.css.map',

    // fonts
    'fonts/README.md',
    'fonts/vendor/uswds/merriweather-bold-webfont.eot',

    // images
    'images/README.md',
    'images/vendor/uswds/arrow-down.png',

    // javascript
    'js/README.md',
    'js/vendor/uswds.js',

    // page templates
    'page-templates/README.md',
    'page-templates/documentation.html',
    'page-templates/landing.html',
  ];

  const sassFiles = [
    'sass/README.md',
    'sass/main.scss',
    'sass/vendor/uswds/core/_variables.scss',
  ];

  describe('default options', function() {

    it('generates all of the default files', function() {
      assert.file(defaultFiles);
    });

    it('generates the Sass files', function() {
      assert.file(sassFiles);
    });

  });

  describe('with {sass: false}', function() {
    this.options = {sass: false};

    it('generates all of the default files', function() {
      assert.file(defaultFiles);
    });

    xit('does not generate the Sass files', function() {
      assert.noFile(sassFiles);
    });

    // return run.call(this);
  });

});

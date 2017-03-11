'use strict';
const assert = require('yeoman-assert');
const generate = require('./lib/generate');

describe('Static scaffolding', function() {

  describe('basic setup', function() {

    before(generate({
      prompts: {
        jekyll: false,
      },
    }));

    describe('creates various assets/uswds files:', function() {
      ['css/uswds.min.css', 'js/uswds.min.js']
        .forEach(file => {
          it(file, function() {
            assert.file(this.path('assets/uswds/' + file));
          });
        });
    });

    it('creates package.json', function() {
      assert.file(this.path('package.json'));
    });

  });

  describe('with Sass', function() {

    before(generate({
      prompts: {
        jekyll: false,
        sass: true,
      },
    }));

    it('creates assets/sass/main.scss', function() {
      const file = this.path('assets/sass/main.scss');
      assert.file(file);
      assert.fileContent(file, /@import.+uswds/, 'imports uswds');
    });

    it('updates package.json', function() {
      const file = this.path('package.json');
      assert.file(file);
      assert.fileContent(file, /"uswds": "\^1\./, 'depends on uswds ^1.x');
    });

  });

});


'use strict';
const assert = require('yeoman-assert');
const generate = require('./lib/generate');

describe('Jekyll scaffolding', function() {

  describe('basic setup', function() {

    before(generate({
      prompts: {
        jekyll: true,
      },
    }));

    describe('creates the requisite Jekyll files:', function() {
      ['_config.yml', 'Gemfile', 'Gemfile.lock']
        .forEach(file => {
          it(file, function() {
            assert.file(this.path(file));
          });
        });

      it('references the uswds gem', function() {
        assert.fileContent(this.path('Gemfile'), /\ngem.+\buswds\b/);
      });
    });

    describe('creates the requisite files in _data:', function() {
      ['header.yml', 'footer.yml', 'navigation.yml']
        .forEach(file => {
          it(file, function() {
            assert.file(this.path('_data/' + file));
          });
        });
    });

  });

  describe('with Sass', function() {

    before(generate({
      prompts: {
        jekyll: true,
        sass: true,
      },
    }));

    it('creates assets/css/main.scss', function() {
      const file = this.path('assets/css/main.scss');
      assert.file(file);
      assert.fileContent(file, /^---\n/, 'has front matter');
      assert.fileContent(file, /@import.+uswds/, 'imports uswds');
    });

  });

});

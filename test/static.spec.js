const path = require('path');
const yotest = require('yeoman-test');
const assert = require('yeoman-assert');

before(function() {
  return yotest.run(path.join(__dirname, '../app'))
    .withPrompts({})
    .toPromise();
});

describe('static site layout', function() {

  const files = [
    'package.json',
  ];

  files.forEach(file => {
    it('generates ' + file, function() {
      assert.file(file);
    });
  });

});

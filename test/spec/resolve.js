define('dir-2@*/lib/index.js', ['./dir'], function (require, exports) {
  exports.a = require('./dir').a;
}, {
  main: true,
  alias: {
    './dir': './dir/index.js'
  }
});


define('dir-2@*/lib/dir/index.js', [], function (require, exports) {
  exports.a = 1;
});


describe("require a directory", function(){
  it("dir", function(done){
    _use('dir', function (dir) {
      expect(dir.a).to.equal(1);
      done();
    });
  });

  it("dir-2: already loaded", function(done){
    _use('dir-2', function (dir) {
      expect(dir.a).to.equal(1);
      done();
    });
  });
});


define('file-module2@*/lib/index.js', ['./dir'], function (require, exports) {
  exports.a = require('./dir').a;
}, {
  main: true,
  alias: {
    './dir': './dir.json'
  }
});


define('file-module2@*/lib/dir.json', [], function (require, exports, module) {
  module.exports = {
    "a": 1
  };
});


describe("file module fallback", function(){
  it("file-module, fallback to .js", function(done){
    _use('file-module@1.0.0', function (dir) {
      expect(dir.a).to.equal(1);
      done();
    });
  });

  it("file-module2, fallback to json", function(done){
    _use('file-module2', function (dir) {
      expect(dir.a).to.equal(1);
      done();
    });
  });
});
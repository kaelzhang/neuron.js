describe("Graph", function(){
  define('a@1.0.0/index.js', ['c@3.0.0'], function(require, exports, module, __filename, __dirname){
    module.exports = require('c');
  }, {
    main: true,
    map: {}
  });

  define('b@2.0.0/index.js', ['c@3.0.0'], function(require, exports, module, __filename, __dirname){
    module.exports = require('c');
  }, {
    main: true,
    map: {}
  });

  define('c@3.0.0/index.js', ['d@^4.0.0'], function(require, exports, module, __filename, __dirname){
    module.exports = require('d');
  }, {
    main: true,
    map: {}
  });

  define('d@4.0.0/index.js', [], function(require, exports, module, __filename, __dirname){
    module.exports = '4.0.0'
  }, {
    main: true,
    map: {}
  });

  define('d@4.1.0/index.js', [], function(require, exports, module, __filename, __dirname){
    module.exports = '4.1.0'
  }, {
    main: true,
    map: {}
  });

  it("could map graph: graph a", function(done){
    _use('a', function (version) {
      expect(version).to.equal('4.0.0');
      done();
    });
  });

  it("could map graph: graph b", function(done){
    _use('b', function (version) {
      expect(version).to.equal('4.1.0');
      done();
    });
  });

  it("should create shadow module with different dependency tree", function(done){
    _use('a', function (version_a) {
      _use('b', function (version_b) {
        expect(version_a).not.to.equal(version_b);
        done();
      });
    });
  });
});
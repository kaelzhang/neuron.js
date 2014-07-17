describe("require", function() {
  it("should throw error if module not found", function(done) {
    _use('mod-not-found', function(e) {
      expect(/Cannot find module/i.test(e.message)).to.equal(true);
      done();
    });
  });

  it("should throw error if require an id with `@`", function(done) {
    _use('require-at', function(e) {
      expect(/prohibited/.test(e.message)).to.equal(true);
      done();
    });
  });
});

describe("require.resolve()", function() {
  define('require-resolve@*/lib/main.js', [], function(require, exports, module) {
    exports.a = require.resolve('./a.png');
  }, {
    main: true,
    map: {}
  });

  it("could return the resolved filename", function(done) {
    _use('require-resolve', function(r) {
      expect(r.a).to.equal( __root + '/require-resolve/*/lib/a.png');
      done();
    });
  });

  define('require-resolve2@*/lib/main.js', [], function(require, exports, module) {
    exports.resolve = function(n) {
      return require.resolve(n);
    }
  }, {
    main: true,
    map: {}
  });

  it("will throw if out of range", function(done) {
    _use('require-resolve2', function(r) {
      expect(r.resolve('../a.png')).to.equal(__root + '/require-resolve2/*/a.png');
      expect(r.resolve('../../a.png')).to.equal(undefined);
      done();
    });
  });
});
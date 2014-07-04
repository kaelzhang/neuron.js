describe("define, feated with _use", function() {
  describe("1. `exports.xxx = xxx`", function() {
    it("module exports could be mixed into argument `exports`", function(done) {

      _use('exports', function(e) {
        expect(e.a === 1);
        done();
      });
    });
  });

  describe("2. `module.exports`", function() {
    it("define module exports with module.exports", function(done) {

      _use('module-exports', function(e) {
        expect(e.a === 1);
        done();
      });
    });
  });

  describe("exports priority: 2 > 1", function() {
    it("module.exports has higher priority", function(done) {

      _use('exports-priority', function(e) {
        expect(e.a === 1);
        done();
      });

    });
  });
});

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
      expect(r.a).to.equal('mod/require-resolve/*/lib/a.png');
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
      expect(r.resolve('../a.png')).to.equal('mod/require-resolve2/*/a.png');
      expect(r.resolve('../../a.png')).to.equal(undefined);
      done();
    });
  });
});
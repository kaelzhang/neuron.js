describe("require", function() {
  it("should throw error if module not found", function(done) {
    neuron._use('mod-not-found', function(e) {
      expect(/Cannot find module/i.test(e.message)).to.equal(true);
      done();
    });
  });

  it("should throw error if require an id with `@`", function(done) {
    neuron._use('require-at', function(e) {
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
    map: {
      './a.png': 'require-resolve@*/lib/a.png'
    }
  });

  it("could return the resolved filename", function(done) {
    neuron._use('require-resolve', function(r) {
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
    map: {
      '../a.png': 'require-resolve2@*/a.png'
    }
  });

  it("will throw if out of range", function(done) {
    neuron._use('require-resolve2', function(r) {
      expect(r.resolve('../a.png')).to.equal(__root + '/require-resolve2/*/a.png');
      var err;
      try {
        r.resolve('../../a.png');
      } catch(e) {
        err = true;
      }
      expect(err).to.equal(true);
      done();
    });
  });

  define('require-resolve3@*/index.js', [], function(require, exports, module) {
    exports.resolve = function(n) {
      return require.resolve(n);
    }
  }, {
    main: true,
    map: {
      './a.png': 'require-resolve3@*/a.png'
    }
  });

  // #140
  it("should return valid resource when resolve at ./index.js", function(done){
    neuron._use('require-resolve3', function(r) {
      expect(r.resolve('./a.png')).to.equal(__root + '/require-resolve3/*/a.png');
      var err;
      try {
        r.resolve('../a.png');
      } catch(e) {
        err = true;
      }
      expect(err).to.equal(true);
      done();
    });
  });
});

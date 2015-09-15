var module_require_loaded;
var module_require_inited;

var module_require_2_loaded;
var module_require_2_inited;

var module_require_3_inited;

describe("facade", function() {

  var POLL_INTERVAL = 10;

  describe("facade(mod)", function() {
    facade('require');

    it("could load a neuron module", function(done) {
      var timer = setInterval(function() {
        if (module_require_loaded) {
          expect(module_require_loaded === true);
          done();
          clearInterval(timer);
        }
      }, POLL_INTERVAL);
    });

    it("will run `init` method if exists", function(done) {
      var timer = setInterval(function() {
        if (module_require_inited) {
          expect(module_require_inited === true);
          done();
          clearInterval(timer);
        }
      }, POLL_INTERVAL);
    });
  });


  describe("facade({mod}), to suppress interference, we use a new module", function() {
    facade('require-2');

    it("could load a neuron module", function(done) {
      var timer = setInterval(function() {
        if (module_require_2_loaded) {
          expect(module_require_2_loaded === true);
          done();
          clearInterval(timer);
        }
      }, POLL_INTERVAL);

    });

    it("will run `init` method if exists", function(done) {
      var timer = setInterval(function() {
        if (module_require_2_inited) {
          expect(module_require_2_inited === true);
          done();
          clearInterval(timer);
        }
      }, POLL_INTERVAL);
    });

  });

  describe("facade({entry, config})", function() {
    it("could assign the value of the argument of `init` by `config`", function(done) {
      var atom = {};

      facade('require-3', {
        value: atom
      });

      var timer = setInterval(function() {
        if (module_require_2_inited) {
          expect(module_require_2_inited === true);
          done();
          clearInterval(timer);
        }

      }, POLL_INTERVAL);
    });

    // test #72:
    it("should apply ranges when facading a package", function(done) {
      facade('range', function(n) {
        expect(n).to.equal(1);
        done();
      });
    });
  });

  describe("facade({entry}), use a js file", function(){
    define('facade@*/lib/main.js', [], function(require, exports, module){
      exports.init = function (check) {
        check(1);
      };
    }, {
      main: true,
      map: {}
    });

    it("load a package", function(done){
      facade('facade', function(n){
        expect(n).to.equal(1);
        done();
      });
    });

    define('facade2@*/a.js', [], function(require, exports, module){
      exports.init = function (check) {
        check(1);
      };
    }, {
      map: {}
    });

    define('facade2@*/a.js.js', [], function(require, exports, module){
      exports.init = function (check) {
        // Booooooooooom!
        check(2);
      };
    }, {
      map: {}
    });

    it("load a script", function(done){
      facade('facade2/a.js', function(n){
        expect(n).to.equal(1);
        done();
      });
    });


    define('facade3@1.1.0/a.js', [], function(require, exports, module){
      exports.init = function (check) {
        check(1);
      };
    }, {
      map: {}
    });

    define('facade3@1.1.0/a.js.js', [], function(require, exports, module){
      exports.init = function (check) {
        // Booooooooooom!
        check(2);
      };
    }, {
      map: {}
    });

    it("load a script with version", function(done){
      facade('facade3@1.1.0/a.js', function(n){
        expect(n).to.equal(1);
        done();
      });
    });
  });
});


var module_require_3_load_count = 0;

describe("_use()", function() {
  it("could prevent duplicate loading", function(done) {
    _use('require-3', function() {
      _use('require-3', function() {
        expect(module_require_3_load_count === 1);
        done();
      })
    })
  });
});
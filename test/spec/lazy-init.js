'use strict';

// for issue #82

describe("lazy factory initialization", function() {
  it("only run factories when `require()`d", function(done) {
    neuron._use('lazy', function(lazy) {
      expect(lazy.a).to.equal(1);
      done();
    });
  });

  it("the factory should not be invoked more than once", function(done) {
    // If the factory of this module invokes more than once, it will booom!
    // #84, #83
    neuron._use('circular', function () {
      done();
    });
  });
});


function lazy_booooom () {
  lazy_deps_loaded = true;
  throw new Error('be more lazy!! Boooooooooom!')
}

var lazy_deps_loaded;

// If load dependencies imediately when defining,
// it will try to load the script file, then it will boooooooooom!
define('lazy-deps@*', ['lazy-deps-dep@*'], function(require, exports, module){
  module.exports = require('lazy-deps-dep');
});


describe("lazy loading dependencies", function(){
  it("only load dependencies when `require()`d", function(done){
    setTimeout(function () {
      if (!lazy_deps_loaded) {
        define('lazy-deps-dep@*', [], function(require, exports, module){
          module.exports = 2;
        });
      }
      lazy_deps_loaded = true;

      neuron._use('lazy-deps', function(lazy) {
        expect(lazy).to.equal(2);
        done();
      });
    }, 500)
  });
});
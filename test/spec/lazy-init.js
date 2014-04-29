'use strict';

// for issue #82

describe("lazy factory initialization", function() {
  it("only run factories when `require()`d", function(done) {
    _use('lazy', function(lazy) {
      expect(lazy.a).to.equal(1);
      done();
    })
  });

  it("the factory should not be invoked more than once", function(done) {
    // If the factory of this module invokes more than once, it will booom!
    // #84, #83
    _use('factory-once', function () {
      done();
    });
  });
});
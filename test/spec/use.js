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
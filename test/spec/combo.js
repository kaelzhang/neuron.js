var module_require_3_load_count = 0;

describe("combo", function() {
  it("test combo files", function(done) {
    neuron._use('combo-a@0.0.0', function(a) {
      expect(a.init(1) === 1);
      done();
    });
  });
});
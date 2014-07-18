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

  it("module.exports.a", function(done){
    define('exports-a@1.0.0/index.js', [], function(require, exports, module, __filename, __dirname){
      module.exports = {};
      module.exports.a = 1;
    }, {
      main: true,
      map: {}
    });

    _use('exports-a@1.0.0', function (mod) {
      expect(mod).to.deep.equal({
        a: 1
      });

      done();
    });
  });
});
describe("__filename and __dirname", function(){
  it("could access filename as __filename", function(done){
    define('filename@*/lib/index.js', [], function (require, exports, module, __filename, __dirname) {
      exports.__filename = __filename;
      exports.__dirname = __dirname;
    }, {
      main: true,
      map: {}
    });

    _use('filename', function (f) {
      expect(f.__filename).to.equal('mod/filename/*/lib/index.js');
      expect(f.__dirname).to.equal('mod/filename/*/lib');
      done();
    });
  });
});
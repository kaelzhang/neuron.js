describe("Cyclic Dependencies: reference", function(){
  it("should not run factory more than once", function(done){

    var count_a = 1;
    define('cyclic-local@1.1.0/a.js', ['cyclic-local@1.1.0/index.js'], function(require, exports, module, __filename, __dirname){
      if (count_a ++ > 1) {
        throw 'Booooooooom, cyclic-local@1.1.0/a.js runs more than once';
      }

      var main = require('./');
      module.exports = main;
      module.exports.a = true;
    }, {
      map: {
        './': 'cyclic-local@1.1.0/index.js'
      }
    });

    var count_index = 1;
    define('cyclic-local@1.1.0/index.js', ['cyclic-local@1.1.0/a.js'], function(require, exports, module, __filename, __dirname){
      if (count_index ++ > 1) {
        throw 'Booooooooom, cyclic-local@1.1.0/index.js runs more than once';
      }

      exports.one = 1;
      var a = require('./a');
      module.exports = {
        a: a
      };

    }, {
      main: true,
      map: {
        './a': 'cyclic-local@1.1.0/a.js'
      }
    });

    _use('cyclic-local@1.1.0', function (mod) {
      expect(mod.a).to.deep.equal({
        one: 1,
        a: true
      });
      expect('one' in mod).to.equal(false);
      done();
    });
  });
});


describe("Cyclic dependencies: load a file", function(){
  it("should load remote files", function(done){
    _use('cyclic@1.0.0', function (exports) {
      expect(exports.a).to.equal(1);
      done();
    });
  });
});


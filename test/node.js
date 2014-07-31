'use strict';

var tmp = require('tmp');
var expect = require('chai').expect;
var node_path = require('path');
var neuron = require('../');
var fs = require('fs');

describe("neuron.version()", function(){
  it("get current neuron version", function(){
    expect(neuron.version()).to.equal(require('../package').cortex.version);
  });
});

describe("neuron.write()", function(){
  it("force === false, not exists", function(done){
    tmp.dir(function (err, dir) {
      expect(err).to.equal(null);
      var file = node_path.join(dir, 'neuron.js');
      neuron.write(file, function (err) {
        expect(err).to.equal(null);
        var content = fs.readFileSync(file).toString();
        expect(!!~content.indexOf(neuron.version())).to.equal(true);
        done();
      });
    });
  });

  it("force === false, exists", function(done){
    tmp.dir(function (err, dir) {
      expect(err).to.equal(null);
      var file = node_path.join(dir, 'neuron.js');
      fs.writeFileSync(file, 'blah');
      neuron.write(file, function (err) {
        expect(err).to.equal(null);
        var content = fs.readFileSync(file).toString();
        expect(!!~content.indexOf(neuron.version())).to.equal(false);
        done();
      });
    });
  });

  it("force === true", function(done){
    tmp.dir(function (err, dir) {
      expect(err).to.equal(null);
      var file = node_path.join(dir, 'neuron.js');
      fs.writeFileSync(file, 'blah');
      neuron.write(file, function (err) {
        expect(err).to.equal(null);
        var content = fs.readFileSync(file).toString();
        expect(!!~content.indexOf(neuron.version())).to.equal(true);
        done();
      }, true);
    });
  });
});


// describe("neuron.dist()", function(){
//   it("will write cortex.json", function(done){
//     // code ...
//   });
// });

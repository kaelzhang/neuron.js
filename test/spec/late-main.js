'use strict';

describe("load main after entry", function(){
  it("should found graph", function(done){
    neuron._use('late-main/lib/entry.js', function (exports) {
      expect(exports.a).to.equal(1)
      done()
    })
  })
})
'use strict';

describe("config.loaded", function(){
  it("should load main module even if an entry is already loaded", function(done){
    neuron._use('only-load-entry/lib/entry.js', function () {
      neuron._use('only-load-entry', function () {
        done()
      })
    })
  })
})
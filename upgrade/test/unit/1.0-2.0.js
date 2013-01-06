'use strict';

var

jasmine = require('../../tools/jasmine'),
NR = require('../../lib/neuron');


describe("a", function(){
   it("b", function(){
       expect(1).toBe(1);
   });
});


var 

jasmineEnv = jasmine.getEnv();
jasmineEnv.addReporter(new jasmine.CLIReporter);
jasmineEnv.updateInterval = 1000;
jasmineEnv.execute();
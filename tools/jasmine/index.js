var

jasmine = require('./jasmine'),

NR = require('../../lib/neuron');

require('../colorize');

NR.mix(global, jasmine);


jasmine = jasmine.jasmine;

jasmine.CLIReporter = NR.Class({
    reportRunnerStarting: function(msg){
        // console.log(msg);
    },
    
    reportRunnerResults: function(msg) {
        // console.log(msg);
    },
    
    reportSuiteResults: function(msg) {
        // console.log(msg);
    },
    
    reportSpecStarting: function(msg) {
        // console.log(msg);
    },
    
    reportSpecResults: function(msg) {
        var results = msg.results_;
        
        console.log(
            results.description, ': ', 
            String(results.passedCount).green, ',', 
            String(results.failedCount).red, '/',
            results.totalCount
        );
        
        results.items_.forEach(function(info){
            console.log('\t' + NR.sub('`{type} {actual} {matcherName} {expected}` {message}', info)[info.passed_ ? 'green' : 'red'] );
        });
    },
    
    log: function(msg) {
        // console.log(msg);
    }
});


module.exports = jasmine;
// exports.b = 1;

var dep1 = require('./dep1');

console.log('dep1.a', dep1, dep1.a);

exports.a = 1;
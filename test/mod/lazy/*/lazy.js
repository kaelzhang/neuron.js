define('lazy@*', ['./booooooom', './ok'], function(require, exports, module){

  if (true) {
    module.exports = require('./ok');
  } else {

    // If we invoke the factory of boooooom before `require()`d, it will booooooom !
    module.exports = require('./booooooom');
  }

}, {
  main: true
});


define('lazy@*/booooooom', [], function(require, exports, module){
  throw new Error('Boooooooom! The sky will fall upon over your head.');
});


define('lazy@*/ok', [], function(require, exports, module){
  module.exports = {
    a: 1
  };
});



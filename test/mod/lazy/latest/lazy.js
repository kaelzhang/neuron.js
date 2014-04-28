define('lazy@latest', ['./booooooom', './ok'], function(require, exports, module){

  if (true) {
    module.exports = require('./ok');
  } else {
    module.exports = require('./booooooom');
  }

}, {
  main: true
});


define('lazy@latest/booooooom', [], function(require, exports, module){
  throw new Error('Boooooooom! The sky will fall upon over your head.');
});

define('lazy@latest/ok', [], function(require, exports, module){
  module.exports = {
    a: 1
  };
});



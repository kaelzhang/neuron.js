define('require-at@latest', [], function(require, exports, module){
  var error;

  try {
    var a = require('abc@10.0.0');
  } catch(e) {
    error = e.message;
  }

  if (error) {
    exports.message = error;
  }
});
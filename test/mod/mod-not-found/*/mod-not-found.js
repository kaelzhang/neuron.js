define('mod-not-found@*', [], function(require, exports, module){
  var error;

  try {
    var a = require('abc');
  } catch(e) {
    error = e.message;
  }

  if (error) {
    exports.message = error;
  }
});
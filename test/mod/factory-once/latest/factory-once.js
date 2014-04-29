var factory_count = {
  main: -1,
  booooooom: -1,
  ok: -1
}

define('factory-once@latest/ok', ['./booooooom'], function(require, exports, module){

  // required by two module
  require('./booooooom');

  if (!factory_count.ok) {
    throw new Error('factory-once/booooooom invoked more than once');
  }

  ++ factory_count.ok;
});


define('factory-once@latest/abc', [], function(require, exports, module){
  if (!factory_count.booooooom) {
    throw new Error('factory-once/booooooom invoked more than once');
  }

  ++ factory_count.booooooom
});


define('factory-once@latest/booooooom', ['./abc'], function(require, exports, module){
  require('./abc');

  if (!factory_count.booooooom) {
    throw new Error('factory-once/booooooom invoked more than once');
  }

  ++ factory_count.booooooom
});


define('factory-once@latest', ['./booooooom', './ok'], function(require, exports, module){

  require('./ok');
  require('./booooooom');

  if (!factory_count.main) {
    throw new Error('factory-once/main invoked more than once');
  }

  ++ factory_count.main;

  // there's no module.exports

}, {
  main: true
});
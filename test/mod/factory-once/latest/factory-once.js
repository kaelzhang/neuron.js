var factory_booooooom_count = -1;

define('factory-once@latest/dep', ['./booooooom'], function(require, exports, module){
  require('./booooooom');
});


define('factory-once@latest/booooooom', [], function(require, exports, module){
  if (!factory_booooooom_count) {
    throw new Error('factory-once/booooooom invoked more than once');
  }

  ++ factory_booooooom_count

  // Oops, it produces a circular dependency
  require.async('./dep', function () {});
});


define('factory-once@latest/index', ['./booooooom'], function(require, exports, module){
  require('./booooooom');
}, {
  main: true
});
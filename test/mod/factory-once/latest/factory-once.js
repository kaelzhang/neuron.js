var factory_count = {
  main: -1,
  booooooom: -1
}


define('factory-once@latest/dep', ['./booooooom'], function(require, exports, module){
  require('./booooooom');
});


define('factory-once@latest/booooooom', [], function(require, exports, module){
  if (!factory_count.booooooom) {
    throw new Error('factory-once/booooooom invoked more than once');
  }

  ++ factory_count.booooooom

  require.async('./dep', function () {});
});


define('factory-once@latest/index', ['./booooooom'], function(require, exports, module){
  require('./booooooom');

  if (!factory_count.main) {
    throw new Error('factory-once/main invoked more than once');
  }

  ++ factory_count.main;

  // there's no module.exports

}, {
  main: true
});
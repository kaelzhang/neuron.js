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


// NON-lazy-initialization:
// 1. define dep, 
// 2. register boom (dependency)
// 3. define boom
// 4. no dependency -> run boom factory start >>> (not lazy)
// 5. boom.exports
// 6. async dep -> register dep

// <<< boom factory end

// 7. emit boom ready
// 8. run dep factory
// 9. require(boom) by dep -> boom.exports
// 10. require(boom) by main -> boom.exports


// Lazy-initialization
// 
// 1. define dep
// 2. register boom
// 3. define boom -> DO NOT run boom factory (lazy)
// 4. emit boom ready
// 5. emit dep ready
// 6. require(boom) by main ->
// 7. run boom factory start >>> (lazy)
// 8. async dep
// 9. run dep factory start >>>
// 10. require(boom) -> run boom factory start >>> BOOOOOOOOOOOM !


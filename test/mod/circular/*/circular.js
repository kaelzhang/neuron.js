var circular_booooooom_count = -1;
var circular_static_count = -1;

define('circular@*/dep', ['./booooooom'], function(require, exports, module){
  require('./booooooom');
}, {
  map: {
    './booooooom': 'circular@*/booooooom'
  }
});


define('circular@*/booooooom', [], function(require, exports, module){
  if (!circular_booooooom_count) {
    throw new Error('circular/booooooom invoked more than once');
  }

  ++ circular_booooooom_count

  // Oops, it produces a circular dependency
  require.async('./dep', function () {});
}, {
  map: {
    './dep': 'circular@*/dep'
  }
});


define('circular@*/static-dep', ['./static-boom'], function(require, exports, module){
  require('./static-boom');
}, {
  map: {
    './static-boom': 'circular@*/static-boom'
  }
});


define('circular@*/static-boom', ['./static-dep'], function(require, exports, module){
  if (!circular_static_count) {
    throw new Error('circular/static-boom invoked more than once');
  }

  ++ circular_static_count

  // Oops, it produces a circular dependency
  require('./static-dep');
}, {
  map: {
    './static-dep': 'circular@*/static-dep'
  }
});


define('circular@*/index', ['./booooooom'], function(require, exports, module){
  // async circular
  require('./booooooom');

  // static circular
  // require('./static-boom');

}, {
  main: true,
  map: {
    './booooooom': 'circular@*/booooooom'
  }
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


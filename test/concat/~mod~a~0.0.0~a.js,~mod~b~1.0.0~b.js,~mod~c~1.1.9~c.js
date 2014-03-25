'use strict';

define('a@0.0.0', ['b@1.0.0'], function (require, exports, module) {
    var b = require('b');
    module.exports = b + 1;
});


define('b@1.0.0', ['c@~1.1.0'], function (require, exports, module) {
    var c = require('c');
    module.exports = c + 1;
});


define('c@1.1.9', [], function (require, exports, module) {
    module.exports = 1;
});
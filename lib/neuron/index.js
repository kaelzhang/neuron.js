/**
 * entrance of nodejs
 */
 
global.NR = require('./seed');

require('./lang/enhance');

require('./oop/class');
require('./oop/attrs');
require('./oop/events');

require('./cleaner');

module.exports = NR;
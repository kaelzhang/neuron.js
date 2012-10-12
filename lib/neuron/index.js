/**
 * entrance of nodejs
 */
 
// add NR, on which is dependent by other modules, such as lang/enhance, oop/*, to global environment of nodejs
global.NR = require('./seed');

require('./lang/enhance');

require('./oop/class');
require('./oop/attrs');
require('./oop/events');

require('./cleaner');

// remove global.NR
// then, you should use require('./neuron') instead
delete global.NR;

module.exports = NR;
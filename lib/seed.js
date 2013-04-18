
// module seed

var NR = makeSureObject(ENV, 'NR');


/**
 * build time will be replaced when packaging and compressing
 */
NR.build = '%buildtime%';


/**
 * atom to identify the Neuron Object, will not be able to access after cleaning
 * @temp
 * @private
 * @const
 */
NR._ = {};


/**
 
 --------------------------------------------------
 [1] NR.isPlainObject will accept instances created by new myClass, but some libs don't, such as jQuery of whose strategy is dangerous, I thought.
 for example:
 suppose somebody, a newbie, wrote something like this:
 <code>
     Object.prototype.destroyTheWorld = true;
     NR.isPlainObject({}); // true
 </code>
 
 if use jQuery: (at least up to 1.6.4)
 <code>
     jQuery.isPlainObject({}); // false
 </code>
 
 
 milestone 2.0 ------------------------------------
 
 2011-10-11  Kael:
 - add NR.isWindow method
 - add an atom to identify the Neuron Object
 
 2011-10-04  Kael:
 - fix a but that NR.isObject(undefined/null) -> true in IE
 
 2011-09-04  Kael:
 - add global support for CommonJS(NodeJS)
 
 Global TODO:
 A. make Slick Selector Engine slim
 B. remove setAttribute opponent from Slick
 C. [business] move inline script for header searching after the HTML structure of header
 
 2011-09-02  Kael:
 - rename core.js as seed.js
 - remove everything unnecessary out of seed.js
 - seed.js will only manage the NR namespace and provide support for type detection
 
 milestone 1.0 ------------------------------------

 2010-08-27  Kael:
 - add global configuration: NR.__PARSER as DOM selector and parser

 2010-08-16  Kael:
 TODO:
 √ GLOBAL: remove all native implements of non-ECMAScript5 standards


 2011-03-19  Kael: move NR.type to lang.js
 2011-03-01  Kael Zhang: add adapter for typeOf of mootools
 2010-12-13  Kael Zhang: fix the getter of NR.data
 2010-10-09  Kael Zhang: create file
 
 */
/**
 * @preserve Neuron JavaScript Framework & Library
 *   author i@kael.me
 */

// version @VERSION
// build @DATE

// including sequence: see ../build.json


// @param {Object} ENV environment
// @param {undefined=} undefined
;(function(ENV, undefined){


// common code slice
// ----
//     - constants
//     - common methods

var DOC = ENV.document;
var EMPTY = '';


// no-operation
function NOOP(){};


// copy all properties in the supplier to the receiver
// @param {Object} receiver
// @param {Object} supplier
// @param {boolean=true} override whether override the existing property in the receiver
// @param {(Array.<string>)=} copylist copy list, an array of selected properties
// @returns {mixed} r
function mix(receiver, supplier, override, copylist) {

    if (supplier && receiver){

        var i = 0;
        var c;
        var len;

        // default to true
        override = override || override === undefined;

        if ( copylist && ( len = copylist.length ) ) {

            for (; i < len; i++) {
                c = copylist[i];

                if ( (c in supplier) && (override || !(c in receiver) ) ) {
                    receiver[c] = supplier[c];
                }
            }

        } else {
            for (c in supplier) {
                if (override || !(c in receiver)) {
                    receiver[c] = supplier[c];
                }
            }
        }
    }

    return receiver;
};

NR.mix = mix;


// make sure `host[key]` is an object
// @param {Object} host
// @param {string} key 
function makeSureObject(host, key){
    return host[key] || (host[key] = {});
};



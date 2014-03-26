// common code slice
// ----
//     - constants
//     - common methods


// A very simple `mix` method
// copy all properties in the supplier to the receiver
// @param {Object} receiver
// @param {Object} supplier
// @returns {mixed} receiver
function mix(receiver, supplier) {
    var c;
    for (c in supplier) {
        receiver[c] = supplier[c];
    }
}


// greedy match:
var REGEX_DIR_MATCHER = /.*(?=\/.*$)/;

// get the current directory from the location
//
// http://jsperf.com/regex-vs-split/2
// vs: http://jsperf.com/regex-vs-split
function dirname (uri){
    var m = uri.match(REGEX_DIR_MATCHER);

    // abc/def  -> abc
    // abc      -> abc
    // abc/     -> abc
    return m ? m[0] : uri;
}


// Canonicalize path
// similar to path.resolve() of node.js
// NOTICE that the difference between `pathResolve` and `path.resolve` of node.js is:
// `pathResolve` treats paths which dont begin with './' and '../' as top level paths,
// but node.js as a relative path.

// For example:
// pathResolve('a', 'b')    -> 'b'
// node_path.resolve('a', 'b')   -> 'a/b'
 
// pathResolve('a/b', './c')    -> 'a/b/c'
// pathResolve('a/b', '../c')   -> 'a/c'
// pathResolve('a//b', './c')   -> 'a//b/c'   - for 'a//b/c' is a valid uri
function pathResolve (from, to) {
    // relative
    if ( isPathRelative(to) ) {
        var old = (dirname(from) + '/' + to).split('/');
        var ret = [];
            
        old.forEach(function(part){
            if (part === '..') {
                ret.pop();
                
            } else if (part !== '.') {
                ret.push(part);
            }
        });
        
        to = ret.join('/');
    }
    
    return to;
}


// @param {string} path
function isPathRelative (path) {
    return path.indexOf('./') === 0 || path.indexOf('../') === 0;
}


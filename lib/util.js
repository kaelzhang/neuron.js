// common code slice
//////////////////////////////////////////////////////////////////////
// - constants
// - common methods

// @const
// 'a@1.2.3/abc' -> 
// ['a@1.2.3/abc', 'a', '1.2.3', '/abc']

//                    0    1           2                3         4
var REGEX_PARSE_ID = /^(?:@([^\/]+)\/)?((?:[^\/])+?)(?:@([^\/]+))?(\/.*)?$/;
// On android 2.2,
// `[^\/]+?` will fail to do the lazy match, but `(?:[^\/])+?` works.
// Shit, go to hell!

// Parses a module id into an object

// @param {string} id path-resolved module identifier
// 'a@1.0.0'    -> 'a@1.0.0'
// 'a'          -> 'a@*'
// 'a/inner'    -> 'a@*/inner'
function parse_module_id (id) {
  var match = id.match(REGEX_PARSE_ID);
  var scope = match[1] || '';
  var name = match[2];

  // 'a/inner' -> 'a@latest/inner'
  var version = match[3] || '*';
  var path = match[4] || '';

  // There always be matches
  return format_parsed({
    s: scope,
    n: name,
    v: version,
    p: path
  });
}


// Format package id and pkg
// `parsed` -> 'a@1.1.0'
function format_parsed (parsed) {
  var pkg = (parsed.s && '@' + parsed.s + '/')
    + parsed.n + '@' + parsed.v;

  parsed.id = pkg + parsed.p;
  parsed.k = pkg;
  return parsed;
}


// A very simple `mix` method
// copy all properties in the supplier to the receiver
// @param {Object} receiver
// @param {Object} supplier
// @returns {mixed} receiver
function mix (receiver, supplier) {
  for (var c in supplier) {
    receiver[c] = supplier[c];
  }
}


// greedy match:
var REGEX_DIR_MATCHER = /.*(?=\/.*$)/;

// Get the current directory from the location
//
// http://jsperf.com/regex-vs-split/2
// vs: http://jsperf.com/regex-vs-split
function dirname (uri) {
  var m = uri.match(REGEX_DIR_MATCHER);

  // abc/def  -> abc
  // abc      -> abc  // which is different with `path.dirname` of node.js
  // abc/     -> abc
  return m ? m[0] : uri;
}


// @param {string} path
function is_path_relative (path) {
  return path === '.'
    || path === '..'
    || path.indexOf('./') === 0
    || path.indexOf('../') === 0;
}


function err (message) {
  throw new Error('neuron: ' + message);
}


function module_not_found (id) {
  err("Cannot find module '" + id + "'");
}

// common code slice
//////////////////////////////////////////////////////////////////////
// - constants
// - common methods

// @const
// 'a@1.2.3/abc' -> 
// ['a@1.2.3/abc', 'a', '1.2.3', '/abc']

//                    0 1                2         3
var REGEX_PARSE_ID = /^((?:[^\/])+?)(?:@([^\/]+))?(\/.*)?$/;
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
  var name = match[1];

  // 'a/inner' -> 'a@latest/inner'
  var version = match[2] || '*';
  var path = match[3] || '';

  // There always be matches
  return format_parsed({
    n: name,
    v: version,
    p: path
  });
}


// Format package id and pkg
// `parsed` -> 'a@1.1.0'
function format_parsed(parsed) {
  var pkg = parsed.n + '@' + parsed.v;
  parsed.id = pkg + parsed.p;
  parsed.k = pkg;
  return parsed;
}


// Legacy
// Old neuron modules will not define a real resolved id.
// We determine the new version by `env.map`
// Since 6.2.0, actually, neuron will and should no longer add file extension arbitrarily,
// because `commonjs-walker@3.x` will do the require resolve during parsing stage.
// But old version of neuron did and will add a `config.ext` to the end of the file.
// So, if commonjs-walker does so, we adds a '.js' extension to the end of the identifier.
// function legacy_transform_id (id, env) {
//   return env.map
//     ? id
//     : id + '.js';
// }


// A very simple `mix` method
// copy all properties in the supplier to the receiver
// @param {Object} receiver
// @param {Object} supplier
// @returns {mixed} receiver
function mix(receiver, supplier) {
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
function dirname(uri) {
  var m = uri.match(REGEX_DIR_MATCHER);

  // abc/def  -> abc
  // abc      -> abc  // which is different with `path.dirname` of node.js
  // abc/     -> abc
  return m ? m[0] : uri;
}


// Get the relative path to the root of the env
// @returns {string} a module path
function resolve_path (path, env) {
  // '', 'a.png' -> 'a.png'
  // '', './a.png' -> 'a.png'
  // '', '../a.png' -> '../a.png'
  // '/index.js', 'a.png' -> 'a.png'
  return path_join(
    // '' -> '' -> ''
    // '/index.js' -> '/' -> ''
    dirname(env.p).slice(1),
    path
  );
}


// Resolves an id according to env
// @returns {string} a module id
function resolve_id (path, env) {
  path = resolve_path(path, env);
  return path
    ? env.k + '/' + path
    : env.k;
}


// Canonicalize path
// The same as `path.resolve()` of node.js.

// For example:
// path_join('a', 'b')        -> 'a/b'
// path_join('a/b', './c')    -> 'a/b/c'
// path_join('a/b', '../c')   -> 'a/c'
// path_join('a//b', './c')   -> 'a/b/c'

// #75:
// path_join('../abc', './c') -> '../abc/c',

// path_join('', './c')       -> 'c'
// path_join('', '../c')      -> '../c' 
function path_join(from, to) {
  var parts = (from + '/' + to)
    .split('/')
    // Filter empty string:
    // ['', '.', 'c'] -> ['.', 'c']
    .filter(Boolean);
  return normalize_array(parts).join('/');
}


// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalize_array(parts) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  var i = parts.length - 1;
  for (; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);

    } else if (last === '..') {
      parts.splice(i, 1);
      up++;

    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  while (up--) {
    parts.unshift('..');
  }

  return parts;
}


// @param {string} path
function is_path_relative(path) {
  return path.indexOf('./') === 0 || path.indexOf('../') === 0;
}


function err (message) {
  throw new Error('neuron: ' + message);
}


function module_not_found (id) {
  err("Cannot find module '" + id + "'");
}

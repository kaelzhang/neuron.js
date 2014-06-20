// common code slice
// ----
//     - constants
//     - common methods

// Ref: [semver](http://semver.org/)
// note that we must use '\-' rather than '-', becase '-' presents a range within brackets
// @const
var REGEX_MATCH_SEMVER = /^(\D*)(\d+)\.(\d+)\.(\d+)/i;
//                       0  1    2      3      4            

// A very simple method to parse semver
// @return {Object} parsed semver object
function parseSemver(version) {
  var ret;
  if (version) {
    var match = version.match(REGEX_MATCH_SEMVER);

    // For example:
    // '~1.3.9-alpha/lang'
    if (match) {
      // decorator -> '~'
      ret.d = match[1];
      // major -> '1'
      ret.a = match[2];
      // minor -> '3'
      ret.b = match[3];
      // patch -> '9'
      ret.c = match[4];
    }
  }

  return ret;
}


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

// #75: 
// pathResolve('../abc', './c') -> '../abc/'
function pathResolve(from, to) {
  // relative
  if (isPathRelative(to)) {
    var parts = (dirname(from) + '/' + to).split('/');
    to = normalizeArray(parts).join('/');
  }

  return to;
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
function normalizeArray(parts) {
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
function isPathRelative(path) {
  return path.indexOf('./') === 0 || path.indexOf('../') === 0;
}


function err (message) {
  throw new Error('neuron: ' + message);
}

// ## Script Loader
//////////////////////////////////////////////////////////////////////

var DOC = document;

// never use `document.body` which might be NULL during downloading of the document.
var HEAD = DOC.getElementsByTagName('head')[0];

function load_js(src) {
  var node = DOC.createElement('script');

  node.src = src;
  node.async = true;

  js_onload(node, function() {
    HEAD.removeChild(node);
  });

  // A very tricky way to avoid several problems in iOS webviews, including:
  // - webpage could not scroll down in iOS6
  // - could not maintain vertial offset when history goes back.
  setTimeout(function () {
    HEAD.insertBefore(node, HEAD.firstChild);
  }, 0);
}


var js_onload = DOC.createElement('script').readyState
  // @param {DOMElement} node
  // @param {!function()} callback asset.js makes sure callback is not NULL
  ? function(node, callback) {
    node.onreadystatechange = function() {
      var rs = node.readyState;
      if (rs === 'loaded' || rs === 'complete') {
        node.onreadystatechange = NULL;
        callback.call(this);
      }
    };
  }

  : function(node, callback) {
    node.addEventListener('load', callback, false);
  };
  
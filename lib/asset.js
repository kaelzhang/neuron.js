
// never use `document.body` which might be NULL during downloading of the document.
var HEAD = DOC.getElementsByTagName('head')[0];

function loadJS(src) {
  var node = DOC.createElement('script');

  node.src = src;
  node.async = true;

  jsOnload(node, function() {
    HEAD.removeChild(node);
  });

  HEAD.insertBefore(node, HEAD.firstChild);
}


var jsOnload = DOC.createElement('script').readyState

/**
 * @param {DOMElement} node
 * @param {!function()} callback asset.js makes sure callback is not NULL
 */
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
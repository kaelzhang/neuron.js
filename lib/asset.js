// <script 
// src="http://localhost:8765/mod/neuronjs/2.0.1/neuron.js" 
// id="neuron-js" 
// data-path="mod"
// data-server="localhost:8765"
// ></script>

// never use `document.body` which might be null during downloading of the document.
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
 * @param {!function()} callback asset.js makes sure callback is not null
 */
  ? function(node, callback) {
    node.onreadystatechange = function() {
      var rs = node.readyState;
      if (rs === 'loaded' || rs === 'complete') {
        node.onreadystatechange = null;
        callback.call(this);
      }
    };
  }

  : function(node, callback) {
    node.addEventListener('load', callback, false);
  };
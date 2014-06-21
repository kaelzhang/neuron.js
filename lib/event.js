// ## A very simple EventEmitter
//////////////////////////////////////////////////////////////////////

// @param {this} self
// @param {string} type
// @returns {Array.<function()>}
function getEventStorageByType(type) {
  var storage = neuron.__ev || (neuron.__ev = {});
  return type ? storage[type] || (storage[type] = []) : [];
}


// @expose
neuron.on = function(type, fn) {
  if (fn) {
    var storage = getEventStorageByType(type);
    storage.push(fn);
  }
  return neuron;
};


// @expose
neuron.emit = function(type, data) {
  var handlers = getEventStorageByType(type);
  handlers.forEach(function(handler) {
    handler(data);
  });
  // Clean
  handlers.length = 0;
};

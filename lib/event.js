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
  getEventStorageByType(type).forEach(function(fn) {
    fn(data);
  });
};

/**
 change log
 
 2012-08-02  Kael:
 - improved the stablility of function overloading, prevent user mistakes
 - optimized calling chain
 
 2011-02-24  Kael:
 TODO:
 A. add .after and .before
 */
 
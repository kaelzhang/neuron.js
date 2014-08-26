// Manage configurations
//////////////////////////////////////////////////////////////////////

// var neuron_loaded = [];
var NEURON_CONF = neuron.conf = {
  loaded: [],
  // If `config.tree` is not specified, 
  graph: {
    _: {}
  }
};


var SETTERS = {

  // The server where loader will fetch modules from
  // if use `'localhost'` as `base`, switch on debug mode
  'path': function(path) {
    // Make sure 
    // - there's one and only one slash at the end
    // - `conf.path` is a directory 
    return path.replace(/\/*$/, '/');
  },

  'loaded': justReturn,
  'graph': justReturn,
  'cache': justReturn
};


function justReturn(subject) {
  return subject;
}


function config(conf) {
  var key;
  var setter;
  for (key in conf) {
    setter = SETTERS[key];
    if (setter) {
      NEURON_CONF[key] = setter(conf[key]);
    }
  }
}

neuron.config = config;

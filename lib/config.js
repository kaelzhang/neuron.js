// Manage configurations
//////////////////////////////////////////////////////////////////////

// var neuron_loaded = [];
var NEURON_CONF = {
  loaded: [],
  // If `config.graph` is not specified, 
  graph: {
    _: {}
  },
  resolve: module_id_to_absolute_url
};

// server: 'http://localhost/abc',
// -> http://localhost/abc/<relative>
// @param {string} relative relative module url
function module_id_to_absolute_url (id) {
  var pathname = id.replace('@', '/');
  var base = NEURON_CONF.path;
  base || err('config.path must be specified');
  return base + pathname;
}


var SETTERS = {

  // The server where loader will fetch modules from
  // Make sure the path is a standard pathname
  'path': function (path) {
    // Make sure 
    // - there's one and only one slash at the end
    // - `conf.path` is a directory 
    // Cases:
    // './abc' -> './abc/'
    // './abc/' -> './abc/'
    return path.replace(/\/*$/, '/');
  },

  'loaded': justReturn,
  'graph': justReturn,
  'resolve': justReturn
};


function justReturn (subject) {
  return subject;
}


function config (conf) {
  var key;
  var setter;
  for (key in conf) {
    setter = SETTERS[key];
    if (setter) {
      NEURON_CONF[key] = setter(conf[key]);
    }
  }
}

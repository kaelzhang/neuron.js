// ## Explose public methods
//////////////////////////////////////////////////////////////////////

// map of id -> defined module data
var mods = 
neuron._mods    = {};

neuron.config   = config;
neuron.error    = err;
neuron._conf    = NEURON_CONF;
neuron.on       = on;
neuron.loadJs   = load_js;

// private methods only for testing
// avoid using this method in product environment
// @expose
neuron._use     = function (id, callback) {
  use_module_by_id(id, callback);
};

// @expose
// Attach a module for business facade, for configurations of inline scripts
// if you want a certain biz module to be initialized automatically, the module's exports should contain a method named 'init'
// ### Usage 
// ```
// // require biz modules with configs
// facade('app-main-header-bar', {
//   icon: 'http://kael.me/u/2012-03/icon.png'
// });
//  ```
function facade (entry, data) {
  use_module_by_id(entry, function(method) {
    typeof method === 'function' && method(data);
  });
}


function use_module_by_id (id, callback) {
  var module = get_module(id);
  module.f = true;
  use_module(module, callback);
}


if (ENV.neuron) {
  return;
}

// @expose
ENV.neuron = neuron;

// @expose
ENV.define = define;

// @expose
ENV.facade = facade;

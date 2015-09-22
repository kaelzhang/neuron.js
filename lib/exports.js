// ## Explose public methods
//////////////////////////////////////////////////////////////////////

ENV.neuron = neuron;

// @expose
ENV.define = define;

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
ENV.facade = function (entry, data) {
  use_module_by_id(entry, function(method) {
    method.init && method.init(data);
  });
};


// private methods only for testing
// avoid using this method in product environment
// @expose
ENV._use = function (id, callback) {
  use_module_by_id(id, callback);
};

// @expose
ENV._load = load_js;


function use_module_by_id (id, callback) {
  var module = get_module(id);
  module.f = true;
  use_module(module, callback);
}

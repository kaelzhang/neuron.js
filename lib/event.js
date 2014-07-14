// ## A very simple EventEmitter
//////////////////////////////////////////////////////////////////////

var events = {};

// @param {this} self
// @param {string} type
// @returns {Array.<function()>}
function get_event_storage_by_type(type) {
  return events[type] || (events[type] = []);
}


// Register an event once
function once(type, fn) {
  get_event_storage_by_type(type).push(fn);
};


// Emits an event
function emit(type, data) {
  var handlers = get_event_storage_by_type(type);
  handlers.forEach(function(handler) {
    handler(data);
  });
  // Clean
  handlers.length = 0;
};

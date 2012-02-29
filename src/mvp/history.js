/**
 * html5 history state manager, an enhanced handler for window.history
 * author  Kael Zhang
 
 * for non-html5-enabled browsers, will smoothly fallback to hashes
 * of support with:
 	- back and forward button of browsers
 	- cross browser, even with IE6,7
 	- pushState and replaceState
 	- popstate event
 	- fixed hash history of IE6,7 and old Safari
 */
 
;(function(){
 
var 

HIS = history,

need_fallback = !('pushState' in HIS),
dependencies = [],
HISTORY_LEGACY = './history-legacy';
	
need_fallback && dependencies.push(HISTORY_LEGACY);

 
KM.define(dependencies, function(K, require){

	var handler;

	/**
	 * for old browsers
	 */
	if(need_fallback){
	
		// history manager for legacy
		handler = require(HISTORY_LEGACY);
		
	/**
	 * standard pushState implementation
	 */
	}else{
		var WIN = K.__HOST,
			HIS = WIN.history,
			
			history_state;
	
		handler = {
			push: function(state, title, url){
				HIS.pushState(state, title, url);
				handler.state = state;
				this.fire('pushstate', {
					state: state,
					title: title,
					url: url
				});
			},
			
			/**
			 * This is a way to look at the state without having to wait for a `popstate` event.
			 * history.state is only implemented by Gecko (up to 2012-02-27), but Webkit not yet.
			 * so create a mock property for mvp/history singleton
			 */
			// state: {Object},
			
			// for standard
			start: function(){
				$(window).on('popstate', function(e){
					var state = e.event.state;
					
					handler.state = state;
					
					handler.fire('popstate', {
						state: state
					});
				});
				
				handler.fire('start');
			}
		};
		
	}

	// mix events methods to handler singleton
	K.Class.implement(handler, 'events');

	return handler;

});


})();


/**
 change log:
 
 2011-11-22  Kael:
 - complete methods to mutually convert from object to query or from query to object
 
 2011-11-18  Kael:
 - refractor and migrate to Neuron
 - mvc/history will no longer register modules
 - mvc/history will only deal with state-related matters
 
 2011-04-28  Kael:
 TODO
 A. support pushState and replaceState
 
 2011-04-26  Kael:
 - refractor several methods, KM.history will tidy Number-type arguments
 
 2011-01-01  Kael Zhang:
 - modulize, optimize scope chain
 - no more dependence on Mootools.Hash
 
 2010-03-03  Kael Zhang: separate methods for cross-browser support, no more detect user agent whenever fetch ajax history
 
 2010-01-20  Kael Zhang: create document, main functionalities
 
 */
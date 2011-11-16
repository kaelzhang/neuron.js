/**
 * html5 history state manager
 * for non-html5-enabled browsers, mvc/state module will smoothly fallback to hashes
 */
KM.define([], function(K, require){
	
	
return {

	/**
	 * push a state into the history stack
	 * @param {string} id 
	 * @param {Object} data {
	 		url: {string} if html5 enabled, url will push to the location state. 
	 			there will be a map associated the url and its relevant data
	 		params: {Array} which will apply to the handler function 
	   }
	 */
	push: function(id, data){
		
	},
	
	/**
	 * replace a state
	 * @param {string} id
	 * @param {Object} data
	 * @param {number} historyID
	 */
	replace: function(id, data, historyID){
		
	},
	
	
	/**
	 * method to start histroy detecting
	 */
	start: function(){
		
	}
	
}


});
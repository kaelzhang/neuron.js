/**
 * module  mvp/router
 */
KM.define(['./history'], function(K, require){

var

History = require('./history'),

// .123
// 1.123
// 123
REGEX_NUMBER = /^(?:\d*\.)?\d+$/,

/**
 * regular expression for route matching
 * credits to [http://documentcloud.github.com/backbone/](backbone)
 */
// escape special symbols
REGEX_REPLACER_ESCAPE = /[-[\]{}()+?.,\\^$|#\s]/g,

// example: `/page/:page`
REGEX_REPLACER_NAMED_PARAM = /:([\w\d]+)/g,

// matching parameter begins with asterisk symbol(`*`)
// ex: `/page/*page`
REGEX_REPLACER_SPLAT_PARAM = /\*([\w\d]+)/g,

// be used with RegExp.exec, matching `:page` 
REGEX_EXECUTOR_PARAM = /[:*]([\w\d]+)/g,


/**
 url rewrite
 
 @param {string|RegExp} matcher of location pathname
 	{string} '/page'
 	{RegExp} /\/page/\d+/
 
 @param {Object} rules {
 	action: {string} action, ex: `'page'`
 	rewrite: {RegExp|string|function()} rewrite rule
 		X {RegExp} return matches
 	 	{string} ruby-style pattern for matching, '/page/:page'
 	 	{function()} returns the matched data
 }
 
 router.add(matcher, rules);
 
 router.route(url);
 
 
 <code:pseudo>
 
 // nginx.conf
 location /page {
 	proxy_pass  http://....
 }
 
 // neuron.router
 router.route('/page', {
 	action: 'page',
 	rewrite: ...
 });
 
 </code>
 */

Router = K.Class({
	initialize: function(){
		this._rules = [];
	},
	
	/**
	 * add a router
	 * @param {string|regexp} pattern
	 * @param {Object}
	 */
	add: function(pattern, action){

		this._rules.push({
			pattern: pattern,
			action: action,
			rewrite: this._patternToRegExp(pattern)
		});
		
		return this;
	},
	
	/**
	 * navigate to a specified url, and apply router action simultaneously
	 * @param {string} url
	 */
	navigate: function(url){
		this._route(url, true);
	},
	
	/**
	 * apply the matched router action to the specified url
	 */
	route: function(url){
		this._route(url);
	},
	
	_route: function(url, pushState){
		var data = this._routeUrl2Data(url);
		
		if(data){
		
			// FIXME:
			// fix document.title
			pushState && History.push(data.state, document.title, url);
			data.action(data.state);
		}
	},
	
	// remove: K._overloadSetter(function(matcher, action){
		
	// }),
	
	/**
	 * convert '/page/:page' to regular expression
	 * @param {string} route backbone style string for matching, '/page/:page' for example
	 * @returns {RegExp}
	 */
	_patternToRegExp: function(route){
      	route = route.replace(REGEX_REPLACER_ESCAPE, "\\$&")
					 .replace(REGEX_REPLACER_NAMED_PARAM, "([^\/]*)")
					 .replace(REGEX_REPLACER_SPLAT_PARAM, "(.*?)");
					 
		// the router pattern must be a full matcher
		return new RegExp(route + '$');
    },
    
    /**
     * split and parse a url into a data object
     */
    _routeUrl2Data: function(url){
    	var rules = this._rules,
			i = 0,
			len = rules.length,
			rule,
			result;
		
		for(; i < len; i ++){
			rule = rules[i];
			
			if(result = this._testRule(url, rule)){
				return {
					state: result,
					action: rule.action
				};
			}
		}
    },
    
    /**
     * apply rewrite rule according to the specified url
     * @returns {Object|undefined} parsed url data
     */
    _testRule: function(url, rule){
    	var matched_data, parsed;
    	
    	if(matched_data = url.match(rule.rewrite)){
    		var offset = 0, 
    			regex = REGEX_EXECUTOR_PARAM,
    			matched_key, value;
    		
    		parsed = {};
    		
    		while(matched_key = regex.exec(rule.pattern)){
    			value = matched_data[++ offset];
    		
    			parsed[matched_key[1]] = REGEX_NUMBER.test(value) ? Number(value) : value;
    		}
    	}
    	
    	return parsed;
    }
});


return Router;

});


/**
 change log
 
 2012-03-01  Kael:
 - 
 
 2012-02-29  Kael:
 - refractor .add method, .add will only accept two params, `matcher` and `action`
 - fix a bug routing a url which include a splat param
 
 2012-02-03  Kael:
 - complete main functionalities
 
 
 */
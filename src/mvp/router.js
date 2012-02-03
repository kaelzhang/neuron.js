/**
 * module  mvp/router
 */
KM.define(function(K, require){

var

REGEX_NUMBER = /^(?:\d*\.)?\d+$/,

/**
 * regular expression for route matching
 * credits to [http://documentcloud.github.com/backbone/](backbone)
 */
// escape special symbols
REGEX_ESCAPE = /[-[\]{}()+?.,\\^$|#\s]/g,

// ex: `/page/:page`
REGEX_NAMED_PARAM = /:([\w\d]+)/g,

// matching parameter begins with asterisk symbol(`*`)
// ex: `/page/*page`
REGEX_SPLAT_PARAM = /\*([\w\d]+)/g,


/**
 url rewrite
 
 @param {string|RegExp} matcher of location pathname
 	{string} '/page'
 	{RegExp} /\/page/\d+/
 
 @param {Object} rules {
 	action: {string} action, ex: `'page'`
 	rewrite: {RegExp|string|function()} rewrite rule
 		X {RegExp} return matches
 	 	{string} backbone-style pattern for matching, '/page/:page'
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
	
	add: function(matcher, rule){
		rule || (rule = {});
		
		var self = this;
	
		if(K.isString(matcher)){
			rule.matcher = new RegExp(matcher.replace('\\', '\\\\'));
		}else if(!K.isRegExp(matcher)){
			return self;
		}
		
		self._createRewriteRule(rule) && this._rules.push(rule);
		
		return self;
	},
	
	/**
	 * @param {function()|string} rule
	 	{string} backbone style string
	 	{function()} matching function, returns the matched data object
	 	
	 * @returns {boolean} whether the rewrite rule is invalid
	 */
	_createRewriteRule: function(rule){
		var parsed_rewrite_rule = false,
			rewrite = rule.rewrite;
	
		switch(K._type(rule.rewrite)){
			case 'string':
				parsed_rewrite_rule = this._routeToRegExp(rewrite);
				rule.pattern = rewrite;
				break;
				
			case 'function':
				parsed_rewrite_rule = rewrite;
				break;
		};
		
		return !!(rule.rewrite = parsed_rewrite_rule);
	},
	
	/**
	 * @param {string} route backbone style string for matching, '/page/:page' for example
	 */
	_routeToRegExp: function(route){
      	route = route.replace(REGEX_ESCAPE, "\\$&")
					 .replace(REGEX_NAMED_PARAM, "([^\/]*)")
					 .replace(REGEX_SPLAT_PARAM, "(.*?)");
					 
		// 
		return new RegExp(route + '$');
    },
    
    /**
     * apply rewrite rule according to the specified url
     */
    _applyRule: function(url, rule){
    	var data = {}, matched_data;
    	
    	if(rule.pattern && (matched_data = url.match(rule.rewrite)) ){
    		var offset = 0, 
    			regex = REGEX_NAMED_PARAM,
    			matched_key, value;
    		
    		while(matched_key = regex.exec(rule.pattern)){
    			value = matched_data[++ offset];
    		
    			data[matched_key[1]] = REGEX_NUMBER.test(value) ? Number(value) : value;
    		}
    	
    	}else{
  			data = rule.rewrite(url);
    	}
    	
    	rule.action(data);
    },
	
	route: function(url){
		var rules = this._rules,
			i = 0,
			len = rules.length,
			rule;
		
		for(; i < len; i ++){
			rule = rules[i];
		
			if(rule && rule.matcher.test(url)){
				this._applyRule(url, rule);
				break;
			}
		}
		
		return this;
	}
});


K.mix(Router, {
});


return Router;

});

/**
 change log
 2012-02-03  Kael:
 - complete main functionalities
 
 
 */
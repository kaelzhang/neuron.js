// new Validator(value).add(rule)
// new Validator(value).check()
// Validator.one
DP.define(['./rule'],function (D, require) {

    var Rule = require('./rule');
    // var DEFAULTTYPE = 'all';
    
    /**
     * @name Validator
     * @constructor
     * @param rules {Object} 配置字段
     */
    var Validator = new D.Class({
        Implements: 'events',
        initialize: function (rules) {
            var self = this;
            self.rules = [];
            self.async_rule = null;
            self.async_cache = {};
            rules = D.makeArray(rules);
            rules.forEach(function(rule){
                self.addRule(rule);
            });
        },

        /** addRule
         *  @param name {String|Function}
         *  @param args {Array|Object} ['hint',arg1,arg2...]|{test:function(),hint:'hint'}
         *  @return {Validator}
         */
        addRule: function (rule) {
        	if(rule.async && !this.async_rule){
        		this.async_rule = Rule.produce(rule);
        	}else{
           		this.rules.push(Rule.produce(rule));
            }
            return this;
        },
        
        getRule:function(name){
        	var rules = this.rules;
        	
        	if(D.isNumber(name)){
        		return rules[name];
        	}
        	
        	if(D.isString(name)){
	        	for(var i=0,rule;rule = rules[i];i++){
	        		if(rule.name == name){
	        			return rule;
	        		}
	        	}
        	}
        	
        	return null;
        },
        
        removeRule:function(name){
        	var rules = this.rules;
        	
        	if(D.isNumber(name)){
        		rules.splice(name,i)
        	}
        	
        	if(D.isString(name)){
	        	for(var i=0,rule;rule = rules[i];i++){
	        		if(rule.name == name){
	        			rules.splice(i,1);
	        		}
	        	}
        	}
        	return this;
        },
        
        /** 验证规则
         * @param v {String} value to be valid
         * @return {Object} {passed:{Boolean},hint:{String}}
         */
        check: function (v,cb) {
            var self = this,
                rules = self.rules,
                async_rule = self.async_rule,
                cache = self.async_cache[v],
                ret;
			
			
            //loop temp
            for(var i = 0,rule;rule = rules[i];i++){
                rule = rules[i];
                
                // validate rule;
                // @return {Boolean}
                if(!rule.test(v)){
                	cb({
                		name:rule.name,
                		passed:false,
                		hint:rule.hint
                	});
                	return;
                };
            }
            
            
            if(async_rule){
            	if(cache){
            		cb({
            			name:async_rule.name,
            			passed:cache[0],
            			hint:cache[1]!==undefined ? cache[1] : async_rule.hint
            		});
            	}else{
	            	async_rule.test(v,function(passed,hint){
	            		hint = hint!==undefined ? hint : async_rule.hint;
	            		self.async_cache[v] = [passed,hint];
	            		
	            		if(passed){
	            			cb({
	            				passed:true,
	            				name:null,
	            				hint:null
	            			});
	            		}else{
	            			cb({
			            		passed:false,
		            			name:async_rule.name,
								hint:hint
							});
	            		}
	            		
	            	});
            	}
            }else{
				cb({
					passed:true,
					hint:null,
					name:null
				});
			}
        }
    });

    return Validator;

});



// Change log 
// 2011-12-27 纠结于是否要把hint作为参数放到rule的check中去
/**             accept
 *                   1. name:'hint'
 *                   2. name:['hint',args...]
 *                   3. name:{hint:'hint',test:function(){}}
 */


/**
 
Review
2011-08-23  Kael:
- incorrect regexp for number and email
- plz remove the dependency on 'io/request'
- use DP.log(msg, 'warn') instead of throw, and abandon invalid rules


*/

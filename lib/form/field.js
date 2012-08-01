DP.define(['./validator'], function (D, require) {

    var Validator = require('./validator');
    
    var EVENT_PRESETS = {
        "star-rating": {
            "hint": "picking",
            "check": "select"
        },
        "textfield": {
            "hint": "focus",
            "check": "blur"
        },
        "select": {
            "hint": "click",
            "check": "change"
        }
    }
	
	var DOM_TYPE_MAP = {
        "select":"select",
        "textarea":"textfield",
        "input":{
            "radio":"radio",
            "checkbox":"checkbox"
        }
    };
    
    var $ = D.DOM;
    
	
    /**
     * @param elem {DOM}
     *  
    **/
    function getTypeOfDomElement(elem){    
        var el = elem.get(0),
            map = DOM_TYPE_MAP,
            tag = el.tagName.toLowerCase(),
            type = el.getAttribute('type');

        return (D.isString(map[tag]) ? map[tag] : map[tag][type]) || "textfield";
    }
	

    var Field = D.Class({

        Implements: 'events attrs',

        /**
        * @param elem {DOM|newClass}
        * @param opt {Object} 
        **/
        initialize: function (elem, option) {
            var self = this;
            
            elem = $.one(elem);
            
            self.elem = elem;
            self.hint = option.hint;
            
            self.set('type',elem);
            self.set('rules',option.rules);
			self.set('name',option.name);
            self.set('checkEvents',option.checkEvents);
            self.set('hintEvents',option.hintEvents);
            
			self.validator = new Validator(self.get("rules"));
            
            self._bindCheck();
            self._bindHint();
        },
        

        /**
        * @private
        */
        _bindHint: function () {
            var self = this,
            	elem = self.elem,
                hintEvents = self.get("hintEvents");
            	
			hintEvents.forEach(function (ev) {
                elem.on(ev, function () {
                    self.fire('hint',{
                    	elem:elem,
                    	text:self.hint
                    });
                });
            });
            
        },
        

        /**
        * @private
        */
        _bindCheck: function () {
            var self = this,
            	elem = self.elem,
                checkEvents = self.get("checkEvents");

            checkEvents.forEach(function (ev) {
                elem.on(ev, function () {
                    self.check();
                });
            });
        },

        addRule: function (rule) {
            this.validator.addRule(rule);
        },

        val:function(v){
        	if(!v){
        		return this.elem.val();
        	}else{
        		return this.elem.val(v);
        	}
        },
        
        
        check: function (cb) {
        	var self = this;
            
            self.validator.check(this.val(),function(res){
            	cb && cb(res.passed);
				self.fire('checked',{
	                elem: self.elem,
					name: res.name,
	                hint: res.hint,
	                passed: res.passed
	            });
			});
        }

    });

    D.Class.setAttrs(Field, {
    	rules:{
    		value:[],
    		setter:function(v){
    			return D.makeArray(v);
    		}
    	},
        type:{
            setter:function(elem){
                return elem.type || getTypeOfDomElement(elem);
            }
        },
        name:{
        	setter:function(v){
        		return v || "dp_field_" + D.guid();
        	}
        },
        checkEvents:{
        	setter:function(v){
        		var checkEvents = v,
        			type = this.get("type");
        		
        		return checkEvents || D.makeArray(EVENT_PRESETS[type]["check"]);
        	}
        },
        hintEvents:{
        	setter:function(v){
        		var checkEvents = this.get("hintEvents"),
        			type = this.get("type");
        		
        		return checkEvents || D.makeArray(EVENT_PRESETS[type]["hint"]);
        	}
        }
    })

    return Field;
});



/*
    if (remoteRules = this._needRemote(rules)) {
        remoteRules.forEach(function (rule) {
            validator.addRule({
                test: new Remote(self, rule),
                'hint': rule.hint
            });
        });
    }
*/
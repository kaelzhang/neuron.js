/**
 * @module  validator
 * method to check a value
 * form/validator will NOT deal with business relevant to form elements, error display and value getter any more.
 */


KM.define([], function(K, require){


/**
 * 'required max-length:10' -> ['required', 'maxlength:10']
 * function(){} -> [function(){}]
 */
function splitIfString(obj, splitter){
	return K.isString(obj) ? obj.trim().split(splitter || ',') : K.makeArray(obj);
};


/**
 * count how many elements has been checked
 */ 
function checkedCounter(elements, onlyCheckExists){
	var i = 0, len = elements.length,
		counter = 0;
	
	for(; i < len; i ++){
		if(elements[i].checked){
			++ counter; 
			if(onlyCheckExists){
				break;
			}
		}
	}
	return counter;
};


/**
 * 
 */
 
/*
 
function smartSelector(id, single){	
	return K.isString(id) ? REGEX_IS_CSS_SELECTOR.test(id) ? single ? $$(id)[0] : $$(id) : $(id) : id;
};

*/

function addValidator(name, module, branch){
	validators[branch || DEFAULT_VALIDATOR_TYPE][name] = module;
};


var undef,
	REGEX_IS_CSS_SELECTOR = /^(?:\.|#)/,
	REGEX_IS_EMAIL = /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]\.?){0,63}[a-z0-9!#$%&'*+\/=?^_`{|}~-]@(?:(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\])$/i,
	
	DEFAULT_VALIDATOR_TYPE = 'input',
	
	Validator,
	AjaxChain,

	// preset validators for input element
	validators = {
		input: {
			'max-length': {
				test: function(v, prop){
					return v.length <= prop;
				}
			},
			
			'min-length': {
				test: function(v, prop){
					return v.length >= prop;
				}
			},
			
			'required': {
				test: function(v){
					return !!v;
				}
			},
			
			'email': {
				test: function(v){
					return REGEX_IS_EMAIL.test(v);
				}
			},
			
			'regex': {
				test: function(v, prop){
					return ( K.isRegExp(prop) ? prop : new RegExp(prop) ).test(v);
				}
			},
			
			'capcha': {
				test: function(v){
					return !!v;
				}
			}
		},
		
		checkbox: {
			'required': {
				test: function(elements){
					return checkedCounter(elements, true);
				}
			}
		},
		
		radio: {
			'required': {
				test: function(elements){
					return checkedCounter(elements, true);
				}
			}
		}
	},
	
	validator_presets_get_checkbox = function(){
		var ret = [];
	
		this.element.each(function(i){
			if(i.checked){
				ret.push(i.value);
			}
		});
		
		return ret.join(this.options.splitter || '|');
	},
	
	validator_presets_getCheckObj_checkbox = function(){
		return this.element;
	},
		
	validator_presets = {
		checkOnBlur: true,
		showErrOnBlur: true,
		trim: true,
		errCls: 'err-input',
		
		// module is prior to element attribute
		testRuleAttr: 'data-validate-rule',
		errMsgAttr: 'data-err-msg',
		
		enableHTML5: true
	},
	
	validator_method_presets = {
		
		_get: {
			input: function(){
				var v = this.element.get('value');
			
				return this.options.trim ? v.trim() : v;
			},
			
			checkbox: validator_presets_get_checkbox,
			radio: validator_presets_get_checkbox
		},
		
		_set: {
			input: function(value){
				return (this.element.value = value, this);
			},
			
			/**
			 * @param sets
			 *		{Array} [0, 1, 0, 1, 0]
			 *		{}
			 * @param reverse {Boolean} 
			 */
			checkbox: function(sets){
				var self = this,
					checkboxes = self.element,
					setAll = K.isBoolean(sets) || sets === 1 || sets === 0,
					reverse = sets === 'reverse';
				
				checkboxes.each(function(c, i){
					c.checked = reverse ? !c.checked : setAll ? sets : sets[i];
				});
				
				return self;
			},
			
			radio: function(index){
				var el = this.element[index];
				
				if(el){
					el.checked = true;
				}
				
				return this;
			}
		},
		
		_getCheckObj: {
			input: function(){
				return this.val();
			},
			
			checkbox: validator_presets_getCheckObj_checkbox,
			radio: validator_presets_getCheckObj_checkbox
		},
	};
	
	
AjaxChain = new Class({
	Implements: Chain,
	
	clearChain: function(fn){
		if(K.isFunction(fn)){
			
		}
	
		this.$chain.empty();
		return this;
	}
});

/**
 <code> 
 	var v = new Validator(validate_rules, options);
 	v.check('my input');
 </code>
 
 
 static method >>>>
 
 {1.}
 create new validator preset
 static.add(name, module, branch);
 
 instance method >>>>
 
 {1.}
 add new validator
 instance.add(rule, errMsg)
 add a validate rule
 
 {2.}
 instance.parseHTML(element)
 
 {3.}
 check the value
 instance.check(value);
 instance.check(radio[s]);
 instance.check(checkbox[es]);
 
 
 */
	
/**
 * @constructor
 * 
 */	
Validator = new Class({
	
	Implements: [Options, Events],
	
	_errMsg: [],
	_tests: [],
	
	/**
	 @param {Object} options {
	 	onAfterCheck: {Function}
	 }
	 
	 */
	initialize: function(options){
	
		var self = this;
		
		self.setOptions(validator_presets, options);
			
		// bind public methods
		bind('parseHTML', self);
		bind('check', self);
		bind('add', self);	
	},
	
	/**
	 * @param type {String} check type of the current form fields. 
	 *	available for 'input', 'checkbox', 'radio' 
	 */
	_config: function(type){
		var self = this,
			o = self.options;
		
		self._config = NOOP;
		
	},	
	
	/**
	 * parse the HTML to fetch validating rules
	 */
	parseHTML: function(element){
				
	},
	
	/**
	 * @param showErr {Boolean} default to true. whether deal with err message after checking
	 */
	check: function(v, element){
		var self = this,
			i = 0,
			tests = self._tests,
			len = tests.length,
			test,
			pass = true,
			err_msg;
			
		for(; i < len; i ++){
			test = tests[i];
			
/**
 ajax rule for validation {
 	ajax: true,
 	
 	// @type {Function(): (KM.ajax)}
 	// @param {String} v the value to be checked
 	// @param {Function(this:element)} cb callback function(isPassed, errorMsg){}
 	//		@param {Boolean} isPassed is ajax checking passed
 	//		@param {String=}
 	test: function(v, cb){}
 }
 
 <code>
 myValidator.add({
 	ajax: true,
 	test: function(v, cb){
 		return new Ajax({
 			url: '...',
 			data: {
 				username: v
 			}
 			onSuccess: function(r){
 				cb(r.pass, r.msg);
 			}
 		});
 	}
 }, 'username already taken');
 
 </code>
 */
			if(test.ajax === true){
				self.lastAjax = test(v, function(isPassed, msg){
				
					// for sync httprequest
					if(!isPassed){
						pass = false;
					}
					
					// self.fireEvent('afterCheck', [pass, msg]);
				});
				
			// normal check
			
			/**
			 * TODO:
			 * store the lastest errMsg
			 * if current errMsg is undef use the last one
			 */
			}else{
				self.lastAjax && self.lastAjax.cancel();
				if(!test(v)){
					pass = false;
				}
				
				// self.fireEvent('afterCheck', [pass, msg]);
			}
			
			if(!pass){
				break;
			}
		}
			
		return pass;
	},
	
	
/**
 @param {String|RegExp|Function|Object} module
 	{String} preset validate rule
 	{RegExp} regular expression for testing
 	{Function} validation function(v){}
 		
 	{Object} {
 		ajax: {Boolean}
 		test: 
 	}
 */
	add: function(module, errMsg){
		var self = this, prop, test, rule_method, regex;
		
		// module presets
		switch( K._type(module) ){
		
			// add('max-length:10', '{value} is longer than 10')
			// 'max-length:10' -> prop = 10, validators[...]['max-length']
			case 'string':
				module = module.split(':');
				prop = (module[1] || '').trim();
				module = validators[self._type][ module[0].trim() ];
				
				break;
				
			case 'regexp':
				regex = module;
				module = {
					test: function(v){
						return regex.test(v);
					}
				};
				
			case 'function':
				module = {
					test: module
				};
				
				break;
		}
		
		if(
			module &&
			module.test && 
			(!module.condition || module.condition(self.element) )
		){
			
			rule_method = function(v){
				return module.test(v, prop);
			};
			
			if(module.ajax){
				rule_method.ajax = true;
				rule_method.chain = module.chain;
			}
			
			self._tests.push(rule_method);
			self._errMsg.push(errMsg);
		}
	}
});

Validator.add = addValidator;
	
return Validator;

});


/**
 TODO:
 - remove public method val, showErr. Validator will only deal with ONE thing, i.e. form checking
 - public APIs: instance.check, instance.add, static.add
 - add oncheck event in instance.check method, remove instance._fail

 
 @change-log:
 2011-06-15  Kael
 - refractor, migrate to loader module
 
 2011-05-04  Kael:
 - change type-detecting method
 2011-04-14  Kael:
 - basic functionality
 */
KM.define(['util/class', './core'], function(K, require){


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
function smartSelector(id, single){	
	return K.isString(id) ? REGEX_IS_CSS_SELECTOR.test(id) ? single ? $$(id)[0] : $$(id) : $(id) : id;
};


function addValidator(name, module, branch){
	validators[branch || DEFAULT_VALIDATOR_TYPE][name] = module;
};


var undef,
	REGEX_IS_CSS_SELECTOR = /^(?:\.|#)/,
	REGEX_IS_EMAIL = /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]\.?){0,63}[a-z0-9!#$%&'*+\/=?^_`{|}~-]@(?:(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\])$/i,
	
	DEFAULT_VALIDATOR_TYPE = 'input',
	
	Validator,

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

/**
 
 	new KM.Form.Validator('email', 'email-err', {
 		test: ['required', function(v){}],
 		errMsg: ['input is require', '{value} is xxx']
 	});
 	 
 */
	
/**
 * @constructor
 * 
 */	
Validator = new Class({
	
	Implements: 'options',
	
	_errMsg: [],
	_tests: [],
	 
	/**
	 * TODO:
	 * transfer the slice of lines into html5-enabler.js
	 * refraction
	 */
	 
	 /*

	_HTML5: function(){
		var self = this,
			placeholder = self.element.getAttribute('placeholder');
	
		if(placeholder){
			// new Form.Placeholder(element, {valSetter: self._getter});
		}
	},
*/

	initialize: function(element, errHolder, module, options){
		element = smartSelector(element, true);
		errHolder = smartSelector(errHolder, true);
		
		if(element){
			var self = this,
				o = self.setOptions(options, validator_presets),
				tests, errMsg,
				bind = K.bind,
				
				check_type = module && module.type,
				is_normal_field = true;
				
			if(check_type === 'checkbox' || check_type === 'radio'){
				element = element.getElements('input[type=' + check_type + ']');
				is_normal_field = false;
			}
								
			self.element = element;
			self.errHolder = errHolder;
			
			if(is_normal_field && o.enableHTML5){
				// self._HTML5();
			}	
				
			if(!check_type && K._type(element, true) === 'element'){
				check_type = DEFAULT_VALIDATOR_TYPE;
			}
				
			self._config(check_type);
			
			if(is_normal_field && !module && element){	
				tests = element.getAttribute(o.testRuleAttr).replace(/\\\\/g, '\\');
				errMsg = element.getAttribute(o.errMsgAttr);
			}else{
				tests = module.test;
				errMsg = module.errMsg;
			}
			
			console.log(tests, errMsg);
			
			// if no validate rules, always return true
			tests = splitIfString(tests || function(){return true});
			
			errMsg = splitIfString(errMsg || []);
			
			tests.each(function(test, index){
				self.add(test, errMsg[index]);
			});
			
			/**
			 * TODO:
			 * other types of elements
			 */
			if(o.checkOnBlur){
				element.addEvent('blur', function(){
					self.check(o.showErrOnBlur);
				});
			};
			
			// bind public methods
			bind('val', self);
			bind('check', self);
			bind('add', self);	
		}
	},
	
	/**
	 * @param type {String} check type of the current form fields. 
	 *	available for 'input', 'checkbox', 'radio' 
	 */
	_config: function(type){
		var self = this,
			o = self.options;
			
		if(!type){
			throw new TypeError('Form.Validator: invalid validate type');
		}
			
		self._type = type;
		self._getCheckObj = validator_method_presets._getCheckObj[type];
		self._getter( o.getter || validator_method_presets._get[type] );
		self._setter( o.setter || validator_method_presets._get[type] );
			
		delete o.getter;
		delete o.setter;
	},
	
	showErr: function(msg){
		var errHolder = this.errHolder;
		
		errHolder && errHolder.set('html', msg || '');
	},
	
	/**
	 * @getter
	 * @setter
	 */
	val: function(value){
		var self = this;
		
		return value === undef ? self._get()
			: self._set(value);
	},
	
	_getter: function(fn){
		if(K.isFunction(fn)){
			this._set = fn;
		}
	},
	
	_setter: function(fn){
		if(K.isFunction(fn)){
			this._get = fn;
		}
	},
	
	
	/**
	 * @param showErr {Boolean} default to true. whether deal with err message after checking
	 */
	check: function(showErr){
		var self = this,
			i = 0, 
			tests = self._tests,
			len = tests.length,
			test,
			pass = true,
			
			v = self._getCheckObj();
			
		for(; i < len; i ++){
			test = tests[i];
			
			// ajax check
			if(test.ajax === true){
				test(v, function(_pass, errMsg){
					if(!_pass){
						pass = false;
						self._fail(showErr, errMsg, v);
					}
				});
				
			// normal check
			
			/**
			 * TODO:
			 * store the lastest errMsg
			 * if current errMsg is undef use the last one
			 */
			}else if(!test(v)){
				pass = false;
				self._fail(showErr, self._errMsg[i], v);
			}
			
			if(!pass){
				break;
			}
		}
		
		if(pass){
			self.showErr();
		}
			
		return pass;
	},

	_fail: function(showErr, errMsg, v){
		var self = this;
		
		self.element.addClass(self.options.errCls);
		self.showErr( ( (showErr || showErr === undef) && errMsg ).substitute({value:v}) );
	},
	
	add: function(module, errMsg){
		var self = this, prop, test, rule_method, regex;
		
		// module presets
		switch( K._type(module) ){
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
			
			if(module.ajax || module.test.ajax){
				rule_method.ajax = true;
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

 
 @change-log:
 2011-06-15  Kael
 - refractor, migrate to loader module
 
 2011-05-04  Kael:
 - change type-detecting method
 2011-04-14  Kael:
 - basic functionality
 */
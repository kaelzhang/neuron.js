KM.define([], function(K){

function isInputable(element){
	return element.match('input') || element.match('textarea');
};

/**
 * 'required max-length:10' -> ['required', 'maxlength:10']
 * function(){} -> [function(){}]
 */
function splitIfString(obj, splitter){
	return K._type(obj) === 'string' ? obj.trim().split(splitter || ',') : K.makeArray(obj);
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

function bind_method(fn, bind){
	return function(){
		return fn.apply(bind, arguments);
	}
};

function bind(fn, bind){
	return K.isFunction(fn) ?
		bind_method(fn, bind)
	:
		(bind[fn] = bind_method(bind[fn], bind));
};


/**
 * 
 */
function smartSelector(id){	
	return K.isString(id) ? REGEX_IS_CSS_SELECTOR.test(id) ? $$(id) : $(id) : id;
};


function addValidator(name, module, branch){
	validators[branch || DEFAULT_VALIDATOR_TYPE][name] = module;
};


var REGEX_IS_CSS_SELECTOR = /^(?:\.|#)/,
    REGEX_IS_EMAIL = /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]\.?){0,63}[a-z0-9!#$%&'*+\/=?^_`{|}~-]@(?:(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\])$/i,

	DEFAULT_VALIDATOR_TYPE = 'input',

	Form = {}, 
	Validator,
	Complex,

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
					return ( K._type(prop) === 'regexp' ? prop : new RegExp(prop) ).test(v);
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
	
	validator_presets_val_checkbox = function(){
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
		showMsgOnBlur: true,
		trim: true,
		errCls: 'err-input',
        errHideCls: 'Hide',
		
		// module is prior to element attribute
		testRuleAttr: 'data-validate-rule',
		errMsgAttr: 'data-err-msg',
		
		_Val: {
			input: function(){
				var v = this.element.get('value');
			
				return this.options.trim ? v.trim() : v;
			},
			
			checkbox: validator_presets_val_checkbox,
			radio: validator_presets_val_checkbox
		},
		
		_getCheckObj: {
			input: function(){
				return this.val();
			},
			
			checkbox: validator_presets_getCheckObj_checkbox,
			radio: validator_presets_getCheckObj_checkbox
		}
	},
	
	complex_presets = {
		enableHTML5: true,
		CSPrefix: '',
		errCSSuffix: '-err',
		showAllErr: false
	};
	
/**
 * @constructor
 * 
 */	
Validator = new Class({
	
	Implements: Options,
	
	/**
	 
	 	new KM.Form.Validator('email', 'email-err', {
	 		test: ['required', function(v){}],
	 		errMsg: ['input is require', '{value} is xxx']
	 	});
	 	 
	 */

	initialize: function(element, errHolder, module, options){
		element = smartSelector(element);
		errHolder = $(errHolder);
		
		if(element){
			var self = this,
				o,
				tests, errMsg,
				type = K._type,
				B = bind,
				
				check_type = module.type;

            self.setOptions(validator_presets, options);
            o = self.options;
				
			if(!check_type && type(element) === 'element'){
				check_type = DEFAULT_VALIDATOR_TYPE;
			}
				
			self._config(check_type);
					
			self.element = element;
			self.errHolder = errHolder;
			
			if(!module && element){	
				tests = element.getAttribute(o.testRuleAttr).replace(/\\\\/g, '\\');
				errMsg = element.getAttribute(o.errMsgAttr);
			}else{
				tests = module.test;
				errMsg = module.errMsg;
			}
			
			// if no validate rules, always return true
			tests = splitIfString(tests || function(){return true});
			
			errMsg = splitIfString(errMsg || []);
			
			tests.each(function(test, index){
				self.addValidator(test, errMsg[index]);
			});
			
			/**
			 * TODO:
			 * other types of elements
			 */
			if(o.checkOnBlur){
				element.addEvent('blur', function(){
					self.check(o.showMsgOnBlur);
				});
			};
			
			// bind public methods
			B('val', self);
			B('check', self);
			B('addValidator', self);	
		}
	},
	
	_config: function(type){
		var self = this,
			o = self.options;
			
		if(!type){
			throw new TypeError('Form.Validator: invalid validate type');
		}
			
		self._type = type;
		self._getCheckObj = validator_presets._getCheckObj[type];
		self._val = o.getVal || validator_presets._Val[type];
			
		delete o.getVal;
	},
	
	_errMsg: [],
	
	_tests: [],
	
	showMsg: function(msg){
		var errHolder = this.errHolder,
            o = this.options;

        msg = msg || '';
		
		if(errHolder){
            errHolder[msg ? 'removeClass' : 'addClass'](o.errHideCls).set('html', msg);
        }
	},
	
	/**
	 * @getter
	 * @setter
	 */
	val: function(getter){
		var self = this;
		
		return K._type(getter) === 'function' ?
			(self._val = getter, self)
			: self._val.call(self);
	},
	
	
	/**
	 * @param showMsg {Boolean} default to true. whether deal with err message after checking
	 */
	check: function(showMsg){
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
						showMsg && self._fail(showMsg, errMsg, v);
					}
				});
				
			// normal check
			}else if(!test(v)){
				pass = false;
				showMsg && self._fail(showMsg, self._errMsg[i], v);
			}
			
			if(!pass){
				break;
			}
		}
		
		if(pass){
			showMsg && self.showMsg();
		}
			
		return pass;
	},

	_fail: function(showMsg, errMsg, v){
		var self = this;
		
		self.element[showMsg ? 'addClass' : 'removeClass'](self.options.errCls);
		(showMsg || showMsg === undef) && self.showMsg( (errMsg || '').substitute({value:v}) );
	},
	
	addValidator: function(module, errMsg){
		var self = this, prop, test, rule_method;
		
		// module presets
		switch( K._type(module) ){
			case 'string':
				module = module.split(':');
				prop = (module[1] || '').trim();
				module = validators[self._type][ module[0].trim() ];
				
				break;
				
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
			
			rule_method = function(){
				return module.test.apply(null, arguments);
			};
			
			if(module.ajax || module.test.ajax){
				rule_method.ajax = true;
			}
			
			self._tests.push(rule_method);
			
			self._errMsg.push(errMsg);
		}
	}
});


/**
 * @constructor
 
 * TODO:
 * method to set err msg for all fields
 */	
Complex = new Class({

	_vals: {},
	_checks: [],
	
	
	/**
	 * TODO:
	 * transfer the slice of lines into html5-enabler.js
	 * refraction
	 */
	_HTML5: function(element, validator){
		// var placeholder = element.getAttribute('placeholder');
	
		// if(placeholder){
		//	new Form.Placeholder(element, {valSetter: validator.val});
		// }
	},
	
	Implements: Options,
	
	initialize: function(wrap, module, options){
		var self = this,
			o,
			modname,
			mod,
			modCS;

        self.setOptions(complex_presets, options);
        o = self.options;

		wrap = $(wrap);
		
		if(wrap){		
			for(modname in module){
				mod = module[modname];
				modCS = mod.CS || modname;
			
				self.add(
					wrap.getElement( o.CSPrefix + modCS ), 
					wrap.getElement( o.CSPrefix + (mod.errCS || (modCS + o.errCSSuffix) ) ),
					modname, 
					mod,
					options
				);
			}
		}
	},
	
	add: function(selector, errHolder, modname, mod, options){
		element = $(selector);
		errHolder = $(errHolder);
		
        if(element){
	        var self = this,
		        validator,
		        is_normal_field = true;
		
	        /**
		        * TODO:
		        * transfer to Validator
		        */
	        if(mod.type === 'checkbox' || mod.type === 'radio'){
		        element = element.getElements('input[type=' + mod.type + ']');
		        is_normal_field = false;
	        }
		
	        validator = new Validator(element, errHolder, mod, options);
		
	        if(is_normal_field){		
		        self.options.enableHTML5 && self._HTML5(element, validator);
	        }
		
	        self._checks.push(validator.check);
	        self._vals[modname] = validator.val;
        }
		
		return self;
	},
	
	check: function(showMsg){
        showMsg = showMsg || showMsg === undefined;

		var self = this,
			show_all_err = self.options.showAllErr,
			i = 0,
			pass = true,
			len = self._checks.length,
			check;
			
		for(; i < len; i ++){
			check = self._checks[i];
			
			// check first
			pass = check(showMsg) && pass;
			
			if(!pass && !show_all_err){
				break;
			}
		}
			
		return pass;
	},
	
	val: function(isQueryString){
		var ret = {}, key, vals = this._vals;
		
		for(key in vals){
			ret[key] = vals[key]();
		}
		
		return isQueryString ? K.toQueryString(ret) : ret;
	}

});	
	

Form.addValidator = addValidator;
Form.Validator = Validator;
Form.Complex = Complex;

return Form;

});


/**
 * TODO:
 *
 * 1. 事件支持，用于同其他组件的通信。
     注册表单事件


 * 2. 整理与配置相关的代码
 
 * @change-log:
 * 2011-04-14  Kael:
 * - 完成基本功能
 */
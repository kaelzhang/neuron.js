/**
 * module  biz
 * method for business requirement
 */

;(function(K){

// --- method for KM.data ----------------------- *\
function setData(data){
	data && K.mix(stored_data, data);
};

function cloneData(){
	return K.clone(stored_data);
};

function getData(name){
	return stored_data[name];
};
// --- /method for KM.data ----------------------- *\


// @this {Array}
function applyBusinessModules(){
	makeArray(this).forEach(function(mod){
		K.provide(mod, function(K, modExports){
			modExports && modExports.init && modExports.init();
		});
	});
};

	// @type {Object}
var stored_data = {},
	biz_modules = [],
	makeArray = K.makeArray,
	undef;


/**
 * module  data

 * setter
 * getter

 * usage:
 * 1. KM.data()                     returns the shadow copy of the current data stack
 * 2. KM.data('abc')                returns the data named 'abc'
 * 3. KM.data('abc', 123)           set the value of 'abc' as 123
 * 4. KM.data({abc: 123, edf:456})  batch setter
 *
 * @param {all=} value 
 */
K.data = function(name, value){
	var type = K._type(name),
		empty_obj = {},
		is_getter, ret;
	
	if(name === undef){
		ret = cloneData(); // get: return shadow copy
		is_getter = true;

	}else if(type === 'string'){
		if(value === undef){
			ret = getData(name); // get: return the value of name
			is_getter = true;
		}else{
			empty_obj[name] = value;
			setData(empty_obj) // set
		}

	}else if(type === 'object'){
		setData(name); // set
	}

	return is_getter ? ret : K;
};


/**
 * attach a module for business requirement, for configurations of inline scripts
 * if wanna a certain biz module to automatically initialized, the module's exports should contain a method named 'init'
 */
K.bizRequire = function(){
	var stack = biz_modules,
		args = arguments;

	stack ? makeArray(args, stack) : applyBusinessModules.call(args);
};


// initialize all biz mods after domready
K.ready(function(K, U){
	var stack = biz_modules;
	
	applyBusinessModules.call(stack);
	
	// destroy stack
	stack.length = 0;
	biz_modules = U;
});


})(KM);


/**
 change log:
 
 2011-10-13  Kael:
 - move KM.data to biz.js
 - add KM.bizRequire method to automatically provide a batch of specified modules
 
 TODO:
 A. add a method to fake a global function to put its invocations into a queue until the real implementation attached
 
 */
/**
 * module  mvp/converter
 * method to convert between query string and object according to the convention specified by Neuron Framework
 */

NR.define(function(K){


/**
 * @param {Object} obj
 * example: 
 	{
 		page: {id: 23, refresh: 1},
 		tag: 'food',
 		poi: ['abc', 123]
 	}
 	
 	-> page/id=23,refresh=1&tag/food&poi/abc,123
 */
function encodeObject2Query(obj){
	var ret = [];
	
	/**
	 * key: value
	 * split key and value of the object
	 */
	K.each(obj, function(value, key){
		var parsed;
	
		if(K.isPlainObject(value)){
			parsed = [];
		
			// {a:1, b:'2'}		-> 'a=1,b=2'
			// {a:1, b:[]}		-> 'a=1'
			K.each(value, function(v, k){
				if(K.isNumber(v) || K.isString(v)){
					parsed.push(k + '=' + v);
				}
			});
			
			parsed = parsed.join(',');
			
		}else{
			// 123 				-> '123'
			// '123' 			-> '123'
			// [123, '234'] 	-> '123,234'
			// [123, '234', {}] -> '123,234'
			parsed = K.makeArray(value).map(function(v){
			
					// if the argument is a bool, convert it to 1 or 0	
					return K.isBoolean(v) ? v ? 1 : 0 : v;
					
				}).filter(function(v){
					return K.isNumber(v) || K.isString(v);
					
				}).join(',');
		}
		
		ret.push(key + '/' + parsed);
	});
	
	return ret.join('&');
};


/**
 * convert a query string to object, the conversed method of encodeObject2Query
 * @param {string} query
 */
function decodeQuery2Object(query){
	var obj = {};
	
	K.isString(query) && query.split('&').forEach(function(q){
		q = q.trim();
		
		if(q){
		
			// only split the first '/'(slash)
			// src/i/1.jpg 		-> {src: 'i/1.jpg'}
			// img/src=i/1.jpg	-> {img: {src: 'i/1.jpg'}}
			var index = q.indexOf('/');
			obj[q.substr(0, index)] = _decodeQueryArguments(q.substr(++ index));
		}
	});
	
	return obj;
};


/**
 @param {string} query

 cases:
 1. '123' 						-> 123;
 2. '123,234,345' 				-> [ 123, 234, 345 ];
 3. 'param1=123,param2=234' 	-> [ { param1:123, param2: 234} ];
 */
function _decodeQueryArguments(query){
	var ret = [],
		args,
		SPLITTER_OBJECT_KEY_VALUE = '=';
	
	query = String(query);
	
	if(query){
	
		// '123, 234, abc' -> [123, 234, 'abc']
		// 'param1=123, param2=234' -> ['param1=123', 'param2=234']
		args = _splitNClean(query);
		
		// case 1:
		// case 2:
		if( query.indexOf(SPLITTER_OBJECT_KEY_VALUE) === -1){
		
			// [123] 		-> 123
			// [123, 234]	-> [123, 234]
			ret = args.length === 1 ? args[0] : args;
		
		// case 3:
		}else{
			ret = {};
			
			args.forEach(function(i){
				i = i.split(SPLITTER_OBJECT_KEY_VALUE);
				
				if(i.length === 2 && i[0]){
					var v = i[1];
				
					ret[i[0]] = REGEX_NUMBER.test(v) ? Number(v) : v;
				}
			});
		}
	}
	
	return ret;
};


/**
 * do 2 things:
 * - split a string into an array and trim every item
 * - convert string of numbers to Numbers
 */
function _splitNClean(string){
	var ret = [];

	string.split(',').forEach(function(s){
		s = s.trim();
		
		if(s || s === ''){
			ret.push( REGEX_NUMBER.test(s) ? Number(s) : s );
		}
	});
	
	return ret;
};


var

// 12	-> true
// 1.2	-> true
// 0.2	-> true	
// .12	-> true
// 12.	-> false
REGEX_NUMBER = /^(?:\d*\.)?\d+$/;


return {
	toQuery: encodeObject2Query,
	toObject: decodeQuery2Object
};


});
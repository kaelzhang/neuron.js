<script>

describe('Neuron:Seed', function(){

	// KM
	describe('global namespace: KM', function(){
		it('should not override existed namespace', function(){
			expect(KM.oldValue).toEqual(OLD_VALUE);
		})
	});
	
	describe('KM.isXXX methods', function(){
	
		// KM.isBoolean()
		it('could detect Boolean type', function(){
			var TRUE = true,
				FALSE = false,
				NULL = null,
				NOT_ONE = !1,
				BOOLEAN = 'boolean';
				
			function test_call(){
				expect(KM.isBoolean(this)).toBeTruthy();
			}
				
			expect(KM.isBoolean(TRUE)).toBeTruthy();
			expect(KM.isBoolean(FALSE)).toBeTruthy();
			expect(KM.isBoolean(NULL)).toBeFalsy();
			expect(KM.isBoolean(NOT_ONE)).toBeTruthy();
			test_call.call(true);
			test_call.apply(false, [1, 2, 3]);
		});
		
		
		// KM.isNumber()
		it('could detect Number type', function(){
			var ONE = 1,
				INFINITY = Number.POSITIVE_INFINITY
				
			expect(KM.isNumber(INFINITY)).toBeTruthy();
			expect(KM.isNumber(ONE)).toBeTruthy();
			expect(KM.isNumber('')).toBeFalsy();
			expect(KM.isNumber(undefined)).toBeFalsy();
		});
		
		
		// KM.isString()
		it('could detect String type', function(){
				
			expect(KM.isString('')).toBeTruthy();
			expect(KM.isString('0')).toBeTruthy();
			expect(KM.isString()).toBeFalsy();
			expect(KM.isString(undefined)).toBeFalsy();
		});
		
		// KM.isFunction()
		it('could detect Function type', function(){
		
			function C(){
			};
			
			C.prototype = [];
				
			expect(KM.isFunction(function(){})).toBeTruthy();
			expect(KM.isFunction(C)).toBeTruthy();
			
			// window.setInterval is Object type in IE
			// expect(KM.isFunction(window.setInterval)).toBeTruthy();
			
			expect(KM.isFunction(/abc/)).toBeFalsy();
		});
		
		
		// KM.isArray()
		it('could detect Array type', function(){
		
			function C(){
			};
			
			C.prototype = [];
				
			expect(KM.isArray( [1, 2, 3] )).toBeTruthy();
			expect(KM.isArray( [] )).toBeTruthy();
			expect(KM.isArray( /abc/ )).toBeFalsy();
			expect(KM.isArray( document.getElementsByTagName('p') )).toBeFalsy();
			
			// !important
			// new C is an object, not a pure array
			expect(KM.isArray( new C )).toBeFalsy();
		});
		
		
		// KM.isDate()
		it('could detect Date type', function(){
				
			expect(KM.isDate( new Date )).toBeTruthy();
		});
		
		// KM.isRegExp()
		it('could detect RegExp type', function(){
				
			expect(KM.isRegExp( new RegExp('abc') )).toBeTruthy();
			expect(KM.isRegExp( /abc/ )).toBeTruthy();
		});
		
		
		// KM.isObject()
		it('could detect Object type', function(){
		
			function C(){}
			
			C.prototype = {
				a: 1
			}
				
			expect(KM.isObject( {a:1} )).toBeTruthy();
			expect(KM.isObject( new C )).toBeTruthy();
			expect(KM.isObject( document.getElementsByTagName('p') )).toBeTruthy();
			expect(KM.isObject( document.getElementsByTagName('p')[0] )).toBeTruthy();
			expect(KM.isObject( window ) ).toBeTruthy();
			expect(KM.isObject( document ) ).toBeTruthy();
			expect(KM.isObject( document.documentElement ) ).toBeTruthy();
			expect(KM.isObject( document.getElementsByTagName('head')[0] ) ).toBeTruthy();
			
			
			// Object.prototype.toString: in IE
			// undefined 	-> [object Object]
			// null 		-> [object Object]
			
			expect(KM.isObject( undefined )).toBeFalsy();
			expect(KM.isObject( null )).toBeFalsy();
		});
		
		
		// KM.isPlainObject()
		it('could detect PlainObject type', function(){
		
			function C(){}
			
			C.prototype = {
				a: 1
			}
				
			expect(KM.isPlainObject( {a:1} )).toBeTruthy();
			expect(KM.isPlainObject( new C )).toBeTruthy();
			// expect(KM.isPlainObject( document.getElementsByTagName('p') )).toBeFalsy();
			// expect(KM.isPlainObject( document.getElementsByTagName('p')[0] )).toBeFalsy();
			
			expect(KM.isPlainObject( undefined )).toBeFalsy();
			expect(KM.isPlainObject( null )).toBeFalsy();
		});
	});
});

</script>
describe('Neuron:lang/native', function(){
	describe('Array', function(){
		it('.indexOf()', function(){
			function foo(){}
		
			var a = [1, '2', foo, {}, 1, '2', foo, {}];
			
			expect( a.indexOf(1) ).toEqual(0);
			expect( a.indexOf(2) ).toEqual(-1);
			expect( a.indexOf('2') ).toEqual(1);
			
			expect( a.indexOf(function(){}) ).toEqual(-1);
			expect( a.indexOf(foo) ).toEqual(2);
			
			expect( a.indexOf({}) ).toEqual(-1);
		});
		
		
		it('.lastIndexOf()', function(){
			function foo(){}
		
			var a = [1, '2', foo, {}, 1, '2', foo, {}];
			
			expect( a.lastIndexOf(1) ).toEqual(4);
			expect( a.lastIndexOf(2) ).toEqual(-1);
			expect( a.lastIndexOf('2') ).toEqual(5);
			
			expect( a.lastIndexOf(function(){}) ).toEqual(-1);
			expect( a.lastIndexOf(foo) ).toEqual(6);
			
			expect( a.lastIndexOf({}) ).toEqual(-1);
		});
		
		
		it('.filter()', function(){
			function foo(){}
		
			var a = [1, '2', foo, {}, undefined, null, true],
				b = [1, '2', foo, {}, undefined, null, true];
			
			// test filter
			expect( a.filter(function(i){return i === 2;}).length ).toEqual(0);
			expect( a.filter(function(i){return NR.isFunction(i)})[0] ).toEqual(foo);
			expect( a.filter(function(i){return NR.isObject(i)}).length ).toEqual(1);
			expect( a.filter(function(i){return NR.isObject(i)})[0] === {} ).toBeFalsy();
			
			// test context
			expect( a.filter(function(i){return NR.isObject(i)})[0] === {} ).toBeFalsy();
		});
	});


});
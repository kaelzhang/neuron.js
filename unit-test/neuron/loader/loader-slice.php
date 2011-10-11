<script>

describe('Neuron/loader:', function(){
	describe('DP', function(){
		describe('.app()', function(){
			it('could define an app with specified configuration', function(){
			
				// create new app: Math
				KM.app('Math', {
					base: '/unit-test/neuron/loader/app-test/math/'
				});
			});
		});
	
		describe('.define()', function(){
			it('could provide modules from an app base', function(){
				var compare;
				
				runs(function(){
					KM.provide('Math::compare', function(K, c){
						compare = c;
					});
				});
				
				waitsFor(function(){
					return compare;
				});
				
				runs(function(){
					expect(compare.isLE).not.toBeUndefined();
					expect(compare.isLE(1, 1)).toBeTruthy();
					expect(compare.isLE(1, 3)).toBeTruthy();
				});
			});
			
			it('will treat normal modules as the basic app', function(){
				var dimension;
				
				runs(function(){
					KM.provide('dom/dimension', function(K, di){
						dimension = di;
					});
				});
				
				waitsFor(function(){
					return dimension;
				});
				
				runs(function(){
					expect(KM.isFunction(dimension.offset)).toBeTruthy();
				});
			});
			
			// math/filter.js
			// require('~/compare')
			it('provide shortcut of the app base', function(){
				var filter;
				
				runs(function(){
					KM.provide('Math::filter', function(K, f){
						filter = f;
					});
				});
				
				waitsFor(function(){
					return filter;
				});
				
				runs(function(){
					expect(filter.max(1, 2)).toEqual(2);
					expect(filter.max(1, 1)).toEqual(1);
					expect(filter.min(-1, 0)).toEqual(-1);
				});
			});
			
			it('provide access to relative location', function(){
				var random;
				
				runs(function(){
					KM.provide('Math::random', function(K, r){
						random = r;
					});
				});
				
				waitsFor(function(){
					return random;
				});
				
				runs(function(){
					for(var i = 0; i < 200; i ++){
						expect(random(10, 100) < 100).toBeTruthy();
					}
					
					for(var i = 0; i < 200; i ++){
						expect(random(10, 100) >= 10).toBeTruthy();
					}
				});
			});
		});
	});
});

</script>
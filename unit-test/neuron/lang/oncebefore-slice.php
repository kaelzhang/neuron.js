<script>

describe('KM._onceBefore', function(){
	it('used with KM.Class', function(){
		var K = KM,
			C = K.Class({
				initialize: function(v){
					this.v = v;
				},
				
				_real: function(){
					return this.v ++;
				},
				
				print: function(){
					return this.v - 1;
				}
			});
			
		K._onceBefore('print', '_real', C.prototype);
		
		var c = new C(1),
			c2 = new C(1);
			
		expect(c.print()).toEqual(c2.print());
		expect(c.print()).toEqual(c2.print());
		expect(new C(3).print()).toEqual(3);
	});
});





</script>
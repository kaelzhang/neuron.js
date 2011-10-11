<style>
#test-width{width:100px; display:none; float:left;}

</style>

<p class="p">para1</p>
<p>para2</p>

<div id="test-width" class="test-width"></div>
<div class="test-width"></div>



<script>

describe('Neuron:dom/css', function(){
	describe('DP', function(){
		describe('.css() setter', function(){
			it('could set opacity style', function(){
				$('p').css('opacity', .3);
			});
			
			it('could set font-size style', function(){
				$('p').css('font-size', 10);
			});
		});
		
		describe('.css() getter', function(){
			it('could get opacity style', function(){
				var p_o = $('p').css('opacity');
				
				expect( Number( p_o ) ).toEqual(.3);
			});
			
			it('could get font-size style', function(){
				expect( Number( $('.test-width').css('width') ) ).toEqual(100);
			});
			
			it('could get float style', function(){
				expect( $('.test-width').css('float') ).toEqual('left');
				expect( $.all('.test-width').get(1).css('float') ).not.toEqual('left');
			});
		});
		
		
	});
});


</script>
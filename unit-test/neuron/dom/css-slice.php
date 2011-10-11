<style>
#test-width{width:100px; display:none; float:left;}
.test-margin{margin:10px 0;}
.test-margin-right{margin:10px 100px;}

</style>

<p class="test-opacity">test opacity</p>

<p class="test-font-size">test font-size</p>
<p class="test-font-size">test font-size</p>

<div id="test-width" class="test-width"></div>
<div class="test-width"></div>

<div class="test-margin">test margin</div>
<div class="test-margin-right">test margin-right</div>

<script>

describe('Neuron:dom/css', function(){
	describe('new DOM', function(){
		describe('.css() setter', function(){
			it('could set opacity style', function(){
				$('.test-opacity').css('opacity', .3);
			});
			
			it('could set font-size style', function(){
				$('.test-font-size').css('font-size', 10);
				$.all('.test-font-size').get(1).css('fontSize', 20);
			});
		});
		
		describe('.css() getter', function(){
			it('could get opacity style', function(){
				var p_o = $('.test-opacity').css('opacity');
				
				expect( Number( p_o ) ).toEqual(.3);
			});
			
			it('could get font-size style', function(){
				expect( parseInt( $('.test-font-size').css('font-size') ) ).toEqual(10);
				expect( parseInt( $.all('.test-font-size').get(1).css('fontSize') ) ).toEqual(20);
			});
			
			it('could get width style', function(){
				expect( parseInt( $('.test-width').css('width') ) ).toEqual(100);
			});
			
			it('could get float style', function(){
				expect( $('.test-width').css('float') ).toEqual('left');
				expect( $.all('.test-width').get(1).css('float') ).not.toEqual('left');
			});
			
			it('get empty string if get margin directly', function(){
				// expect( $('.test-margin').css('margin') ).toEqual('');
			});
			
			it('could get margin-* style', function(){
				
				expect( parseInt( $('.test-margin-right').css('margin-right') ) ).toEqual(100);
				expect( parseInt( $('.test-margin-right').css('marginRight') ) ).toEqual(100);
			});
		});
		
		
	});
});


</script>
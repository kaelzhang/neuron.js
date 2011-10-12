<div id="test-dom-manipulate">
	<div class="dom-data"></div>
	<div class="dom-html"></div>
	<div class="dom-text-get"><div class="">abc</div>def</div>
	<div class="dom-text-set"></div>
	<div class="dom-text-set-html"></div>
</div>

<select id="test-select" autocomplete="off">
	<option value="0">0</option>
	<option value="1" selected="selected">1</option>
	<option value="2">2</option>
	<option value="3">3</option>
</select>

<script>

describe('Neuron: dom/manipulate', function(){
	describe('new DOM', function(){
		describe('.data()', function(){
			it('could store and retrieve data', function(){
				var el = $('#test-dom-manipulate .dom-data');
				
				el.data('abc', 1);
				
				expect( el.data('abc') ).toEqual(1);
			});
		});
		
		describe('.html()', function(){
			it('could set and get html', function(){
				var el = $('#test-dom-manipulate .dom-html'),
					html = '<div class="inner">haha, i\'m the inner of .dom-html</div>';
				
				el.html(html);
				
				expect( el.html().toLowerCase().trim() ).toEqual(html.toLowerCase().trim());
				
				// expect( el.one('.inner').el(0) ).not.toBeUndefined();
			});
		});
		
		describe('.text()', function(){
			it('could set text', function(){
				var el = $('#test-dom-manipulate .dom-text-get');
				expect( el.text() ).toEqual('abcdef');
			});
			
			it('could get text', function(){
				var el = $('#test-dom-manipulate .dom-text-set'),
					el2 = $('#test-dom-manipulate .dom-text-set-html'),
					html = '<div></div>'
				
				el.text('abcdef');
				el2.text(html);
				
				expect( el.text() ).toEqual('abcdef');
				expect( el2.text() ).toEqual(html);
			});
		});
		
		describe('.val()', function(){
			it('could get value of select', function(){
				var select = $('#test-select');
				
				expect( select.val() ).toEqual('1');
			});
			
			it('could set value of the select', function(){
				var select = $('#test-select');
			
				select.val(2);
				
				expect( select.val() ).toEqual('2');
			});
		});
	});
});



</script>
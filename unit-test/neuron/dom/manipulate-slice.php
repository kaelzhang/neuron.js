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

<div id="test-dom-attr-html-text">haha<div>inner</div></div>
<div id="test-dom-attr-html-text-set">haha</div>
<div id="test-dom-attr-bool">
	


</div>

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
				
				expect( el.html().toLowerCase().trim().replace(/"/g, '') ).toEqual(html.toLowerCase().trim().replace(/"/g, ''));
				
				// expect( el.one('.inner').el(0) ).not.toBeUndefined();
			});
		});
		
		describe('.text()', function(){
			it('could set text', function(){
				var el = $('#test-dom-manipulate .dom-text-get');
				expect( el.text().replace(/\s+/, '') ).toEqual('abcdef');
			});
			
			it('could get text', function(){
				var el = $('#test-dom-manipulate .dom-text-set'),
					el2 = $('#test-dom-manipulate .dom-text-set-html'),
					html = '<div></div>'
				
				el.text('abcdef');
				el2.text(html);
				
				expect( el.text().replace(/\s+/, '') ).toEqual('abcdef');
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
		
		describe('.attr() getter', function(){
			it('will not deal with html and text', function(){
				var el = $('#test-dom-attr-html-text');
				
				// console.log(el.attr('html'));
				// console.log(el.attr('html', 'abc'));
				
				
				expect( el.attr('html') ).toEqual(null);
				expect( el.attr('text') ).toEqual(null);
				
				// IE7 will upper the case of html tagname, and add a whitespace behind `<div>`
				expect( el.html().toLowerCase().replace(/\s+/, '') ).toEqual('haha<div>inner</div>');
				expect( el.text().toLowerCase().replace(/\s+/, '') ).toEqual('hahainner');
			});
			
			
			
			it('could deal with boolean attributes', function(){
				
			});
			
		});
		
		describe('.attr() setter', function(){
			it('will not deal with html and text', function(){
				var el = $('#test-dom-attr-html-text-set');
				
				el.attr('html', 'haha2');
				expect(el.html()).toEqual('haha');
				
				el.attr('text', 'haha3');
				expect(el.text()).toEqual('haha');
				
			});
		});
	});
});



</script>
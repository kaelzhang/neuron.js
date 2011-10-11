<div id="dom-traverse">
	<h2>test dom-traverse</h2>
	<div class="first">first</div>

	<div class="item">item1</div>
	<div class="item">item2</div>
	<div class="item">
		<p>item3 p1</p>
		<p>item3 p2</p>
		<p>item3 p3</p>
	</div>

	<div class="last">last</div>
</div>


<script>

describe('Neuron:dom/traverse', function(){
	describe('new DOM', function(){
		describe('.prev()', function(){
			it('get the previous element, if matched', function(){
				var last_div = $('#dom-traverse .last'),
					last_item = $.all('#dom-traverse .item').get(2);
			
				expect(last_div.prev().el(0) === last_item.el(0)).toEqual(true);
			});
			
			it('get the previous element, if no match', function(){
				var first = $('#dom-traverse h2');
				
				expect(first.prev().el(0)).toBeUndefined();
				expect(first.prev().count()).toEqual(0);
			});
			
			it('only get the previous element of the first matched elements', function(){
				var items = $.all('#dom-traverse .item'),
					first_div = $('#dom-traverse .first');
				
				expect(items.prev().count()).toEqual(1);
				expect(items.prev().el(0)).toEqual(first_div.el(0));
			});
		});
		
		describe('.next()', function(){
			it('get the next element, if matched', function(){
				var last_div = $('#dom-traverse .last'),
					last_item = $.all('#dom-traverse .item').get(2);
			
				expect(last_div.el(0) === last_item.next().el(0)).toEqual(true);
			});
			
			it('get the next element, if no match', function(){
				var last = $('#dom-traverse .last');
				
				expect(last.next().el(0)).toBeUndefined();
				expect(last.next().count()).toEqual(0);
			});
			
			it('only get the next element of the first matched elements', function(){
				var items = $.all('#dom-traverse .item');
				
				expect(items.next().count()).toEqual(1);
				expect(items.next().el(0)).toEqual(items.el(1));
			});
		});
	});
});



</script>
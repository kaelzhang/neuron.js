<style>
.box{border:1px solid gray; padding:10px; background:white}
.box-container{width:500px;}

</style>

<div id="dom-event">
	<h2>test dom-event</h2>
	<a class="click-prevent" href="#">click prevent</a>
	
	<div class="box box-container" data-depth="1">box 1
		<div class="box" data-depth="2">box 2
			<div class="box" data-depth="3">box 3
				<div class="box" data-depth="4">
					box inner
				</div>
			</div>
		</div>
	</div>
</div>

<script>

describe('Neuron:dom/event', function(){
	describe('new DOM', function(){
		describe('.on()', function(){
			it('could bind a specified event', function(){
				
			});
		});
	});
});

$('#dom-event .click-prevent').on('click', function(e){
	e.prevent();
	console.log('click event fired ', this)
});

$('#dom-event').child('.box').child('.box').on('mouseenter', function(e){
	console.log( 'enter ', $(this).attr('data-depth'), ' from ', $(e.relatedTarget).attr('data-depth') );
}).css('background', '#f00')
.child('.box').on('mouseenter', function(e){
	console.log( 'enter ', $(this).attr('data-depth'), ' from ', $(e.relatedTarget).attr('data-depth') );
}).child('.box').on('mouseenter', function(e){
	console.log( 'enter ', $(this).attr('data-depth'), ' from ', $(e.relatedTarget).attr('data-depth') );
}).child('.box').on('mouseenter', function(e){
	console.log( 'enter ', $(this).attr('data-depth'), ' from ', $(e.relatedTarget).attr('data-depth') );
});


console.log( $('#dom-event').child('.box').child('.box').attr('data-depth') );

/*
$('#dom-event').child('.box').child('.box').el(0).attachEvent('onmouseover', function(){
	console.log('mouseover', $(this).attr('data-depth'));
});

$('#dom-event').child('.box').el(0).attachEvent('onclick', function(){
	console.log('click', $(this).attr('data-depth'), this);
});
*/

</script>
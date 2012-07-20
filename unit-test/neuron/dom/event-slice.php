<style>
.box{border:1px solid gray; padding:10px; background:white; zoom:1;}
.box-container{width:500px;}

#dom-event-mouse-enter-leave{border:1px solid #000; width:400px; height:400px;}

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
	
	<select id="test-select">
		<option value="1">1</option>
		<option value="2">2</option>
		<option value="3">3</option>
		<option value="4">4</option>
		<option value="5">5</option>
	</select>
	
	<div id="dom-event-mouse-enter-leave"></div>
</div>

<script>

$('#test-select').on('change', function(){
	var t = $(this);
	
	console.log('change', t, t.val());
});

$('#test-select').on('click', function(){
	console.log('click', $(this));
});

$('#dom-event-mouse-enter-leave').on('mouseleave', function(e){
	location.hash = e + ':' + this + ':' + typeof e + ':' + typeof this + ':' + this.nodeType + ':' + e.type + ':' + e.base;
}).on('mouseenter', function(e){
	location.hash = e + ':' + this + ':' + typeof e + ':' + typeof this + ':' + this.nodeType + ':' + e.type + ':' + e.base;
});

// $('#test-select').detach('click');
// $('#test-select').detach();

/*

$('#dom-event .click-prevent').on('click', function(e){
	e.prevent();
	console.log('click event fired ', this)
});


var child = $('#dom-event');

child.child('.box').on('mouseenter', function(e){
	console.log( 'enter ', $(this).attr('data-depth'), ' from ', $(e.relatedTarget).attr('data-depth') );
}).css('background', '#f00').child('.box').on('mouseenter', function(e){
	console.log( 'enter ', $(this).attr('data-depth'), ' from ', $(e.relatedTarget).attr('data-depth') );
}).child('.box').on('mouseenter', function(e){
	console.log( 'enter ', $(this).attr('data-depth'), ' from ', $(e.relatedTarget).attr('data-depth') );
}).child('.box').on('mouseenter', function(e){
	console.log( 'enter ', $(this).attr('data-depth'), ' from ', $(e.relatedTarget).attr('data-depth') );
});


KM.ready(function(K){
	console.log('dom ready', K)
});

*/

/*

child = child.child('.box');

console.log(1, 'before on', child.context.length);

child.on('mouseenter', function(e){
	console.log( 'enter ', $(this).attr('data-depth'), ' from ', $(e.relatedTarget).attr('data-depth') );
}).css('background', '#f00');

console.log(1, 'after on', child.context.length);


child = child.child('.box');

console.log(2, 'before on', child.context.length);

child.on('mouseenter', function(e){
	console.log( 'enter ', $(this).attr('data-depth'), ' from ', $(e.relatedTarget).attr('data-depth') );
});

console.log(2, 'after on', child.context.length);


child = child.child('.box');

console.log(3, 'before on', child.context.length);

child.on('mouseenter', function(e){
	console.log( 'enter ', $(this).attr('data-depth'), ' from ', $(e.relatedTarget).attr('data-depth') );
});

console.log(3, 'after on', child.context.length);

child = child.child('.box');

console.log(4, 'before on', child.context.length);

child.on('mouseenter', function(e){
	console.log( 'enter ', $(this).attr('data-depth'), ' from ', $(e.relatedTarget).attr('data-depth') );
});

console.log(4, 'after on', child.context.length);
*/


</script>
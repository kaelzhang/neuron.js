<style>

.event-live-c{
	padding:10px 10px 1px; width:500px; border:3px solid #eee;
	font-size: 13px;
}

.event-live-c .item{
	background-color:rgba(30, 255, 30, 0.1); margin-bottom:9px; min-height:15px; cursor:pointer; padding:5px;
}

.event-live-c .item span{
	display:block; height:15px; width:100px; font-size:12px;
}

#event-live-amount, .event-live-input{
	border:1px solid #bbb; margin-bottom:10px;
}

</style>




<div id="event-live-c" class="event-live-c">
<div class="item"></div>
</div>

<button id="event-live-add">add item</button> <br/><br/>


<div id="event-live-c2" class="event-live-c">
	<div class="item"><span></span>
		<div class="item"><span></span>
			<div class="item"><span></span>
				<div class="item special-item"><span></span></div>
			</div>
		</div>
	</div>
	
	<div class="item"><span></span>
		<div class="item"><span></span>
			<div class="item special-item"><span></span></div>
		</div>
	</div>
	
	<div class="item special-item"><span></span>
		<div class="item special-item"><span></span></div>
	</div>

</div>

<button id="event-live-insert">add child</button><input id="event-live-amount"></input><br/><br/>

<div id="event-live-c3" class="event-live-c">
	<input class="event-live-input"></input><span></span><br/>
	<input class="event-live-input"></input><span></span>
</div>

<script>

KM.provide('event/live', function(K, live){
	KM.ready(function(){
		live.on('#event-live-c', 'click', '.item', function(e){
			var el = $(this),
				count = parseInt(el.text()) || 0;
				
			el.text(++ count);
		});
		
		$('#event-live-add').on('click', function(e){
			e.prevent();
			$.create('div', {'class': 'item'}).inject($('#event-live-c'));		
		});
		
		
		
		var amount = $('#event-live-amount'),
			ele = $('#event-live-c2 .special-item');
		
		live.on('#event-live-c2', 'mouseenter', '.special-item', function(e){
			
			console.log(this, e.type, e.relatedTarget, e.base);
						
		});
		
		live.on('#event-live-c2', 'mouseleave', '.special-item', function(e){
			
			console.log(this, e.type, e.relatedTarget, e.base);
						
		});
		
		live.on('#event-live-c2', 'mouseenter', '.item', function(e){
			
			$(this).one('span').text('enter');
						
		});
		
		live.on('#event-live-c2', 'mouseleave', '.item', function(e){
			
			$(this).one('span').text('leave');
						
		});
		
		
		live.on('#event-live-c3', 'focus', 'input', function(e){
			console.log(this, e.type, e.relatedTarget, e.base);	
			
			var input = $(this);
			
			input.next().text(input.val());
		});
		
		
	
	})
});

</script>



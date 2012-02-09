<style>

.wrap{
	padding:30px;
	background-color:rgba(30, 255, 30, .1);
}

#container{
	
}

#inner{
	width:100px;
	height:100px;
}


</style>

<div class="wrap" id="container">
<div class="wrap">
<div class="wrap">

<div class="wrap" id="inner"></div>


</div>
</div>
</div>

<script>

$('#container').on('mouseenter', function(e){
	console.log(this, e, e.target, e.relatedTarget);
});


</script>
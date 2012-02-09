<style>

#c {
	border: 5px solid #ccc;
	padding: 10px;
}

input{
	border:1px solid #666;
}

</style>


<div id="c">

<input id="i"></input><span></span>

</div>

<script src="../../tools/mt-1.4.2.js"></script>
<script>

document.getElementById('c').addEvent('change:relay(input)', function(e){
	console.log(e);
	this.getNext().set('text', this.value);
});

/*
document.getElementById('i').addEventListener('change', function(e){
	console.log(e);
	this.getNext().set('text', this.value);
});
*/

</script>
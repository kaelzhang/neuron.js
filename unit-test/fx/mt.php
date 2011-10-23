<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title></title>

<style>
</style>

</head>

<body>


<style>
#tween-box{border:1px solid #000; width:10px; height:10px; position:absolute;}

</style>


<div id="tween-box"></div>

<script src="mt.js"></script>
<script>
	
new Fx.Tween('tween-box', {
		property: 'left',
		duration: 3000
	}).start(1000);

	
	
</script>


</body>
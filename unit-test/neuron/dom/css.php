<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Neuron:seed.js</title>
<style>
.neuron{width:700px; margin:0 auto; padding-top:10px;}.neuron .cate{display:block; font-family: Verdana; font-size: 20px; padding-top:15px; color:#666; text-transform: uppercase; margin-bottom:10px;}.neuron p{padding:0 0 10px; margin:0;}.neuron a, .neuron .title{line-height:20px; font-size: 18px; padding-bottom:1px; margin-left:20px; font-family: Verdana; color:#1376b6; text-decoration: none; border-bottom:1px solid #fff;}.neuron a:hover{border-bottom:1px solid #80c0ea;}.neuron a span, .neuron .title span{color:#80c0ea; font-size:12px;}
</style>
<script>
var r = + new Date;
</script>
</head>
<body><div class="neuron"><h1 class="title">Neuron: DOM/CSS <span>unit test cases</span></h1></div>

<script>

</script>

<?php 
require('../../js.php');
require('../../jasmine.php');
// require('../../jasmine-simple.php');

require('css-slice.php');
?>


<script>

// KM.ready(function(){
	jasmine.getEnv().addReporter(new jasmine.TrivialReporter());jasmine.getEnv().execute();
// });

</script>

</body>
</html>
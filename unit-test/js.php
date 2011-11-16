<?php

function inc($path){
	?><script src="http://neuron.lc/src/<?php
	
		echo $path;
	
	?>"></script>
<?php
};

// use strict mode
?><script>'use strict';</script>
<!-- <script src="http://i1.static.dp:1337/trunk/lib/neuron.js"></script> -->

<?

inc("neuron/seed.js");

inc("neuron/lang/native.js");
inc("neuron/lang/enhance.js");
inc("neuron/lang/web.js");

inc("neuron/ua/ua.js");

inc("neuron/loader/loader.js");

inc("neuron/loader/config/alpha.js");

inc("neuron/oop/class.js");
inc("neuron/oop/attrs.js");
inc("neuron/oop/super.js");
inc("neuron/oop/events.js");

inc("neuron/selector/finder.js");
inc("neuron/selector/parser.js");
inc("neuron/selector/adapter.js");

inc("neuron/dom/dom.js");
inc("neuron/dom/feature.js");
inc("neuron/dom/event.js");
inc("neuron/dom/css.js");
inc("neuron/dom/traverse.js");
inc("neuron/dom/manipulate.js");
inc("neuron/dom/create.js");
inc("neuron/dom/domready.js");

inc("neuron/biz/biz.js");
inc("neuron/biz/neuron.js");
// inc("neuron/biz/faker.js");

inc("neuron/cleaner.js");

?>
<script>
KM.__Loader.init();


function log(msg){
	var div = document.createElement('div');
	
	div.innerHTML = Array.prototype.slice.call(arguments).map(function(i){
		if(i === undefined){
			i = 'undefined';
		}else if(i === null){
			i = 'null';
		}else if(!i){
			i = 'false';
		}
		
		return '' + i;
	}).join(' ');
		
	document.body.appendChild(div);
};

/*

if(!window.console){
	var console = {
		log: log
	}
}
*/

</script>
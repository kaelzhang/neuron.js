<style type="text/css">
.tabs:after, .container:after{content:'\20'; display:block; height:0; clear:both;}

body{padding:30px;}
.wrap{margin-bottom:30px; margin-right:30px; width:300px; float:left;}
h2{margin-bottom:5px; font-family: }

.J_lazy-load{display:none;}

/* tab-switch */
.switch{margin:0 auto;}
.tabs{padding-left:1px; border-bottom:1px solid #aaa;}
.tabs li{float:left; padding:3px 5px; height:20px; margin-left:-1px; margin-bottom:-1px; border:1px solid #aaa; background:#f0f0f0; cursor:pointer;}
.tabs li:hover{background:#f7f7f7;}

.tabs .r{float:right;}

.tabs .on{padding-bottom:4px; border-bottom:0; cursor:default;}
.tabs .on, .tabs .on:hover{background:#fff; }
.contents{}
.contents li{display:none;}
.contents .on{display:block; padding:5px; border:1px solid #aaa; border-top:0; height:100px;}

/* carousel */
.stage{border:1px solid #aaa; border-top:0; height:110px; overflow:hidden; position:relative;}
.track{position:absolute; left:0; top:0;}
.track li{position:absolute;}

.accordion{padding-top:1px;}
.accordion li{height:25px; margin-top:-1px; border:1px solid #aaa; background:#f0f0f0; line-height:25px; padding:0 5px;}
.accordion li:hover{cursor:pointer;}
.accordion .on, .accordion .on:hover{height:58px; background:#fff; cursor:default;}

.carousel-complex .stage{height:131px;}
.carousel-complex .items{border:none; border-right:1px solid #aaa; width:298px; position:absolute;}
.carousel-complex .accordion li{position:relative; border-left:none; border-bottom:none; border-right:none;}
.carousel-complex .accordion .first{border-top:none;}

.fade .track li{opacity:0;}
.fade .track .on{opacity:1;}
</style>

<div class="container">

<div class="wrap">
<h2>Tab Switch</h2>
<div class="tab-switch switch">
	<ul class="tabs">
		<li class="tab on">tab1</li>
		<li class="tab">tab2</li>
		<li class="tab">tab3</li>
	</ul>
	<ul class="contents">
		<li class="on cont">cont1</li> 
		<li class="cont">cont2</li>
		<li class="cont">cont3</li>
	</ul>
</div>
</div>

<div class="wrap">
<h2>Carousel with autoPlay and lazyload</h2>
<div class="carousel switch carousel-simple">
	<ul class="tabs">
		<li class="tab on">tab1</li> 
		<li class="tab">tab2</li>
		<li class="tab">tab3</li>
		<li class="r next">&gt;</li>
		<li class="r prev">&lt;</li>
	</ul>
	<div class="stage">
		<ul class="track">
			<li class="on cont"><img width="300" alt="" src="i/1.jpg"/></li>
		</ul>
		<script type="text/plain" class="J_lazy-load">
			<li class="cont" style="left:300px;"><img width="300" alt="" src="i/2.jpg"/></li>
			<li class="cont" style="left:600px;"><img width="300" alt="" src="i/3.jpg"/></li>
		</script>
	</div>
</div>
</div>

<div class="wrap">
<h2>Accordian</h2>
<div class="accordion switch accordion-simple">
	<ul class="items">
		<li class="item on">item1</li> 
		<li class="item">item2</li>
		<li class="item">item3</li>
		<li class="item">item4</li>
	</ul>
</div>
</div>

<div class="wrap">
<h2>Complex Demo</h2>
<div class="carousel switch carousel-complex">
	<ul class="tabs">
		<li class="tab on">tab1</li> 
		<li class="tab">tab2</li>
		<li class="tab">tab3</li>
		<li class="r next">&gt;</li>
		<li class="r prev">&lt;</li>
	</ul>
	<div class="stage accordion">
		<div class="track">
		
		<ul class="items">
			<li class="item on first">item1-1</li> 
			<li class="item">item1-2</li>
			<li class="item">item1-3</li>
			<li class="item">item1-4</li>
		</ul>
		
		</div>
		<script type="text/plain" class="J_lazy-load">
			<ul class="items" style="left:300px;">
				<li class="item on first">item2-1</li> 
				<li class="item">item2-2</li>
				<li class="item">item2-3</li>
				<li class="item">item2-4</li>
			</ul>
			<ul class="items" style="left:600px;">
				<li class="item on first">item3-1</li> 
				<li class="item">item3-2</li>
				<li class="item">item3-3</li>
				<li class="item">item3-4</li>
			</ul>
		</script>
	</div>
</div>
</div>

</div>



<div class="container">
<div class="wrap">
<h2>fade in and out</h2>
<div class="fade switch fade-simple">
	<ul class="tabs">
		<li class="tab on">tab1</li> 
		<li class="tab">tab2</li>
		<li class="tab">tab3</li>
		<li class="r next">&gt;</li>
		<li class="r prev">&lt;</li>
	</ul>
	<div class="stage">
		<ul class="track">
			<li class="on cont"><img width="300" alt="" src="i/1.jpg"/></li>
		</ul>
		<script type="text/plain" class="J_lazy-load">
			<li class="cont"><img width="300" alt="" src="i/2.jpg"/></li>
			<li class="cont"><img width="300" alt="" src="i/3.jpg"/></li>
		</script>
	</div>
</div>
</div>

</div>

<script>

KM.provide('switch/core', function(K, Switch){

var NAVITATOR_DISABLE_STYLE = {
        opacity	: .3,
        cursor	: 'default'
    },

    NAVITATOR_ENABLE_STYLE = {
        opacity	: 1,
        cursor	: ''
    };



new Switch().plugin('tabSwitch').init({
	CSPre: 			'.tab-switch', 
	triggerCS: 		'.tab', 
	triggerOnCls:	'on', 
	containerCS:	'.contents', 
	itemCS:			'.cont', 
	itemOnCls:		'on'
});



new Switch().plugin('lazyLoad', 'carousel', 'endless', 'autoPlay').on({
	navEnable: function(btn, which){
		btn && btn.css(NAVITATOR_ENABLE_STYLE);
	},
	
	navDisable: function(btn, which){
		btn && btn.css(NAVITATOR_DISABLE_STYLE);
	}
	
}).init({
	CSPre: 			'.carousel-simple',
	triggerCS: 		'.tab', 
	triggerOnCls:	'on', 
	containerCS:	'.track', 
	itemCS:			'.cont', 
	itemOnCls:		'on',
	prevCS:			'.prev',
	nextCS:			'.next'
});


new Switch().plugin('accordion', 'autoPlay').on({
	itemActive: function(i){
	},
	
	itemDeactive: function(i){
	}
}).init({
	triggerType:	'mouseenter',
	CSPre: 			'.accordion-simple',
	triggerCS: 		'.item', 
	// triggerOnCls:	'on', 
	containerCS:	'.items',
	itemCS:			'.item', 
	itemOnCls:		'on'
});


new Switch().plugin('lazyload', 'carousel', 'endless', 'autoPlay').on({
	navEnable: function(btn, which){
		btn && btn.css(NAVITATOR_ENABLE_STYLE);
	},
	
	navDisable: function(btn, which){
		btn && btn.css(NAVITATOR_DISABLE_STYLE);
	},
	
	afterInit: 	function(){
		$.all('.carousel-complex .items').forEach(function(wrap, i){
			$(wrap).addClass('items-' + i);
			
			new Switch().plugin('accordion').init({
				triggerType:	'mouseenter',
				CSPre: 			'.items-' + i,
				triggerCS: 		'.item', 
				triggerOnCls:	'on', 
				containerCS:	'',
				itemCS:			'.item', 
				itemOnCls:		'on'
			});
		});
	}
	
}).init({
	CSPre: 			'.carousel-complex',
	triggerCS: 		'.tab', 
	triggerOnCls:	'on', 
	containerCS:	'.track', 
	itemCS:			'.items', 
	itemOnCls:		'on',
	prevCS:			'.prev',
	nextCS:			'.next'
});


new Switch().plugin('lazyload', 'fade', 'autoPlay').on({
	navEnable: function(btn, which){
		btn && btn.css(NAVITATOR_ENABLE_STYLE);
	},
	
	navDisable: function(btn, which){
		btn && btn.css(NAVITATOR_DISABLE_STYLE);
	}
	
}).init({
	triggerType:	'click',
	CSPre: 			'.fade-simple',
	triggerCS: 		'.tab', 
	triggerOnCls:	'on', 
	containerCS:	'.track',
	itemCS:			'.cont', 
	itemOnCls:		'on',
	prevCS:			'.prev',
	nextCS:			'.next',
	
	onItemActive: 	function(i){
	},
	
	onItemDeactive: function(i){
	}
	
});

});

</script>
<style type="text/css">
.tabs:after, .container:after{content:'\20'; display:block; height:0; clear:both;}

body{padding:30px;}
.wrap{margin-bottom:30px; margin-right:30px; width:300px; float:left;}
.wide-wrap{width:1000px;}

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
.carousel-complex .pending{background-color:#ddd;}

.carousel-complex .first-items, .carousel-complex .first-items li{background:yellow;}

.wide-wrap .carousel-complex .items{width:198px; height:132px;}
.wide-wrap .carousel-complex .this{border-color:orange;}
.wide-wrap .carousel-complex .end{line-height:130px; text-align:center;}

.carousel-complex .accordion li{position:relative; border-left:none; border-bottom:none; border-right:none;}
.carousel-complex .accordion .first{border-top:none;}

.fade .track li{opacity:0;}
.fade .track .on{opacity:1;}
</style>

<div class="container">


<div class="wrap wide-wrap">
<h2>Complex Demo</h2>
<div class="carousel switch carousel-complex">
	<ul class="tabs">
        <!--
		<li class="tab on">tab1</li> 
		<li class="tab">tab2</li>
		<li class="tab">tab3</li>
		-->
		<li class="r next">&gt;</li>
		<li class="r prev">&lt;</li>
	</ul>
	<div class="stage accordion">
		<div class="track">
		
		<!--
		<ul class="items first-items">
			<li class="item on first">item1-1</li>
			<li class="item">item1-2</li>
			<li class="item">item1-3</li>
			<li class="item">item1-4</li>
		</ul>
		
		<ul class="items" style="left:200px;">
			<li class="item on first">item2-1</li>
			<li class="item">item2-2</li>
			<li class="item">item2-3</li>
			<li class="item">item2-4</li>
		</ul>
		
		<ul class="items" style="left:400px;">
			<li class="item on first">item3-1</li>
			<li class="item">item3-2</li>
			<li class="item">item3-3</li>
			<li class="item">item3-4</li>
		</ul>
		
		<ul class="items" style="left:600px;">
			<li class="item on first">item4-1</li>
			<li class="item">item4-2</li>
			<li class="item">item4-3</li>
			<li class="item">item4-4</li>
		</ul>
		
		<ul class="items" style="left:800px;">
			<li class="item on first">item5-1</li>
			<li class="item">item5-2</li>
			<li class="item">item5-3</li>
			<li class="item">item5-4</li>
		</ul>
		-->
		
		</div>
	</div>
</div>
</div>

<script type="text/plain" id="J_tpl-complex">
<ul class="items" data-index="@{it.index}"><?php echo '<?js'; ?>

	var i = 0, pre = 'item' + it.index + '-';
	it.list.forEach(function(li, i){
		var cls = i === 0 ? ' on first' : '';
		<?php echo '?>'; ?><li class="item@{cls}">@{pre}@{li}</li><?php echo '<?js'; ?>
		
	});
<?php echo '?>'; ?></ul>
</script>

</div>


</div>

<?php

inc('switch/core.js', true);
inc('mvp/tpl.js', true);
inc('io/ajax.js', true);
inc('switch/conf.js', true);
inc('util/queue.js', true);
inc('util/json.js', true);
inc('switch/step.js', true);
inc('switch/carousel.js', true);
inc('switch/cleaner.js', true);
inc('fx/tween.js', true);
inc('fx/easing.js', true);
inc('fx/css.js', true);
inc('fx/core.js', true);

?>

<script>

'use strict';

KM.provide(['switch/core', 'mvp/tpl', 'io/ajax'], function(K, Switch, tpl, Ajax){

var 

$ = K.DOM,

NAVITATOR_DISABLE_STYLE = {
    opacity	: .3,
    cursor	: 'default'
},

NAVITATOR_ENABLE_STYLE = {
    opacity	: 1,
    cursor	: ''
},

template = tpl.parse($('#J_tpl-complex').html()),
data = [],

amount = 100,
start = 6;
    
/*

while(amount --){
    data.push({
        index: start ++,
        list: [1,2,3,4]
    })
};
*/

var guid = 1;

var AsyncSwitch = KM.Class({
    Extends: Switch,
    
    _lifeCycle: [
        {
            method: '_prepareItems',
	    		
    		// asychronously 
    		// auto: false
    	},
    	
    	'_on',
    	
    	'_after'
    ],
    
    _prepareItems: function(){
        var self = this,
            data = self.get('data'),
            data_max = self.get('dataLength') - 1,
            
            expect_left = Math.max(self.expectIndex, 0),
            
             // less than `dataLength` 
            expect_right = Math.min(expect_left + self.get('stage') - 1, data_max),
            
            is_forward = expect_left - self.activeIndex >= 0,
            
            data_right = self.dataRight,
            data_left = self.dataLeft,
            
            prefetch = self.get('prefetch'),
            
            // basic preload
            load_left = data_left,
            load_right = data_right,
            
            async_needed = true,
            load_start,
            load_amount;
        
        // positive direction    
        if(is_forward){
            load_right = Math.min(expect_right + prefetch, data_max);
        }else{
            load_left = Math.max(expect_left - prefetch, 0);
        }
        
        if(expect_right > data_right){
            load_start = data_right + 1;
            load_amount = load_right - data_right;
            
        }else if(expect_left < data_left){
            load_start = load_left;
            load_amount = data_left - load_left;
            
        }else{
            async_needed = false;
        }
        
        if(async_needed){
            // sync 变成一个获取和控制 async method 的方法，会自己处理异步请求结束的工作
            self.get('sync')({
                start: load_start,
                amount: load_amount
                
            }, function(rt){
                var itemData = rt.items, item, index,
                    start = load_start,
                    amount = load_amount,
                    i = 0,
                    renderer = self.get('itemRenderer');
                    
                for(; i < amount; i ++ ){
                    index = start + i;
                    data[index] = itemData[i];
                    
                    if(index >= expect_left && index <= expect_right && index < self.length){
                        item = self._getItem(index);
                        renderer.call(self, index).children().inject(item.empty().removeClass('pending'));
                    }
                }
                
                self.dataRight = Math.max(load_right, self.dataRight);
                self.dataLeft = Math.min(load_left, self.dataLeft);
                
                // self._lifeCycle.resume();
            });
        }
        
        self._before();
    },
    
    _getPage: function(){
    	return parseInt((this.activeIndex + 1) / this.get('move'));
    },
    
    _limit: function(index){
        return index >= 0 ? index % (this.length + 1) : -1;
    },
    
    _isNoprev: function(){
    	var self = this;
    
    	return self.noprev = !self._getPage() 
    	
            // if activeIndex is more than zero, there still be previous items
            && self.activeIndex === -1;
    },
    
    _isNonext: function(){
    	var self = this;
    	
    	return self.nonext = self._getPage() > self.pages;
    }
});


function resume(data, callback){
    callback && callback();
};


KM.Class.setAttrs(AsyncSwitch, {
    sync: {
        getter: function(v){
            return v || resume;
        }
    },
    
    prefetch: {
        getter: function(v){
            return v && v > 0 ? v : 0;
        }
    },
    
    ghostRenderer: {}
});


window.switcher = new AsyncSwitch().plugin('step', 'carousel', /* 'endless',  */'cleaner').on({
	navEnable: function(btn, which){
		btn && btn.css(NAVITATOR_ENABLE_STYLE);
	},
	
	navDisable: function(btn, which){
		btn && btn.css(NAVITATOR_DISABLE_STYLE);
	},
	
	afterInit: function(){
        var self = this;
        
        self.dataLeft = self.dataRight = self.activeIndex;
        -- self.dataRight;
    },
    
    beforeSwitch: function(){
        var expect = this.expectIndex;
        
        if(expect === -1 || expect === this.length - this.get('stage') && (expect = this.length)){
            this._getItem(expect);
        }
    }
	
}).init({
	CSPre          : '.carousel-complex',
	triggerCS      : '.tab', 
	triggerOnCls   : 'on', 
	containerCS    : '.track', 
	itemCS         : '.items', 
	itemOnCls      : 'on',
	prevCS         : '.prev',
	nextCS         : '.next',
	stage          : 5,
	move           : 2,
	
	prefetch       : 10,
	
	itemSpace      : 200,
	data           : data,
	dataLength     : 2000,
	activeIndex    : 2,
	itemRenderer   : function(index){
        var data = this.get('data')[index],
            item;
            
        if(data){
            var html = template(data);
            
            item = $.create('div').html(html).child();
        }else{
            item = this.get('ghostRenderer').call(this, index);
        }
        
        if(index === -1){
            item = $.create('div', {'class': 'items end'}).text('reach left end');
        }else if(index === this.length){ 
            item = $.create('div', {'class': 'items end'}).text('reach right end');
        }
        
        if(index === 1){
            item.addClass('this');
        }
		
		return item;
	},
	
	ghostRenderer  : function(index){
        return $.create('ul', {'class': 'items pending', 'data-index': index});
	},
	
	sync: function(data, callback){
	   return new Ajax({
	       url: 'handler/step.php',
	       data: data,
	       isSuccess: function(rt){
	           return !!rt;
	       }
	   }).on({
	       success: function(rt){
	           callback(rt);
	       }
	   }).send();
	}
});


});

/**
 TODO:
 - prevent duplicate loading
 
 
 */

</script>
<style type="text/css">

#mvp-p-nav {
	width:800px;
	margin:0 auto;
}


#mvp-p-nav .pages, #mvp-p-nav .content{
	border: 1px solid #ccc;
	
	margin-bottom:5px;
}

#mvp-p-nav .pages{
	padding: 5px;
}

#mvp-p-nav .content{
	padding: 10px;
}

#mvp-p-nav .pages:after{
	content: '\20'; display:block; clear:both; height:0;	
}

#mvp-p-nav .page{
	float: left; padding: 3px 7px; background:#ddd; color:#333; margin-right:5px;
}

#mvp-p-nav .active{
	background:#555; color:#fff;
}

</style>


<!-- 

tech:

1. 非集合式的 presenter，工作全部交给其他模块


每一次点击分页，会载入 .content 的内容

TODO：

1. 事件支持
2. 


-->

<div id="mvp-p-nav">

	<div class="pages">
		<a href="/page/1" class="page" data-page="1">1</a>
		<a href="/page/2" class="page" data-page="2">2</a>
		<a href="/page/3" class="page" data-page="3">3</a>
	</div>
	
	<div class="content">
		
	</div>
</div>


<script type="text/javascript">

KM.provide(

['mvp/presenter', 'mvp/model', 'mvp/router', 'mvp/history', 'event/live', 'io/ajax'],  function(K, 
Presenter, Model, Router, History, Live, Ajax){


var NaviModel = K.Class({
	Extends: Model,

	_read: function(callback){
		new Ajax({
			method: 'GET',
			url: '/unit-test/mvp/handler/navi.php',
			data: {
				page: this.fetch('page')
			}
			
		}).on({
			success: function(rt){
				callback(rt);
			}
			
		}).send();
	}
});


var NaviView = K.Class({
	
	Implements: 'attrs',

	initialize: function(){
		this.subject = $('#mvp-p-nav');
	},
	
	render: function(data){
		this.subject.one('.content').html(data.content);
	}
	
});

K.Class.setAttrs(NaviView, {
	subject: {
		getter: function(){
			return this.subject;
		}
	}
});


var navi = new Presenter({
	model: new NaviModel(),
	view: new NaviView()
});

var router = new Router();

function routeURL(e){
	router.route(location.href);
};

History.on({
	pushstate: routeURL,
	popstate: routeURL
});

History.start();

router.add('/page/:page', function(data){
	navi.init(data);
});

Live.on($('#mvp-p-nav'), 'click', '.page', function(e){
	e.prevent();
	
	History.push({}, '', this.href);
	$.all('.page').removeClass('active');
	$(this).addClass('active');
});
	
});

</script>
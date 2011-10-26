KM.define([], function(){

function getLazyData(container){
	var data,
		tagName = container.el(0).tagName;
	
	if(/textarea/i.test(tagName)){
		data = container.val();
		
	}else if(/script/i.test(tagName)){
		data = container.html();
	}

	return (data || '').trim();
};

return {
    // name为一个插件声明所必需的,若name未定义,则会被认为是无效插件
    name: 'lazyLoad',

    // 这里的options会被合并到新的Switch实例的options中
    options: {
        lazyLoadCS: '.J_lazy-load'
    },

    // @param switchInstance {object} new instance of DP.Switch, as the same as below
    init: function(self){
    	self.on(self.get('EVENTS').BEFORE_INIT, function(){
	        var lazyLoadTextarea,
	            tmp_parent;
	            
	        lazyLoadTextarea = $(self.CSPre + self.get('lazyLoadCS'));
	        
	        if(lazyLoadTextarea.count()){
	            tmp_parent = $.create('div').html(getLazyData(lazyLoadTextarea));
	            tmp_parent.children().addClass('J_switch-lazy-item').inject(self.container);
	            lazyLoadTextarea.dispose();
	        }
	    });
    }
};

});

/**
 TODO:
 ? A. add event interface: AFTER_LAZYLOAD



 */
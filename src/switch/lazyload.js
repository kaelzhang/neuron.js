KM.define([], function(){

function getLazyData(container){
	var data,
		tagName = container.tagName;
		
	if(/textarea/i.test(tagName)){
		data = container.value.trim();
		
	}else if(/script/i.test(tagName)){
		data = container.innerHTML.trim();
	}

	return data || '';
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
        function renderData(){
            var o = self.options,
                lazyLoadTextarea,
                tmp_parent;
                    
            lazyLoadTextarea = $$(o.CSPre + o.lazyLoadCS)[0];

            if(lazyLoadTextarea){
                tmp_parent = new Element('div', {html: getLazyData(lazyLoadTextarea)});
                tmp_parent.getChildren().addClass('J_switch-lazy-item').inject(self.container);

                lazyLoadTextarea.dispose();
            }
        };
        
        var EVENTS = self.get('EVENTS');

        self.on(EVENTS.BEFORE_INIT, renderData);
    }
};

});

/**
 TODO:
 ? A. add event interface: AFTER_LAZYLOAD



 */
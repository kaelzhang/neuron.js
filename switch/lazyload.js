KM.define({
    // name为一个插件声明所必需的,若name未定义,则会被认为是无效插件
    name: 'lazyLoad',

    // require: require {string} required plugin, if the required plugin not loaded, it will automatically search and load it (to do)

    // 这里的options会被合并到新的Switch实例的options中
    options: {
        lazyLoadCS: '.J_lazy-load'
    },

    // @param switchInstance {object} new instance of DP.Switch, as the same as below
    init: function(_this){
        function renderData(){
            var o = _this.options,
                lazyLoadTextarea,
                tmp_parent;
                    
            lazyLoadTextarea = $$(o.selectorPre + o.lazyLoadCS)[0];  

            if(lazyLoadTextarea){
                tmp_parent = new Element('div', {html: lazyLoadTextarea.value.trim()});
                tmp_parent.getChildren().addClass('D-switch-lazy-item').inject(_this.container);

                lazyLoadTextarea.dispose();
            }
        };

        _this.addEvent(EVENT_BEFORE_INIT, renderData);
    }
});
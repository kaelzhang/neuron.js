KM.define({
    name: 'tabSwitch',
    // no plugins will be added after this one
    final_: true,

    init: function(_this){
        _this.addEvent(EVENT_BEFORE_SWITCH, function(){
            var _t = _this;
                o = _t.options,
                activeIndex = _t.activeIndex;

            _t.triggers[activeIndex] && _t.triggers[activeIndex].removeClass(o.triggerOnClass);
            _t.items[activeIndex] && _t.items[activeIndex].removeClass(o.itemOnClass);
        });

        _this.addEvent(EVENT_ON_SWITCH, function(){
            var _t = _this;
                o = _t.options,
                activeIndex = _t.activeIndex;

            _t.triggers[activeIndex] && _t.triggers[activeIndex].addClass(o.triggerOnClass);
            _t.items[activeIndex] && _t.items[activeIndex].addClass(o.itemOnClass);
        });
    }
});
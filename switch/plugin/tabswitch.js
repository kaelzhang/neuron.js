/**
 * Switch Plugin: Tab Switching
 * author  Kael Zhang
 */

KM.define({
    name: 'tabSwitch',
    // no plugins will be added after this one
    final_: true,

    init: function(self){
    	var EVENT_BEFORE_SWITCH = 'beforeSwitch',
    		EVENT_ON_SWITCH = 'switching';
    
        self.addEvent(EVENT_BEFORE_SWITCH, function(){
            var t = self;
                o = t.options,
                activeIndex = t.activeIndex;

            t.triggers[activeIndex] && t.triggers[activeIndex].removeClass(o.triggerOnCls);
			t.items[activeIndex] && t.items[activeIndex].removeClass(o.itemOnCls);
        });

        self.addEvent(EVENT_ON_SWITCH, function(){
            var t = self;
                o = t.options,
                activeIndex = t.activeIndex = t.expectIndex;

            t.triggers[activeIndex] && t.triggers[activeIndex].addClass(o.triggerOnCls);
            t.items[activeIndex] && t.items[activeIndex].addClass(o.itemOnCls);
        });
    }
});
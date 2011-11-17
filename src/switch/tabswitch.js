/**
 * Switch Plugin: Tab Switching
 * author  Kael Zhang
 */

KM.define({
    name: 'tabSwitch',
    
    // no plugins will be added after this one
    final_: true,

    init: function(self){
    	var EVENTS = self.get('EVENTS'),
    		ITEM_ON_CLS = 'itemOnCls';
    
        self.on(EVENTS.BEFORE_SWITCH, function(){
            var t = this,
                activeIndex = t.activeIndex;
                
            t._getItem(activeIndex).removeClass(t.get(ITEM_ON_CLS));
            t._dealTriggerCls(true);
        });

        self.on(EVENTS.ON_SWITCH, function(){
            var t = this,
                activeIndex = t.activeIndex = t.expectIndex;
                
            t._getItem(activeIndex).addClass(t.get(ITEM_ON_CLS));
            t._dealTriggerCls(false, activeIndex);
        });
    }
});


/**
 change log
 
 2011-10-31  Kael:
 - use _dealTriggerCls and _getItem instead of old methods
 
 */
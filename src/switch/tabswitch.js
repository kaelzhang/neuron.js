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
    		TRIGGER_ON_CLS = 'triggerOnCls',
    		ITEM_ON_CLS = 'itemOnCls';
    
        self.on(EVENTS.BEFORE_SWITCH, function(){
            var t = self,
                activePage = t.activePage;
                
            t.triggers[activePage].removeClass(t.get(TRIGGER_ON_CLS)); 
            t.items[activePage].removeClass(t.get(ITEM_ON_CLS));
        });

        self.on(EVENTS.ON_SWITCH, function(){
            var t = self,
                activePage = t.activePage = t.expectPage;
			
			t.triggers[activePage].addClass(t.get(TRIGGER_ON_CLS));
            t.items[activePage].addClass(t.get(ITEM_ON_CLS));
        });
    }
});
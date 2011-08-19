/**
 * Switch Plugin: Tab Switching
 * author  Kael Zhang
 */

KM.define({
    name: 'tabSwitch',
    // no plugins will be added after this one
    final_: true,

    init: function(self){
    	var EVENTS = self.get('EVENTS');
    
        self.addEvent(EVENTS.BEFORE_SWITCH, function(){
            var t = self;
                o = t.options,
                activePage = t.activePage;

            t.triggers[activePage] && t.triggers[activePage].removeClass(o.triggerOnCls);
			t.items[activePage] && t.items[activePage].removeClass(o.itemOnCls);
        });

        self.addEvent(EVENTS.ON_SWITCH, function(){
            var t = self;
                o = t.options,
                activePage = t.activePage = t.expectPage;

            t.triggers[activePage] && t.triggers[activePage].addClass(o.triggerOnCls);
            t.items[activePage] && t.items[activePage].addClass(o.itemOnCls);
        });
    }
});
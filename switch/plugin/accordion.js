/**
 * Switch Plugin: Accordian Effect
 * author  Kael Zhang
 */
 
KM.define(['fx/tween', 'fx/easing'], function(K, require){

var Tween = require('fx/tween'),
	Easing = require('fx/easing'),

	EVENT_BEFORE_INIT = 'beforeInit',
    EVENT_AFTER_INIT = 'afterInit',
    EVENT_BEFORE_SWITCH = 'beforeSwitch',
    EVENT_ON_SWITCH = 'switching',
    EVENT_COMPLETE_SWITCH = 'completeSwitch',
    
    NULL = null;

return {
	name: 'accordion',
	
	options: {
        fx: {
            link: 'cancel',
            transition: Easing.Cubic.easeOut,
            duration:200
        },
        
        property: 'height',
        
        activeSize: NULL,
        normalSize: NULL
    },
    
    init: function(self){
    	var EFFECT_KEY = '_s_accordion',
    		o = self.options,
    		fx = o.fx,
    		on_complete = [],
    		active_cls = o.itemOnCls;
    	
    	delete o.fx;
    
    	function getFx(element, offset){
    		var effect = element.retrieve(EFFECT_KEY);
    		
    		if(!effect){
    			effect = new Tween(
    				element, 
    				K.mix({
    					onComplete: function(){
    						var cb = on_complete[offset];
    						cb && cb();
    					}
    				}, fx)
    			);
    			element.store(EFFECT_KEY, effect);
    		}	
    		
    		return effect;
    	};
    	
    	function setFxCallback(active, expect){
    		delete on_complete[active];
    		delete on_complete[expect];
    	
    		on_complete[active] = function(){
    			self.items[active].removeClass(active_cls);
    		}
    		
    		on_complete[expect] = function(){
    			self.items[expect].addClass(active_cls);
    			self.fireEvent(EVENT_COMPLETE_SWITCH);
    		}
    	};
    	
    	function chk(a){
    		return a || a === 0;
    	};
    	
    	if(!fx.property){
            fx.property = o.property;
        };

        self.addEvent(EVENT_AFTER_INIT, function(){
            var t = self,
                active = t.activeIndex;
                
          	if(!chk(o.activeSize)){
          		o.activeSize = t.items[active].getStyle(fx.property);
          	}
          	
          	if(!chk(o.normalSize)){
          		o.normalSize = t.items[(active + 1) % t.items.length].getStyle(fx.property);
          	}
        });

        self.addEvent(EVENT_ON_SWITCH, function(){
            var t = self,
                active = t.activeIndex,
                expect = t.expectIndex;
                
            setFxCallback(active, expect);    
            getFx(t.items[active], active).start(o.normalSize);
            getFx(t.items[expect], expect).start(o.activeSize);
            
            
/**
 a: active,  e: expect,  n: normal, normalSize: 0, activeSize: 3;  'e' will be activated
 ////////////////////////////////////////////////////////////////////////////////////////////
 
       | 2. but, at this point                       |
       | [n] interrupt in, everything changes ===>   |
 a: \                                                |    a: \
      \    | 1. if nothing happens,                  |         \    | [a] isn't affected
        \  | it would be ended here                  |           \  |
          \                                          |             \
                                                     |
          /                                          |          | before [n] interrupted in
        /                                            |          | [e] should have been the new [active]
      /                                              |         / \   
 e: /                                                |    e: /     \
                                                     |
                                                     |                 /
                                                     |               /
                                                     |             /
 n: ________                                         |    n: ____/

 ////////////////////////////////////////////////////////////////////////////////////////////
 */
 			// set expectIndex as activeIndex immediately after fx started
            t.activeIndex = expect;
        });
    }
}

});
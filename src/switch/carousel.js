/**
 * Switch Plugin: Carousel Effect
 * author  Kael Zhang
 */

KM.define(['fx/tween', 'fx/easing'], function(K, require){

var Tween = require('fx/tween'),
	Easing = require('fx/easing');
    
    
// 检查舞台，删除多余的trigger
// @method checkStage
// @param t {Object} DP.Switch instance
function checkStage(_t){
    var triggerlength = _t.triggers.length,                            
        i;
                        
    // 若trigger数比翻页数更多，则移除多余的trigger，这是为了避免后端输出错误，对js造成影响
    for(i = _t.pages; i < triggerlength; ++ i){
        _t.triggers[i].destroy();
    }

    // 设置container为offsetParent，从而正确的定位和获得偏移量
    if(_t.items[0].el(0).offsetParent !== _t.container.el(0)){
        _t.container.css('position', 'relative');
    }                           
};


function capitalize(str){
	return str.replace(/^[a-z]/i, function(match){
		return match.toUpperCase();
	});
};


return {
    name: 'carousel',
    options: {
        fx: {
            link: 'cancel',
            transition: Easing.Cubic.easeOut,
            duration:300
        },

        // only support 'left' || 'top'
        direction: 'left'
    },

    init: function(self){
        var EVENTS = self.get('EVENTS'),
        	direction,
        	offset_direction;

        function currentTriggerClass(remove, index){
            var t = self,
                currentTrigger = t.triggers[index || t.activePage],
                TRIGGER_ON_CLS = t.get('triggerOnCls');
                
            remove ? 
            	currentTrigger.removeClass(TRIGGER_ON_CLS) : 
            	currentTrigger.addClass(TRIGGER_ON_CLS);
        };

        self.on(EVENTS.AFTER_INIT, function(){
            checkStage(self);

            var t = self,
                active = t.activePage,
                fx = t.get('fx');
                
            direction = t.get('direction');
            offset_direction = 'offset' + capitalize(direction);
                
            if(!fx.property){
	            fx.property = direction;
	        };
	        
            t.effect = new Tween(t.container, fx).on('complete', function(){
	            t.fire(EVENTS.COMPLETE_SWITCH);
	        });

            // there's a bug about moo tools Fx: the container's position must be specified before you use Fx,
            // or the first Fx will have no animation
            t.container.css(direction, - t.items[active * t.get('move')].el(0)[offset_direction] );
            t._dealNavs();
        });

        self.on(EVENTS.BEFORE_SWITCH, function(){
            currentTriggerClass(true);
        });

        self.on(EVENTS.ON_SWITCH, function(){
            var t = self,
                active = t.activePage = t.expectPage;

            t._dealNavs();
			
            t.effect.start( - ( t.items[active * t.get('move')] ).el(0)[offset_direction] );

            currentTriggerClass(false, active);
        });

    }
};

});
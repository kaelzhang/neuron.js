/**
 * switch plugin: carousel
 */

KM.define(['fx/tween', 'fx/easing'], function(K, require){

var Tween = require('fx/tween'),
	Easing = require('fx/easing'),
	
	EVENT_BEFORE_INIT = 'beforeInit',
    EVENT_AFTER_INIT = 'afterInit',
    EVENT_BEFORE_SWITCH = 'beforeSwitch',
    EVENT_ON_SWITCH = 'switching',
    EVENT_COMPLETE_SWITCH = 'completeSwitch';
    
    
// 检查舞台，删除多余的trigger
// @method checkStage
// @param t {Object} DP.Switch instance
function checkStage(_t){
    var triggerlength = _t.triggers.length,                            
        i;
                        
    // 若trigger数比翻页数更多，则移除多余的trigger，这是为了避免后端输出错误，对js造成影响
    for(i = _t.pages; i < triggerlength; ++ i){
        _t.triggers[i].dispose();
    }

    // 设置container为offsetParent，从而正确的定位和获得偏移量
    if(_t.items[0].offsetParent !== _t.container){
        _t.container.setStyle('position', 'relative');
    }                           
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
        var o = self.options,
            fx = o.fx,
            _offset_direction = 'offset' + o.direction.capitalize();

        function currentTriggerClass(remove, index){
            var t = self,
                currentTrigger = t.triggers[index || t.activeIndex];
                
            currentTrigger && (remove ? 
            	currentTrigger.removeClass(t.options.triggerOnCls) : 
            	currentTrigger.addClass(t.options.triggerOnCls)
            );
        };  

        if(!fx.property){
            fx.property = o.direction;
        };

        fx.onComplete = function(){
            self.fireEvent(EVENT_COMPLETE_SWITCH);
        };

        self.addEvent(EVENT_BEFORE_INIT, function(){
            self.effect = new Tween(self.container, fx);
            delete self.options.fx;
        });

        self.addEvent(EVENT_AFTER_INIT, function(){
            checkStage(self);

            var t = self,
                active = t.activeIndex;

            // there's a bug about moo tools Fx: the container's position must be specified before you use Fx,
            // or the first Fx will have no animation
            t.container.setStyle(o.direction, - t.items[active * t.options.move][_offset_direction] );
            t._dealBtn();
        });

        self.addEvent(EVENT_BEFORE_SWITCH, function(){
            currentTriggerClass(true);
        });

        self.addEvent(EVENT_ON_SWITCH, function(){
            var t = self,
                active = t.activeIndex;

            t._dealBtn();

            t.effect.start( - ( t.items[active * t.options.move] )[_offset_direction] );

            currentTriggerClass(false, active);
        });

    }
};

});
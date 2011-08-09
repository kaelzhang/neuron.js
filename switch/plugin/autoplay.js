/**
 * Switch Plugin: Auto play
 * author  Kael Zhang
 */

KM.define({
    name: 'autoPlay',
    options: {
        // autoPlay: true,
        interval: 3000,
        hoverStop: true
    },

    init: function(self){
        function autoplay(){
            var t = self;
            if(!t.triggerOn && !t.paused){
                t.switchTo( (t.activeIndex + 1) % t.length );
            }
        };

        var o = self.options,
            autoPlayTimer = KM.delay(autoplay, o.interval),
            EVENT_BEFORE_INIT = 'beforeInit',
		    EVENT_AFTER_INIT = 'afterInit',
		    EVENT_BEFORE_SWITCH = 'beforeSwitch',
		    EVENT_ON_SWITCH = 'switching',
		    EVENT_COMPLETE_SWITCH = 'completeSwitch';

        self.addEvent(EVENT_AFTER_INIT, function(){
            var t = self;

            o.hoverStop && t.container.addEvents({
                mouseenter: function(){
                    t.paused = true;
                },

                mouseleave: function(){
                    t.paused = false;
                    autoPlayTimer.start();
                }
            });

            autoPlayTimer.start();
        });

        // 
        self.addEvent(EVENT_BEFORE_SWITCH, function(){
            autoPlayTimer.cancel();
        });
            
        self.addEvent(EVENT_COMPLETE_SWITCH, function(){
            autoPlayTimer.start();
        });
    }
});
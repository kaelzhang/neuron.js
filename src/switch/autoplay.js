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
                t.switchTo( (t.activePage + 1) % t.pages );
            }
        };

        var o = self.options,
            autoPlayTimer = KM.delay(autoplay, o.interval),
            paused = false,
            
            EVENTS = self.get('EVENTS');
		    
		function pause(){
			paused = true;
			autoPlayTimer.cancel();
		};

		function resume(){
			paused = false;
			autoPlayTimer.start();
		};
		    
		self.addEvent(EVENTS.__CONSTRUCT, function(){
			K.mix(self, {
				pause: pause,
				resume: resume
			})
		});

        self.addEvent(EVENTS.AFTER_INIT, function(){
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
        self.addEvent(EVENTS.BEFORE_SWITCH, function(){
            autoPlayTimer.cancel();
        });
            
        self.addEvent(EVENTS.COMPLETE_SWITCH, function(){
            !paused && autoPlayTimer.start();
        });
    }
});

/**
 2011-08-19  Kael:
 - fix a bug calculating activePage when auto playing

 TODO:
 A. add api: pause and resume

 */
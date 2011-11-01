/**
 * Switch Plugin: Auto play
 * author  Kael Zhang
 */

KM.define({
    name: 'autoPlay',
    final_: true,
    
    options: {
        interval: 3000,
        hoverStop: true
    },

    init: function(self){
        function autoplay(){
            var t = self;
            if(!t.triggerOn && !t.paused){
                t.next();
            }
        };

        var autoPlayTimer = KM.delay(autoplay, self.get('interval')),
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
		

        self.on(EVENTS.AFTER_INIT, function(){
            var t = self;
            
            // TODO
            // add queue support
            KM.mix(t, {
				pause: pause,
				resume: resume
			});
			
            t.get('hoverStop') && t.container.on({
            
            	// when mouse hovers over the container, stop autoplaying
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

        self.on(EVENTS.BEFORE_SWITCH, function(){
            autoPlayTimer.cancel();
        });
            
        self.on(EVENTS.COMPLETE_SWITCH, function(){
            !paused && autoPlayTimer.start();
        });
    }
});

/**
 
 2011-10-31  Kael:
 - use .next() method

 2011-08-19  Kael:
 - fix a bug calculating activePage when auto playing

 TODO:
 A. add api: pause and resume

 */
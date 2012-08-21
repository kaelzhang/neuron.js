describe("Neuron: dom/domready", function(){
    var 
    
    $ = NR.DOM,
    domready_time,
    onload_time;
    
    // register `load` event ahead of domready
    $(window).on('load', function(){
        onload_time = + new Date; 
    });
        
    NR.ready(function(){
        domready_time = + new Date; 
    });

    describe("NR.ready(fn)", function(){
        it("`fn` would be executed when `'DOMContentLoaded'` event fired", function(){
            expect().toBe();
        });
        
        it("`fn` should be called before window.onload", function(){
            waitsFor(function(){
               return !!onload_time;
            });
            
            runs(function(){
                expect(onload_time > domready_time).toBe(true);
            });
        });
        
        it("after domready, `fn` passed in NR.ready should be executed immediately", function(){
            waitsFor(function(){
                return !!domready_time;
            });
            
            runs(function(){
                var test;
                
                NR.ready(function(){
                    test = 1;
                });
                
                expect(test).toBe(1);
            })
        });
    });
    
    describe("NR.isDomReady()", function(){
        it("should return true, if DOMContentLoaded fired", function(){
            var ready;
            
            runs(function(){
                NR.ready(function(){
                    ready = true;
                });
            });
            
            waitsFor(function(){
                return ready;
            });
        
            runs(function(){
                expect(NR.isDomReady()).toBe(true);
            });
        });
    });
    
});
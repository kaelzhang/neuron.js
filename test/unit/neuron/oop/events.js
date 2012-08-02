describe("Neuron: oop/events", function(){

var Class = NR.Class;

describe("NR.Class ext: events", function(){
    var EventClass = Class({
            Implements: 'events',
            a: 1,
            b: 2
        });


    describe(".on(), feated with .fire()", function(){
        it("could register a sync event handler", function(){
            var flag = true;
                
            var obj = new EventClass().on('myEvent', function(){
                flag = !flag
            });
        
            expect(flag).toBe(true);
            
            obj.fire('myEvent');
            expect(flag).toBe(false);
            
            obj.fire('myEvent');
            expect(flag).toBe(true);
        });
        
        
        it("could deal with function overloading, and register a list of event handlers", function(){
            var flag1 = true,
                flag2 = true;
                
            var obj = new EventClass().on({
                    event1: function(){
                        flag1 = !flag1;
                    },
                    
                    event2: function(){
                        flag2 = !flag2;
                    }
                });
            
            obj.fire('event1');
            expect(flag1).toBe(false);
            
            obj.fire('event2');
            expect(flag2).toBe(false);
        });
        
        it("the `this` object should be the current instance", function(){
            var obj = new EventClass().on({
                    increase: function(){
                        this.a ++;
                    }
                });
            
            expect(obj.a).toBe(1);
            
            obj.fire('increase');
            expect(obj.a).toBe(2);
        });
        
        it("could register more than one handlers to a same event type", function(){
            var obj = new EventClass();
            
            obj.on({
                increase: function(){
                    this.a ++;
                }
            });
            
            obj.on({
                increase: function(){
                    this.a ++;
                }
            });
        
            expect(obj.a).toBe(1);
            
            obj.fire('increase');
            expect(obj.a).toBe(3);
        });
        
        it("the execution of handlers should be maintained by registering sequence", function(){
            var obj = new EventClass();
            
            obj.on({
                increase: function(){
                    this.a ++;
                }
            });
            
            obj.on({
                increase: function(){
                    this.c = this.a * this.b;
                }
            });
            
            expect(obj.c).toBe(undefined);
            
            obj.fire('increase');
            expect(obj.c).not.toBe(2);
            expect(obj.c).toBe(4);
        });
    });

    describe(".off(type, fn), feated with .fire()", function(){
    
        it("should return the instance", function(){
            var handler = function(){},
                obj = new EventClass().on({
                    increase: handler
                })
        
            expect(obj.off('increase', handler)).toBe(obj);
            expect(obj.off('increase')).toBe(obj);
            expect(obj.off()).toBe(obj);
            
            // error invocation
            expect(obj.off(null)).toBe(obj);
            expect(obj.off(null, null)).toBe(obj);
            expect(obj.off(null, handler)).toBe(obj);
        });
        
        it("could remove a specific handler of a certain type: .off(type, fn)", function(){
            var flag = 1,
                handler = function(){
                    flag ++;  
                },
                obj = new EventClass().on({
                    increase: handler
                });
            
            obj.fire('increase');
            expect(flag).toBe(2);
            
            obj.off('increase', handler);
            obj.fire('increase');
            expect(flag).toBe(2);
        });
        
        it("could remove all handlers of a certain type: .off(type)", function(){
            var flag = 1,
                handler = function(){
                    flag ++;  
                },
                handler2 = function(){
                    flag = flag + 2;  
                },
                obj = new EventClass().on('increase', handler).on('increase', handler2);
            
            obj.off('increase');
            obj.fire('increase');
            expect(flag).toBe(1);
        });
        
        it("could remove all registered events: .off()", function(){
            var flag = 1,
                handler = function(){
                    flag ++;  
                },
                handler2 = function(){
                    flag = flag + 2;  
                },
                obj = new EventClass().on('increase1', handler).on('increase2', handler2);
            
            obj.off();
            obj.fire('increase1');
            obj.fire('increase2');
            expect(flag).toBe(1);
        });
        
        it("would do nothing if bad arguments", function(){
            var flag = 1,
                handler = function(){
                    flag ++;  
                },
                handler2 = function(){
                    flag = flag + 2;  
                },
                obj = new EventClass().on('increase1', handler).on('increase1', handler).on('increase2', handler2);
            
            obj.off(undefined);
            obj.off(undefined, handler);
            obj.off(undefined, undefined);
            obj.off('increase1', undefined);
            
            obj.fire('increase1');
            obj.fire('increase2');
            expect(flag).toBe(5);
        });
    });
    
    
    describe(".fire()", function(){
        
        it("normal fire, with tested before", function(){
            expect().toBe();
        });
    });

    
});
    
});


describe('Neuron: loader-active', function (){


describe("NR.define, feated with NR.provide", function(){
    
    describe("NR.define(exports)", function(){
        
        it("could directly define a module exports", function(){
            var e;
        
            runs(function(){
                NR.provide('test/loader/exports', function(K, E){
                    e = E;
                });
            });
            
            waitsFor(function(){
                return e;
            });
            
            runs(function(){
                expect(e.a).toBe(1);
            });
        });  
    });
    
    describe("NR.define(fn)", function(){
        
        describe("1: exports.xxx = xxx", function(){
            it("module exports could be mixed into argument `exports`", function(){
                var e;
            
                runs(function(){
                    NR.provide('test/loader/fn-exports', function(K, E){
                        e = E;
                    });
                });
                
                waitsFor(function(){
                    return e;
                });
                
                runs(function(){
                    expect(e.a).toBe(1);
                });
            });
        });
        
        describe("2: return exports", function(){
            it("the return value of fn will be the module exports", function(){
                var e;
            
                runs(function(){
                    NR.provide('test/loader/fn-return', function(K, E){
                        e = E;
                    });
                });
                
                waitsFor(function(){
                    return e;
                });
                
                runs(function(){
                    expect(e.a).toBe(1);
                });
            });
        });
        
        describe("3: module.exports", function(){
            it("define module exports with module.exports", function(){
                var e;
            
                runs(function(){
                    NR.provide('test/loader/fn-module-exports', function(K, E){
                        e = E;
                    });
                });
                
                waitsFor(function(){
                    return e;
                });
                
                runs(function(){
                    expect(e.a).toBe(1);
                });
            });
        });
        
        describe("priority: 3 > 2", function(){
            it("module.exports has higher priority", function(){
                var e;
            
                runs(function(){
                    NR.provide('test/loader/fn-3-2', function(K, E){
                        e = E;
                    });
                });
                
                waitsFor(function(){
                    return e;
                });
                
                runs(function(){
                    expect(e.a).toBe(2);
                });
            });
        });
        
        describe("priority: 2 > 1", function(){
            it("the return value has higher priority", function(){
                var e;
            
                runs(function(){
                    NR.provide('test/loader/fn-2-1', function(K, E){
                        e = E;
                    });
                });
                
                waitsFor(function(){
                    return e;
                });
                
                runs(function(){
                    expect(e.a).toBe(2);
                });
            });
        });
        
        describe("priority: 3 > 1", function(){
            it("module.exports has higher priority", function(){
                var e;
            
                runs(function(){
                    NR.provide('test/loader/fn-2-1', function(K, E){
                        e = E;
                    });
                });
                
                waitsFor(function(){
                    return e;
                });
                
                runs(function(){
                    expect(e.a).toBe(2);
                });
            });
        });
        
        describe("highest priority: 3", function(){
            it("module.exports has the highest priority", function(){
                var e;
            
                runs(function(){
                    NR.provide('test/loader/fn-3-2-1', function(K, E){
                        e = E;
                    });
                });
                
                waitsFor(function(){
                    return e;
                });
                
                runs(function(){
                    expect(e.a).toBe(2);
                });
            });
        });
        
    });
    
    describe("private: NR.define(url, [url, [...]] true)", function(){
        
        
        it("could specify the version of a module", function(){
            var a;
        
            runs(function(){
                NR.define('/lib/test/loader/a.v2.js', true);
                NR.provide('test/loader/a', function(K, A){
                    a = A;
                });
            });
            
            waitsFor(function(){
                return a;
            });
            
            runs(function(){
                expect(a).toBe('a');
            });
        });
    });
});


describe("NR.provide", function(){
    describe("NR.provide(dep, fn)", function(){
        it("could load a module, which tested before", function(){
            expect().toBe();
        });
    });
    
    describe("NR.provide(deps, fn)", function(){
        it("could load several modules", function(){
            var loaded,
                a, b;
        
            runs(function(){
                NR.provide(['test/loader/a', 'test/loader/b'], function(K, A, B){
                    a = A;
                    b = B;
                    loaded = true;
                });
            });
            
            waitsFor(function(){
                return loaded;
            });
            
            runs(function(){
                expect(a).toBe('a');
                expect(b).toBe('b');
            });
        });
    });
    
    describe("never duplicate providing", function(){
        it("the module which provided before will never provide again", function(){
            var loaded;
            
            runs(function(){
                NR.provide('test/loader/a', function(K, A){
                    loaded = true
                });
            });
            
            waitsFor(function(){
                return loaded;
            });
            
            runs(function(){
                var a;
                NR.provide('test/loader/a', function(K, A){
                    a = A;
                });
                
                expect(a).toBe('a');
            });
        });
    });
    
    
    describe("NR.provide(dep)", function(){
        it("could pre-load a module", function(){
            expect().toBe();
        });
    });
    
    describe("NR.provide(deps)", function(){
        it("could pre-load several modules", function(){
            expect().toBe();
        });
    });
});


});
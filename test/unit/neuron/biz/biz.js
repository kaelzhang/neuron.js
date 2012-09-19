describe("Neuron: biz", function(){
    
describe('NR.data()', function(){
    it('could store data by key-value, and sharing a global storage', function(){
        NR.data('a', 1);
        NR.data('b', {});
        
        expect(NR.data('a')).toBe(1);
        expect( NR.isObject( NR.data('b')) ).toBe(true); 
    });
    
    
    it('could retrieve data by key, and the result may be the reference of the stored object', function(){
        NR.data('b').a = 2;
    
        expect(NR.data('a')).toBe(1);
        expect( NR.data('b').a ).toBe(2);
    });
    
    it("could deal with setter overloading", function(){
        NR.data({
            c: 1,
            d: {
                a: 1
            }
        })
    
        expect(NR.data('c')).toBe(1);
        expect(NR.data('d').a).toBe(1);
    });

    it("the old value should be overridden, if set the value of the same key more than once", function(){
        NR.data('e', 1);
        NR.data('e', 2);
    
        expect(NR.data('e')).toBe(2);
    });
    
    it("could retrieve the shadow copy of all data", function(){
        NR.data({
            f: 1,
            g: {
                a: 2
            }
        })
    
        var DATA = NR.data();
    
        expect(DATA.f).toBe(1);
        expect(DATA.g.a).toBe(2);
    });
    
    it('could retrieve the shadow copy of all data, so manipulate the copy will not affect the origin object', function(){
        var DATA = NR.data();
        
        DATA.h = 3;
        expect(NR.data('h')).toBe(undefined);
    })
});


describe("NR.require", function(){
    describe("NR.require(mod)", function(){
        it("could load a neuron module", function(){
            runs(function(){
                NR.require('test/require/no-init'); 
            });
            
            waitsFor(function(){
                return window.test_require_no_init; 
            });
            
            runs(function(){
                expect(window.test_require_no_init).toBe(true); 
            });
        });
        
        it("will run `init` method if exists", function(){
            runs(function(){
                NR.require('test/require/with-init'); 
            });
            
            waitsFor(function(){
                return window.test_require_with_init;
            });
            
            runs(function(){
                expect(window.test_require_with_init_id).toBe(100);
            });
        });
    });
    
    describe("NR.require({mod})", function(){
        it("could load a neuron module", function(){
            runs(function(){
                NR.require('test/require/no-init-mod'); 
            });
            
            waitsFor(function(){
                return window.test_require_no_init_mod; 
            });
            
            runs(function(){
                expect(window.test_require_no_init_mod).toBe(true); 
            });
        });
        
        it("will run `init` method if exists", function(){
            runs(function(){
                NR.require('test/require/with-init-mod'); 
            });
            
            waitsFor(function(){
                return window.test_require_with_init_mod;
            });
            
            runs(function(){
                expect(window.test_require_with_init_mod_id).toBe(100);
            });
        });
    });
    
    describe("NR.require({mod, config})", function(){
        it("could assign the value of the argument of `init` by `config`", function(){
            var atom = {};
        
            runs(function(){
                NR.require({
                    mod: 'test/require/with-init-config',
                    config: {
                        id: atom
                    }
                }); 
            });
            
            waitsFor(function(){
                return window.test_require_with_init_config;
            });
            
            runs(function(){
                expect(window.test_require_with_init_config_id).toBe(atom);
            });
        });
    });
});
 
    
});
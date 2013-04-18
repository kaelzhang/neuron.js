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
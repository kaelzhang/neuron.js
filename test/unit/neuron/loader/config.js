describe("test sample business configurations", function(){
 
describe("url map", function(){
    NR.mix(NR._env.loader.urls, {
        '/lib/test/an-unexisted-module.js' : '/lib/test/package/plus-1-whenever-loaded.js'
    });
    
    it("should load modules according to the url map", function(){
        var exports;
        
        runs(function(){
            NR.provide('test/an-unexisted-module', function(NR, API){
                exports = API;
            });  
        });
        
        waitsFor(function(){
            return !!exports; 
        });
        
        runs(function(){
            expect('getCounter' in exports).toBe(true);
        });
    });
    
    it("should never load a single module more than once", function(){
        var exports1, exports2;
    
        runs(function(){
            NR.provide('test/an-unexisted-module', function(NR, API){
                exports1 = API;
            });  
            
            NR.provide('test/an-unexisted-module', function(NR, API){
                exports2 = API;
            });
        });
        
        waitsFor(function(){
            return !!exports1 && !!exports2;
        });
        
        runs(function(){
            expect(exports1.getCounter()).toBe(1);
            expect(exports2.getCounter()).toBe(1);
        });
    });
});


describe("package configuration", function(){
    NR.mix(NR._env.loader.pkgs.pkg, {
        'pkg-1' : '/lib/test/package/pkg-1.js'
    });
    
    NR.mix(NR._env.loader.pkgs.mod, {
        'test/mod-1' : 'pkg-1',
        'test::mod-2' : 'pkg-1'
    });
    
    it("should load package file instead according to the config", function(){
        var exports;
    
        runs(function(){
            NR.provide('test/mod-1', function(NR, API){
                exports = API;
            });
        });
        
        waitsFor(function(){
            return !!exports;
        });
        
        runs(function(){
            expect('getCounter' in exports).toBe(true);
        });
    });
    
    it("package file should not be loaded more than once", function(){
        var exports1, exports2;
    
        runs(function(){
            NR.provide('test/mod-1', function(NR, API){
                exports1 = API;
            });  
            
            NR.provide('test::mod-2', function(NR, API){
                exports2 = API;
            });
        });
        
        waitsFor(function(){
            return !!exports1 && !!exports2;
        });
        
        runs(function(){
            expect(exports1.getCounter()).toBe(1);
            expect(exports2.getCounter()).toBe(2);
        });
    });
});
    
});
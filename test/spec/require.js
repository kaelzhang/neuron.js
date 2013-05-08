var module_require_loaded;
var module_require_inited;

var module_require_2_loaded;
var module_require_2_inited;

var module_require_3_inited;

describe("NR.require", function(){

    var POLL_INTERVAL = 300;

    describe("NR.require(mod)", function(){
        NR.require('require');

        it("could load a neuron module", function(done){
            var timer = setInterval(function() {
                if(module_require_loaded){
                    expect( module_require_loaded === true );
                    done();
                    clearInterval(timer);
                }
            }, POLL_INTERVAL);

        });
        
        it("will run `init` method if exists", function(done){
            var timer = setInterval(function() {
                if(module_require_inited){
                    expect( module_require_inited === true );
                    done();
                    clearInterval(timer);
                }
            }, POLL_INTERVAL);
        });
    });


    describe("NR.require({mod}), to suppress interference, we use a new module", function(){
        NR.require({
            mod: 'require-2'
        });

        it("could load a neuron module", function(done){
            var timer = setInterval(function() {
                if(module_require_2_loaded){
                    expect( module_require_2_loaded === true );
                    done();
                    clearInterval(timer);
                }
            }, POLL_INTERVAL);

        });
        
        it("will run `init` method if exists", function(done){
            var timer = setInterval(function() {
                if(module_require_2_inited){
                    expect( module_require_2_inited === true );
                    done();
                    clearInterval(timer);
                }
            }, POLL_INTERVAL);
        });
    
    });

    describe("NR.require({mod, config})", function(){
        var atom = {};

        NR.require({
            mod: 'require-3',
            config: {
                value: atom
            }
        });

        it("could assign the value of the argument of `init` by `config`", function(done){
            var timer = setInterval(function() {
                if(module_require_2_inited){
                    expect( module_require_2_inited === true );
                    done();
                    clearInterval(timer);
                }

            }, POLL_INTERVAL);
        });
    });

});



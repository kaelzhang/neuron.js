describe('Neuron:loader', function (){

    xdescribe('NR.define()', function (){
        describe('NR.define() with 0 arguments', function (){
            it('0 arguments', function (){
                expert(true).toBeTruthy();
            });

        });
        describe('NR.define() with 1 arguments', function (){
            it('uri passed in', function (){
                expert(true).toBeTruthy();
            });
            it('factory passed in', function (){
                var exports = {a:1}
                NR.define(function (){
                    return exports;
                });
                expect(de)
            });
        });

        describe('NR.define() with 2 arguments', function (){
            it('dependencies and factory passed in', function (){
                //NR.define()
            });
            it('factory passed in', function (){
                expert(true).toBeTruthy();
            });
        });

        describe('NR.define() with 3 arguments', function (){
            it('name, dependencies, factory passed in', function (){
                expert(true).toBeTruthy();
            });
            it('factory passed in', function (){
                expert(true).toBeTruthy();
            });
        });
    });

    describe('NR.provide()', function (){
        it('dependencies, callback passed in', function (){
            //expect(NR.define.__mods['/lib/upload/swfu.js']).toBeUndefined();
            var AjaxHost = undefined;
            NR.provide(['io/ajax'], function(N, Ajax){
                AjaxHost = Ajax;
                //expect(NR.define.__mods['/lib/upload/swfu.js']).toDefined();
                //expect(NR.define.__mods['/lib/1.0/upload/swfu.js'].s).toBe(3);
            });
            waitsFor(function (){
                return AjaxHost;
            });
            runs(function (){
                expect(AjaxHost).toBeDefined();
            });
        });

        xit('dependencies passed in', function (){
            NR.provide(['io/ajax']);
            waitsFor(function (){
                return NR.define.__mods['/lib/io/ajax.js'];
        });

       expect(NR.define.__mods['/lib/io/ajax.js']).toBeDefined();
        });
    });
    xdescribe('NR.require()', function (){

    });

});


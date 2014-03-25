describe("require.async", function(){
    it("require.async should solve module id by the current environment", function(done){
        _use('async@0.0.0', function (a) {
            a.load(function (relative) {
                expect( relative(1) === 2 );
                done();
            });
        });
    });

    it("if main is not index.js, path calculation should not mess up", function(done){
        _use('async-not-index@0.1.0', function (a) {
            a.load(function (relative) {
                expect( relative(1) === 2 );
                done();
            });
        });
    });
});
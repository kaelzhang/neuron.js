describe("neuron.config(combo)", function(){
    it("require.async should solve module id by the current environment", function(done){
        _use('a@0.0.0', function (a) {
            expect(a).to.equal(3);
            done();
        });
    });
});
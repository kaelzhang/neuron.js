describe("neuron.config(combo)", function(){
    it("could analysis dependencies, and load combo file", function(done){
        _use('a@0.0.0', function (a) {
            expect(a).to.equal(3);
            done();
        });
    });

    it("if there's only one file, it won't load combo file", function(done){
        _use('one@0.0.0', function (d) {
            expect(d).to.equal(1);
            done();
        });
    });
});

describe("define, feated with _use", function(){
        
    describe("1. `exports.xxx = xxx`", function(){
        it("module exports could be mixed into argument `exports`", function(done){

            _use('exports', function(e) {
                expect( e.a === 1 );
                done();
            });
        });
    });
        
    describe("2. `module.exports`", function(){
        it("define module exports with module.exports", function(done){
        
            _use('module-exports', function(e) {
                expect( e.a === 1 );
                done();
            });
        });
    });
        
    describe("exports priority: 2 > 1", function(){
        it("module.exports has higher priority", function(done){
            
            _use('exports-priority', function(e) {
                expect( e.a === 1 );
                done();
            });
        
        });
    });        
});


describe("require", function(){
  it("should throw error if module not found", function(done){
    _use('mod-not-found', function (e) {
      expect(/Cannot find module/i.test(e.message)).to.equal(true);
      done();
    });
  });
});



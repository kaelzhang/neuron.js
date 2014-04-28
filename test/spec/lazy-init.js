'use strict';

// for issue #82

describe("lazy factory initialization", function(){
    it("only run factories when `require()`d", function(done){
        _use('lazy', function (lazy) {
            expect(lazy.a).to.equal(1);
            done();
        })
    });
});
describe("Neuron: seed", function(){

describe("Env detection", function(){
    it("running on env with window object", function(){
        expect(!!window).toBe(true);
        expect(!!window.setInterval).toBe(true);
    });
});


describe("NR initialization", function(){
    it("old `NR` object should be retained", function(){
        expect(NR._old).toBe(true);
    });
    
    it("`NR` must be the former `NR`", function(){
        expect(OLD_NR).toBe(NR);
    });
});
 
/*
describe("NR._debugOn()", function(){
    it("will switch on debug mode", function(){
        NR._debugOn();
        
        expect(NR._env.debug).toBe(true);
    });
});
*/
    
});
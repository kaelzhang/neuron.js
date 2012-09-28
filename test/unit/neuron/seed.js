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


describe("type detection", function(){
    describe("NR.isBoolean()", function(){
        it("true is a boolean", function(){
            expect(NR.isBoolean(true)).toBe(true);
        });
        
        it("new Boolean(true) is a boolean", function(){
            expect(NR.isBoolean(new Boolean(true))).toBe(true);
        });
        
        it("whether or not, always returns a boolean", function(){
            expect(NR.isBoolean()).toBe(false);
            expect(NR.isBoolean(1)).toBe(false);
            expect(NR.isBoolean('')).toBe(false);
        });
    });
    
    describe("NR.isNumber()", function(){
        it("1 is a number", function(){
            expect(NR.isNumber(1)).toBe(true);
        });
        
        it("Number.POSITIVE_INFINITY is a number", function(){
            expect(NR.isNumber(Number.POSITIVE_INFINITY)).toBe(true);
        });
        
        it("Number.NEGATIVE_INFINITY is a number", function(){
            expect(NR.isNumber(Number.NEGATIVE_INFINITY)).toBe(true);
        });
        
        it("whether or not, always returns a boolean", function(){
            expect(NR.isNumber('')).toBe(false);
            expect(NR.isNumber()).toBe(false);
        });
    });
    
    describe("NR.isString()", function(){
        it("empty string is a string", function(){
            expect(NR.isString('')).toBe(true);
        });
        
        it("'abc' is a string", function(){
            expect(NR.isString('abc')).toBe(true);
        });
        
        it("whether or not, always returns a boolean", function(){
            expect(NR.isString(1)).toBe(false);
            expect(NR.isString()).toBe(false);
        });
    });
    
    describe("NR.isFunction()", function(){
        it("empty function is a function", function(){
            function a(){};
            expect(NR.isFunction(a)).toBe(true);
        });
        
        it("a function with a specified prototype is a function", function(){
            function b(){};
            b.prototype = {
                a: 1,
                b: 2
            };
        
            expect(NR.isFunction(b)).toBe(true);
        });
        
        it("an NR.Class instance is a function", function(){
            var myClass = NR.Class();
            
            expect(NR.isFunction(myClass)).toBe(true);
        });
        
        it("whether or not, always returns a boolean", function(){
            expect(NR.isFunction()).toBe(false);
        });
    });
    
    describe("NR.isArray()", function(){
        it("[1] is an array", function(){
            expect(NR.isArray([1])).toBe(true);
        });
        
        it("a nodelist is not an array", function(){
            var divs = document.getElementsByTagName('div');
            expect(NR.isArray(divs)).toBe(false);
        });
        
        (function(){
            var arg = arguments;
        
            it("arguments is not an array", function(){
                expect(NR.isArray(arg)).toBe(false);
            });
            
        })();
        
        it("whether or not, always returns a boolean", function(){
            expect(NR.isArray()).toBe(false);
            expect(NR.isArray('')).toBe(false);
        });
    });
    
    describe("NR.isDate()", function(){
        it("new Date is a Date instance", function(){
            expect(NR.isDate(new Date)).toBe(true);
            expect(NR.isDate(new Date(2012))).toBe(true);
            expect(NR.isDate(new Date(+ new Date))).toBe(true);
        });
    });
    
    describe("NR.isRegExp()", function(){
        it("should detect whether an subject is a regular expression", function(){
            expect(NR.isRegExp(/a/)).toBe(true);
        });
    });
    
    describe("NR.isObject()", function(){
        it("undefined is not an object(which in ie, typeof undefined === 'object')", function(){
            expect(NR.isObject(undefined)).toBe(false);
            expect(NR.isObject()).toBe(false);
        });
        
        it("null is not an object", function(){
            expect(NR.isObject(null)).toBe(false);
        });
        
        it("a plain object is an object", function(){
            expect(NR.isObject({})).toBe(true);
        });
        
        it("an normal function instance is an object", function(){
            function A(){};
            expect(NR.isObject(new A)).toBe(true);
        });
        
        it("window is an object", function(){
            expect(NR.isObject(window)).toBe(true);
        });
        
        it("NodeList/DOMElement is an object", function(){
            var divs = document.getElementsByTagName('div');
            expect(NR.isObject(divs)).toBe(true);
            expect(divs.length ? NR.isObject(divs[0]) : true).toBe(true);
        });
    });
    
    describe("NR.isPlainObject", function(){
        it("simple objects which created with {} and new Object() are plain objects", function(){
            expect(NR.isPlainObject({})).toBe(true);
            expect(NR.isPlainObject(new Object({a: 1}))).toBe(true);
        });
        
        it("an normal function instance is a plain object", function(){
            function A(){};
            expect(NR.isPlainObject(new A)).toBe(true);
        });
        
        it("the instance of the NR.Class instance is a plain object", function(){
            var A = NR.Class();
            expect(NR.isPlainObject(new A)).toBe(true);
        });
        
        it("NodeList/DOMElement is not plain object", function(){
            var divs = document.getElementsByTagName('div');
            expect(NR.isPlainObject(divs)).toBe(false);
            expect(divs.length ? NR.isPlainObject(divs[0]) : false).toBe(false);
        });
    });
    
    describe("NR.isWindow()", function(){
        it("window", function(){
            expect(NR.isWindow(window)).toBe(true);
        });
    });
});
 
describe("NR._debugOn()", function(){
    it("will switch on debug mode", function(){
        NR._debugOn();
        
        expect(NR._env.debug).toBe(true);
    });
});
    
});
describe('Neuron:lang/native', function(){

function createArrayLikeObject(array){
    var ret = {
            splice: Array.prototype.splice
        },
        
        len = ret.length = array.length,
        i = 0;
        
    for(; i < len; i ++){
        ret[i] = array[i];
    }
    
    return ret;
};


function testFn(){
    global_this = this;
};

var global_this;

testFn();


describe('Array', function(){
    function foo(){};

    var obj = {},
        obj2 = {},
        a = [
            1,      // 0
            '2', 
            foo,    // 2
            obj, 
            1,      // 4
            '2', 
            foo,    // 6
            obj2
        ];

    describe(".indexOf()", function(){
        var AP_indexOf = Array.prototype.indexOf;
    
        describe(".indexOf(searchSubject)", function(){
            it("returns the index of matched subject", function(){
                expect( a.indexOf(1) ).toBe(0);
                expect( a.indexOf('2') ).toBe(1);
                expect( a.indexOf(foo) ).toBe(2);
                expect( a.indexOf(obj) ).toBe(3);
            });
            
            it("returns -1 if no match found", function(){
                expect( a.indexOf(function(){}) ).toBe(-1);
                expect( a.indexOf(2) ).toBe(-1);
                expect( a.indexOf({}) ).toBe(-1);
            });
        });
        
        describe(".indexOf(searchSubject) called with Array-like Object", function(){
            var ao = createArrayLikeObject(a);
            
            it("Array-like Objects could use .indexOf with Array.prototype.indexOf.call", function(){
                expect(AP_indexOf.call(ao, 1) ).toBe(0);
                expect(AP_indexOf.call(ao, obj) ).toBe(3);
            });
        });
        
        describe(".indexOf(searchSubject, fromIndex)", function(){
            it("fromIndex parameter could assign the index at which to begin the search", function(){
                expect( a.indexOf(1, 3) ).toBe(4);
                expect( a.indexOf(foo, 3) ).toBe(6);
                expect( a.indexOf(obj, 3) ).toBe(3);
                expect( a.indexOf(obj, 4) ).toBe(-1);
            });
            
            it("called with Array-like Object", function(){
                var ao = createArrayLikeObject(a);
            
                expect( AP_indexOf.call(ao, 1, 3) ).toBe(4);
                expect( AP_indexOf.call(ao, foo, 3) ).toBe(6);
                expect( AP_indexOf.call(ao, obj, 3) ).toBe(3);
                expect( AP_indexOf.call(ao, obj, 4) ).toBe(-1);
            });
        });
        
        describe("fromIndex < 0", function(){
            it("will calulate a start index", function(){
                
                expect( a.indexOf(1, -5) ).toBe(4);
                expect( a.indexOf(foo, -5) ).toBe(6);
            });
        
            it("will search the whole array, if calculated < 0", function(){
                expect( a.indexOf(1, -9) ).toBe(0);
                expect( a.indexOf('2', -9) ).toBe(1);
            });
        });
        
        describe("fromIndex as float numbers", function(){
            it("fromIndex < 0", function(){
                expect(a.indexOf(1, -3.5)).toBe(-1);
                expect(a.indexOf(1, -4.5)).toBe(4);
            });
            
            it("fromIndex > 0", function(){
                expect(a.indexOf(1, 4.5)).toBe(4);
                expect(a.indexOf(1, 5.5)).toBe(-1);
            });
        });
        
        describe("will never traverse deleted values", function(){
            it("delete array[0]", function(){
                var arr = [1, 2, 3, 4];
                    
                delete arr[0];
            
                expect(arr.indexOf(undefined)).toBe(-1);
            });
        });
    });
    
    
    describe(".lastIndexOf()", function(){
        var AP_lastIndexOf = Array.prototype.lastIndexOf;
    
        describe(".lastIndexOf(searchSubject)", function(){
            it("normal invocation", function(){
                expect( a.lastIndexOf(1) ).toBe(4);
                expect( a.lastIndexOf('2') ).toBe(5);
                expect( a.lastIndexOf(foo) ).toBe(6);
            });
            
            it("returns -1 if no match found", function(){
                expect( a.lastIndexOf(2) ).toBe(-1);
                expect( a.lastIndexOf(function(){}) ).toBe(-1);
                expect( a.lastIndexOf({}) ).toBe(-1);
            });
            
            it("called with Array-like Object", function(){
                var ao = createArrayLikeObject(a);
            
                expect( AP_lastIndexOf.call(ao, 1) ).toBe(4);
                expect( AP_lastIndexOf.call(ao, foo) ).toBe(6);
            });
        });
        
        describe(".lastIndexOf(searchSubject, fromIndex)", function(){
            var ao = createArrayLikeObject(a);
        
            it("fromIndex parameter could assign the index at which to begin the search", function(){
                expect(a.lastIndexOf(1, 3)).toBe(0);
                expect(a.lastIndexOf(1, 4)).toBe(4);
            });
            
            it("the whold array will be searched if fromIndex >= length", function(){
                expect(a.lastIndexOf(1, 9)).toBe(4);
                expect(a.lastIndexOf(1, 8)).toBe(4);
            });
            
            it("fromIndex < 0", function(){
                expect(a.lastIndexOf(1, -1)).toBe(4);
            });
            
            it("returns -1, if calculated < 0", function(){
                expect(a.lastIndexOf(1, -100)).toBe(-1);
                expect( a.lastIndexOf(foo, -100) ).toBe(-1);
            });
            
            it("called with Array-like Object", function(){
                expect( AP_lastIndexOf.call(ao, 1, 4) ).toBe(4);
                expect( AP_lastIndexOf.call(ao, 1, 9) ).toBe(4);
                expect( AP_lastIndexOf.call(ao, 1, -100) ).toBe(-1);
            });
        });
        
        describe("fromIndex as float numbers", function(){
            var array = [1, 2, 3, 2, 1];
        
            it("fromIndex < 0", function(){
                expect(array.lastIndexOf(1, -1.5)).toBe(4);
                expect(array.lastIndexOf(1, -2.5)).toBe(0);
            });
            
            it("fromIndex > 0", function(){
                expect(array.lastIndexOf(2, 1.5)).toBe(1);
                expect(array.lastIndexOf(2, 0.5)).toBe(-1);
            });
        });
        
        describe("will never traverse deleted values", function(){
            it("delete array[0]", function(){
                var arr = [1, 2, 3, 4];
                    
                delete arr[0];
            
                expect(arr.lastIndexOf(undefined)).toBe(-1);
            });
        });
    });
    
    describe(".filter()", function(){
        function NOOP(){
        };
        
        function foo(){
        }
    
        var arr = [1, '2', foo, {}, undefined, null, true];
    
        describe(".filter(filterFn)", function(){
            it("always returns a new array", function(){
                expect(arr.filter(NOOP) === arr).toBe(false);
            });
            
            it("could filter the array by filterFn", function(){
                expect(arr.filter(NR.isFunction).length).toBe(1);
                expect(arr.filter(NR.isFunction)[0]).toBe(foo);
                expect(arr.filter(function(s){
                        return !!s;
                    }).length
                ).toBe(5);
            });
        });
        
        describe(".filter(filterFn, thisObject)", function(){
        
            it("could assign the `this` object of filterFn by thisObject", function(){
                expect().toBe();
            });
            
            it("if thisObject is not set, `this` of filterFn will be global object which associated with filterFn", function(){
                var filter_this;
                
                arr.filter(function(){
                    filter_this = this;
                });
            
                expect(filter_this).toBe(global_this);
            });
            
            it("if thisObject is set to null, `this` of filterFn will be global object which associated with filterFn", function(){
                var filter_this;
                
                arr.filter(function(){
                    filter_this = this;
                }, null);
            
                expect(filter_this).toBe(global_this);
            });
        });
    });
    
    describe('.forEach()', function (){
        var AP_forEach = Array.prototype.forEach;
    
        describe(".forEach(callback)", function(){
            it("normal invocation", function(){
                var arr = [1, 2, 3, 4],
                    passed = true,
                    copy = [].concat(arr),
                    len = arr.length;
                
                arr.forEach(function (item, index){
                    arr[index] = item + 1;
                });
                
                for(var i = 0; i < len; i ++){
                    if(copy[i] === (arr[i]-1)){
                        continue;
                    }else{
                        passed = false;
                    }
                }
                expect(passed).toBe(true);
            });
        });
        
        describe(".forEach(callback, thisObject)", function(){
            it("normal invocation", function(){
                var arr     = [1, 2, 3, 4],
                    append  = [2, 3, 4, 5],
                    result  = [3, 5, 7, 9];
                
                arr.forEach(function(v, i, arr){
                    arr[i] = v + this[i];
                }, append)
                    
                expect(arr).toEqual(result);
            });
            
            it("this object of callback should be `global_this`, if thisObject is not set or set to null", function(){
                var callback_this;
                
                [1].forEach(function(){
                    callback_this = this;
                }, null);
            
                expect(callback_this).toBe(global_this);
            });
        });
        
        describe("called with an Array-like Object", function(){
            it("should act as an array", function(){
                var aobj    = createArrayLikeObject([1, 2, 3, 4]),
                    append  = [2, 3, 4, 5],
                    result  = [3, 5, 7, 9];
                
                AP_forEach.call(aobj, function(v, i, arr){
                    arr[i] = v + this[i];
                }, append);
                    
                expect(aobj[1]).toEqual(result[1]);
            });
        });
        
        describe("will never traverse deleted values", function(){
            it("delete array[0]", function(){
                var arr = [1, 2, 3, 4],
                    fail;
                    
                delete arr[0];
                    
                arr.forEach(function(v, i){
                    if(i === 0){
                        fail = true;
                    }
                });
            
                expect(fail === true).toBe(false);
            });
            
            it("delete obj[0]", function(){
                var arr = createArrayLikeObject([1, 2, 3, 4]),
                    fail;
                    
                delete arr[0];
                    
                AP_forEach.call(arr, function(v, i){
                    if(i === 0){
                        fail = true;
                    }
                });
            
                expect(fail === true).toBe(false);
            
                expect().toBe();
            });
        });
    });

    describe('.every()', function (){
        var AP_every = Array.prototype.every;
    
        describe(".every(checker)", function(){
            it("normal invocation", function(){
                var arr = [1, 2, 3, 4];
            
                expect(arr.every(NR.isNumber)).toBe(true);
            });
        
            it("should stop calling the checker immediately when checker returns a false value", function(){
                var fail = false,
                    arr = [1, 2, null, 4];
                    
                var result = arr.every(function(v, i){
                        if(i === 3){
                            fail = true;
                        }
                
                        return NR.isNumber(v); 
                    });
            
                expect(fail).toBe(false);
                expect(result).toBe(false);
            });
            
            it("will never traverse deleted values", function(){
                var arr = [null, 2, 3, 4],
                    fail;
                    
                delete arr[0];
            
                expect(arr.every(NR.isNumber)).toBe(true);
            });
        });
        
        describe(".every(checker, thisObject)", function(){
            it("normal invocation", function(){
                var arr = [1, null, null, 4],
                    filter_array = [1, 0, 0, 1];
                
                expect(arr.every(function(v, i){
                    return !this[i] || NR.isNumber(v)
                    
                }, filter_array)).toBe(true);
            });
            
            it("will never traverse deleted values", function(){
                var arr = createArrayLikeObject([null, 2, 3, 4]);
                    
                delete arr[0];
            
                expect(AP_every.call(arr, NR.isNumber)).toBe(true);
            });
        });
    });


    describe('.map()', function (){
        var AP_map = Array.prototype.map;
    
        describe(".map(mapper)", function(){
            it("normal invocation", function(){
                var arr = [1, 2, 3, 4];
                expect(arr.map(function(v){return v + 1;})).toEqual([2, 3, 4, 5]);
            });
            
            it("will never traverse deleted values", function(){
                var arr = [1, 2, 3, 4],
                    zero = 0;
                    
                delete arr[0];
                
                var result = arr.map(function(v){
                    return v + 1; 
                });
                
                expect(zero in result).toBe(false);
            });
            
            it("called with an Array-like Object", function(){
                var arr = createArrayLikeObject([1, 2, 3, 4]),
                    zero = 0;
                
                delete arr[0];
                
                var result = AP_map.call(arr, function(v){
                    return v + 1; 
                });
            
                expect(NR.isArray(result)).toBe(true);
                expect(zero in result).toBe(false);
            });
        });
        
        describe(".map(mapper, thisObject)", function(){
            it("normal invocation", function(){
                var arr = [1, 2, 3, 4],
                    mapper_arr = [1, 0, 0, 0];
                    
                expect(arr.map(function(v, i){return v + this[i];}, mapper_arr)).toEqual([2, 2, 3, 4]);
            });
        });
    });

    describe('.some()', function (){
        it('normal call', function (){
            var arr = [1,2,3];
            expect(arr.some(function (item){return item > 2})).toBeTruthy();
            expect(arr.some(function (item){return item > 12})).toBeFalsy();
        });
        
        it("should stop calling the checker immediately when checker returns a true value", function(){
            var fail = false,
                arr = [1, 2, null, 4];
                
            var result = arr.some(function(v, i){
                    if(i === 3){
                        fail = true;
                    }
            
                    return !NR.isNumber(v); 
                });
        
            expect(fail).toBe(false);
            expect(result).toBe(true);
        });
        
        it("will never traverse deleted values", function(){
            var arr = [1, 2, 3, 4];
            
            delete arr[0];
            
            var result = arr.some(function(v){
                return !NR.isNumber(v); 
            });
        
            expect(result).toBe(false);
        });
    });

    describe('.reduce()', function(){
        
        describe(".reduce(callback)", function(){
            it("if no initialValue is not assigned, it will start with the second subject", function(){
                var arr = [1, 1, 1, 1],
                    first;
                    
                var result = arr.reduce(function(p, c, i){
                     if(first === undefined){
                         first = i;
                     }
                     
                     return p + c;
                });
                
                expect(first).toBe(1);
                expect(result).toBe(4);
            });
            
            it("will exclude holes of the array", function(){
                var arr = [1, 1, 1, 1],
                    first;
                    
                delete arr[1];
                    
                var result = arr.reduce(function(p, c, i){
                     if(first === undefined){
                         first = i;
                     }
                     
                     return p + c;
                });
                
                expect(first).toBe(2);
                expect(result).toBe(3);
            });
        });
        
        describe(".reduce(callback, initialValue)", function(){
            it("if initialValue is assigned, it will start with the first subject", function(){
                var arr = [1, 1, 1, 1],
                    first;
                    
                var result = arr.reduce(function(p, c, i){
                     if(first === undefined){
                         first = i;
                     }
                     
                     return p + c;
                }, 1);
                
                expect(first).toBe(0);
                expect(result).toBe(5);
            });
            
            it("will exclude holes of the array", function(){
                var arr = [1, 1, 1, 1],
                    first;
                    
                delete arr[0];
                    
                var result = arr.reduce(function(p, c, i){
                     if(first === undefined){
                         first = i;
                     }
                     
                     return p + c;
                }, 1);
                
                expect(first).toBe(1);
                expect(result).toBe(4);
            });
        });
    });
    
    
    describe('.reduceRight()', function(){
        
        describe(".reduceRight(callback)", function(){
            it("if no initialValue is not assigned, it will start with the second subject", function(){
                var arr = [1, 1, 1, 1],
                    first;
                    
                var result = arr.reduceRight(function(p, c, i){
                     if(first === undefined){
                         first = i;
                     }
                     
                     return p + c;
                });
                
                expect(first).toBe(2);
                expect(result).toBe(4);
            });
            
            it("will exclude holes of the array", function(){
                var arr = [1, 1, 1, 1],
                    first;
                    
                delete arr[2];
                    
                var result = arr.reduceRight(function(p, c, i){
                     if(first === undefined){
                         first = i;
                     }
                     
                     return p + c;
                });
                
                expect(first).toBe(1);
                expect(result).toBe(3);
            });
        });
        
        describe(".reduceRight(callback, initialValue)", function(){
            it("if initialValue is assigned, it will start with the first subject", function(){
                var arr = [1, 1, 1, 1],
                    first;
                    
                var result = arr.reduceRight(function(p, c, i){
                     if(first === undefined){
                         first = i;
                     }
                     
                     return p + c;
                }, 1);
                
                expect(first).toBe(3);
                expect(result).toBe(5);
            });
            
            it("will exclude holes of the array", function(){
                var arr = [1, 1, 1, 1],
                    first;
                    
                delete arr[3];
                    
                var result = arr.reduceRight(function(p, c, i){
                     if(first === undefined){
                         first = i;
                     }
                     
                     return p + c;
                }, 1);
                
                expect(first).toBe(2);
                expect(result).toBe(4);
            });
        });
    });
    
    
});


describe('Object', function(){
    describe('Object.create()', function (){
        describe("Object.create(proto)", function(){
            it('create a object', function (){
                var obj = {a:1, b:2},
                    newObject = Object.create(obj);
    
                expect(obj.isPrototypeOf(newObject)).toBe(true);
            });
        });
        
        describe(".create(proto, properties)", function(){
            
        });
    });
    
    describe('Object.keys()', function (){
        describe("standard", function(){
            it('could get keys of object', function (){
                var obj={a:1,b:2};
    
                expect(Object.keys(obj)).toEqual(["a", "b"]);
            });
            
            it('could get keys of array', function (){
                var obj2 = [1,2];
                obj2.aa='1';
                expect(Object.keys(obj2)).toEqual(["0", "1", "aa"]);
            });
            
            it("will not enumerate prototype properties", function(){
                function myClass(){
                    this.b = 2;
                };
                
                myClass.prototype = {
                    a: 1
                };
                
                var obj = new myClass();
            
                expect(Object.keys(obj)).toEqual(['b']);
            });
        });
        
        describe("will cover the bug that some property could not be enumerated by some browsers", function(){
            [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ].forEach(function(key){
                it("could enumerate '" + key + "'", function(){
                    var obj = {};
                    
                    obj[key] = 1;
                
                    expect(Object.keys(obj)[0]).toBe(key);
                });
            });
        });

    });
});


describe('String', function(){
    describe('.trimLeft()', function (){
        it('could remove whitespaces from left end of a string', function (){
            var str = '   hello   ';
            expect(str.trimLeft()).toBe('hello   ');
        });
    });

    describe('.trimRight()', function (){
        it('could remove whitespaces from right end of a string', function (){
            var str = '   hello   ';
           expect(str.trimRight()).toBe('   hello');
        });
    });

    describe('.trim()', function (){
        it('could remove whitespaces from both ends of a string', function (){
            var str = '   hello   ';
            expect(str.trim()).toBe('hello');
        });
    });
});


});
describe("预设不存在 unexist",function(){
    it("name为，test(\"\")为false，hint为null",function(){
    
        var ready = false;    
        runs(function(){
            NR.provide('form/rule',function(D,Rule){
                ready = true;
                var r1;
                
                try{
                    r1 = Rule.produce("unexist");
                }catch(e){
                      expect(e).toEqual("Rule preset unexist does not exist");    
                }
              });
        });
        
        waitsFor(function(){
            return ready;    
        });
    });
});

describe("简单预设 required",function(){
    it("name为required，test(\"\")为false，hint为null",function(){
    
        var ready = false;    
        runs(function(){
            NR.provide('form/rule',function(D,Rule){
                ready = true;
                
                var r1 = Rule.produce("required");
                  expect(r1.name).toEqual("required");
                  expect(r1.test("")).toEqual(false);
                  expect(r1.test(null)).toEqual(false);
                  expect(r1.test(undefined)).toEqual(false);
                  expect(r1.test(0)).toEqual(false);
                  expect(r1.test("ha")).toEqual(true);
                  expect(r1.hint).toEqual(null);
              });
        });
        
        waitsFor(function(){
            return ready;    
        });
    });
});

describe("简单预设 notempty",function(){
    it("name为notempty，test(\"\")为false，hint为null",function(){
    
        var ready = false;    
        runs(function(){
            NR.provide('form/rule',function(D,Rule){
                ready = true;
                
                var r1 = Rule.produce("notempty");
                  expect(r1.name).toEqual("notempty");
                  expect(r1.test([])).toEqual(false);
                  expect(r1.test([1])).toEqual(true);
                  expect(r1.hint).toEqual(null);
              });
        });
        
        waitsFor(function(){
            return ready;    
        });
    });
});


describe("简单预设 numeric",function(){
    it("name为numeric",function(){
    
        var ready = false;    
        runs(function(){
            NR.provide('form/rule',function(D,Rule){
                ready = true;
                
                var r1 = Rule.produce("numeric");
                  expect(r1.name).toEqual("numeric");
                  expect(r1.test("")).toEqual(false);
                  expect(r1.test("23")).toEqual(true);
                  expect(r1.test(13)).toEqual(true);
                  expect(r1.test(0)).toEqual(true);
                  expect(r1.hint).toEqual(null);
              });
        });
        
        waitsFor(function(){
            return ready;    
        });
    });
});


describe("简单预设 equal",function(){
    it("name为equal:abc，test(\"abc\")为true，test(\"b\")为false，hint为null",function(){
    
        var ready = false;    
        runs(function(){
            NR.provide('form/rule',function(D,Rule){
                ready = true;
                
                var r1 = Rule.produce("equal:abc");
                  expect(r1.name).toEqual("equal");
                  expect(r1.test("abc")).toEqual(true);
                  expect(r1.test("b")).toEqual(false);
                  expect(r1.hint).toEqual(null);
              });
        });
        
        waitsFor(function(){
            return ready;    
        });
    });
});




describe("简单预设 unequal",function(){
    it("name为unequal:abc，test(\"abc\")为false，test(\"b\")为true，hint为null",function(){
    
        var ready = false;    
        runs(function(){
            NR.provide('form/rule',function(D,Rule){
                ready = true;
                
                var r1 = Rule.produce("unequal:abc");
                  expect(r1.name).toEqual("unequal");
                  expect(r1.test("abc")).toEqual(false);
                  expect(r1.test("b")).toEqual(true);
                  expect(r1.hint).toEqual(null);
              });
        });
        
        waitsFor(function(){
            return ready;    
        });
    });
});



describe("简单预设 email",function(){
    it("name为email，test(\"aaa@163.com\")为true，hint为null",function(){
    
        var ready = false;    
        runs(function(){
            NR.provide('form/rule',function(D,Rule){
                ready = true;
                
                var r1 = Rule.produce("email");
                  expect(r1.name).toEqual("email");
                  expect(r1.test("aaa@163.com")).toEqual(true);
                  expect(r1.hint).toEqual(null);
              });
        });
        
        waitsFor(function(){
            return ready;    
        });
    });
});


describe("预设配置 {name:email,hint:\"必须为email\"}",function(){
    it("name为\"email\"，hint为\"必须为email\"",function(){
    
        var ready = false;    
        runs(function(){
            NR.provide('form/rule',function(D,Rule){
                ready = true;
                
                var r2 = Rule.produce({
                    test:"email",
                    hint:"必须为email"
                });
                  expect(r2.name).toEqual("email");
                  expect(r2.hint).toEqual("必须为email");
              });
        });
        
        waitsFor(function(){
            return ready;    
        });
    });
});




describe("带参数预设配置 {test:\"min:5\",hint:\"长度不小于{0}\"}",function(){
    it("name为\"min\"，hint为\"长度不小于5\"，test abc为false，abcde为true，abcdef为true",function(){
    
        var ready = false;    
        runs(function(){
            NR.provide('form/rule',function(D,Rule){
                ready = true;
                
                var r3 = Rule.produce({
                    test:"min:5",
                    hint:"长度不小于{0}"
                });
                
                  expect(r3.name).toEqual("min");
                  expect(r3.hint).toEqual("长度不小于5");
                  expect(r3.test("abc")).toEqual(false);
                  expect(r3.test("abcde")).toEqual(true);
                  expect(r3.test("abcdef")).toEqual(true);
                  
              });
        });
        
        waitsFor(function(){
            return ready;    
        });
    });
});


describe("带参数预设配置 {test:\"max:5\",hint:\"长度不大于{0}\"}",function(){
    it("name为\"max\"，hint为\"长度不大于5\"，test abc为true，abcde为true，abcdef为false",function(){
    
        var ready = false;    
        runs(function(){
            NR.provide('form/rule',function(D,Rule){
                ready = true;
                
                var r3 = Rule.produce({
                    test:"max:5",
                    hint:"长度不大于{0}"
                });
                
                  expect(r3.name).toEqual("max");
                  expect(r3.hint).toEqual("长度不大于5");
                  expect(r3.test("abc")).toEqual(true);
                  expect(r3.test("abcde")).toEqual(true);
                  expect(r3.test("abcdef")).toEqual(false);
                  
              });
        });
        
        waitsFor(function(){
            return ready;    
        });
    });
});


describe("参数预设配置 in:a,b,c",function(){
    it("name为in",function(){
    
        var ready = false;    
        runs(function(){
            NR.provide('form/rule',function(D,Rule){
                ready = true;
                
                var r1 = Rule.produce("in:a,b,c");
                  expect(r1.name).toEqual("in");
                  expect(r1.test("a")).toEqual(true);
                  expect(r1.test("b")).toEqual(true);
                  expect(r1.test("c")).toEqual(true);
                  expect(r1.test("d")).toEqual(false);
                  expect(r1.hint).toEqual(null);
              });
        });
        
        waitsFor(function(){
            return ready;    
        });
    });
});




describe("自定义函数test",function(){
    it("name为\"mytest\"，hint为\"值必须为123\"，test 123为true",function(){
    
        var ready = false;    
        runs(function(){
            NR.provide('form/rule',function(D,Rule){
                ready = true;
                
                var r4 = Rule.produce({
                    name:"mytest",
                    test:function(v){
                        return v === 123;
                    },
                    hint:"值必须为123"
                });
            
                  expect(r4.name).toEqual("mytest");
                  expect(r4.hint).toEqual("值必须为123");
                  expect(r4.test(123)).toEqual(true);
                  
              });
        });
        
        waitsFor(function(){
            return ready;    
        });
    });
});
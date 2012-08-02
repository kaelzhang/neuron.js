describe('Neuron: oop/class', function(){


describe('NR.Class', function(){
    var Class = NR.Class,
        
        myClass = Class({
            initialize: function(n){
                this.c = n;
            },
            
            get: function(){
                return this.c * 10;
            },
            
            data: {
                a: 1,
                b: 2
            },
            
            _data: {
                a: 1
            },
            
            _data2: {
                a: 1
            }
        }),
        
        subClass = Class({
            Extends: myClass,
        
            initialize: function(n){
                this.c = n * 100;
            },
            
            data2: {
                a: 11
            }
        });
    
    it('basic functionalities testing', function(){
        var ins = new myClass(2);
        
        expect(ins.get()).toBe(20);
    });
    
    it('would create a pure class with tidy prototype', function(){
        expect(myClass.prototype.data.a).toBe(1);
    });
    
    it('would unlink the reference to its prototype', function(){
        var ins = new myClass(2);
        
        ins._data.a = 11;
        
        expect(myClass.prototype._data.a).toBe(1);
        
        myClass.prototype._data.a = 111;
        expect(ins._data.a).toBe(11);
    });
    
    it('would always maintain the prototype chain', function(){
        var ins = new myClass(2);
        
        delete ins._data2.a;
        expect(ins._data2.a).toBe(1);
        
        myClass.prototype._data2.a = 111;
        delete ins._data2.a;
        expect(ins._data2.a).toBe(111);
    });
    
    it('could inherit from a pure constructor', function(){
        function parentClass(){};
        
        parentClass.prototype = {
            a: {
                a: 1
            },
            
            b: [1, 2, 3],
            
            c: 1,
            
            method: function(){
                return this.c
            }
        };
        
        var myClass = Class({
            Extends: parentClass,
            
            method2: function(){
                return this.c * 10;
            }
        });
        
        var c = new myClass,
            cp = new parentClass;
        
        expect(c.method()).toBe(1);
        expect(c.method2()).toBe(10);
        expect(cp.method2).toBeUndefined();
        
        expect(c.a.a).toBe(1);
        delete c.a.a;
        expect(c.a.a).toBe(1);
        
    });
    
    it('could inherit from a NR.Class constructor', function(){
        var parentClass = Class({
            a: {
                a: 1
            },
            
            b: [1, 2, 3],
            
            c: 1,
            
            method: function(){
                return this.c
            }
        });
        
        var myClass = Class({
            Extends: parentClass,
        
            method2: function(){
                return this.c * 10;
            }
        });
        
        var c = new myClass,
            cp = new parentClass;
        
        expect(c.method()).toBe(1);
        expect(c.method2()).toBe(10);
        expect(cp.method2).toBeUndefined();
        
        expect(c.a.a).toBe(1);
        delete c.a.a;
        expect(c.a.a).toBe(1);
        
    });
    
    
}); // END NR.Class


});
describe('Neuron:lang/biz', function(){

describe('NR.data()', function(){
    it('could store data by key-value, and sharing a global storage', function(){
        NR.data('a', 1);
        NR.data('b', {});
        
        expect(NR.data('a')).toBe(1);
        expect( NR.isObject( NR.data('b')) ).toBe(true); 
    });
    
    
    it('could retrieve data by key, and the result may be the reference of the stored object', function(){
        NR.data('b').a = 2;
    
        expect(NR.data('a')).toBe(1);
        expect( NR.data('b').a ).toBe(2);
    });
    
    it("could deal with setter overloading", function(){
        NR.data({
            c: 1,
            d: {
                a: 1
            }
        })
    
        expect(NR.data('c')).toBe(1);
        expect(NR.data('d').a).toBe(1);
    });

    it("the old value should be overridden, if set the value of the same key more than once", function(){
        NR.data('e', 1);
        NR.data('e', 2);
    
        expect(NR.data('e')).toBe(2);
    });
    
    it("could retrieve the shadow copy of all data", function(){
        NR.data({
            f: 1,
            g: {
                a: 2
            }
        })
    
        var DATA = NR.data();
    
        expect(DATA.f).toBe(1);
        expect(DATA.g.a).toBe(2);
    });
    
    it('could retrieve the shadow copy of all data, so manipulate the copy will not affect the origin object', function(){
        var DATA = NR.data();
        
        DATA.h = 3;
        expect(NR.data('h')).toBe(undefined);
    })
});


describe('NR.getLocation()', function(){
    describe('could analyse a given uri and split it to several parts', function(){
        
        // custom protocal
        var itunes = NR.getLocation( 'itms://mylocalhost:8000/abc/def/?abc=123&fffff#ddddddd?abcdef' );
        
        it("correct protocol", function(){
            expect(itunes.protocol).toBe('itms:');
        });
        
        it("correct port", function(){
            expect(itunes.port).toBe('8000');
        });
        
        it("correct host", function(){
            expect(itunes.host).toBe('mylocalhost:8000');
        });
        
        it("correct hostname", function(){
            expect(itunes.hostname).toBe('mylocalhost');
        });
        
        it("correct pathname", function(){
            expect(itunes.pathname).toBe('/abc/def/');
        });
        
        it("correct search", function(){
            expect(itunes.search).toBe('?abc=123&fffff');
        });
        
        
        it("correct hash", function(){
            expect(itunes.hash).toBe('#ddddddd?abcdef');
        });
          
    });
});
    
    
});
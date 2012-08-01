<script>

describe('Neuron:lang/enhance', function(){

describe('.data()', function(){
    it('could store data by key-value, and sharing a global storage', function(){
        KM.data('a', 1);
        KM.data('b', {});
        
        expect(KM.data('a')).toEqual(1);
        expect( KM.isObject( KM.data('b')) ).toBeTruthy(); 
    });
    
    
    it('could retrieve data by key, and the result may be the reference of the stored object', function(){
        KM.data('b').a = 2;
    
        expect(KM.data('a')).toEqual(1);
        expect( KM.data('b').a ).toEqual(2);
    });
    
    it('could retrieve the shadow copy of all data', function(){
        var DATA = KM.data();
        
        expect(DATA.a).toEqual(1);
        expect(DATA.b.a).toEqual(2);
        
        DATA.c = 3;
        expect(KM.data('c')).toBeUndefined();
    })
});


describe('.getLocation()', function(){
    it('could analyse a given uri and split it to several parts', function(){
        
        // custom protocal
        var itunes = KM.getLocation( 'itms://mylocalhost:8000/abc/def/?abc=123&fffff#ddddddd?abcdef' );
        
        expect(itunes.protocol).toEqual('itms:');
        expect(itunes.port).toEqual('8000');
        expect(itunes.host).toEqual('mylocalhost:8000');
        expect(itunes.hostname).toEqual('mylocalhost');
        expect(itunes.pathname).toEqual('/abc/def/');
        expect(itunes.search).toEqual('?abc=123&fffff');
        expect(itunes.hash).toEqual('#ddddddd?abcdef');
    })
});
    
    
});

</script>
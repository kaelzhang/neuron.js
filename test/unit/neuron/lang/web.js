describe('Neuron:lang/web', function(){

describe('NR.getLocation()', function(){
    describe('could analyse a given uri and split it to several parts: NR.getLocation(href)', function(){
        
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
    
    var passed = false;
    
    try{
        var l = document.location,
            h = location.href;
            
        passed = true;
    }catch(e){}
    
    passed && describe("could get the current location: NR.getLocation()", function(){
        var 
        
        location = document.location,
        cur = NR.getLocation(),
        parsed = NR.getLocation(location.href);
        
        it("current protocol", function(){
            expect(cur.protocol).toBe(location.protocol);
            expect(cur.protocol).toBe(parsed.protocol);
        });
        
        it("current port", function(){
            expect(cur.port).toBe(location.port);
            expect(cur.port).toBe(parsed.port);
        });
        
        it("current host", function(){
            expect(cur.host).toBe(location.host);
            expect(cur.host).toBe(parsed.host);
        });
        
        it("current hostname", function(){
            expect(cur.hostname).toBe(location.hostname);
            expect(cur.hostname).toBe(parsed.hostname);
        });
        
        it("current pathname", function(){
            expect(cur.pathname).toBe(location.pathname);
            expect(cur.pathname).toBe(parsed.pathname);
        });
        
        it("current search", function(){
            expect(cur.search).toBe(location.search);
            expect(cur.search).toBe(parsed.search);
        });
        
        it("current protocol", function(){
            expect(cur.hash).toBe(location.hash);
            expect(cur.hash).toBe(parsed.hash);
        });
    });
});
    
    
});
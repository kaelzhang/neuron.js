describe("io/jsonp", function(){

function contains (obj, pattern, specified_key) {
    var
    key, value;

    if(specified_key){
        value = obj[specified_key];
        return NR.isString(value) && value.indexOf(pattern) !== -1;
    }

    for(key in obj){
        value = obj[key];
        if(NR.isString(value) && value.indexOf(pattern) !== -1){
            return true;
        }
    }

    return false;
};

function url(rel){
    return 'http://localhost/neuron/test/io/jsonp/' + rel;
};


describe("basic requirements:", function(){
    it("jsonp module ready.", function(){
        async('io/jsonp', function(jsonp) {
            expect(!!jsonp).toBe(true);
        });
    });
});


describe("responses (could successfully receive responses)", function(){
    it("simple jsonp requests", function(){
        async('io/jsonp', false, {
            url: url('simple-jsonp.php')

        }, {
            success: function(res) {
                expect(!!res).toBe(true);
            }
        }); 
    });

    it("response handler", function(){
        async('io/jsonp', false, {
            url: url('simple-jsonp.php'),
            data: {
                a: 1,
                b: 100
            }

        }, {
            success: function(res) {
                expect(res.a).toBe(1);
                expect(res.b).toBe(100);
            }
        }); 
    });
});

describe("event: success", function(){
    it("no test cases here", function(){
        expect().toBe();
    });
});

describe("event: error", function(){
    it("will be fired when timeout occurs", function(){
        async('io/jsonp', false, {
            url: url('unexisted-url.jsonp'),
            data: {
                a: 1,
                b: 100
            },

            timeout: 1000

        }, {
            success: function(res) {
                expect(false).toBe(true);
            },

            error: function() {
                expect(true).toBe(true);
            }
        });
    });
});

    
});
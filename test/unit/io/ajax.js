describe("io/ajax", function(){

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
    return '/lib/test/io/ajax/' + rel;
};


describe("basic requirements:", function(){
    it("ajax module ready.", function(){
        async('io/ajax', function(ajax) {
            expect(!!ajax).toBe(true);
        });
    });
});


describe("responses (could successfully receive responses)", function(){
    it("'get' method", function(){
        async('io/ajax', false, {
            url: url('wrong-json-format.json'),
            dataType: 'text'

        }, {
            success: function(res) {
                expect(!!res).toBe(true);
            }
        }); 
    });

    it("'post' method", function(){
        async('io/ajax', false, {
            url: url('wrong-json-format.json'),
            dataType: 'text',
            method: 'post'

        }, {
            success: function(res) {
                expect(!!res).toBe(true);
            }
        });
    });

    it("option `method` is not case-sensitive", function(){
        async('io/ajax', false, {
            url: url('wrong-json-format.json'),
            dataType: 'text',
            method: 'POST'

        }, {
            success: function(res) {
                expect(!!res).toBe(true);
            }
        });
    });
});

describe("option: dataType:", function(){
    it("contains 'application/json' in header, if dataType is json", function(){
        async('io/ajax', function(Ajax) {
            var 

            ajax = new Ajax({
                url: url('wrong-json-format.json'),
                dataType: 'json',
                method: 'post'
            });

            expect( contains(ajax.get('headers'), 'application/json') ).toBe(true);
        });
    });

    it("contains 'text/plain' in header", function(){
        async('io/ajax', function(Ajax) {
            var 

            ajax = new Ajax({
                url: url('wrong-json-format.json'),
                dataType: 'text',
                method: 'post'
            });

            expect( contains(ajax.get('headers'), 'text/plain') ).toBe(true);
        });
    });

    it("contains 'x-www-form-urlencoded' in header", function(){
        async('io/ajax', function(Ajax) {
            var 

            ajax = new Ajax({
                url: url('wrong-json-format.json'),
                dataType: 'text',
                method: 'post'
            });

            expect( contains(ajax.get('headers'), 'x-www-form-urlencoded') ).toBe(true);
        });
    });
});

describe("option: santitizer", function(){
    it("could change the response text before everything taking effect", function(){
        async('io/ajax', false, {
            url: url('simple-json.json'),
            dataType: 'json',
            method: 'post',
            santitizer: function(res) {
                return '{"a":11,"b":22}';
            }

        }, {
            success: function(res) {

                // if 'success' event fired, test case will fail
                expect(res.a).toBe(11);
            }
        });
    });

    it("could santitize wrong response format into the right one", function(){
        async('io/ajax', false, {
            url: url('wrong-json-format.json'),
            dataType: 'json',
            method: 'post',
            santitizer: function(res) {
                return res.replace('\'', '"');
            }

        }, {
            success: function(res) {

                // if 'success' event fired, test case will fail
                expect(false).toBe(true);
            },

            error: function() {
                expect(true).toBe(true);
            }
        });
    });
});


describe("option: isSuccess", function(){
    it("could indicate whether the ajax request is successfull", function(){
        async('io/ajax', false, {
            url: url('simple-json.json'),
            dataType: 'json',
            method: 'post',
            isSuccess: function(rt) {
                return rt.a === 100;
            }

        }, {
            success: function(res) {

                // if 'success' event fired, test case will fail
                expect(false).toBe(true);
            },

            error: function() {
                expect(true).toBe(true);
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
    it("will fail, if dataType didn't match", function(){
        async('io/ajax', false, {
            url: url('wrong-json-format.json'),
            dataType: 'json',
            method: 'post'

        }, {
            success: function(res) {

                // if 'success' event fired, test case will fail
                expect(false).toBe(true);
            },

            error: function() {
                expect(true).toBe(true);
            }
        });
    });

    it("will fail, if xhr failure", function(){
        async('io/ajax', false, {
            url: url('unexisted-url.json'),
            dataType: 'json',
            method: 'post'

        }, {
            success: function(res) {

                // if 'success' event fired, test case will fail
                expect(false).toBe(true);
            },

            error: function() {
                expect(true).toBe(true);
            }
        });
    });

    it("will fail, if http status indicate a failure", function(){
        async('io/ajax', false, {
            url: url('wrong-json-format.json'),
            dataType: 'json',
            method: 'post',
            isXHRSuccess: function(s) {
                return s < 100;
            }

        }, {
            success: function(res) {

                // if 'success' event fired, test case will fail
                expect(false).toBe(true);
            },

            error: function() {
                expect(true).toBe(true);
            }
        });
    });
});

    
});
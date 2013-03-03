describe("io/ajax", function(){

var

EVENTS = ['success', 'error'];

function Async(ajax_loaded, options, events){
    var 

    ajax, res,

    need_ajax = arguments.length === 3,
    
    succeed,

    fake_events = {},

    event_res = {},

    final_event_type;

    EVENTS.forEach(function(type) {
        fake_events[type] = function() {
            event_res[type] = arguments;
            final_event_type = type;
        };
    });

    runs(function() {
        NR.provide(['io/ajax'], function(NR, Ajax) {
            ajax = Ajax;
        });
    });

    waitsFor(function() {
        return !!ajax;
    });

    runs(function() {
        if(ajax_loaded){
            ajax_loaded(ajax);
        }

        if(need_ajax){
            new ajax(options).on(fake_events).send();
        }
    });

    if(need_ajax){
        waitsFor(function() {
            return !!final_event_type;
        });

        runs(function() {
            EVENTS.forEach(function(type) {
                var
                callback = events[type];

                if(type === final_event_type){
                    callback && callback.apply(null, event_res[type]);
                }
            });
        });
    }
};

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
    return '/lib/test/io/' + rel;
};


describe("basic requirements:", function(){
    it("ajax module ready.", function(){
        Async(function(ajax) {
            expect(!!ajax).toBe(true);
        });
    });
});


describe("responses (could successfully receive responses)", function(){
    it("'get' method", function(){
        Async(false, {
            url: url('wrong-json-format.json'),
            dataType: 'text'

        }, {
            success: function(res) {
                expect(!!res).toBe(true);
            }
        }); 
    });

    it("'post' method", function(){
        Async(false, {
            url: url('wrong-json-format.json'),
            dataType: 'text',
            method: 'post'

        }, {
            success: function(res) {
                expect(!!res).toBe(true);
            }
        });
    });

    it("is not case-sensitive", function(){
        Async(false, {
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
        Async(function(Ajax) {
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
        Async(function(Ajax) {
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
        Async(function(Ajax) {
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
        Async(false, {
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
        Async(false, {
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
    it("", function(){
        expect().toBe();
    });
});

describe("event: success", function(){
    it("no test cases here", function(){
        expect().toBe();
    });
});


describe("event: error", function(){
    it("will fail, if dataType didn't match", function(){
        Async(false, {
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
        Async(false, {
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
        Async(false, {
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
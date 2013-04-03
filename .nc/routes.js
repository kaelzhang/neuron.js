// TODO:
// move it out of nervecentre

var 

routes = [

    {
        // favicon
        test: /^\/favicon.ico/,
        action: "favicon"
    },

    {
        test: /^\/$/,
        template: "index.html"
    },
    
    // doc ----------------------
    {
        // docs
        test: /^\/docs\.html/,
        model: "docs",
        template: "doc.html"
    },

    {
        // doc
        test: /^\/doc\/.*\.html/,
        model: ["docs", "doc"],
        template: "doc.html"
    },

    // test ----------------------
    {
        // tests
        test: /^\/tests\.html/,
        model: "tests",
        template: "tests.html"
    }, 

    {
        // test
        test: /^\/test\/unit.*\.html/,
        model: "test",
        template: "test.html"
    },

    // demo -----------------------
    {
        test: /^\/demos\.html/,
        model: "demos",
        template: "demos.html"
    }, 

    {
        test: /^\/demo\/.*\.html/,
        model: "ut",
        template: "demo"

    }, {
        test: /^\/testcases.json/,
        model: "utcases"
    }
];

routes.default_route = {
    action: "neuron"
};

module.exports = routes;


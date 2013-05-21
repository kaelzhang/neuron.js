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
        model: "docs",
        template: "doc.html"
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
        template: "test.html"
    }, 

    {
        // atom page for unit testing
        test: /^\/test\/unit\/.*\.html\?ut/,
        model: "ut",
        template: "ut.html"
    },

    {
        // test
        test: /^\/test\/unit\/.*\.html/,
        model: "tests",
        template: "test.html"
    },

    // demo -----------------------
    {
        test: /^\/demos\.html/,
        model: "demos",
        template: "demo.html"
    }, 

    {
        test: /^\/demo\/.*\.html\?slice/,
        model: "demoslice",
        template: "demo-slice.html"
    },

    {
        test: /^\/demo\/.*\.html/,
        model: "demos",
        template: "demo.html"

    }

    // , {
    //     test: /^\/testcases.json/,
    //     model: "utcases"
    // }
];

routes.default_route = {
    action: "neuron"
};

module.exports = routes;


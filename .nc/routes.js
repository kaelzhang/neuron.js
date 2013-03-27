// TODO:
// move it out of nervecentre

var 

routes = [
    {
        test: /^\/favicon.ico/,
        action: "favicon"

    }, {
        test: /^\/$/,
        template: "index.html"

    }, {
        // doc
        test: /^\/doc\/.*\.html/,
        model: "doc",
        template: "doc.html"

    }, {

        // docs
        test: /^\/docs\.html/,
        model: "docs",
        template: "docs.html"
    
    }, {
        test: /^\/tests\.html/,
        model: "index",
        template: "tests"

    }, {
        test: /^\/demos\.html/,
        model: "index",
        template: "demos"

    }, {
        test: /^\/test\/unit.*\.html/,
        template: "ut"
    
    }, {
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


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
        test: /^\/doc\/.*\.simple\.html/,
        model: "doc",
        template:"doc.simple.html"

    }, {
        test: /^\/doc\/.*\.html/,
        template: "doc"

    }, {
        test: /^\/docs\.html/,
        model: "index",
        template: "docs"
    
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

routes.default_template = "neuron";

module.exports = routes;


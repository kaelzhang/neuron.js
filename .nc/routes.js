// TODO:
// move it out of nervecentre

var 

routes = [
    {
        name:"icon",
        test: /^\/favicon.ico/

    }, {
        name:"index",
        test: /^\/$/ 

    }, {
        name:"doc.simple",
        test: /^\/doc\/.*\.simple\.html/,
        action: "doc",
        dataGetter: function(){
            return {
                doc: this.position.replace(".simple.html", ".md")
            }
        }

    }, {
        name:"doc",
        test: /^\/doc\/.*\.html/,
        dataGetter: function(){
            return {
                doc: this.position.replace(".html", ".md")
            }
        }

    }, {
        name: "docs",
        test: /^\/docs\.html/,
        action: "index"
    
    }, {
        name: "tests",
        test: /^\/tests\.html/,
        action: "index"

    }, {
        name: "demos",
        test: /^\/demos\.html/,
        action: "index"

    }, {
        name: "ut",
        test: /^\/test\/unit.*\.html/
    
    }, {
        name: "demo",
        test: /^\/demo\/.*\.html/,
        action: "ut"

    }, {
        name:"utcases",
        test: /^\/testcases.json/

    }
];

routes["default"] = {
    name: "neuron"
};

module.exports = routes;


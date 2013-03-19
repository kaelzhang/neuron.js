var

Menu = require('~/mod/menu'),
Ajax = require('io/ajax');
    

module.exports = {
    init: function(config) {
        NR.ready(function(){
            var content = $('#content');

            new Menu({
                tree: config.tests.children,

                parser: function(t) {
                    return t;
                }

            }).on({
                menuClick: function(e) {
                    var link = e.link;

                    content.empty();

                    $.create('iframe', {
                        src: link,
                        frameborder: 0,
                        scrolling: "no"

                    }).inject(content);

                }
            });
        });
    }
};
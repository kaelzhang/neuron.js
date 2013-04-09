var

Menu = require('~/mod/menu'),
Ajax = require('io/ajax');
    

module.exports = {
    init: function(config) {
        NR.ready(function(){
            var content = $('#content');

            // initialize side menu
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
                        src: link + '?ut',
                        frameborder: 0,
                        scrolling: "no"

                    }).inject(content);

                }
            });

            // initialize ut
            var init_ut_link = /tests\.html/.test( location.pathname ) ? 
                '/test/unit/neuron.html' : location.pathname;

            $.create('iframe', {
                src: init_ut_link + '?ut',
                // scrolling: "no",
                frameborder: 0

            }).inject(content);
            
        });
    }
};
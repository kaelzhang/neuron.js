var

Menu = require('~/mod/menu'),
Ajax = require('io/ajax');
    

module.exports = {
    init: function(config) {
        NR.ready(function(){
            var content = $('#content');

            // initialize side menu
            new Menu({
                tree: config.demos.children,

                parser: function(t) {
                    t.forEach(function(li) {
                        if(li.children){
                            delete li.path;
                        }
                    });

                    return t;
                }

            }).on({
                menuClick: function(e) {
                    var link = e.link;

                    content.empty();

                    $.create('iframe', {
                        src: link + '?slice',
                        frameborder: 0,
                        scrolling: "no"

                    }).inject(content);

                }
            });

            return;

            if ( !/demos\.html/.test( location.pathname ) ) {
                $.create('iframe', {
                    src: location.pathname + '?slice',
                    // scrolling: "no",
                    frameborder: 0

                }).inject(content);
            }
            
        });
    }
};
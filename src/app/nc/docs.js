var

Menu = require('~/mod/menu'),
Ajax = require('io/ajax');
    

module.exports = {
    init: function(config) {
        NR.ready(function(){
            var content = $('#content');

            new Menu({
                tree: config.docs.children,

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
                    var 

                    link = e.link;

                    if(link){
                        new Ajax({
                            url: '/model?data=doc.html&url=' + link,
                            dataType: 'text'
                        
                        }).on({
                            success: function(response){
                                content.html(response);
                            }

                        }).send();
                    }
                }
            });
        });
    }
};
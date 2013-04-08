var

Menu = require('~/mod/menu'),
Ajax = require('io/ajax');
    

exports.init = function(config) {
    var docs = config.docs;
    var menu_map = config.menu_map;

    NR.ready(function(){
        var content = $('#content');

        new Menu({
            tree: docs.children,

            parser: function(t, depth) {
                t.forEach(function(li) {
                    li.name = li.name.replace(/\.md$/, '');

                    var menu_config = menu_map[li.name] || {};

                    if(menu_config.depth !== undefined && menu_config.depth !== depth){
                        menu_config = {};
                    }

                    li.prior = menu_config.prior || 0;
                    li.name = menu_config.cn || li.name;

                    if(li.children){
                        delete li.path;
                    }
                });

                return t.sort(function(a, b) {
                    return b.prior - a.prior;
                });
            }

        }).on({
            menuClick: function(e) {
                var 

                link = e.link;

                if(link){
                    this.ajax && this.ajax.cancel();

                    this.ajax = new Ajax({
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
};
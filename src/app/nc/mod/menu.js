var

tpl = require('mvp/tpl');


module.exports = NR.Class({
    Implements: 'attrs events',

    initialize: function(options) {
        this.set(options);

        this.createMenu();
    },

    walkTree: function(tree, depth, template, parser){
        var self = this;

        tree = parser(tree, depth);

        tree.forEach(function(li) {
            if(li.children){
                li.html_children = '<ul class="list list-depth-' + depth + '">' 
                                   + self.walkTree(li.children, depth + 1, template, parser)
                                   + '</ul>';
            }
        });

        return template(tree);
    },

    createMenu: function(){
        var 

        self = this,
        tree = this.get('tree'),
        parser = this.get('parser'),

        menu_container = $('#menus'),
        template = tpl.compile( $('#J_tpl-menu-lis').html() ),

        html_list = this.walkTree(tree, 0, template, parser);

        menu_container.html(html_list);

        menu_container.on('click', '.J_menu-link', function(e) {
            e.preventDefault();

            var link = $(this).attr('href');

            if(link){
                self.fire('menuClick', {
                    link: link
                });

                history.pushState({}, "", link);
            }
        });
    }

}, {
    tree: {},
    parser: {}
});





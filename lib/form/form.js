NR.define(['./field'], function (D, require) {

    var Field = require('./field');

    // 简单包装checkbox
    var CheckBox = D.Class({
        Implements: "events",
        initialize: function (elem) {
            var self = this;
            self.elem = elem;
            elem.on("click", function () { self.fire("click"); });
        },
        val: function () {
            return this.elem.attr("checked");
        }
    });


    /* 
    * @param elem {Object}
    * @return {Field}
    **/
    function parseField(elem) {
        var cfg,
            node,
            field;

        // elem as an Object {}
        if (elem.constructor === Object) {
            if (!elem.elem || !elem.rules) {
                throw 'elem and rules is required for a field config ' + elem.elem + " " + elem.rules;
            }
            cfg = {
                checkEvents: elem.checkEvents,
                hintEvents: elem.hintEvents,
                rules: elem.rules,
                hint: elem.hint,
                name: elem.name
            };

            node = $(elem.elem);
            if (!node.count()) {
                return;
            }

            if (node.attr("type") === "checkbox") {
                field = new Field(new CheckBox(node), D.mix({ name:node.attr("name")||cfg.name,checkEvents: ["click"] }, cfg, false));
            } else {
                field = new Field(node, cfg);
            }

            field.on(elem.events);
            // elem as a Field
        } else {
            field = elem;
        }

        return field;
    }

    var Form = new D.Class({

        Implements: 'events attrs',

        initialize: function (form, options) {
            var self = this,
            	fields;

            form = $(form);

            if (!form.count()) {
                throw 'please parse a form';
            };

            self.set('block', options.block || false);
            self._ignores = {};

            fields = options.fields;
            fields.forEach(function (el, i) {
                self.add(el);
            });

            form.on('submit', function (e) {
                if (!self.check()) {
                    e.prevent();
                }
            });

            self.elem = form;

        },

        /**
        * 添加Field
        * @param field {Field}        
        **/
        add: function (field) {

            field = parseField(field);

            field && this.get('fields').push(field);

            return this;
        },
        getField:function(name){
            var fields = this.get("fields");
            
            for(var i = 0,fld;fld = fields[i];i++){
                if(fld.get("name") === name){
                    return fld;
                }
            }
        },
        remove: function (name) {
            var fields = this.get('fields');

            for (var i = 0, l = fields.length; i < l; i++) {
                if (fields[i].get('name') == name) {
                    fields.splice(i, i);
                    break;
                }
            }

            return this;
        },

        /**
        * @param fire {Boolean} set false to prevent fire check event in field
        */
        check: function (fire) {
            var self = this,
            	fields = self.get('fields'),
            	block = self.get('block'),
            	stop = false,
            	count = fields.length,
            	passes = {},
            	passed = true;


            for (var i = 0, fld, res; fld = fields[i]; i++) {
                (function (f) {
                    var name = f.get("name");
                    !self._ignores[name] && f.check(function (p) {
                        passes[name] = p;
                        if (!p) {
                            passed = false;
                            if (block) {
                                stop = true;
                            }
                        }
                    }, fire);
                })(fld);

                if (stop) {
                    break;
                }
            }

            self.fire('checked', {
                passed: passed,
                passes: passes
            });

            return passed;
        },


        ignore: function (name) {
            this._ignores[name] = true;
        },

        unignore: function (name) {
            this._ignores[name] = false;
        },

        val: function () {
            var self = this,
                ret = {};

            this.get("fields").forEach(function (field) {
                var name = field.get("name");
                if (!self._ignores[name] && name) {
                    ret[name] = field.val();
                }
            });

            return ret;
        }
    });

    D.Class.setAttrs(Form, {
        block: {
            value: false
        },
        fields: {
            value: []
        }
    });

    return Form;
});

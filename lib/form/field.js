var Validator = require('./validator');

var EVENT_PRESETS = {
    "textfield": {
        "hint": "focus",
        "check": "blur"
    },
    "select": {
        "hint": "click",
        "check": "change"
    }
}

var DOM_TYPE_MAP = {
    "select": "select",
    "textarea": "textfield",
    "input": {
        "radio": "radio",
        "checkbox": "checkbox"
    }
};


/**
* @param elem {DOM}
*  
**/
function getTypeOfDomElement(elem) {
    if (!(elem instanceof D.DOM)) { return; }
    var el = elem.el(0),
        map = DOM_TYPE_MAP, 
        tag = el.tagName.toLowerCase(),
        type = el.getAttribute('type');

    return (NR.isString(map[tag]) ? map[tag] : map[tag][type]) || "textfield";
}


var Field = NR.Class({

    Implements: 'events attrs',

    /**
    * @param elem {DOM|newClass}
    * @param opt {Object} 
    **/
    initialize: function (elem, option) {
        var self = this;     

        if (NR.isString(elem)) {
            elem = $(elem);
        }

        self.elem = elem;
        self.hint = option.hint;

        self.set('type', elem);
        self.set('rules', option.rules);
        self.set('name', (elem.attr && elem.attr("name")) || option.name);
        self.set('checkEvents', option.checkEvents);
        self.set('hintEvents', option.hintEvents);

        self.validator = new Validator(self.get("rules"));

        self._bindCheck();
        self._bindHint();
    },


    /**
    * @private
    */
    _bindHint: function () {
        var self = this,
        	elem = self.elem,
            hintEvents = self.get("hintEvents");

        hintEvents.forEach(function (ev) {
            elem.on(ev, function () {
                self.fire('hint', {
                    elem: elem,
                    text: self.hint
                });
            });
        });

    },

    /**
    * @private
    */
    _bindCheck: function () {
        var self = this,
        	elem = self.elem,
            checkEvents = self.get("checkEvents");

        checkEvents.forEach(function (ev) {
            elem.on(ev, function () {
                self.check();
            });
        });
    },

    addRule: function (rule) {
        this.validator.addRule(rule);
    },

    val: function (v) {
        var el = this.elem;

        if (!v) {
            return el.val && el.val();
        } else {
            return el.val && el.val(v);
        }
    },

    /**
    * @param cb {Function} callback on checked
    * @param fire {Boolean} set false to prevent fire check event in field
    */
    check: function (cb, fire) {
        var self = this;
        fire = fire === false ? false : true;
        self.validator.check(this.val(), function (res) {
            cb && cb(res.passed);
            fire && self.fire('checked', {
                elem: self.elem,
                name: res.name,
                hint: res.hint,
                passed: res.passed
            });
        });
    }

}, {
    rules: {
        value: [],
        setter: function (v) {
            return NR.makeArray(v);
        }
    },
    type: {
        setter: function (elem) {
            return elem.type || getTypeOfDomElement(elem);
        }
    },
    name: {
        setter: function (v) {
            return v || "dp_field_" + NR.guid();
        }
    },
    checkEvents: {
        setter: function (v) {
            var type = this.get("type");

            if (v) {
                return NR.makeArray(v);
            } else if (EVENT_PRESETS[type] && EVENT_PRESETS[type]["check"]) {
                return NR.makeArray(EVENT_PRESETS[type]["check"]);
            } else {
                throw "check events preset is not defined"; // 必须指定checkEvents
            }

        }
    },
    hintEvents: {
        setter: function (v) {
            var type = this.get("type");


            if (v) {
                return NR.makeArray(v);
            } else if (EVENT_PRESETS[type] && EVENT_PRESETS[type]["hint"]) {
                return NR.makeArray(EVENT_PRESETS[type]["hint"]);
            } else {
                return []; // 允许不存在hintEvents
            }
        }
    }
});

module.exports = Field;



/*
if (remoteRules = this._needRemote(rules)) {
remoteRules.forEach(function (rule) {
validator.addRule({
test: new Remote(self, rule),
'hint': rule.hint
});
});
}
*/

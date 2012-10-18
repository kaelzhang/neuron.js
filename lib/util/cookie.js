NR.define(function (D,require) {

    var default_options = {
            path: '/',
            domain: false,
            duration: false,
            secure: false,
            document: document,
            encode: true
        };

    function escapeRegExp(str){
        return str.replace(/([-.*+?^${}()|[\]\/\\])/g,"\\$1")
    }

    var Cookie = D.Class({

        Implements: 'attrs',
        initialize: function (key, options) {
            this.key = key;            
            this.set({ opt: options });
        },
        write: function (value) {
            var o = this.get('opt');

            if (o.encode) value =  encodeURIComponent(value);
            if (o.domain) value += '; domain=' + o.domain;
            if (o.path) value += '; path=' + o.path;
            if (o.duration) {
                var date = new Date();
                date.setTime(date.getTime() + o.duration * 24 * 60 * 60 * 1000);
                value += '; expires=' + date.toGMTString();
            }
            if (o.secure) value += '; secure';
            o.document.cookie = this.key + '=' + value;
            this.set('opt',o);
            return this;
        },

        read: function () {
            var o = this.get('opt');
            var value = o.document.cookie.match('(?:^|;)\\s*' + escapeRegExp(this.key ) + '=([^;]*)');
            return (value) ? decodeURIComponent(value[1]) : null;
        },

        dispose: function () {
            new Cookie(this.key, D.mix({ duration: -1 },this.get('opt'), false)).write('');
            return this;
        }

    });

    Cookie.write = function (key, value, options) {
        return new Cookie(key, options).write(value);
    };

    Cookie.read = function (key) {
        return new Cookie(key).read();
    };

    Cookie.dispose = function (key, options) {
        return new Cookie(key, options).dispose();
    };


    D.Class.setAttrs(Cookie, {
        opt: {
            value: default_options,
            setter: function (v) {
                return D.mix(v || {},this.get('opt'),false);
            }
        }
    });

    return Cookie;


});
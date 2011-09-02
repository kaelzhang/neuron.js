DP.define(function (K) {

    var NAME_PREFIX = 'D',
        CLASS_NAME_DELIMITER = '-',
        ID_NAME_DELIMITER = '_',
        DEFAULT_NAME = 'NONE',
        EMPTY_STR = '',

        TYPE_CLASS = 'class',
        TYPE_ID = 'id';

    function _nameFactory(type, cname, name) {
        var _tag = name || DEFAULT_NAME,
            _arr = [NAME_PREFIX, _tag];

        cname && _arr.push(cname);

        switch (type) {
            case TYPE_CLASS:
                return _arr.join(CLASS_NAME_DELIMITER);
            case TYPE_ID:
                return _arr.append([K.guid()]).join(ID_NAME_DELIMITER);
        };

        return EMPTY_STR;
    };

    return {
        /**
        * @public
        * @method className
        * @description 获取class name
        * @param {String} className
        * @param {String} name
        * @return {String}
        */
        className: function (className, name) {
            return _nameFactory(TYPE_CLASS, className, name);
        },
        /**
        * @public
        * @method id
        * @description 获取 id
        * @param {String} id
        * @param {String} name
        * @return {String}
        */
        id: function (id, name) {
            return _nameFactory(TYPE_ID, id, name);
        }
    };
});
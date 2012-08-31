# Attrs Method: addAttr

##   语法:

***
    {{lang:javascript}}
    MyClass.addAttr(key, setting);
***

##   参数:
 - key (string) 属性名
 - setting (object) 约定结构集合，结构各属性如下：
     - value 默认值
     - setter 填充值
     - getter 获取值
     - validator 填充验证
     - readOnly  只读
     - writeOnce 写一次

####   addAttr Example:
***
    {{lang:javascript}}
	    var Dpper = Class({
            Implements: 'attrs',
            init: function (options) {
                this.set(options);
            }
        });

        var F2E = new Dpper();

        F2E.addAttr('sex', {
            value: 'male',
            readOnly: true
        });
        F2E.addAttr('name', {
            value: '?',
            setter: function (v) {
                return v.toString();
            },
            getter: function (v) {
                return 'F2E-' + v;
            }
        });
        F2E.addAttr('age', {
            value: 1,
            validator: K.isNumber,
            writeOnce: true
        }); 

        F2E.init({ name: 'Kael', sex: 'female', age: 18 });

        alert(F2E.get('sex'));   // alerts male
	    alert(F2E.get('name'));  // alerts F2E-Kael
	    alert(F2E.get('age'));   // alerts 18
***


# Attrs Method: set

##   语法:

***
    {{lang:javascript}}
    MyClass.set(key, value);
***
##   参数:
 - key (string) 属性名
 - value (object) 自定义值

####   set Example:
***
    {{lang:javascript}}
    var Dpper = Class({
        Implements: 'attrs',
        init: function (options) {
           this.set(options);
        }
    });

    var F2E = new Dpper();
    F2E.addAttr('name');

    F2E.init({ name: 'Jim'});
	alert(F2E.get('name')); // alerts Jim

    F2E.set('name','Kael');
	alert(F2E.get('name')); // alerts Kael
***

# Attrs Method: get
##   语法:

***
    {{lang:javascript}}
    MyClass.get(key);
***
##   参数:
 - key (string) 属性名

####   set Example:
***
    {{lang:javascript}}
    var Dpper = Class({
        Implements: 'attrs',
        initialize: function (options) {
           this.set(options);
        }
    });
    Class.setAttrs(Dpper, {
        name:{}
    });
    var F2E = new Dpper({ name: 'Kael'});
	alert(F2E.get('name')); // alerts Kael
***

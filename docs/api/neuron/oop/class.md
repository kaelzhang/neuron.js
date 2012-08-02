Class
=======
概览
------
- constructor
- Property:Extends
- Property:Implements
- Property:initialize
- Class.setAttrs

Class Method: constructor
---------

###   语法:

***
    {{lang:javascript}}
    var MyClass = new Class(properties);
    //or
    var MyClass = Class(properties);
***

###   参数:
 - properties
- (object) 自定义属性集合、特殊属性（Extends、Implements、initialize）

###   Property: Extends
- (class) 被继承的父类

###   Property: Implements
- (string)空格分隔的字符属性，该组属性将复制到类上
- (object)该对象属性将被复制到类上
- (class)该类的原型属性将被复制到类上
- (array)数组中的各元素(string、object、class)对象属性将被复制到类上

###   Property: initialize
- (function)类实例化时的构造方法

###   Returns:
- (class) 类的实例

### Examples:

#### Class Example:

***
    {{lang:javascript}}
    var NR = Class({
        initialize: function(name){
            this.name = name;
        }
    });
    var dp = new NR('dianping');
    alert(dp.name); // alerts 'dianping'
***

####   Extends Example:
***
    {{lang:javascript}}
    var Dapper= new Class({
        initialize: function(age){
            this.age = age;
        }
    });
    var F2E= new Class({
        Extends: Dapper,
        initialize: function(name, age){
            Dapper.call(this, options);
            this.name = name;
        }
    });
    var Kael= new F2E('Kael', 18);
    alert(Kael.name); // alerts 'Kael'
    alert(Kael.age);  // alerts 18
***

####   Implements Example:
***
    {{lang:javascript}}
    var commons = {
        setName : function(name){
           this.name = name;
        }
    };
    var Dapper= new Class({
        Implements : commons ,
        initialize: function(age){
            this.age = age;
        }
    });
    var F2E = new Dapper(20);
    F2E.setName('Kael');
    alert(F2E.name); // alerts 'Kael'
***

### Class Static Method: setAttrs

#   语法:

***
    {{lang:javascript}}
    Class.setAttrs(class, properties);
***

##   参数:
 - class (class) 类
 - properties (object)用户自定义设置属性

####   setAttrs Example:
***
    {{lang:javascript}}
    var Dapper= Class({
        Implements: 'attrs',
        initialize: function(options){
             this.set(options);
        }
    });
    Class.setAttrs(Dapper, {
        'name': {
            value: ''
        }
    });
    var F2E= new Dapper({ name: 'Kael'});
    alert(F2E.get('name')); // alerts 'Kael'
***

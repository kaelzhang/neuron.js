<markdown>

# Events Method: on

##   语法:

***
    {{lang:javascript}}
	MyClass.on(types);

	//or

    MyClass.on(type, fn);
***

##   参数:
 - 1个参数
- types (object) 事件集合
 - 2个参数
- type (string) 事件名
- fn (function) 事件方法

##   返回值:
- (instance) 实例

####   on Example -One Argument:
***
    {{lang:javascript}}
    var Dpper = Class({
         Implements: 'events',
         say: function () {
            this.fire('whisper');
            this.fire('cry');
         }
    });
    var F2E = new Dpper().on({
        'whisper': function () {
            alert('F2E');
        },
        'cry': function () {
            alert('Kael');
        }
    });
    F2E.say(); // alerts F2E then alerts Kael
***

####   on Example -Two Arguments:
***
    {{lang:javascript}}
    var Dpper = Class({
        Implements: 'events',
        say: function () {
            this.fire('whisper');
        }
    });
    var F2E = new Dpper().on('whisper', function () {
        alert('F2E');
    });
    F2E.say(); // alerts F2E
***

# Events Method: off

##   语法:

***
    {{lang:javascript}}
    MyClass.off(type);

	//or

    MyClass.off(type, fn);
***

##   参数:
 - 1个参数 - 解除该事件名上的所有绑定方法
- type (object) 事件名
 - 2个参数 - 解除该事件名上的对应方法
- type (string) 事件名
- fn (function) 事件方法

##   返回值:
- (instance) 实例

####   off Example -One Argument:
***
    {{lang:javascript}}
    var Dpper = Class({
         Implements: 'events',
         say: function () {
            this.fire('whisper');
         }
    });
    var F2E = new Dpper().on({
        'whisper': function () {
            alert('F2E');
        }
    });
    F2E.say(); // alerts F2E
    F2E.off('whisper');
    F2E.say(); // nothing
***

####   off Example -Two Arguments:
***
    {{lang:javascript}}
    var Dpper = Class({
        Implements: 'events',
        say: function () {
            this.fire('whisper');
        }
    });
    function whisper() {
        alert('F2E');
    };
    var F2E = new Dpper().on('whisper', whisper).on(
          'whisper', function () {
            alert('Kael');
        }
    );
    F2E.off('whisper', whisper);
    F2E.say(); // alerts Kael
***

# Events Method: fire
##   语法:

***
    {{lang:javascript}}
	MyClass.fire(type);

	//or

    MyClass.fire(type, args);
***

##   参数:
 - 1个参数
- type (string) 事件名
 - 2个参数
- type (string) 事件名
- args (function) 参数数组

##   返回值:
- (instance) 实例

####   fire Example -One Argument:
***
    {{lang:javascript}}
    //参见 on、off 示例
***

####   fire Example -Two Arguments:
***
    {{lang:javascript}}
	var Dpper = Class({
        Implements: 'events'
    });
    var F2E = new Dpper().on(
        'whisper', function (v) {
          alert(v + 'Kael');
        }
    );
    F2E.fire('whisper', ['F2E-']); // alerts F2E-Kael
***
</markdown>

Validator
======

验证器，只关心值

Outline
------
- Constructor
- addRule
- getRule
- check


Validator:Constructor
------

### 语法
	
	var validator = new Validator(rules);

### 参数

- rules:(Array) 需要验证的规则，每个数组项允许的形式参见addRule方法



.addRule(config)
-----
### 语法

    validator.addRule(config);

### 参数
####config
{string|Object}

### 示例

1.添加预设规则，预设规则没有默认的错误提示文本，可以在回调函数中直接自行处理。

	validator.addRule("email");	

2.通过配置对象添加规则

	validator.addRule({
		test:"email",
		hint:"email not correct"
	});

3.通过自定义函数添加规则

	validator.addRule({
		test:function(v){ … custom code … },
		hint:"custom error hint"
	});
	
4.异步规则

	validator.addRule({
                name:"remote test",
		test:function(v, callback){
			new Ajax({
				url:"xxx",
				method:"post"
			}).on('success', function(rt){
				callback(`{passed}`,`{hint}`)
			});
		},
		async:true,
                hint:'async check failed'
	});
	
### 注意

- 每个验证器应当只有一个异步验证器。
- 该验证器会在验证周期的最后执行。
- 若配置了多个异步验证器，除第一个之外的其他将被忽略
- 可以为异步规则配置默认错误提示。
- 亦可在callback中将特定的错误提示返回。

- addRule方法传递的配置若为预设，则将以预设名作为验证规则的name
- 若为自定义方法则取传入的name配置作为name
- 不然则会自动生成dp_rule_{n} 形式的name

.getRule(name)
----
### 语法

	validator.getRule(name)

### 参数

####name
{string} 要获取的rule的名称

### 返回
{Rule} Rule的实例

.check(v,callback)
----
### 语法
	
	
	validator.check(v,callback);
	
### 参数

####v
{string} 要验证的值
####callback
{Function} 验证完成后的回调，若包含异步回调，则会在异步回调完成后触发。接受一个参数，为描述验证结果的对象，包含name passed hint三个键

### 示例

	validator.check('a.b@c.com',function(o){
		console.log(o.name); // 验证遇到未通过的规则即停止，此处返回该规则的name，若验证通过则为null
		console.log(o.hint); // 对应规则的hint，若验证通过则为null
		console.log(o.passed); // 若所有规则通过，返回true，否则返回false
	});


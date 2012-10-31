Rule
======

- Rule模块返回一个对象
- 该对象定义了一些全局的默认规则，并且提供添加自定义规则的接口


Rule.add(name,test)
--------
添加一条预设验证规则，内部方法，不建议在外部使用

### 语法


	Rule.add(name,function(v,v2,cb){
		return v == v2
	});


### 参数
####name
{string} 预置规则的名字
####test
{Function} 预置规则的验证函数

### 示例

1.单一参数

	Rule.add("required",function(v){
		return !!v;
	});

2.接受第二个参数

验证长度

	Rule.add("maxlength",function(v,length){
		return v.length <= length;
	});

验证相同数值

	Rule.add("equals",function(v1,v2){
		return v1==v2;
	});

Rule.produce(name)
-------
产生一条验证规则，返回用于验证规则的函数

### 语法
	
	Rule.produce(name)
	
### 参数
####name
{string|Object} 通过预设或配置获得一条验证规则

### 示例

1.获取预置配置

	Rule.produce("email");
	
2.自定义提示的预置配置

	Rule.produce({
		test:"email",
		hint:"email格式错误"	
	});
	
3.接受第二个参数的配置

	Rule.produce({
		test:"maxlength:5",
		hint:"长度不大于{0}"	
	});

4.自定义验证函数的配置

	Rule.produce({
		test:function(v){
			return v===123;
		},
		hint:"必须为123"
	});

### 返回

	{
		name:"name",
		test:function(v){
			return {Boolean}
		},
		hint:""
	}
	
预设规则列表
-----------

- required 验证不为空 (用于string或boolean)
- notempty 验证不为空（用于Array like objects）
- numeric 是否为纯数字
- in:a,b,c 是否为a,b,c之一
- chinese 验证全为中文
- email 验证邮箱
- nickname 验证符合nickname规则（包含中文数字英文大小写以及下划线）
- min:len 长度不能小于min
- max:len 长度不能大于max
- equal:value 是否与value相同
- unequal:value 是否与value不同
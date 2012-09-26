
Form
======


Outline
-----
- Constructor
- add
- remove
- check
- getField
- ignore
- unignore
- val
	
Form:Constructor
------------

### 语法

new Form(form,[options]);

### 参数

####form
{NeuronDOM|DOMElement} form元素，必须为form节点
1.options - (object) 定义Form包含的fields数组以及是否阻断式监测

#### options 
{Object} 额外配置

- fields - {Array} 表单所包含的表单域，默认为空数组
- block - (boolean} 定义在检测中遇到一个Field不通过时是否停下后续检测，默认为false

### 事件:checked

form检测完毕后触发的事件，回调中包含：

		
- e.passed 整个表单是否验证通过
- e.passes 表单每个域的验证通过情况

	
### 示例 ###
		
		var myField1 = new Field(…),
			myField2 = new Field(…);
		
		var fields = [myField1,myField2
	         , {
	        	name:'review1',
	            elem: '#J_review-s1',
	            rules: ['unequal:-1'],
	            events:{checked:PickerHint}
	        }, {
	        	name:'review2',
	            elem: '#J_review-s2',
	            rules: ['unequal:-1'],
	            events:{checked:PickerHint}
	        }];
		
		var form = new Form($('#form'), {
            fields: fields
        }).on('checked', function (e) {
        	console.log(e.passed,e.passes);
        });
	

.add(field)
------------

为form添加一个field

### 语法

		myForm.add(field);
		
### 参数

####field 
{Field|Object} 添加的Field，可为Field的实例或配置对象。更多详情请参阅 **Field** 相关文档

### 示例 ###

1.通过实例添加

		var field = new Field("#email",{
			rules:[{test:"email",hint:"必须满足email格式"],
			name:"email_field"
		}).on({
			checked:function(e){
				console.log(e.elem,
					e.passed,
					e.error_hint,
					e.error_rule);
			}
		});
		myForm.add(field);

2.通过配置添加（仅限原生表单域）

		myForm.add({
			elem:"#email",
			rules:[{test:"email",hint:"必须满足email格式"],
			name:"email_field",
			events:{
				checked:function(e){console.log(e.passed,e.text);}
			}
		});
		

.remove(name)
------------

通过特定name删除一个field

### 语法

	myForm.remove("field1");

### 参数
#### name
{String} field的名称

.check(fire=)
------------

验证form

### 语法

	myForm.check();

### 参数
####fire
{boolean} 是否触发事件

.val()
------------

获取所有表单域的值

### 语法

	myForm.val();
	
### 返回

{Object} form中各field的键值对

.ignore(name)
-----------
通过特定name忽略一个field，在check及val方法中会跳过该field

### 语法

	myForm.ignore("field1");

### 参数
#### name
{String} field的名称

.unignore(name)
-----------
将特定name的field移出忽略列表

### 语法

	myFrom.unignore("field1");
	
### 参数
#### name
{String} field的名称

.getField(name)
---------
根据特定name获取fld实例

### 语法

	myFrom.unignore("field1");
	
### 参数
#### name
{String} field的名称

### 返回

{Field} field实例
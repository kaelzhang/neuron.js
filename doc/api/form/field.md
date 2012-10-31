
Field
=======

Outline
------
- Constructor
- val
- check
- addRule

Field:Constructor
--------------------

### 语法

	new Field(elem,options);


### 参数

####elem 
{string|DOM|newField} 作为field的elem属性。若传入string，则会先被以D.DOM包装成DOM。
####options 
{Object} field的相关配置

 -  checkEvents: {Array.<string\>} 用以触发验证的事件名，浏览器原生field具有默认值，将会被此处定义覆盖
 -  hintEvents: {Array.<string\>} 用以触发提示的事件名，浏览器原生field具有默认值，将会被此处定义覆盖
 -  rules: {Array.<object\>} 表单的验证规则，详情请参阅 **Validator** 及 **Rule** 相关文档
 -  hint: {string} 在触发hint事件时用以传入事件作显示的值
 -  name: {string} 用以在form中查找以取值或删除的标识，若不传递会以 dp_field_{guid}自动生成

### 事件:hint

- e.elem field的elem属性
- e.text hint的提示文本
	
### 事件:checked

- e.elem field的elem属性 
- e.name 验证出错字段的名称，若通过则为null
- e.hint 验证错误时的提示文本，若验证通过则为null
- e.passed 是否验证通过，bool值

	

.val(v=)
--------------------
### 语法
val方法只负责调用this.elem上的val方法，并将结果返回。
自定义formui组件自行决定在val被调用时如何处理数据和ui。

1.取值

	field.val();
	
2.存值

	field.val(v);
	
### 参数

####v
{mix} 将要设置给field的值

### 返回

{mix} 取得的field值


.check(cb,fire=true)
--------------------
验证field，无返回值，验证结果将作为事件对象传递给check事件函数。

### 语法

	field.check()

### 参数
#### cb
验证完毕的回调函数，接受默认参数passed，代表field中所有规则是否验证通过

#### fire
是否触发checked事件

.addRule(rule)
--------------------
为field的验证器添加一条验证规则，详情请参阅 **Validator** 相关文档

### 语法
	
	field.addRule(rule);

### 参数
#### rule

{Object|string} 规则配置 **Rule** 相关文档


说明
--------------------

- field的属性只做取值用，请勿在业务代码中对其进行直接修改以免出现无法预测的结果
- 在相关事件的事件对象上拿到的elem就是field的elem属性，并不一定是DOM实例，也可能是自定义的formui组件，这时候要拿到对你所关心的dom对象的引用，再去调用该组件的相关方法即可。


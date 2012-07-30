Outline
----
- css

修改或获取元素的特定css

css
------
删除节点上所存储的相应数据

### 语法

	DOM().css(prop);
	
### 参数

1. key: {string} 所要删除数据的键，若为undefined，则删除节点上存储的所有数据

### 示例

1. 获取css属性

	DOM("#myele").css("width"); // 返回 50px

2. 设置css属性

	DOM("#myele").css("width",50);

3. 设置多组css属性

	DOM("#myele").css({
            "width":50,
            "height":'12em'
        });

### 注意

- 通过css方法取出的值应当默认为string类型，需要自行处理单位
- 设值时若类型为数字或纯数字符串，则会以px为单位，亦可自行决定其他单位
- 设值方法会遍历DOM对象的所有元素进行设置
- 取值方法只会处理DOM对象第一个元素

</markdown>
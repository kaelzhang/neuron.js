Loader 模块标识规范及转换规则
====

本文说明，

 - 如何将一个 module identifier 转换为真实的文件路径。
 - 业务模块的代码如何放置。
 - 说明什麽叫做业务 App。

 

配置相关参数
----

### libBase

框架模块所在的根目录，也就是 Neuron 项目中的 lib 目录。

该目录的位置在生产环境可能会因版本不同而发生变化，比如 lib/1.0，lib/1.1 分别对应于 Neuron 的 1.0 和 1.1 版本。

### appBase

业务模块所在的根目录，它会因为业务环境的配置不同而不同。



命名规范
----
1. 模块标识仅能包含 **小写** 英文字母，数字，短横线（`-`，dash），斜线（`/`，slash）。
2. 斜线不应当出现在模块标识开头。


比如，如下命名都是 **错误** 的：

- 错误！`'shop::allReviews'` 应当更正为 ----> `'shop::allreviews'`
- 错误！`'io.ajax'` 应当更正为 ----> `'io/ajax'`



业务模块
----

### 格式
<业务模块包名>::<业务模块相对于包的路径名>

neuron 项目中也经常将 <业务模块包名> 成为 app名。


### 举例

假若 appBase 的路径为 s/j/app/

那么 

`'shop::main'` 模块对应于 s/j/app/shop/main.js

`'shop::main/map'` 模块对应于 s/j/app/shop/main/map.js


#### 格式说明
在 `appBase` 目录下，我们会放置同一个网站下，不同业务线的文件夹，并以该业务线的内容来命名。

以 [大众点评网主站](http://www.dianping.com) 为例，它包含至少如下三个业务线：

1. 商户中心
2. 图片中心
3. 用户中心

在 neuron 框架中，我们将每个不同的业务线，称作 **App**。


因此在可能会有如下的目录结构：

	<appBase>/
		shop/
			main.js				-- 页面级别的门面文件，main.js 对应于商户中心的主页面，商户页
			review.js
			main/
				map.js
				park.js
			
			comm/
				add-review.js
			
			
		pic/
			album-list.js
		user/
			private.js

在该目录结构下，

1. shop/ 目录即对应商户中心。
2. shop/ 目录根下面的 JavaScript 文件，为页面级别的文件。
3. 若某一个页面，包含一些复杂的模块，需要将这些模块放到与该页面文件同名的子目录中。
4. 若该业务线之中，存在多个页面都需要公用的模块，需要放置到 comm/ 目录下

### 业务模块分类及目录规则（草案）

#### 页面级文件（门面模块， Facade Module）

1. 页面级别的文件是一种利用 [Facade](http://en.wikipedia.org/wiki/Facade_pattern) 设计模式，将页面中各个模块的初始化代码集合起来的文件。
2. 它需要包含一个名为 `init` 的静态方法。
3. 一般的情况下，页面级文件 **不应当** 包含静态依赖。

#### 业务模块文件

1. 模块文件不应当包含动态依赖。



类库模块
----

### 格式

<类库模块的路径名>

### 举例

假若 libBase 的路径为 lib/1.0/

那么 

`'io/ajax'` 模块对应于 lib/1.0/io/ajax.js


### 类库模块目录规则

1. libBase 根目录不允许包含模块文件，所有的模块文件，都应当在 libBase 下的子目录中。
2. 同类模块，可以放到同一个目录中。如 ajax.js 与 json.js 可以放到 io/ 目录下。
3. 一般情况下，不应该出现多级子目录。


相对模块标识
----

### ./abc (relative identifier)
形如 ./abc 模块标识，只允许在 `NR.define` 的 factory 中使用，它指代的是相对于当前模块的路径。

#### 假若，

libBase 的路径为 lib/1.0/

在 lib/1.0/mypackage/mymodule.js （`'mypackage/mymodule'`） 文件中，有如下代码片段：

	NR.define(['./mymodule2'], function(D, require){
		var myModule2 = require('./mymodule2');
		
		// ...
	});
	
那么，上面的 

`'./mymodule2'` 就对应于 lib/1.0/mypackage/mymodule2.js，与 `'mypackage/mymodule2'` 等价。

### <del>../abc</del>

**框架规范中禁止使用这样的模块标志**

### ~/abc (home identifier)
这种模块标识，只能使用在业务模块中。表示相对于当前 app 的模块。

**Tips**: 可以将 neuron 相关的命名规范与 Linux 的语法风格类比。`~/` 相当于 user home。而我们的每个业务线的目录，就相当于用户文件夹。

	<appBase>/			->		Users/
		shop/			->			zhouyao/
		pic/			->			spud/
		user/			->			kael/
		

#### 假若，

appBase 的路径为 s/j/app/

有一个模块为 'promo::index'，根据上面的规则，对应于文件为 s/j/app/promo/index.js，`promo` 为 app名。

该模块的文件中，有如下代码片段:

	NR.define(['~/comm/locmap'], function(D, require){
	});

那么，上面的

`'~/comm/locmap'` 即对应于 `'promo::comm/locmap'`，对应文件为 s/j/app/promo/comm/locmap.js







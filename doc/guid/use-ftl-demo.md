Neuron新手入门
===
此处是介绍neuron, 省略1000字

链接
---
* [API文档](identifier)
* [下载&安装](https://github.com/kaelzhang/neuron)
* [关于neuron](https://github.com/kaelzhang/neuron)

一个例子
---
以图片中心为例，第一步当然是把代码拉下来了，移步到 code.dianpingoa.com 

	git clone git@code.dianpingoa.com:pic-static.git

#### JavaScript 目录结构
看看 pic-static 的目录结构

```
pic-static/
			css/
				xx.css
			js/
				xxx.js
```
CSS 文件是当前业务用到的 CSS

JS 目录下的文件存放业务 JS
#### 加载 neuron.js ：`业务上自动加载`
后端会自动把 neuron.js 载入到页面中

	<script>
		var __loaderConfig={appBase:'s/j/app/',libBase:'lib/1.0/',server:'i{n}.dpfile.com'};
	</script>
	<script 
	src="http://i1.dpfile.com/lib/1.0/neuron-active.min.53cf95a8154b692a089607d7d43c2034.js"
	></script>
	
#### 存储数据：`开发人员在 FTL 处理`

经常会有业务需要存储后端输出的数据，供业务模块调用，可以用 `DP.data` 函数来做这件事情。

	<script>
	DP.data({
		"reportSetting" :  {
			"feedPrefix":"[图片举报][上海]",
			"feedSuffix":"关于小桥流水精菜坊(淮海路店)的图片",
			"feedType": 11, 
			"referShopID": 2034829, 
			"cityID": 1
		},
		shopID: 2034829
	});
	</script>
`注意`

该函数参数是一个键值对, 值如果为字符串，则后端FTL输出时，需要`加引号`，例如在FTL上应该这样写：

	<script>
	DP.data({
    	"reportSetting" :  {
        	"feedPrefix": "${feedPrefix}",
        	"feedSuffix": "${feedSuffix}",
	        "feedType": 11, 
    	    "referShopID": 2034829, 
        	"cityID": 1
	    },
	    shopID: 2034829
	});
</script>
	#### 加载业务组件——使用一个模块：`开发人员在 FTL 中处理`

以图片中心为例。在 FTL 的 body 之后写下这段语句，可以加载Pic业务下的 list-new.js 这个文件	
	<script>		DP.require('Pic::list-new');	</script>
DP.require 用来调用业务的门面组件，这些组件，必须返回一个 init 方法，该方法会在组件加载完毕后自动调用。没有init 方法，该组件不会被调用。
DP.require('Pic::list-news'); 会把 Pic::list-news 解析为一个 URL 地址: 

	http://i2.dpfile.com/s/j/app/pic/list-new.min.e5e651d994467dd597989a970b4e67bd.js
其中 Pic 表示`业务代号`， list-news 表示`文件相对路径`，默认为 js 文件。

备注：

* 有关DP.require 请参见 [business-facade.md](https://github.com/kaelzhang/neuron/blob/master/doc/api/neuron/loader/business-facade.md)
* 有关业务名 "Pic" 的命名规范 请参见 [identifier.md](https://github.com/kaelzhang/neuron/blob/master/doc/api/neuron/loader/identifier.md)

#### 组件代码

list-news.js文件代码片段：

	DP.define(['Pic::widget/float', 'Pic::report/report', 'Pic::report/picmod', './zan', 'util/cookie'], function (D, require, exports) {
	
		// 在这里写你的业务代码
		
		var main = function(){
			// 在这里写你的业务代码
		};
		
		// 必须把 init 方法导出，否则这个沙箱里的代码都不会被执行。
		exports.init = main;
	});

到此，一个业务组件就已经加载完成，开发人员可以在这个沙箱里进行业务开发。

有关DP.define 请参见 [module-defining.md](https://github.com/kaelzhang/neuron/blob/master/doc/api/neuron/loader/module-defining.md)
Neuron Loader: Change Log
=========================

marks:
- √ complete
- \# deprecated scheme
- X discarded scheme
- * unimportant
- ! important and of high priority
	
##### 2012-06-08  Kael:

TODO:

- split logic of module loading and generating module identifiers
- backword compatibility with passive mode

##### 2012-05-10  Kael:

- complete main functionalities of passive-mode loader.
	
	
##### 2012-05-02  Kael:

- create a new dev branch for loader of passive mode
    
TODO:

- A. remove KM.define.on and KM.define.off	

##### 2012-04-26  Kael:

- A. transaction support

##### 2012-03-05  Kael:

TODO:

- X A. create an another version of loader to support loading all dependencies simultaneously according to a parsed dependency tree

milestone 4.0
=============
****

##### 2012-03-05  Kael:

TODO:

- A. add methods to define custom syntax for module identifier

##### 2012-02-06  Kael:

- fix image pre-loader
- change all `loaderError` to `error`

##### 2012-01-05  Kael:

TODO:

- A. make KM.define support NodeJS environment

##### 2011-12-08  Kael:

TODO:

- X A. could define a tree of dependencies for a certain module. so that we can parse all dependencies of modules ahead of time by back-end services
	reason: dealing loading sequence is not the matter front-end loader should concern, because it's doing something with arithmetics and environment configurations. 

##### 2011-10-27  Kael:

- bug fixes: if the base location of an app is not empty, IE will fail

##### 2011-10-17  Kael:

- adjust the logic about uri generation
- improve generateModuleURI_Identifier method to make sure it works even if the uri is not an absolute uri

##### 2011-10-11  Kael:

- optimize calling chain for provideOne; 
- optimize scope chain for STATUS enum;

##### 2011-10-05  Kael:

- fix the bug that module dependencies will lose namespace information when providing; 
- set the identifier of home modules as '~'
	
TODO:

- X A. use loader constructor instead of singleton

##### 2011-09-27  Kael:

- complete configuration for the new APIs of Loader

##### 2011-09-23  Kael:

- complete TODO[09-09].A  
- complete TODO[09-12].A
- complete TODO[09-21].[B,C,D]

##### 2011-09-22  Kael:

- loader will have no fault tolarence on initialization of configuration

TODO:

- A. split implementations of browser and non-browser environment
- B. optimize absolutizeURI method, put the last condition ahead. speed test
- C. optimize mod.uri, if enableCDN is true, mod.uri will no more be applied with CDNHasher

##### 2011-09-21  Kael:

- TODO[09-02].B 100%

TODO:

- ! A. support pre-loading env modules before anything taking effect
- √ ! B. remove API: define(alias, uri) to improve readability and definition
- √ C. replace all text of errors and warnings with error code
- √ D. treat loaderError and warning as configurations of loader
- X E. remove the feature that loader would not initialize the factory function if no callback method passed to KM.provide

##### 2011-09-17  Kael:

- complete TODO[09-09].B

##### 2011-09-12  Kael:

TODO:

- √ A. split the logic about loader constructor and its instances
- ?X B. refractor dependency model with EventProxy
- X C. use dev version modules if debug mode on
- √ D. throw no warnings and errors when release mode on

milestone 3.0
=============
****

##### 2011-09-09  Kael:

TODO:

- √ ! A. add loader constructor to create more than one configuration about library base, etc.
		Scheme: KM.define('http://...fx.js'); var Checkin = KM.app('Checkin'); KM.define('http://...timeline.js');
		KM.provide('Checkin::timeline', function(K, timeline){ … });
- √ B. optimize isXXX methods for scope chain
- X C. use native forEach methods for Array: too much arguments

##### 2011-09-07  Kael:

TODO:

- √ A. [issue] if pkg module is directly defined by define.on(), automatically providing called by a child module will fail
- ? B. support fake package module definition: define.on(); define('dom', fn); define.off(); define('dom/dimension', fn)

##### 2011-09-02  Kael:

- remove parseDependencies methods, all dependencies must be explicitly declared.

TODO:

- A. support non-browser environment
- √ B. distinguish the identifier for anonymous module and non-anonymous module in the module cache. 
		if define('abc', fn), it will be saved as {'~abc': fn}, 
		completely prevent user from defining a path as the module identifier to override lib modules
		
- X C. support the module which could automatically initialize itself when provided
- D. split the logic of module management and script manipulation, 
		so that loader could work on non-browser environment, such as NodeJS

##### 2011-09-01  Kael:

TODO:

- A. prevent duplicate defining a certain module

##### 2011-08-20  Kael:

TODO:

- A. improve stability if user provide a package file

##### 2011-08-03  Kael:

- TODO[08-01].[A,E]

##### 2011-08-02  Kael:

- refractor package definition. 
		if a relevant package is detected, neuron loader will try to fetch the package instead of the module file itself.
		if the id of module A is the parent dirname of module B, A will be treated as the pkg of B 
- TODO[06-15].[C,I,J,K]

##### 2011-08-01  Kael:

- add config.santitizer, remove path_cleaner out from loader

TODO:

- √ A. failure control, if loading the package fails, fallback to normal way to provide modules
- √ B. tidy parameters in _define
- C. lazily manage package association
- D*. detect if it fails to load a module file
- √ E. [issue] if define a package after the definition of a certain module, the package association fails

##### 2011-06-10  Kael:

- TODO[06-15].[E, A]

milestone 2.0
=============
****

##### 2011-06-07  Kael:

- fix a bug on regular expressions which could not properly remove the decorators(version and min) from uris
- fix a bug when defining a module with different versions
- change the way to determine the implicity of a module which will only relevant to the <name> param; remove the isImplicit flag from the '_define' method

##### 2011-05-15  Kael:

- fix a bug, in ie6 on virtual machine, that the module could not load successfully, 
		if onload event fired during insertion of the script node(interactive script fetched) 
	
TODO:

- √ A. new API: KM.define(uri1, uri1, uri3, uri4, true) to define several module uris
- B. add loader constructor to create more instances of loader
	- 1. association of several instances of loader
	- 2. comm definition
- √ C. package detection: 
	- 1. if the uri of a package is already defined, then its children modules will associated with it even before the source file of the package is fetched
		# - 2. automatically detect the providing frequency within the modules in one package, in order to automatically use packages
	
	// never add this feature into module loader
- X # D. [blocked by C] frequency detection for the use of modules within a same lib directory(package), and automatically use package source instead
- √ E. switcher to turn on define buffer, so we can load module files in traditional ways(directly use <script> to load external files)
- F. tidy the logic about param factory of string type and param uri in _define method
- ? G. nested define-provide structure. you can use KM.provide inside the factory function of KM.define to dynamically declare dependencies
	
	// ._allMods removed
- X # H. complete ._allMods method
- √ I. abolish KM._pkg
- √ J. prevent defining a non-anonymous module with a name like pathname
- √ ? K. explode the cache object of modules
- L. optimize the calling chain of define and getOrdefine, use less step to get module idenfitier.

##### 2011-05-14  Kael:

- TODO[05-08].A
- add more annotations

##### 2011-05-12  Kael:

- TODO[05-08].B

##### 2011-05-10  Kael:

- add assetOnload.css
- add support for css dependencies: TODO[04-17].H
- add support for resources with search query
- if module uri has a location.search and location.hash, it wont be fulfilled width the extension of '.js' any more

TODO:

- A?. default configurations
- B?. Loader Class support: to create various loader instances with different configurations

##### 2011-05-08  Kael:

- tidy the status data of modules
- modules defined in package files will be treated as library modules

TODO:

- √ A. [issue] when no cdn, package modules don't properly saved in {_mods}: 
			the module identifier should not be a pathname but absolute uri
- √ B. tidy the logic about configuration, such as managing default settings, checking.

##### 2011-05-07  Kael:

- fix a syntax exception when defining anonymous module in ie6-9

##### 2011-05-05  Kael:

- TODO[04-27].A

##### 2011-04-27  Kael:

- fix a bug of implicit module definition
- fix a bug that the callback isn't able to be called when the module is already being providing

TODO:

- √ A. [issue] implicitly defined module dont properly saved as absolute uri

##### 2011-04-26  Kael:

- TODO[04-17].C

##### 2011-04-25  Kael:
 95%!
- optimize call chain. create private methods with no type-detecting for arguments
- module path will include location.search
- config.enableCDN will affect module path
- support modules with multiple versions
- complete cdn auto delivery TODO[04-17].E2
- remove analysisModuleName method
- complete all functionalities relevant with package definition TODO[05-17].G

##### 2011-04-24  Kael:

- require and define methods in inline docs and in module file will be different
- TODO[04-17]['A', 'D', 'E1', 'B']
- adjust annotations for advanced mode of closure compiler

TODO:

- √ optimize and cache dependent modules and module infos
- test TODO[04-17].B

##### 2011-04-20  Kael:

- redesign the realization of modules, 
	distinguish the 2 different ways to define a module - on page or in a module file
- redesign require method
- add config for CDNHasher

milestone 1.0
=============
****

##### 2011-04-19  Kael:

- \# remove lazy quantifier from the regexp to match comments
		choose lazy match afterwards

##### 2011-04-18  Kael:

- remove comments before parsing dependencies from factory function

##### 2011-04-17  Kael:

- memoize the result of analysisModuleName
- santitize the logic of providing a module, split provideOne off from provide
- complete basic work flow

TODO:

- √ B. cyclic dependency detection
- √ A. reference path for the inside of each module
- √ C. fix scriptonload on ie6-9
- √ D. tidy module data, remove no-more unnecessary properties
- √ E. enable the support to cdn
		- √ avoid duplicate request
		- √ cdn frequency adjustion ?
- \# F. detecting potential invocation errors
		- change 'exports' object
		- define non-anonymous module in a module file
- √ H. support css dependencies
- √ Z. debug-release mode switching
		- debug: 
			- √ maintain the script nodes which attached into the document
			- X print dependency tree
		- release: 
			- √ remove script nodes
			- √ warn, if a module's uri has not been specified
- √ G. package association

##### 2011-04-10  Kael:

- create main function of provide
- add a new api, KM.pkg to define a package

##### 2011-04-05  Kael:

- create main function of define

##### 2011-04-03  Kael:
 basic api design
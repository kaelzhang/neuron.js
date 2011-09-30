<script>

describe('Neuron:lang/enhance', function(){
	describe('DP', function(){
		var Class = KM.Class,
			
			myClass = Class({
				initialize: function(n){
					this.c = n;
				},
				
				get: function(){
					return this.c * 10;
				},
				
				data: {
					a: 1,
					b: 2
				},
				
				_data: {
					a: 1
				},
				
				_data2: {
					a: 1
				}
			}),
			
			subClass = Class(myClass, {
				initialize: function(n){
					this.c = n * 100;
				},
				
				data2: {
					a: 11
				}
			});
		
		describe('.Class', function(){
			it('basic functionalities testing', function(){
				var ins = new myClass(2);
				
				expect(ins.get()).toEqual(20);
			});
			
			it('will create a pure class with tidy prototype', function(){
				expect(myClass.prototype.data.a).toEqual(1);
			});
			
			it('will unlink the reference to its prototype', function(){
				var ins = new myClass(2);
				
				ins._data.a = 11;
				
				expect(myClass.prototype._data.a).toEqual(1);
				
				myClass.prototype._data.a = 111;
				expect(ins._data.a).toEqual(11);
			});
			
			it('will always maintain the prototype chain', function(){
				var ins = new myClass(2);
				
				delete ins._data2.a;
				expect(ins._data2.a).toEqual(1);
				
				myClass.prototype._data2.a = 111;
				delete ins._data2.a;
				expect(ins._data2.a).toEqual(111);
			});
			
			it('could inherit from a pure constructor', function(){
				function parentClass(){};
				parentClass.prototype = {
					a: {
						a: 1
					},
					
					b: [1, 2, 3],
					
					c: 1,
					
					method: function(){
						return this.c
					}
				};
				
				var myClass = Class(parentClass, {
					method2: function(){
						return this.c * 10;
					}
				});
				
				var c = new myClass,
					cp = new parentClass;
				
				expect(c.method()).toEqual(1);
				expect(c.method2()).toEqual(10);
				expect(cp.method2).toBeUndefined();
				
				expect(c.a.a).toEqual(1);
				delete c.a.a;
				expect(c.a.a).toEqual(1);
				
			});
			
			it('could inherit from a KM.Class constructor', function(){
				var parentClass = Class({
					a: {
						a: 1
					},
					
					b: [1, 2, 3],
					
					c: 1,
					
					method: function(){
						return this.c
					}
				});
				
				var myClass = Class(parentClass, {
					method2: function(){
						return this.c * 10;
					}
				});
				
				var c = new myClass,
					cp = new parentClass;
				
				expect(c.method()).toEqual(1);
				expect(c.method2()).toEqual(10);
				expect(cp.method2).toBeUndefined();
				
				expect(c.a.a).toEqual(1);
				delete c.a.a;
				expect(c.a.a).toEqual(1);
				
			});
		}); // end Class
		
		describe('.Class.Exts', function(){
			describe('super', function(){
				it('provide access to invocate the method of the super class(pure constructor)', function(){
					function parentClass(){};
					
					parentClass.prototype = {
						c: 1,
						
						method: function(){
							return this.c;
						}
					};
					
					var	myClass = Class(parentClass, {
							Implements: ['super'],
							method: function(){
								return this._super('method') * 10;
							}
						});
					
					var c = new myClass,
						cp = new parentClass;
					
					expect(c.method()).toEqual(10);
					expect(cp.method()).toEqual(1);
				});
				
				it('provide access to invocate the method of the super class(KM.Class constructor)', function(){
					var parentClass = Class({
							c: 1,
							
							method: function(){
								return this.c
							}
						}),
						
						myClass = Class(parentClass, {
							Implements: ['super'],
							method: function(){
								return this._super('method') * 10;
							}
						});
					
					var c = new myClass,
						cp = new parentClass;
					
					expect(c.method()).toEqual(10);
					expect(cp.method()).toEqual(1);
				});
				
				it('recursive invocation', function(){
					var ancestor = Class({
							c: 1,
							method: function(){
								return this.c;
							}
						}),
					
						parent = Class(ancestor, {
							method: function(){
								return this._super('method') * 10;
							}
						}),
						
						myClass = Class(parent, {
							Implements: ['super']
						});
					
					var c = new myClass;
					
					expect(c.method()).toEqual(100);
				});
			}); // END SUPER
			
			describe('attr', function(){
				it('will unlink the attributes of a instance with the presets', function(){
					var myClass = Class({
							Implements: 'attrs',
							initialize: function(options){
								this.setAttrs(options);
							}
						});
						
					Class.setAttrs(myClass, {
						a: {
							value: 1
						},
						
						b: {
							value: 2,
							writeOnce: true
						}
					});
					
					var ins = new myClass({a: 5}),
						ins2;
						
					expect(ins.get('a')).toEqual(5);
					
					ins.set('a', 10);
					ins2 = new myClass();
					
					expect(ins2.get('a')).toEqual(1);
				});
			
				it('prevent private member from directly accessing', function(){
					var myClass = Class({
							Implements: 'attrs',
							initialize: function(options){
								this.setAttrs(options);
							}
						});
						
					Class.setAttrs(myClass, {
						a: {
							value: 1
						},
						
						b: {
							value: 2,
							writeOnce: true
						}
					});
					
					var ins = new myClass();
					
					ins.set('a', 10);
					
					expect(ins.a).toBeUndefined();
				});
				
				it('could specify a setter(direct setter)', function(){
					var myClass = Class({
							Implements: 'attrs',
							initialize: function(options){
								this.setAttrs(options);
							}
						});
						
					Class.setAttrs(myClass, {
						a: {
							value: 1,
							setter: function(n){
								return n * 10;
							}
						}
					});
					
					var my = new myClass();
					
					expect(my.get('a')).toEqual(1);
					expect(my.set('a', 2)).toBeTruthy();
					expect(my.get('a')).toEqual(20);
				});
				
				
				it('could specify a setter(set a member of the instance)', function(){
					var myClass = Class({
							Implements: 'attrs',
							initialize: function(options){
								this.setAttrs(options);
							}
						});
						
					Class.setAttrs(myClass, {
						a: {
							setter: function(n){
								this.b = n * 10;
							}
						}
					});
					
					var my = new myClass();
					
					expect(my.get('a')).toBeUndefined();
					expect(my.b).toBeUndefined();
					expect(my.set('a', 2)).toBeTruthy();
					expect(my.get('a')).toBeUndefined();
					expect(my.b).toEqual(20);
				});
				
				
				it('could specify a setter(instance method as a setter)', function(){
					var myClass = Class({
							Implements: 'attrs',
							initialize: function(options){
								this.setAttrs(options);
							},
							
							_setA: function(n){
								this.b = n * 10;
							}
						});
						
					Class.setAttrs(myClass, {
						a: {
							setter: '_setA'
						}
					});
					
					var my = new myClass();
					
					expect(my.get('a')).toBeUndefined();
					expect(my.b).toBeUndefined();
					expect(my.set('a', 2)).toBeTruthy();
					expect(my.get('a')).toBeUndefined();
					expect(my.b).toEqual(20);
				});
				
				
				it('could specify a getter(direct getter)', function(){
					var myClass = Class({
							Implements: 'attrs',
							initialize: function(options){
								this.setAttrs(options);
							}
						});
						
					Class.setAttrs(myClass, {
						a: {
							value: 1,
							getter: function(v){
								return v * 100;
							}
						}
					});
					
					var my = new myClass();
					
					expect(my.get('a')).toEqual(100);
					expect(my.set('a', 2)).toBeTruthy();
					expect(my.get('a')).toEqual(200);
				});
				
				
				it('could specify a getter(instance method as a getter)', function(){
					var myClass = Class({
							Implements: 'attrs',
							initialize: function(options){
								this.setAttrs(options);
							},
							
							_getA: function(n){
								return n * 100
							}
						});
						
					Class.setAttrs(myClass, {
						a: {
							value: 1,
							getter: '_getA'
						}
					});
					
					var my = new myClass();
					
					expect(my.get('a')).toEqual(100);
					expect(my.set('a', 2)).toBeTruthy();
					expect(my.get('a')).toEqual(200);
				});
				
				
				it('could specify a validator(direct validator)', function(){
					var myClass = Class({
							Implements: 'attrs',
							initialize: function(options){
								this.setAttrs(options);
							}
						});
						
					Class.setAttrs(myClass, {
						a: {
							value: 1,
							validator: function(n){
								return n < 100;
							}
						}
					});
					
					var my = new myClass();
					
					expect(my.get('a')).toEqual(1);
					expect(my.set('a', 100)).toBeFalsy();
					expect(my.get('a')).toEqual(1);
					expect(my.set('a', 99)).toBeTruthy();
					expect(my.get('a')).toEqual(99);
				});
				
				
				it('could specify a validator(instance method as a validator)', function(){
					var myClass = Class({
							Implements: 'attrs',
							initialize: function(options){
								this.setAttrs(options);
							},
							
							_validateA: function(n){
								return n < 100;
							}
						});
						
					Class.setAttrs(myClass, {
						a: {
							value: 1,
							validator: '_validateA'
						}
					});
					
					var my = new myClass();
					
					expect(my.get('a')).toEqual(1);
					expect(my.set('a', 100)).toBeFalsy();
					expect(my.get('a')).toEqual(1);
					expect(my.set('a', 99)).toBeTruthy();
					expect(my.get('a')).toEqual(99);
				});
				
				
				(function(){
					var myClass = Class({
							Implements: 'attrs',
							initialize: function(options){
								this.setAttrs(options);
							}
						}),
						
						myClass2 = Class({
							Implements: 'attrs',
							initialize: function(options){
								this.setAttrs(options, true);
							}
						})
						
					Class.setAttrs(myClass, {
						a: {
							value: 1,
							readOnly: true
						},
						
						b: {
							value: 1,
							writeOnce: true
						}
					});
					
					Class.setAttrs(myClass2, {
						a: {
							value: 1,
							readOnly: true
						},
						
						b: {
							value: 1,
							writeOnce: true
						}
					});
					
					var my = new myClass({a: 2, b: 2}),
					
						// force to initializing
						my2 = new myClass2({a: 2, b: 2});
				
				
					it('provide controller: readOnly', function(){
						expect(my.get('a')).toEqual(1);
						expect(my2.get('a')).toEqual(2);
						
						expect(my.set('a', 3)).toBeFalsy();
						expect(my2.set('a', 3)).toBeFalsy();
						
						expect(my.get('a')).toEqual(1);
						expect(my2.get('a')).toEqual(2);
					});
						
					it('provide controller: writeOnce', function(){
						expect(my.get('b')).toEqual(2);
						expect(my2.get('b')).toEqual(2);
						
						expect(my.set('b', 3)).toBeFalsy();
						expect(my2.set('b', 3)).toBeTruthy();
						
						expect(my.get('b')).toEqual(2);
						expect(my2.get('b')).toEqual(3);
						
						expect(my2.set('b', 4)).toBeFalsy();
						expect(my2.get('b')).toEqual(3);
					});
					
				})();
				
			}); // END ATTR
		}); // END CLASS EXTS
		
	}); // END DP
});

</script>
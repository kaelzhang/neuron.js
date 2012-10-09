describe("测试getRule",function(){
	it("name为max，passed为false，hint为null",function(){
		
		var ready = false;
		
		runs(function(){
			NR.provide(['form/validator'],function(D,Validator){
				var v2 = new Validator([{
					test:"email",
					hint:"email not correct"
				},'max:5']);
				ready = true;
				var rule_by_name = v2.getRule("max");
				expect(rule_by_name.name).toEqual("max");
				expect(rule_by_name.hint).toEqual(null);
				var rule_by_num = v2.getRule(0);
				expect(rule_by_num.name).toEqual("email");
				expect(rule_by_num.hint).toEqual("email not correct");
				var rule_not_exist = v2.getRule("not exists");
				expect(rule_not_exist).toEqual(null);
			});
		});
		
		waitsFor(function(){
			return ready;
		});
	});	
});

/*
describe("测试removeRule",function(){
	it("name为max，passed为false，hint为null",function(){
		
		var ready = false;
		
		runs(function(){
			NR.provide(['form/validator'],function(D,Validator){
				var v2 = new Validator([{
					test:"email",
					hint:"email not correct"
				},'max:5']);
				ready = true;
				v2.removeRule("max");
				var rule_by_name = v2.getRule("max");
				expect(rule_by_name).toEqual(null);
				
				v2.removeRule(0);
				
				var rule_email = v2.getRule(0);
				expect(rule_email).toEqual(null);
			});
		});
		
		waitsFor(function(){
			return ready;
		});
	});	
});
 */

describe("空验证器",function(){
	
	it("name为null，hint为null，passed为true",function(){
		var ready = false;
		
		runs(function(){
			NR.provide(['form/validator'],function(D,Validator){
				var v1 = new Validator();
				ready = true;
				
				
				v1.check("",function(e){
					expect(e.name).toEqual(null);
					expect(e.hint).toEqual(null);
					expect(e.passed).toEqual(true);
				});	
			});
		});
		
		
		waitsFor(function(){
			return ready;
		});
		
	});
});



describe("多预设验证器在max:5处出错",function(){
	it("name为max，passed为false，hint为null",function(){
		
		var ready = false;
		
		runs(function(){
			NR.provide(['form/validator'],function(D,Validator){
				var v2 = new Validator([{
					test:"email",
					hint:"email not correct"
				},'max:5']);
				ready = true;
				v2.check("my@gmail.com",function(e){
					expect(e.name).toEqual("max");
					expect(e.hint).toEqual(null);
					expect(e.passed).toEqual(false);
				});
			});
		});
		
		waitsFor(function(){
			return ready;
		});
	});	
});



describe("my@gmail.com测试自定义规则不通过",function(){
	it("name为dp_rule_2，passed为false，hint为custom error hint",function(){
		
		var ready = false;
		
		runs(function(){
			NR.provide(['form/validator'],function(D,Validator){
				var v3 = new Validator([{
					test:function(v){
						return v === 123;
					},
					hint:"custom error hint"
				}]);
				ready = true;
				v3.check("my@gmail.com",function(e){
		 			expect(e.name).toEqual('dp_rule_2');
		 			expect(e.hint).toEqual('custom error hint');
		 			expect(e.passed).toEqual(false);
				});
			});
		});
		
		waitsFor(function(){
			return ready;
		});
	});	
});




describe("异步验证不通过",function(){
	it("name为remote test，passed为false，hint为custom error hint",function(){
		
		var ready = false;
		
		runs(function(){
			NR.provide(['form/validator','io/ajax'],function(D,Validator,Ajax){
				var v4 = new Validator([{
					test:function(v,cb){
						new Ajax({
							url:'/test/unit/form/ajax/check_email.txt',
							method:'post'
						}).on('success',function(rt){
							ready = true;
							cb(rt.code === 200,rt.msg.hint);
						}).send();
					},
					async:true,
					name:"remote test",
					hint:"remote validate failed"
				}]);
				
				v4.check("my@gmail.com",function(e){
		 			expect(e.name).toEqual("remote test");
		 			expect(e.hint).toEqual("email exists");
		 			expect(e.passed).toEqual(false);
		 			
		 			// from cache
					v4.check("my@gmail.com",function(e){
			  			expect(e.name).toEqual("remote test");
			  			expect(e.hint).toEqual("email exists");
			  			expect(e.passed).toEqual(false);
					});
				});
				
			});
		});
		
		waitsFor(function(){
			return ready;
		});
	});	
});





describe("异步验证通过",function(){
	it("name为remote test，passed为false，hint为custom error hint",function(){
		
		var ready = false;
		
		runs(function(){
			NR.provide(['form/validator','io/ajax'],function(D,Validator,Ajax){
				var v5 = new Validator([{
					test:function(v,cb){
						new Ajax({
							url:'/test/unit/form/ajax/check_username.txt',
							method:'post'
						}).on('success',function(rt){
							cb(rt.code === 200,rt.msg.hint);
							ready = true;
						}).send();
					},
					async:true,
					name:"username test"
				}]);
				
				v5.check("my@gmail.com",function(e){
		  			expect(e.name).toEqual("username test");
		  			expect(e.hint).toEqual("user name exist");
		  			expect(e.passed).toEqual(true);
				});
				
			});
		});
		
		waitsFor(function(){
			return ready;
		});
	});	
});

				
				
NR.define(function (D) {

    /**
    * @name Rule
    */
    var Rule = new function () {
        var rules = {};

        function getPreset(rule) {
            var test = rule.test,
            	name = test.split(':')[0],
            	arg = test.split(':')[1] || '',
            	hint = rule.hint || null,
            	preset = rules[name];
            
            if (!preset) { 
            	throw "Rule preset " + name + " does not exist"; 
            }
            

            return {
            	name: rule.name || name,
                test: function (v) {
                    return preset(v,arg);
                },
                hint: hint && D.sub(hint,[arg])
            }
        }

        // 添加rule对象
        this.add = function (name, rule) {
            rules[name] = rule
        };

        // 获取rule对象，先不做任何预设
        // @example gain('required',['field required'])
        // @param param {Array}        
        this.produce = function (rule) {
			
			
			if(typeof rule === "string"){
				rule = {test:rule};	
			}
			
			if(typeof rule.test === "string"){
				rule = getPreset(rule);
			}
			
			// now we have such fomats:
			//
			//	{
			//		test:function(v){},
			//		hint:""
			//	}
			
			
            return {
            	name:rule.name || 'dp_rule_'+D.guid(),
            	test:rule.test,
            	hint:rule.hint
	        }
        };
    }

    // 预置规则

    // 必填
    Rule.add('required', function (v) {
    	if(typeof v === "string"){
	    	return v.trim() !== '';
    	}else{
      	  return !!(v === 0 || v);
        }
    });
    
    Rule.add('notempty',function(v){
    	return !!(v && (v.length !== undefined) && v.length > 0);
    });

    Rule.add('equal', function (v, v2) {
        return v === v2;
    });

    Rule.add('unequal', function (v, v2) {
        return v !== v2;
    });    

    // 最大
    Rule.add('max', function (v, l) {
        return v.length <= l;
    });

    // 最小
    Rule.add('min', function (v, l) {
        return v.length >= l;
	});

    Rule.add('allnumber',function (v) {
    	if(v && v.constructor === Array){
	    	return !!(v.length && !v.some(function(num){
		    	return !/^\d+$/.test(num);
	    	}));
    	}else{
        	return !!/^\d+$/.test(v);
        }
    });

    Rule.add('in', function (v, str) {
    	var ret = true;
    	var vs = str.split(',');
    	for(var i = 0,l=vs.length;i<l;i++){
    		if(vs[i]==v){
    			return true;
    		}
    	}
    	return false;
    });


    // remote验证
    /*
    Rule.add('_remote', {
        // 这个cb让Remote想办法处理了丢过来
        test: function (v, cb) {
            return cb.call(this, v);
        }
    });
    */

    // 正则规则们
    [['chinese', /^[\u0391-\uFFE5]+$/],
     ['email', /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/],
     ['nickname', /^[0-9a-zA-Z_\u4e00-\u9fa5]+$/]
    ].forEach(function (e) {
        Rule.add(e[0], function (v) {
            return e[1].test(v);
        });
    });


    return Rule;

});




NR.define(['./field'], function (D, require) {

    var Field = require('./field'),
        $ = D.DOM;


    /* 
     * @param elem {Object}
     * @return {Field}
    **/
    function parseField(elem){
    	var cfg;
    	
    	// elem as an Object {}
    	if(elem.constructor == Object ){
    		if(!elem.elem || !elem.rules){
	            throw 'elem and rule is required for a field config';
	        }
	        cfg = {
	            checkEvents:elem.checkEvents,
	            hintEvents:elem.hintEvents,
	            rules:elem.rules,
	            hint:elem.hint,
	            name:elem.name
	        };
	        field = new Field(elem.elem,cfg);
	        field.on(elem.events);
	    // elem as a Field
    	}else{
    		field = elem;
    	}
    	
        return field;
    }

    var Form = new D.Class({
        
		Implements : 'events attrs',
		
        initialize: function (form, options) {
            var self = this,
            	fields;
			
			form = $(form);
			
            if(!form.length){
                throw 'please parse a form';
            };
            
            self.set('block',options.block || false);
            
			
			fields = options.fields;
            fields.forEach(function(el,i){                
                self.add(el);
            });
            
            form.on('submit', function (e) {
                if(!self.check.call(self)){                    
                    e.preventDefault();
                }
            });
            
            self.elem = form;
            
        },
        
        /**
         * 添加Field
         * @param field {Field}        
        **/
        add: function (field) {      
        
        	field = parseField(field);
        	
            this.get('fields').push(field);
            
			return this;
        },
		
		remove:function(name){
			var fields = this.get('fields');
			
			for(var i=0,l=fields.length;i<l;i++){
				if(fields[i].get('name') == name){
					fields.splice(i,i);
					break;
				}
			}
			
			return this;
		},
		
        /**
         * @param fire {Boolean} set false to prevent fire check event in field
         */
        check: function () {
            var self = this,
            	fields = self.get('fields'),
            	block = self.get('block'),
            	stop = false,
            	count = fields.length,
            	passes = {},
            	passed = true;
            
            
            for(var i=0,fld,res;fld=fields[i];i++){
            	(function(f){
	            	f.check(function(p){
	            		passes[f.get("name")] = p;
	            		if(!p){
	            			passed = false;
	            			if(block){
	            				stop = true;
	            			}
	            		}
	            	});
            	})(fld);
            	
            	if(stop){
            		break;
            	}
            }
            
            self.fire('checked',{
            	passed:passed,
            	passes:passes
            });
            
            return passed;
        },
        
        val:function(){
        	var ret = {};
        	
        	this.get("fields").forEach(function(field){
        		ret[field.get("name")] = field.val();
        	});
        	
        	return ret;
        }
    });
	
	D.Class.setAttrs(Form, {
        block:{
        	value:false
        },
        fields:{
        	value:[]
        }
    });
	
    return Form;
});

NR.Class.EXTS['super'] = {
	// execute the method of superClass
	_super: function(name, args){
		var __SUPER_CLASS = 'superclass',
		
			self = this,
			super_ = self[__SUPER_CLASS],
			superProto,
			superMethod,
			superX2,
			ret;
			
		if(super_){
			superProto = super_.prototype;
			superMethod = superProto[name];
			
			if(superMethod){
				superX2 = superProto[__SUPER_CLASS];
				
				// temporarily change the current superclass as parent superclass
				self[__SUPER_CLASS] = superX2;
				
				// for IE, args mustn't be undefined but an array
				ret = superMethod.apply(self, args || []);
				
				// then return it back
				self[__SUPER_CLASS] = super_;
			}
		}
		
		return ret;
	}
};
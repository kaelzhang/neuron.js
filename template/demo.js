KM.define({
	HTML: '<div id="form-wrap" class="ele-wrap wrap">'
		+ '<div class="dialog-title">登陆或注册</div>'
		+ '<div class="field">'
		+ 		'<label>field1</label>'
		+ 		'<input class="input" id="i-field1" placeholder="input here..."/>'
		+ 		'<span id="i-field1-err" class="err"></span>'
		+ '</div>'
	
		+ '<div class="field">'
		+ 		'<label>field2</label>'
		+ 		'<input class="input" id="i-field2" placeholder="input here..."/>'
		+ 		'<span id="i-field2-err" class="err"></span>'
		+ '</div>'
	
		+ '<div class="field" id="i-checks">'
		+ 		'<label>checkboxes</label>'
		+ 		'<input class="c" type="checkbox" value="1" name="c"/>'
		+ 		'<input class="c" type="checkbox" value="2" name="c" />'
		+ 		'<input class="c" type="checkbox" value="3" name="c" />'
		
		+ 		'<span id="i-checks-err" class="err"></span>'
		+ '</div>'
	
		+ '<div class="field" id="i-radios">'
		+ 		'<label>radios</label>'
		+ 		'<input class="r" type="radio" value="1" name="r" />'
		+ 		'<input class="r" type="radio" value="2" name="r"  />'
		+ 		'<input class="r" type="radio" value="3" name="r"  />'
		
		+ 		'<span id="i-radios-err" class="err"></span>'
		+ '</div>'
		
		+ '<div class="field">'
		+ 		'<label>capcha</label>'
		+ 		'<input id="i-capcha" class="input" type="text" placeholder="type the capcha you see"/>'
		+ 		'<span id="i-capcha-err" class="err"></span>'
		+ '</div>'
	
		+ '<input type="button" value="show data" id="submit-btn" />'
		+ '</div>',
		
	rules: {
		field1: {
			errMsg: 'is required, {value} is longer than 10, must not be number, must not contain "abc"',
			test: ['required', 'max-length:10', 'regex:^\\D+$', function(v){
				return v.indexOf('abc') < 0;
			}]
		},
					
		field2: {
			errMsg: 'is required, must not contain "abc"',
			test: ['required', function(v){
				return v.indexOf('abc') < 0;
			}]
		},
		
		radios: {
			errMsg: 'at least select one item',
			test: 'required',
			type: 'radio'
		},
		
		checks: {
			errMsg: 'at least select one item',
			test: 'required',
			type: 'checkbox'
		},
		
		capcha: {
			errMsg: 'invalid capcha',
			test:	'capcha'
		}
	}
});

/** 
 * Kael.Me live event
 * modified from mootools live event, and optimized performance
 
 * KM.live
 * KM.die
 */
(function(kael_me_namespace) {
	var _guid = 1,
		_fns = {},
		
		_liveHandler = function(event) {
			var eventTarget = $(event.target), 
				type = event.type,
				
				fns = _fns[type],
				fn,
				
				matchedElements = [],
				stop = true,
				
				len,
				
				i = 0,
				
				elem,
				
				closest = _closest,
				
				closestElement;
				
			// Make sure we avoid non-left-click bubbling in Firefox (#3861) --- jQuery
			if (!fns || !fns.length || event.liveFired === this || event.rightClick ) {
				return;
			}

			event.liveFired = this;
			
			// live event will be triggered a lot,
			// for performance, use for loop instead of mootools each method
			for(len = fns.length; i < len; i ++){
				fn = fns[i];
				
				closestElement = closest(fn.selector, eventTarget);

				if (closestElement && 
					
					// 'mouseenter' and 'mouseleave' require additional checking
					!(
						fn._related && 
						
						// $$(if fn.selector) contains relatedTarget, current event is not 'mouseenter' or 'mouseleave'
						closest(closestElement, event.relatedTarget) 
					)
				
				){
					matchedElements.push({
						elem: closestElement.elem,
						order: closestElement.distance,
						
						target: eventTarget,
						fn: fn
						 
					});
				}
				
			}
			
			len = matchedElements.length;
	
			if (len) {
				
				// sort the functions, so that they will be executed by bubble order
				matchedElements.sort(function(a, b) {
					return a.order - b.order;
				});
				
				for(i = 0; i < len; i ++){
					elem = matchedElements[i];
					
					// fireEvents
					// if there's one method returned false, stop live event <type>
					if (elem.fn(event, elem.elem) === false){
						stop = false;
					}
				}
			}
			
			return stop;
		},
		
		
		// @param {DOM selector || DOM element} selector
		// @param {DOM element} element
		
		// @return {
		//		elem: the first ancestor element that matches the selector
		//		distance: the DOM distance between elem and the element
		// }		
		
		// or false if no match found
		_closest = function(selector, element) {
			if(!element) return;
			
			var parents = $$(selector), 
			
				currentElement = element, 
				
				distance = 0;
			
			if (!parents.length) return;
	
			while (currentElement && !_isBody(currentElement)) {
				
				if (parents.contains(currentElement)) {
					return {distance: distance, elem: currentElement};
				}
				
				currentElement = currentElement.getParent();
				
				++ distance;
			}

			return;
		},

		_isBody = function(element) {
			return (/^(?:body|html)$/i).test(element.tagName);
		};
		
		// @param {string} selector selector of live event must be string
		// @param {string} type
		_addLiveEvent = function(selector, type, fn) {
			// $$(selector).length may be 0, the elements which match the selector might not be inserted into DOM yet
			if($type(selector) !== 'string') return;
			
			var fns,
				
				// so that, we won't add 'selector' in fn
				fn_wrap = function() { return fn.apply(this, arguments) },
				
				len,
				
				saved_fn,
				
				passed = true;
				
			if(type === 'mouseenter'){
				fn_wrap._related = true;
				type = 'mouseover';
				
			}else if(type === 'mouseleave'){
				fn_wrap._related = true;
				type = 'mouseout';
			}
			
			// save different type seperately, save time
			fns = _fns[type] || ( _fns[type] = [] );
			
			len = fns.length;
				
			fn_wrap.guid = fn.guid = fn.guid || _guid ++;
			
			fn_wrap.selector = selector;
			
			if(len){
				
				// we have judged len at 'if' just now, do first
				do{
					saved_fn = fns[--len];
					
					// rules: NEVER let user bind 'mouseover' and 'mouseenter' to one same element simultaneously
					// the same to 'mouseout' and 'mouseleave'
					if(saved_fn.guid === fn_wrap.guid || saved_fn.selector === fn_wrap.selector){
						passed = false;
						
						// break, and save time
						break;
					}
					
				}while(len);
				
				passed && fns.push(fn_wrap);

			}else{
				fns.push(fn_wrap);
			}
			
			document.addEvent(type, _liveHandler);
		},
		
		_removeLiveEvent =  function(selector, type, fn) {
			if($type(selector) !== 'string') return;
			
			var fns = _fns[type];
			
			if (!fns || !fns.length) return;
			
			_fns = fns.filter(function(_func) {
				return !(_func.selector === selector && (fn ? _func.guid === fn.guid : true));
			});
		};
		
	kael_me_namespace.live = _addLiveEvent;
	kael_me_namespace.die = _removeLiveEvent;
		
})(KM);

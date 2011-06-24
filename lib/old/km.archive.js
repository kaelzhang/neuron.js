// JavaScript Document


KM.init.add(function(){
	var title = $$('.side-archive .side-t');
	
	title.each(function(t){
		t.addEvent('click', function(e){
			// e.target.hasClass('side-t') && e.preventDefault();
		
			var p = t.getParent();
			
			title.getParent().removeClass('side-this');
			
			p.toggleClass('side-this');
			
		});	
	});
	
	KM.popup.init().assign('.list-post', true);
	
	KM.live('.page-link a', 'click', function(e, link_){
		e && e.preventDefault();
		
		location.hash = 'page/' + link_.get('text');
	});
	
	var container = $('list-cont'),
	
		overlay = new KM.Overlay(container),
		
		getArchive = function(arg){
			var q = KM.query;
											 
			new KM.Request({
				url: '/handler.x',
				data: {
					
					// UNDONE!
					a: 'archive',
					y: q.yr,
					m: q.mo,
					cat: q.cat,
					max: q.max,
					page: arg || q.page,
					uri: location.pathname
				},
				
				onRequest: function(){
					overlay.show();
				},
				
				onSuccess: function(rt){
					var c = container.empty();
					
					if(rt.list){
						rt.list.each(function(li_html){
							new Element('li', {'class': 'list-post', 'html': li_html}).inject(c);
						});
						
						rt.pagenavi && $('page-nav').set('html', rt.pagenavi);
						
						overlay.hide();
					}
				},
				
				onError: function(){
					overlay.hide();
				}
						   
			}).send();
		}
	
	KM.handler.register('page', getArchive).start({noHash: getArchive});
	
});

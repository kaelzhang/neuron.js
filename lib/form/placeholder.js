/**
 * @overview module to support placeholder for ungelivable browsers   
 * @author jiayi.xu
 */

NR.define(['uibase/align'],function(D,require){

var 

Align = require('uibase/align'),
Dim = require('dom/dimension'),

STR_DISPLAY = 'display',

$ = D.DOM,
    
Placeholder = D.Class({
        
    initialize: function(elem,opt){
        /*
        if('placeholder' in document.createElement('input')){
            return;
        }
        */

        var self = this,
            hideEvent =  ( opt && opt.hideEvent) || 'focus',
            showEvent = 'blur',
            className = 'd-ui-placeholder',
            
            elem = this.elem = $.findOne(elem),
            
            ph = this.placholder = elem.attr('placeholder'),
            lb = this.label = $.create('label').html(ph).addClass(className).attr('for',elem.attr('id')),
            
            hasScroll = Dim.offset(elem).height > Dim.size(elem).height ;        
                 
        if(!elem.attr('id'))elem.attr('id','d-ui-placeholder-'+ D.guid());    

        lb.css({
            position: 'absolute',
            fontSize: elem.css('font-size'),
            color: '#ccc', // be a option?
            fontFamily: elem.css('font-family'),
            lineHeight: elem.css('line-height'),
            width:Dim.size(elem.get(0),'scroll').width,
            height:elem.css('height'),
            overflow:'hidden',
            //paddingBottom: elem.css('padding-bottom'),                 
            cursor:'text',
            "z-index":elem.css('z-index')+1
        }).inject(elem.parent());

        //console.log(parseInt(elem.css('padding-top')) + parseInt(elem.css('border-top-width')));
        lb.on('click',function(){
            elem.get(0).focus();
        });

        self.lbAlign = new Align(lb);
        self.position();

        elem.on(hideEvent,function(e){ 
            console.log(e.type)
            if(e.type == 'focus'){
                self.hide();
            }else if(e.type == 'keyup'){
                if(elem.val() == ''){
                    self.show();
                }else{
                    self.hide();
                }
            }
        });  

        elem.on('blur', function(){
            self.show();
        });

        elem.on(showEvent,function(e){
            if(elem.val() == ''){
                self.show();      
            }else{
                self.hide();
            }
        });

    },
    position:function(){
        var elem = this.elem;
        this.lbAlign.align(elem,[Align.TL,Align.TL],{
            top: parseInt(elem.css('padding-top')) + parseInt(elem.css('border-top-width')),
            left:parseInt(elem.css('padding-left')) + parseInt(elem.css('border-left-width'))
        });
    },
    show:function(){
        this.label.css(STR_DISPLAY, '');
        this.position();
    },
    hide:function(){            
        this.label.css(STR_DISPLAY, 'none');
    }

});

return Placeholder;

});
<style type="text/css">
body, html{margin:0; padding:0;}

#offset-parent, #target-inner, #node-inner{ opacity:.4; *filter:alpha(opacity=40)}


#offset-parent{
    background-color: #fffc00;
    position:relative; width:800px; height:500px; margin:0 auto;
}

#target-inner{
    background-color: #0018ff;
    position:relative; width:300px; height:50px; left:100px; top:150px;
}

#node-inner{
    background-color: #00ff16;
    position:absolute; width:400px; height:300px; left:0; top:0;
}


#scroll-wrap{
    /* width:850px; height:400px; overflow:auto; margin:0 auto; */
}

</style>



</head>
<body>
<div id="scroll-wrap">
<div id="offset-parent">
    <div id="target-inner"></div>
    <div id="node-inner"></div>
</div>
</div>
<input id="toggle-relative" type="button" value="toggle yellow relative" >
<span id="yellow-status">relative</span>

<select id="target" autocomplete="off">
    <option>target</option>
    <option>body</option>
    <option>document</option>
    <option>window</option>
    <option>html</option>
    <option>viewport</option>
</select>

<select id="node-align" autocomplete="off">
	<option>node-align</option>
    <option>TL</option>
    <option>TC</option>
    <option>TR</option>
    <option>RC</option>
    <option>BR</option>
    <option>BC</option>
    <option>BL</option>
    <option>LC</option>
    <option>CC</option>

</select>

<select id="target-align" autocomplete="off">
	<option>target-align</option>
    <option>TL</option>
    <option>TC</option>
    <option>TR</option>
    <option>RC</option>
    <option>BR</option>
    <option>BC</option>
    <option>BL</option>
    <option>LC</option>
    <option>CC</option>
</select>

<input id="fix" type="checkbox" checked></input>fix

<div id="id1"></div>
<div id="id2"></div>
<div id="id3"></div>
<div id="id4"></div>

<script>


KM.ready(function(){

KM.provide(['uibase/align', 'dom/dimension'], function(K, Align, di){
    var parent = $('#offset-parent'),
    	position_status = $('#yellow-status'),
        target = $('#target-inner'),
        node = $('#node-inner'),
        t = target, //document.body,
        
        tp = 'BC',
        np = 'TC',
        
        target_enum = {
            target: target,
            window: window,
            body: document.body,
            document: document,
            html: document.documentElement,
            viewport: 'viewport'
        },
        
        fix = true,
        
        po = new Align(node);
        
    console.log(po);
        
    function refresh(){
        po.align(t, [Align[np], Align[tp]], {
        	fix: fix
        }); 
    };  

    $('#toggle-relative').on('click', function(e){
        e && e.prevent();
        
        var status = parent.css('position') == 'relative' ? 'static' : 'relative';
        
        parent.css('position', status);
        position_status.html(status);
        
        refresh();
    });
    
    $('#target').on('change', function(){
        t = target_enum[ $(this).val().trim().toLowerCase() ];
        refresh();
    })
    
    $('#node-align').on('change', function(){
    	var v = $(this).val().trim();
    	v.indexOf('-') == -1 && (np = v);
        refresh();
    });
    
    $('#target-align').on('change', function(){
    	var v = $(this).val().trim();
    	v.indexOf('-') == -1 && (tp = v);
        refresh();
    });
    
    $('#fix').on('click', function(){
        fix = this.checked;
        refresh();
    });
    
    refresh();
    
    
    var mybox = K.Class({
    	Implements: Align.Ext,
    
    	initialize: function(){
    		this.element = $.create('div').css({width:100, height:100, background:'#000'}).inject(document.body);
    	}
    });
    
    new mybox().align('viewport', [Align.RC, Align.RC]);
});

});


</script>
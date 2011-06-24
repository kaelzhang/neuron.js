<div class="b"><div class="cont"><div class="extra"></div></div></div><?php


?><div class="footer"><div class="cont"><a href="http://wordpress.org" class="i-wp item" title="Powered by Wordpress">wordpress</a><a title="Mootools Framework" href="http://mootools.net" class="i-mt item">mootools</a><span class="copyright item">&copy;2010 <a href="http://kael.me">Kael.Me</a></span></div></div><?php


global $KM, $STATIC;

/*
$STATIC->inc('core/mt.js');
$STATIC->combo('core/mt.js');
$STATIC->combo('core/mt.png');
$STATIC->combo('reset.css, thumb.css');
*/

$STATIC->combo('core/mt.js, core/km.js, core/lang.js, core/web.js, core/loader.js, core/config.js');


// extra javascript, external javascript should use KM.init.add method
$KM->js();

?><script>
/*
KM.init('page.top','carousel','single',<?php if(is_archive() || is_page()) echo "'archive',"?>'more',function(){var k=KM,c;<?php
	?>k.page.init({<?php
	$obj = array("domain:'" . COOKIE_DOMAIN . "'", "path:'" . COOKIEPATH . "'", "hash:'" . COOKIEHASH . "'" ); 
	echo join(',', $obj); 
	
?>},{<?php 
	$obj = array('limit:12', 'thumb:true'); 
	if( isset($KM -> post_ID) ){ 
		array_push($obj, 'id:' . $KM -> post_ID );
	}
	
	if( isset($KM -> cat_ID[0]) ){ 
		array_push($obj, 'cat:' . $KM -> cat_ID[0] );
	}
	
	if( !is_single() ){		
		if($KM->retrieve('year')) array_push($obj, 'yr:' . $KM->retrieve('year') );
		if($KM->retrieve('month')) array_push($obj, 'mo:' . $KM->retrieve('month') );
		array_push($obj, 'page:' . $KM->retrieve('paged') );
		array_push($obj, 'max:' . $KM -> retrieve('max_page') );
	}
	
	echo join(',', $obj);


?>});c=k.topCtrl('top-toggle', 'top', 'top-more'<?php if(is_single()) echo ', true'; ?>);<?php
	
?>new k.TabSwitch('#top .tab','#top-toggle .m-wrap',{onSwitch:c.bind,onComplete:c.down});<?php
	
?>new k.TranCrsl({tk:'.featured',tn:'.f-wrap2',cr:'.f-wrap2 img',pv:'.featured .prev',nt:'.featured .next',cv:'.featured .cover',platforms:1});<?php

if($KM->retrieve('com_open')) echo 'k.smartCom.init();';

?>k.menu.init();<?php

if($KM->retrieve('prev')){
	?>new k.HoverSlide({oc:'#prev .btn',ds:'#prev',di:'left',io:-252});<?php
}

if($KM->retrieve('next')){
	?>new k.HoverSlide({oc:'#next .btn',ds:'#next',di:'right',io:-252});<?php
}


?>});

*/</script></body></html>
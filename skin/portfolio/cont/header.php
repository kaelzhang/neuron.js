<?php
$km_agent = $_SERVER['HTTP_USER_AGENT'];
$km_ie = strstr( $km_agent, 'MSIE' );
$km_ie6 = strstr( $km_agent, 'MSIE 6.0' );
if( $km_ie ){
	echo '<!DOCTYPE html><html><body><style>body{background:#f0f0f0;font:15px/20px Verdana, arial, sans-serif;} .c{margin:0 auto; padding-top:100px; width:900px; text-align:center;}</style><div class="c">Sorry! Life is busy. Kael<sup>.me</sup> currently do NOT support <strong>Microsoft Internet Explorers</strong>, and maybe never!</div></body></html>';
	exit;
}

$km_title = wp_title(' - ', false, 'right');

global $KM, $STATIC, $paged;

// Prevent post initialization on the page which doesn't contain a single article
if ( is_single() ){
	if ( have_posts() ){ 
		the_post();
		global $post;
		$KM->store('have_post', true);
		$KM->post_ID = $post->ID;
		
		$KM->cat_ID = km_get_cate_ids($post->ID);
		
		$KM->post_init();
	}
}else{	
	$t_cate_id = km_get_query_cat();
	
	if($t_cate_id) array_push($KM -> cat_ID, $t_cate_id);
	
	
	// $t_cate_id = km_get_query_tag();
	
	// if($t_cate_id) $KM -> tag_ID = $t_cate_id;
	
	
	unset($t_cate_id);
	
	$KM->store('max_page', km_get_max_page(), true);
	
	// store the date of current archive
	$KM->store('year', km_get_archive_year(), true);
	$KM->store('month', km_get_archive_month(), true);
	
	$KM->store('paged', $paged);
	
}

// deal with html class
?><!DOCTYPE html><html class="J_N"><head><meta charset="UTF-8" /><script>document.documentElement.className=location.hash?'J_H':'';</script><?php
?><meta name="description" content="kael's webfolio" /><?php
?><meta name="keywords" content="kael, designs, illustrations, doujin, tutorials, blog, themes, web design" /><?php
?><link rel="alternate" type="application/atom+xml" title="Atom 0.3" href="<?php bloginfo('atom_url'); ?>" /><?php
?><link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="<?php bloginfo('rss2_url'); ?>" /><?php
?><link rel="alternate" type="text/xml" title="RSS .92" href="<?php bloginfo('rss_url'); ?>" /><?php
?><link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" /><?php
?><link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" /><?php

$STATIC->inc('reset.css,' . KM_USING_STYLE);

if($km_ie){
	$STATIC->inc('ie.css,');
}

$KM->css(); 

?><title><?php echo $km_title; ?><?php bloginfo('name');?><?php if( is_home() ){ echo ' - '; bloginfo('description');} ?></title><?php 

wp_head(); 

?></head>
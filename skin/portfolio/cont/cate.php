<?php
$KM->inc_header();

?><body class="archive"><?php

$KM->inc('logo');

?><div class="c"><div class="title"><?php

$t_current_cate = get_category($KM -> cat_ID[0]);

if($t_current_cate -> parent != 0){
	$t_parent_cate = get_category($t_current_cate -> parent);
	
	?><a href="<?php echo get_category_link($t_current_cate -> parent); ?>"><?php echo $t_parent_cate -> cat_name; ?></a> &gt; <?php
}


?><h1><a href="<?php echo get_category_link($t_current_cate -> term_id); ?>"><?php echo $t_current_cate -> cat_name; ?></a></h1><?php

unset($t_current_cate);
unset($t_parent_cate);


?></div><div class="l-bg"></div><div class="cont"><div class="col-m"><div class="m-wrap"><div class="H_list-protect"></div><ul class="list-c" id="list-cont"><?php
	
if ( have_posts() ){
	while ( have_posts() ){
		the_post();
		
		if($KM->retrieve('list_style') == 'detail'){
		}else{
			
			$t_cate_id = km_get_cate_ids();
			$t_cate_id = $t_cate_id[0];
			$t_post_link = get_permalink();
			$t_post_title = get_the_title();
			
			
			?><li class="list-post"><h2 class="list-title"><a href="<?php echo $t_post_link; ?>" title=""><img alt="<?php 
			
				echo $t_post_title;
			
			?>" src="<?php echo km_get_thumbnail(); ?>" /></a></h2><div class="list-cont"><a class="pop-title" href="<?php echo $t_post_link; ?>"><?php
				
				echo $t_post_title;
				
			?></a><div class="pop-cont"><?php 
				km_home_post(array('limit' => 100));
			
			// .info-cont
			?></div><div class="pop-info F"><a class="cate" href="<?php 
				echo get_category_link($t_cate_id); 
			
			?>"><span class="i-folder"></span><span class="text"><?php
				echo get_cat_name($t_cate_id);
				
			?></span></a><a class="more" href="<?php the_permalink(); ?>">more...</a></div></div></li><?php
		}
		
	} // end while have_posts()
}
	
?></ul></div></div><div class="col-l"><?php 

if( is_archive() || is_page() ){
	
	// km_get_categories(array('depth' => 0));
	
	$t_cate_nav = km_pagenavi(array('echo' => false));
	
	if($t_cate_nav['pages'] > 1){
		$t_cate_nav = $t_cate_nav['html'];
	}else{
		$t_cate_nav = false;
	}
	
	km_list_categories(array(
		'title_li' => false,
		'current_category' => $KM -> cat_ID[0],
		'show_count' => 1,
		'depth' => 2,
		'page_nav' => $t_cate_nav
		
	));
	
	unset($t_cate_nav);
	
	// print_r( get_categories('title_li=&current_category=1&show_count=1&echo=0$depth=2') );
	
	/*
	km_get_archives(array(
		'current_month' => $KM->retrieve('current_archive_month'),
		'current_year' => $KM->retrieve('current_archive_year'),
		'first_open' => is_page()
	)); 
	*/

}

?></div></div></div><?php

$KM->inc('top');
$KM->inc_footer('single');

?>
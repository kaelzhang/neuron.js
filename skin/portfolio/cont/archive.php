<?php
$KM->inc_header();

?><body class="archive"><?php

$KM->inc('logo');

?><div class="c"><?php

if ( is_page() ){
	?><h1 class="title"><a href="<?php 
		the_permalink();
		
	?>" rel="bookmark"><?php the_title(); ?></a></h1><div class="l-bg"></div><div class="cont"><div class="col-m"><div class="m-wrap"><?php
	
}elseif ( is_archive() ){
	$t_archive_year = $KM->retrieve('year');
	$t_archive_month = $KM->retrieve('month');
	
	// archive year link
	$t_archive_link = '<a class="link" href="/' . $t_archive_year . '/" title="Posts during year ' . $t_archive_year . '">' . $t_archive_year . '</a>';
	
	if ( is_month() || is_day() ){
		$t_archive_link = '<a class="link" href="/' . $t_archive_year . '/' . $t_archive_month . '/" title="Posts during ' . get_the_time('F Y') . '">' . get_the_time('M') . '</a> ' . $t_archive_link;
		
	}
	
	?><h1 class="title"><a href="/archive/" >Archive</a> &gt; <?php
	
	echo $t_archive_link;
	
	unset($t_archive_year);
	unset($t_archive_month);
	unset($t_archive_link);
	
	?></h1><div class="l-bg"></div><div class="cont"><div class="col-m"><div class="m-wrap"><div class="H_list-protect"></div><ul class="list-c" id="list-cont"><?php
	
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
		
		?></ul><?php
		
		unset($t_cate_id);
		unset($t_post_link);
		unset($t_post_title);
		
	}else{
		echo 'no match';
	}
	
}


?></div></div><div class="col-l"><?php 

if( is_archive() || is_page() ){
	km_get_archives(array(
		'current_month' => $KM->retrieve('month'),
		'current_year' => $KM->retrieve('year'),
		'first_open' => is_page()
	)); 

}

?></div></div></div><?php

$KM->inc('top');
$KM->inc_footer('single'); 
?>
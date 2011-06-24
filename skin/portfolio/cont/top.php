<?php defined('KM_CONT_PATH') or die ('Access prohibited'); 

global $KM;
$type = $KM->get('tab');

if(!$type){
	$type = 'cate';
}

if(!is_single() && ( $type == 'cate' || $type == 'related' )){
	$type = 'popular';
}

$limit = 12;

$t_is_single = is_single();

# start top
?><div id="top" class="top"><div class="t-wrap"><div class="cont"><div class="col-m"><div class="m-wrap switch"><ul class="menu"><?php

if($t_is_single){

	?><li class="tab<?php if($type == 'cate') echo ' this'; ?>"><a href="?tab=cate"><?php
	
		echo get_cat_name($KM->cat_ID[0]);
		
	?></a></li><li class="tab<?php if($type == 'related') echo ' this'; ?>"><a href="?tab=related">Related</a></li><?php

}
?><li class="tab<?php if($t_is_single && $type == 'random') echo ' this'; ?>"><a href="?tab=random">Random</a></li><?php
?><li class="tab<?php if($t_is_single && $type == 'popular') echo ' this'; ?>"><a href="?tab=popular">Popular</a></li><?php

unset($t_is_single);

?><li class="page_item login"><a href="/wp-admin/" id="login">Login</a></li><?php

?><li class="page_item page-item-779"><a title="About" href="http://localhost:8080/about-2/">About</a></li><?php
?><li class="page_item<?php if(is_archive()) echo ' current_page_item'?>"><a title="Archive" href="http://localhost:8080/archive/">Archive</a></li><?php

/*
$t_pages = trim(km_list_pages('sort_column=menu_order&title_li=0&echo=0'));

echo preg_replace('/>\s+</', '><', $t_pages);
unset($t_pages);
*/

// ul | .m-wrap | .col-m |
?></ul></div></div><div class="col-l"><form class="s" action="<?php 

bloginfo('home'); 

// .col-l || .more || .cont | .t-wrap | .top
?>/" method="get"><input class="s-box" name="s" /><input class="s-btn disable" type="submit" value="" /></form></div><div class="more<?php if(is_single()) echo ' J_panel-open'; ?>" id="top-more">more...</div></div></div></div><?php


# start top-toggle
?><div class="top-toggle" id="top-toggle"><div class="cont"><div class="col-m"><div class="m-wrap"><div class="track"><?php

switch($type){
	case 'cate':
		km_category_posts($KM -> cat_ID[0], $KM -> post_ID, array('limit' => $limit));
		break;
		
	case 'related':
		km_echo_selected_posts( km_get_related_posts($limit, $KM -> post_ID));
		break;
		
	case 'random':
		km_echo_selected_posts( km_get_random_posts($limit));
		break;

	case 'popular':
		km_echo_selected_posts( km_get_most_commented_posts($limit));
		break;
}

// .track || .loading || .m-wrap | .col-m | .cont | .top-toggle
?></div><div class="loading"></div><a class="prev">previous</a><a class="next">next</a></div></div></div></div>
<?php
if(file_exists('../ajax-init.php')){
	require_once('../ajax-init.php');
}else{
	die('Access Prohibited');
}

require_once(KM_INCLUDE_PATH . '_.php');

// ajax method to get posts
$type = $KM->post('type');
$post_ID = $KM->post('id');
$limit = $KM->post('limit');
$thumb = $KM->post('thumb');
$cat_ID = $KM->post('cat');


switch($type){
	case 'random':
		$ret = km_echo_selected_posts( km_get_random_posts($limit), array('with_thumb' => $thumb, 'echo' => false));
		break;
		
	case 'related':
		$ret = km_echo_selected_posts( km_get_related_posts($limit, $post_ID), array('with_thumb' => $thumb, 'echo' => false));
		break;
		
	case 'popular':
		$ret = km_echo_selected_posts( km_get_most_commented_posts($limit, $post_ID), array('with_thumb' => $thumb, 'echo' => false));
		break;
	
	case 'cate':
		$ret = km_category_posts($cat_ID, $post_ID, array('with_thumb' => $thumb, 'echo' => false, 'limit' => $limit));
		break;
}

echo json_encode( array( 'html' => $ret ) );

?>
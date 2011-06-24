<?php
if(file_exists('../ajax-init.php')){
	require_once('../ajax-init.php');
}else{
	die('Access Prohibited');
}

require_once(KM_INCLUDE_PATH . '_.php');

if(file_exists(KM_INCLUDE_PATH . '_.php')){

$action = $KM->post('a');

// ajax method to get archive posts
if($action == 'archive' || $action == 'category'){
	$page = $KM->post('page');
	$uri = $KM->post('uri');
	
	if(!$page) $page = 1;
	
	if($action == 'archive'){
		$query = array( 
			'year' => $KM->post('y'),
			'monthnum' => $KM->post('m'),
			'paged' => $page 
		);
	}else if($action == 'category'){
		$query = array( 
			'category' => $KM->post('cat'),
			'paged' => $page 
		);	
	}
	
	$list = km_list_posts( $query );
	
	unset($query);
	
	$page_nav = km_pagenavi(array('uri' => $uri, 'ajax' => true, 'echo' => false, 'page' => $page, 'max_page' => $KM->post('max'))); //$query);
	
	if($page_nav == false) fail('fetch posts failed');

	echo json_encode( array(
		'list' => $list,
		'pagenavi' => $page_nav['html'],
		'max' => $page_nav['pages']
	));

}else{
	fail();
}


?>
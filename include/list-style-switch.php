<?php
// Prevent users from directly loading this class file
defined('KM_PORT') or die ('Access prohibited, kael.me portfolio');

/* list style switcher
----------------------------------------------*/

// @param {string} 'l': list-style
// @param {string} 'tab': tab name 
$sig = array(
	'l' => array('required'=> false, 'type' => 'string', 'filter' => strip_tags),
	'tab' => array('required'=> false, 'type' => 'string', 'filter' => strip_tags),
);
$KM -> sanitize( $sig );

$km_cur_style = $KM->get('l');

if ( $km_cur_style ) {
	if ( $km_cur_style == 'detail' || $km_cur_style == 'thumb' ) {
		
		$expire = time() + 30000000;
		setcookie(	
			'km_list_style' . COOKIEHASH,
			stripslashes($km_cur_style),
			$expire,
			COOKIEPATH
		);
	}

	$redirect = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
	header( 'location: '. preg_replace('/\?.*/', '', $redirect) );
	exit;	

}elseif( !empty($_COOKIE['km_list_style' . COOKIEHASH]) ){

	$km_cur_style = $_COOKIE['km_list_style' . COOKIEHASH];
}

if( !$km_cur_style ) $km_cur_style = 'thumb';

$KM->store('list_style', $km_cur_style);

?>

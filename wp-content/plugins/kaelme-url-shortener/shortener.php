<?php
/*
Plugin Name: Kael<sup>.me</sup> Url Shortener
Plugin URI: http://kael.me/-su
Description: Url shortener plugin for Wordpress. Let you create your own tiny urls like <code>http://yoursite/-abc</code>, and easily manage them.
Version: 1.0.1
Author: Kael Zhang
Author URI: http://kael.me
*/

/* ----------------------------------------------
 *	Date: Oct. 21st, 2009
 *	Copyright 2009 Kael Zhang, Yottaworks Studio(http://yottaworks.net) 
 *	Email: i@kael.me
 * ----------------------------------------------
 *	Released under the GPL license
 *	http://www.opensource.org/licenses/gpl-license.php
 * ---------------------------------------------- */

define ('KM_S_PATH', dirname(__FILE__) . '/');

$km_host = 'http://' . $_SERVER['HTTP_HOST'];
$km_home = get_option('home');
$km_uri = str_replace( $km_home, '', $km_host . $_SERVER['REQUEST_URI'] );

$settings = get_option('km_shorturl_set');

//rewrite_module disabled
if( $settings[0] ){
	$km_uri = $_GET[ $settings[1] ];
	if( !empty( $km_uri ) && file_exists( KM_S_PATH . 'redirect.php' ) ){
		require_once( KM_S_PATH . 'redirect.php' );
		km_shorturl_redirect( $km_uri );
	}

//rewrite_module activated
}elseif( $km_uri !== '/' ){

	$km_uri_head = substr($km_uri, 1, 1);
	$km_uri = substr($km_uri, 2);

	switch( $km_uri_head ){
		case $settings[1] :
			if( file_exists( KM_S_PATH . 'redirect.php' ) ){
				require_once( KM_S_PATH . 'redirect.php' );
				km_shorturl_redirect( $km_uri );
			}
			break;
	
		case $settings[2] :
			header('location: ' . $km_home . '/?p=' . $km_uri );
			exit;
			break;
	}
}

//url shortener plugin admin start
if( file_exists( KM_S_PATH . 'settings.php' ) ){
	require_once( KM_S_PATH . 'settings.php' );
}

add_action('admin_menu', 'km_shorturl_admin');
?>
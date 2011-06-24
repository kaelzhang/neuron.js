<?php
# Prevent users from directly loading this class file
defined('ABSPATH') or die ('Access prohibited, kael.me portfolio');


# Protect against register_globals
# This must be done before any globals are set by the code
if ( ini_get( 'register_globals' ) ) {
	if ( isset( $_REQUEST['GLOBALS'] ) ) {
		die( '$GLOBALS overwrite vulnerability');
	}
	$verboten = array(
		'GLOBALS',
		'_SERVER',
		'HTTP_SERVER_VARS',
		'_GET',
		'HTTP_GET_VARS',
		'_POST',
		'HTTP_POST_VARS',
		'_COOKIE',
		'HTTP_COOKIE_VARS',
		'_FILES',
		'HTTP_POST_FILES',
		'_ENV',
		'HTTP_ENV_VARS',
		'_REQUEST',
		'_SESSION',
		'HTTP_SESSION_VARS'
	);
	foreach ( $_REQUEST as $name => $value ) {
		if( in_array( $name, $verboten ) ) {
			header( "HTTP/1.x 500 Internal Server Error" );
			echo "register_globals security paranoia: trying to overwrite superglobals, aborting.";
			die( -1 );
		}
		unset( $GLOBALS[$name] );
	}
}

require_once( ABSPATH . 'include/config.php' );
require_once( KM_INCLUDE_PATH . '_.php' );

define('KM_USING_STYLE', $km_cur_style . '.css');

unset($km_cur_style);

# disable wordpress admin bar
add_action( 'show_admin_bar', '__return_false' );

?>
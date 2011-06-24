<?php
require_once( '../wp-config.php' );

function fail($s = '') {
	header('HTTP/1.0 500 Internal Server Error');
	echo $s;
	exit;
}

if (!strstr( $_SERVER['HTTP_REFERER'], get_option('home') ) || $_SERVER["REQUEST_METHOD"] != "POST") {
    fail();
}

// only allow post ajax request
define('KM_POST', true);

require_once( 'config.php' );

?>
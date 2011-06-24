<?php

# FOR INVOCATION BY WP-CONTENT/THEMES/<CURRENT-THEME>/FUNCTIONS.PHP 

// Prevent users from directly loading this class file
defined('KM_PORT') or die ('Access prohibited, kael.me portfolio');

require_once( KM_INCLUDE_PATH . 'classes.php');
require_once( KM_INCLUDE_PATH . 'static.php');
require_once( KM_INCLUDE_PATH . 'functions.php');
require_once( KM_INCLUDE_PATH . 'km.php' );
require_once( KM_INCLUDE_PATH . 'list-style-switch.php' );

$STATIC = new StaticFiles(array(
	'jsPath' 		=> KM_JS_PATH,
	'cssPath'		=> KM_CSS_PATH,
	'cdnPattern'	=> KM_FILE_SERVER_PATTERN,
	'dir'			=> KM_FILE_SERVER_DIR
));

?>
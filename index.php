<?php
/*

if( '/' == $_SERVER['REQUEST_URI']){

?><!DOCTYPE html><style>body{background:#f0f0f0;}div{margin:100px auto 0;width:900px;text-align:center;text-shadow:0 1px 0 #fff;font:bold 15px Verdana}</style><div>Kael.Me is still under alpha testing...</div><?php

	exit;
}
*/


/**
 * Front to the WordPress application. This file doesn't do anything, but loads
 * wp-blog-header.php which does and tells WordPress to load the theme.
 *
 * @package WordPress
 */

/**
 * Tells WordPress to load the WordPress theme and output it.
 *
 * @var bool
 */
define('WP_USE_THEMES', true);

/** Loads the WordPress Environment and Template */
require('./wp-blog-header.php');
?>
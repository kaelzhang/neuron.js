<?php
/*
Template Name: Archives
*/

defined('KM_CONT_PATH') or die ('Access prohibited');

$t_latest_post = km_get_latest_post();
$t_latest_post = '/' . get_the_time('Y', $t_latest_post ) . '/';

// redirect to the latest year archive
header("location:$t_latest_post");

// include( KM_CONT_PATH . 'archive.php'); 

?>
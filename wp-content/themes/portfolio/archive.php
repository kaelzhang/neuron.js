<?php

defined('KM_CONT_PATH') or die ('Access prohibited');

if ( is_category() ){
	include( KM_CONT_PATH . 'cate.php');
	
}elseif ( is_tag() ){
	include( KM_CONT_PATH . 'tag.php'); 	
	
}elseif ( is_archive() ){
	include( KM_CONT_PATH . 'archive.php'); 

}

?>
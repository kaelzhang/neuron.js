<?php
defined('KM_PORT') or die ('Access prohibited, kael.me portfolio');

global $KM;

if( $KM->post('h') ){
	$reg = '/(?<=>)\s+(?=<)/';
	$str_old = stripslashes( $KM->post('h') );
	$str = preg_replace( $reg, '', $str_old );

	$str_old = htmlentities($str_old, ENT_NOQUOTES, 'UTF-8');
	$str = htmlentities($str, ENT_NOQUOTES, 'UTF-8');
}
?>

<style>
textarea{display:block;width:700px; height:200px;overflow:auto;margin-bottom:10px;}
input{margin-bottom:10px;}


</style>


<h1>HTML compressor</h1>

<form method="post">
<textarea id="tobe" name="h"><?php if( isset( $str_old ) ){ echo $str_old; } ?></textarea>

<input type="submit" id="go" value="compress it" />

<textarea id="done"><?php if( isset( $str_old ) ){ echo $str; } ?></textarea>
</form>

<br/>HTML compressor &copy;2009 <a href="http://kael.me">kael.me</a>

<?php
if(file_exists('../ajax-init.php')){
	require_once('../ajax-init.php');
}else{
	die('Access Prohibited');
}

require_once(KM_INCLUDE_PATH . 'km.php');


// ajax method to get avatar
$email = $KM->post('email');
$default = $KM->post('default');
$size = $KM->post('size');

if( !$email ) exit;
if( !$default ) $default = get_option('home') . '/i/trans.png';

if( !$size ) $size = '50';

function km_avatar( $email, $size, $default ){
	return 'http://www.gravatar.com/avatar.php?gravatar_id=' . md5($email) . '&default=' . urlencode($default) . '&size=' . $size ;
}

echo json_encode( array( 'uri' => km_avatar( trim( $email ), trim( $size ), trim( $default ) ) ) );

?>
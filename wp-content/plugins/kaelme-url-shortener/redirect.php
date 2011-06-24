<?php
function km_shorturl_redirect( $uri ){
	global $table_prefix, $wpdb;
	
	$table_name = $table_prefix . 'shortenurl';
	
	$protocol = $_SERVER["SERVER_PROTOCOL"];
		if ( 'HTTP/1.1' != $protocol && 'HTTP/1.0' != $protocol ){
			$protocol = 'HTTP/1.0';
		}
	
	$redirect = $wpdb -> get_row( "SELECT * FROM $table_name WHERE request_url = '$uri'" );
	
	if( $redirect ){
	
		$wpdb -> query( "UPDATE $table_name SET visit_count = visit_count + 1 WHERE request_url = '$uri'" );
		
		$type = $redirect -> redirect_type;
		
		//print_r( $type );
		//print_r( $redirect );
		//exit;
		if( $type == 301 ){
			header ($protocol.' 301 Moved Permanently');
		}elseif( $type == 307 ){
			header ($protocol.' 307 Temporary Redirect');
		}
		
		
		header ('Location: '. $redirect -> origin_url );
		exit;
	}
}
?>
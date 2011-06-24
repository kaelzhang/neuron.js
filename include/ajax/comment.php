<?php
if(file_exists('../ajax-init.php')){
	require_once('../ajax-init.php');
}else{
	die('Access Prohibited');
}

require_once(KM_INCLUDE_PATH . '_.php');

$km_db_check = true;

function kill_data() {
	return '';
}

function check_db() {
	global $wpdb, $km_db_check;

	if($km_db_check) { //if $km_db_check is true indicate that we fail to open database
		// Check DB
		if(!$wpdb->dbh) {
			echo('Our database has issues. Try again later.');
		} else {
			echo('We\'re currently having site problems. Try again later.');
		}

		die();
	}
}

ob_start('kill_data');

register_shutdown_function('check_db');

$km_db_check = false;
ob_end_clean();

nocache_headers();

$comment_post_ID = (int) $KM->post('comment_post_ID');

$status = $wpdb->get_row("SELECT post_status, comment_status FROM $wpdb->posts WHERE ID = '$comment_post_ID'");

if ( empty($status->comment_status) ) {
	do_action('comment_id_not_found', $comment_post_ID);
	fail( 'The post you are trying to comment on does not currently exist in the database.' );
} elseif ( 'closed' ==  $status->comment_status ) {
	do_action('comment_closed', $comment_post_ID);
	fail( 'Sorry, comments are closed for this item.' );
} elseif ( in_array($status->post_status, array('draft', 'pending') ) ) {
	do_action('comment_on_draft', $comment_post_ID);
	fail( 'The post you are trying to comment on has not been published.' );
}

$comment_author			= trim(strip_tags($KM->post('author')));
$comment_author_email	= trim($KM->post('email'));
$comment_author_url		= trim($KM->post('url'));
$comment_content		= trim($KM->post('comment'));
$comment_parent			= trim($KM->post('comment_parent'));

if(strlen($comment_content) < 5) fail('you should say more');

// If the user is logged in
$user = wp_get_current_user();
if ( $user->ID ) {
	$comment_author       = $wpdb->escape($user->display_name);
	$comment_author_email = $wpdb->escape($user->user_email);
	$comment_author_url   = $wpdb->escape($user->user_url);
	if ( current_user_can('unfiltered_html') ) {
		if ( wp_create_nonce('unfiltered-html-comment_' . $comment_post_ID) != $_POST['_wp_unfiltered_html_comment'] ) {
			kses_remove_filters(); // start with a clean slate
			kses_init_filters(); // set up the filters
		}
	}
} else {
	if ( get_option('comment_registration') )
		fail( 'Sorry, you must be logged in to post a comment.' );
}

$comment_type = '';

if ( get_option('require_name_email') && !$user->ID ) {
	if ( 6 > strlen($comment_author_email) || '' == $comment_author )
		fail( 'Error: please fill the required fields (name, email).' );
	elseif ( !is_email($comment_author_email))
		fail( 'Error: please enter a valid email address.' );
}

if ( '' == $comment_content )
	fail( 'Error: please type a comment.' );


// Simple duplicate check
$dupe = "SELECT comment_ID FROM $wpdb->comments WHERE comment_post_ID = '$comment_post_ID' AND ( comment_author = '$comment_author' ";
if ( $comment_author_email ) $dupe .= "OR comment_author_email = '$comment_author_email' ";
$dupe .= ") AND comment_content = '$comment_content' LIMIT 1";
if ( $wpdb->get_var($dupe) ) {
	fail( 'Duplicate comment detected; it looks as though you\'ve already said that!' );
}


$commentdata = compact('comment_post_ID', 'comment_parent', 'comment_author', 'comment_author_email', 'comment_author_url', 'comment_content', 'comment_type', 'user_ID');

$comment_id = wp_new_comment( $commentdata );

$comment = get_comment($comment_id);
if ( !$user->ID ) {
	setcookie('comment_author_' . COOKIEHASH, $comment->comment_author, time() + 30000000, COOKIEPATH, COOKIE_DOMAIN);
	setcookie('comment_author_email_' . COOKIEHASH, $comment->comment_author_email, time() + 30000000, COOKIEPATH, COOKIE_DOMAIN);
	setcookie('comment_author_url_' . COOKIEHASH, clean_url($comment->comment_author_url), time() + 30000000, COOKIEPATH, COOKIE_DOMAIN);
}

@header('Content-type: ' . get_option('html_type') . '; charset=' . get_option('blog_charset'));

$comment->comment_type = 'comment';

$admin = $comment->comment_author_email == get_the_author_email();

?><li id="comment-<?php 
	comment_ID();
	
?>"><div class="com<?php 

if($admin){
	echo ' adminComment'; 
}else{
	echo ' singleComment';

} 

?>"><div class="<?php 

if($depth == 1) echo 'top-info'; else echo 'info'; 

?>"><?php

echo get_avatar( $comment->comment_author_email, '50', $STATIC->get('i/trans.png') );

if($admin) echo '<div class="admin-decoration"></div>';

?><span class="author"><?php 

	comment_author_link();
	
?></span><span class="time"><?php 

	comment_date('M j, Y') ?>  <?php comment_time('H:i') 
	
?></span></div><div class="content"><?php 
	comment_text();
	
?></div><div class="arrow"></div><?php

if($admin || $depth < 4){ 
	?><a href="#" class="t-re" title="click to reply"><span class="t-arrow"></span></a><?php
}

if ($comment->comment_approved == '0'){
	?><div class="small">Your comment is awaiting moderation.</div><?php
}

echo '</div></li>'; ?>
<?php
defined('KM_CONT_PATH') or die ('Access prohibited');

?><div class="cont comments" id="comments"><?php

if (!empty($post->post_password)) { // if there's a password
	if ($_COOKIE['wp-postpass_' . COOKIEHASH] != $post->post_password) {  // and it doesn't match the cookie
	
	
	?><p class="nocomments">This post is password protected. Enter the password to view comments.</p><?php
		
		return;
	}
}


?><ul id="comList" class="comList"><?php 

if ($comments){	
	wp_list_comments('callback=km_list_comments');
}
	
?></ul><?php


if ( !comments_open() ) {

?><div class="messagebox">Comments are closed.</div><?php

}else{

	global $STATIC, $user_ID, $user_email;
	
    ?><div class="hr-w"></div><div id="newComment" class="newComment"><form action="<?php echo get_option('siteurl'); ?>/wp-comments-post.php" method="post" id="comForm" class="comForm"><div class="comWelcome"><?php 
	
	if ( $user_ID ){
		$logout_link = wp_logout_url(); 
		$km_comment_author_link = 'admin'; 
		
			?>Welcome back, Master! <a href="<?php echo $logout_link; ?>" title="Log out of this account">Logout &raquo;</a></div><div class="com"><?php 
		
	}else{
		
		if ( $comment_author != "" ){
			$km_comment_author_link = '<a class="url" href="'. $comment_author_url .'">' . $comment_author . '</a>';
			
			?>Welcome back, <span><?php echo $comment_author; ?></span>! Say something?</div><div class="com hasInfo"><div class="comSetting"><?php
			
		}else{
			
			?>Welcome! Say something?</div><div class="com noInfo"><div class="comSetting"><?php
		}
		
		?><div class="row"><label for="author">Name</label><input type="text" name="author" id="author" value="<?php 
			echo $comment_author; 
		
		?>" tabindex="1" class="textField" /><span class="note">(required)</span></div><?php
		
		
        ?><div class="row"><label for="email">E-mail</label><input type="text" name="email" id="email" value="<?php 
			echo $comment_author_email; 
			
		?>" tabindex="2" class="textField" /><span class="note">(required, never published)</span></div><?php
		
		
        ?><div class="row"><label for="url">Website</label><input type="text" name="url" id="url" value="<?php 
			echo $comment_author_url; 
		
		?>" tabindex="3" class="textField" /></div></div><?php 
	
	}
	
	?><div class="info"><?php
		
		if($user_ID){
			$comment_author_email = $user_email;
		}
		
		if($comment_author_email){
			echo get_avatar( $comment_author_email, '50', $STATIC->get('i/trans.png') );
		}else{
			?><img alt="" src="<?php echo $STATIC->get('i/trans.png'); ?>" class="avatar avatar-50 photo avatar-default" height="50" width="50"><?php
		}
		
	?><span class="author"><?php echo $km_comment_author_link; ?></span><?php 
		
		if( !$user_ID ) echo '<a class="comChange" href="#">Change</a>'; 
		
	?></div><div class="arrow"></div><a class="t-cancel" title="cancel reply" href="#">cancel reply</a><?php
	
    ?><textarea name="comment" id="comment" rows="6" tabindex="4" class="textArea" cols="7"></textarea><input name="SubmitComment" type="submit" class="submitBtn" alt="" tabindex="99" /><div class="loading"></div><div class="comResize"></div><span class="c-area"></span><span class="c-rest"></span></div><?php 
		comment_id_fields();
		do_action('comment_form', $post->ID); 
		
	?></form></div><?php
	
}

?></div>
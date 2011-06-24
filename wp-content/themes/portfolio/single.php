<?php
defined('KM_CONT_PATH') or die ('Access prohibited');

function echo_once(){
	static $side_first;
	
	if($side_first != true){
		$side_first = true;
		echo ' side-d_f';
	}
}

$KM->inc_header('single');

?><body class="single"><?php
	$KM->inc('logo');
	
	?><div class="c"><?php 

if ( $KM->retrieve('have_post') ){
		# title
		?><h1 class="title"><a title="<?php 
			the_title(); 
			?>" href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a></h1><div class="l-bg"></div><?php 
		
		# cont
		?><div class="cont"><?php
			# cont -> main
			?><div class="col-m"><div class="m-wrap"><?php 
	
				$KM->feature_img(); 
	
				?><div class="post-c"><?php the_content(); ?></div></div></div><?php 
			
			# cont -> left
			?><div class="col-l"><div class="side-box side-this"><h3 class="side-t">involve</h3><?php 
	
	// $KM->side_des(true); 
	
	# post catetories 
	if($KM->cat_ID){
				?><div class="side-d<?php echo_once(); ?>"><div class="side-i i-folder" title="Categories">Category</div><ul class="side-c"><?php
		foreach($KM->cat_ID as $cat_id){
			$cat_name = get_cat_name($cat_id);
					?><li><a title="View all posts filed under <?php echo $cat_name; ?>" href="<?php echo get_category_link($cat_id); ?>"><?php echo $cat_name; ?></a></li><?php
		}
		
				?></ul></div><?php // end .post-d		
	}
	
	# post tags
	$t_tags = get_the_tags();
	if($t_tags){
				?><div class="side-d<?php echo_once(); ?>"><div class="side-i i-tag" title="Tags">Tags</div><ul class="side-c"><?php
		foreach($t_tags as $tag){
					?><li><a title="View all posts tagged with <?php echo $tag->name; ?>" href="<?php echo get_tag_link($tag->term_id); ?>"><?php echo $tag->name; ?></a></li><?php
		}
		
				?></ul></div><?php // end .post-d
	}
			
	# ivolved tools
	$t_tools = $KM->get_custom('tools');
	if($t_tools){
				?><div class="side-d<?php echo_once(); ?>"><div class="side-i i-tool" title="tags">Tags</div><ul class="side-c"><?php
		foreach($t_tools as $tool){
			list($link, $text) = $tool;
					?><li><?php
				if($link == '#'){
						?><p><?php echo $text; ?></p><?php
				}else{			
						?><a href="<?php echo $link; ?>"><?php echo $text; ?></a><?php
				}
					?></li><?php
		}
		
				?></ul></div><?php // end .post-d
	}
	
			// end .side-box | .col-l | .cont
			?></div></div></div><div class="hr-w"></div><?php
			
	
	if ( comments_open() ){
		$KM->store('com_open', true);
		comments_template('', true); 
	}
	
	// end .c
	?></div><?php
	
	$t_pre_post = get_previous_post('no', '');
	$t_nxt_post = get_next_post('no', '');

	if( $t_pre_post -> ID ){
		$t_pre_post = $t_pre_post -> ID;
		$KM->store('prev', true);
	
		?><div id="prev" class="prev-post"><a href="<?php 
			echo get_permalink( $t_pre_post ); 
			
		?>" title="<?php 
			echo get_the_title( $t_pre_post ); 
			
		?>"><img alt="" src="<?php echo km_get_thumbnail('thumbnail', $t_pre_post ); ?>" /></a><div class="btn"></div></div><?php
		
	}

	if( $t_nxt_post -> ID ){
		$t_nxt_post = $t_nxt_post -> ID;
		$KM->store('next', true);
	
		?><div id="next" class="next-post"><a href="<?php 
			echo get_permalink( $t_nxt_post ); 
			
		?>" title="<?php 
			echo get_the_title( $t_nxt_post ); 
			
		?>"><img alt="" src="<?php echo km_get_thumbnail('thumbnail', $t_nxt_post ); ?>" /></a><div class="btn"></div></div><?php
		
	}
	
	unset($t_pre_post);
	unset($t_nxt_post);
	
}else{

	include( KM_CONT_PATH . '404.php');
	
	// .c
	echo '</div>';

}//end if have_post 

$KM->inc('top');
$KM->inc_footer('single'); 
?>
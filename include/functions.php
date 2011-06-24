<?php

// Prevent users from directly loading this class file
defined('KM_PORT') or die ('Access prohibited, kael.me portfolio');

/*
if ( function_exists('register_sidebar') ){
    register_sidebars(1, array(
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h2 class="widgettitle">',
        'after_title' => '</h2>',
    ));}
*/

function km_recent_comments($no_comments = 10, $comment_len = 150) { 
    global $wpdb; 
	
	$request = "SELECT * FROM $wpdb->comments";
	$request .= " JOIN $wpdb->posts ON ID = comment_post_ID";
	$request .= " WHERE comment_approved = '1' AND post_status = 'publish' AND post_password =''"; 
	$request .= " ORDER BY comment_date DESC LIMIT $no_comments"; 
		
	$comments = $wpdb->get_results($request);
		
	if ($comments) { 
		foreach ($comments as $comment) { 
			ob_start();
?><li><a href="<?php echo get_permalink( $comment->comment_post_ID ) . '#comment-' . $comment->comment_ID; ?>"><strong><?php echo $comment->comment_author ?></strong>: </a>&quot; <?php echo strip_tags(km_substr(apply_filters('get_comment_text', $comment->comment_content), $comment_len)); ?> &quot;</li><?php
			ob_end_flush();
		} 
	} else { 
		echo "<li>No comments</li>";
	}
}

//substr without breaking Chinese and English Words +++++++++++++++++++++++++++++++++++

function km_substr($str, $length, $htmlcheck = false){
	if($length < strlen($str)){
		$cur_length = $length;
		for ($i= 0; $i < $length; $i ++){
			$cur_odd = ord(substr($str, $i, 1));
			if ($cur_odd > 0xa0){        // start of a Chinese word
				$cur_length = $i + 3;
				$i += 2;
			} 
			else if($cur_odd == 0x20)	$cur_length = $i; // avoid breaking english words
		}
	}
	else $cur_length = strlen($str);
	
	if($htmlcheck){
		return htmlspecialchars(substr($str, 0, $cur_length));
	}else{
		return substr($str, 0, $cur_length);
	}
}


function km_get_author($comment) {
	$author = "";

	if ( empty($comment->comment_author) )
		$author = __('Anonymous');
	else
		$author = $comment->comment_author;
		
	return $author;
}


/**
 * km_pagenum_link
 
 * Retrieve get links for page numbers.
 *
 * @since 1.5.0
 *
 * @param int $pagenum Optional. Page ID.
 * @return string
 
 * @param {mixed} $uri if $uri == false, use request_uri
 */
function km_pagenum_link($pagenum = 1, $uri = false) {
	global $wp_rewrite;

	$pagenum = (int) $pagenum;

	if($uri){
		
		// add_query_arg located in wp-includes\functions.php
		$request = add_query_arg( 'paged', false, $uri );
	}else{
		$request = remove_query_arg( 'paged' );
	}

	$home_root = parse_url(get_option('home'));
	$home_root = ( isset($home_root['path']) ) ? $home_root['path'] : '';
	$home_root = preg_quote( trailingslashit( $home_root ), '|' );

	$request = preg_replace('|^'. $home_root . '|', '', $request);
	$request = preg_replace('|^/+|', '', $request);

	if ( !$wp_rewrite->using_permalinks() || is_admin() ) {
		$base = trailingslashit( get_bloginfo( 'home' ) );

		if ( $pagenum > 1 ) {
			$result = add_query_arg( 'paged', $pagenum, $base . $request );
		} else {
			$result = $base . $request;
		}
	} else {
		$qs_regex = '|\?.*?$|';
		preg_match( $qs_regex, $request, $qs_match );

		if ( !empty( $qs_match[0] ) ) {
			$query_string = $qs_match[0];
			$request = preg_replace( $qs_regex, '', $request );
		} else {
			$query_string = '';
		}

		$request = preg_replace( '|page/\d+/?$|', '', $request);
		$request = preg_replace( '|^index\.php|', '', $request);
		$request = ltrim($request, '/');

		$base = trailingslashit( get_bloginfo( 'url' ) );

		if ( $wp_rewrite->using_index_permalinks() && ( $pagenum > 1 || '' != $request ) )
			$base .= 'index.php/';

		if ( $pagenum > 1 ) {
			$request = ( ( !empty( $request ) ) ? trailingslashit( $request ) : $request ) . user_trailingslashit( 'page/' . $pagenum, 'paged' );
		}

		$result = $base . $request . $query_string;
	}

	$result = apply_filters('get_pagenum_link', $result);

	return $result;
}



/* Page Navigation
 * @return {array}: if 'echo' == false, will return an associative ARRAY, which contains html and the number of pages
 *
 * @feature:
 * 	ajax enabled
 * 	return or post
 * 	limited stable elements
 * 	optimized ellipsis position
-----------------------------------------------------*/
function km_pagenavi( $options = '' ){
	global $wp_query, $paged;
	
	$defaults = array(
		'before' => '',
		'after' => '', 
		
		// if true, use page number instead of prelabel or nxtlabel
		'nolabel' => true,
		
		'prelabel' => '|<strong>&laquo;</strong>',
		'nxtlabel' => '<strong>&raquo;</strong>|', 
		
		'max_buttons' => 7,
		'always_show' => false,
		'echo' => true,
		'page' => 0,
		
		'max_page' => false,
		
		'echo' => true,
		'ajax' => false,
		'uri' => false
	);

	$r = wp_parse_args( $options, $defaults );
	extract( $r, EXTR_SKIP );
	
	// if there's ellipsis by left-hand side
	$left_elps = false;
	$right_elps = false;
	

	if (!is_single()) {
		
		// km_pagenavi called outside the loop, thus, $query should not be empty
		if($ajax){
			if(!max_page) return false;
			
		// normal calling, get max_page from $wp_query
		}else if(!$max_page){
			$max_page = $wp_query -> max_num_pages;
		}
		
		if( !$page ){
			if( empty( $paged ) ){
				$page = 1;
			}else{
				$page = $paged;
			}
		}

		$buttons_left = floor( $max_buttons / 2 );
		$start_page = 1;
		
		if( $max_buttons < $max_page ){
			$continuous_pages = $max_buttons;
			
			if( $page > $buttons_left ){
				$left_elps = true;
				$continuous_pages -= 2;
				$start_page = $page + 1 - ceil( ( $max_buttons - 4 ) / 2 );
				$buttons_left = 3 + $page - $start_page;
			}else{
				$buttons_left = $page;
			}
                         
			if( $max_page - $page > $max_buttons - $buttons_left ){
				$right_elps = true;
				$continuous_pages -= 2;
			}

			if( $start_page + $continuous_pages > $max_page ){
				$start_page = $max_page - $continuous_pages + 1;
			}
		}else{
			$continuous_pages = $max_page;
		}
		
		
		// ---------------------------echo start
		$output = $before;
		
		if( $left_elps ){
			$output .= '<li class="page-link first-page"><a href="' . km_pagenum_link(1, $uri) . '" title="First Page">' . ($nolabel ? 1 : $prelabel) . '</a></li><li class="page-elps"><span>...</span></li>';
		}
		
		for( $i = $start_page, $end_page = $start_page + $continuous_pages; $i < $end_page; $i ++ ){
			if($i == $page) {
				$output .= '<li class="cur-page"><span title="Page ' . $i . '">' . $i . '</span></li>';
			} else {
				$output .= '<li class="page-link"><a href="' . km_pagenum_link($i, $uri) . '" title="Page ' . $i . '">' . $i . '</a></li>';
			}
		}
		
		if( $right_elps ){
			$output .= '<li class="page-elps"><span>...</span></li><li class="page-link last-page"><a href="'
					.km_pagenum_link($max_page, $uri) 
					. '" title="Last Page">' . ($nolabel ? $max_page : $nxtlabel ) . '</a></li>';
		}
		
		$output .= $after;
		// ---------------------------echo end
	}
	
	if($echo)
		echo $output;
	else
		return array('html' => $output, 'pages' => $max_page);
}



// Grab all posts and filter them into an array
function km_get_posts() {
	// If we have a cached copy of the filtered posts array, use that instead
	if ( $posts = wp_cache_get( 'posts', 'archives-loader' ) )
		return $posts;

	// Get a simple array of all posts
	$rawposts = get_posts( 'numberposts=-1' );

	// Loop through each post and sort it into a structured array
	foreach( $rawposts as $key => $post ) {
		$posts[ mysql2date( 'Y.m', $post->post_date ) ][] = $post;

		unset( $rawposts[$key] ); // Try and free up memory for users with lots of posts and poor server configs
	}
	
	$rawposts = NULL; // More memory cleanup

	// Store the results into the WordPress cache
	wp_cache_set( 'posts', $posts, 'archives-loader' );

	return $posts;
}

/**
 * related posts original by fairyfish.net 
 * modified by kael.me
 */

function km_get_related_posts( $limit = 10, $post_ID = false ) {
	global $wpdb, $post, $table_prefix;
	
	// if $post_ID is specified
	if($post_ID) $post = get_post($post_ID);
		
	if(!$post->ID){return;}
	$now = current_time('mysql', 1);
	$tags = wp_get_post_tags($post->ID);
	
	$taglist = "'" . $tags[0]->term_id. "'";
	
	$tagcount = count($tags);
	if ($tagcount > 1) {
		for ($i = 1; $i <= $tagcount; $i++) {
			$taglist = $taglist . ", '" . $tags[$i]->term_id . "'";
		}
	}
	$q = "SELECT p.ID, p.post_title, p.post_date, p.comment_count, count(t_r.object_id) as cnt FROM $wpdb->term_taxonomy t_t, $wpdb->term_relationships t_r, $wpdb->posts p WHERE t_t.taxonomy ='post_tag' AND t_t.term_taxonomy_id = t_r.term_taxonomy_id AND t_r.object_id  = p.ID AND (t_t.term_id IN ($taglist)) AND p.ID != $post->ID AND p.post_status = 'publish' AND p.post_date_gmt < '$now' GROUP BY t_r.object_id ORDER BY cnt DESC, p.post_date_gmt DESC LIMIT $limit;";

	$related_posts = $wpdb->get_results($q);
	
	if(!$related_posts){
		$related_posts = km_get_random_posts($limit, $post_ID);
	}
	
	return $related_posts;
}

function km_get_most_commented_posts($limit) {
	global $wpdb; 
	$q = "SELECT ID, post_title, post_content, post_excerpt, post_date, COUNT($wpdb->comments.comment_post_ID) AS 'comment_count' FROM $wpdb->posts, $wpdb->comments WHERE comment_approved = '1' AND $wpdb->posts.ID=$wpdb->comments.comment_post_ID AND post_status = 'publish' GROUP BY $wpdb->comments.comment_post_ID ORDER BY comment_count DESC LIMIT $limit"; 
    return $wpdb->get_results($q);
}

function km_get_random_posts ( $limit = 10, $post_ID = false ) {
    global $wpdb, $post;
	
	// if $post_ID is specified
	if($post_ID) $post = get_post($post_ID);
	
	if(empty($post))
		$post_q = "";
	else $post_q = " AND ID != $post->ID";
		
    $q = "SELECT ID, post_title, post_date, comment_count FROM $wpdb->posts WHERE post_status = 'publish' AND post_type = 'post'" . $post_q . " ORDER BY RAND() LIMIT $limit";

	return $wpdb->get_results($q);
}

function km_category_posts($cat, $post_ID, $options = array()){
	global $post;
	
	$defaults = array(
		'with_thumb' => true,
		'thumb_type' => 'tinynail',
		'echo' => true,
		'ulclass' => 'train',
		'limit' => 12
	);

	$r = wp_parse_args( $options, $defaults );
	extract( $r, EXTR_SKIP );
	
	
	$link = $with_thumb ? '<a class="imgLink" title="' : '<a title="';
	$count = 0;
	$output = '<ul' . ( $ulclass ? ' class="' . $ulclass . '"' : '' ) . '>';
	
	query_posts( array( 'cat' => $cat, 'posts_per_page' => $limit ) ); 
	if ( have_posts() ){
	
		while ( have_posts() ){
			the_post();
			
			$count ++;
		
			$output .= '<li' . ( $post -> ID == $post_ID ? ' class="this">' : '>' ) . $link . the_title('', '', false) . '" href="' . get_permalink($post -> ID) . '">' 
					. ($with_thumb ? ('<img class="image" alt="" src="' . km_get_thumbnail($thumb_type) . '"/>') : the_title('', '', false) )
					. '</a></li>';
		}
	}
	
	wp_reset_query();
	
	if($echo){
		echo $output . '</ul>';
	}else{
		//return array('count' => $count, 'html' => $output . '</ul>');
		return $output . '</ul>';
	}
}

function km_echo_selected_posts ($km_posts, $options = array()){
	$defaults = array(
		'with_thumb' => true,
		'thumb_type' => 'tinynail',
		'echo' => true,
		'ulclass' => 'train'
	);

	$r = wp_parse_args( $options, $defaults );
	extract( $r, EXTR_SKIP );
	
	
	if($km_posts){
		$output = '<ul' . ( $ulclass ? ' class="' . $ulclass . '"' : '' ) . '>';
		foreach ($km_posts as $km_post ){		
			/*if ($show_date){
				$dateformat = get_option('date_format');
				$output .=   mysql2date($dateformat, $km_post->post_date) . ' -- ';
				
			}*/
		
			/*if ($show_comments_count){
				$output .=  ' (' . $km_post->comment_count . ')';
			}*/
			
			
			$output .= '<li><a href="' .get_permalink($km_post->ID) . '" title="' . wptexturize($km_post->post_title) . '">' . 
				($with_thumb ? '<img alt="" src="' . km_get_thumbnail( $thumb_type, $km_post->ID ) . '"/>' : wptexturize($km_post->post_title) ) . '</a></li>';
		}
		
		$output .= '</ul>';
	}else{
		$output = '<ul></ul>';
		$km_posts = array();
	}
	
	if($echo){
		echo $output;
	}else{
		//return array('count' => count($km_posts), 'html' => $output );
		return $output;
	}
}


// Generates the HTML output based on $atts array from the shortcode
function km_post_list() {
	global $wp_locale;

	// Get the big array of all posts
	$posts = km_get_posts();

	// Sort the months reverse
	krsort( $posts );

	// Sort the posts within each month based on $atts
	foreach( $posts as $key => $month ) {
		$sorter = array();
		foreach ( $month as $post )
			$sorter[] = $post->post_date_gmt;

		array_multisort( $sorter, SORT_DESC, $month );

		$posts[$key] = $month;
		unset($month);
	}

	// Generate the HTML
	$firstmonth = TRUE;
	foreach( $posts as $yearmonth => $posts ) {
		list( $year, $month ) = explode( '.', $yearmonth );

		$html .= '<ul id="' . sprintf( __('%1$s%2$d'), $wp_locale->get_month($month), $year ) . '" >';
		foreach( $posts as $post ) {

			$html .= '<li>' . mysql2date( 'd', $post->post_date ) . ': <a href="' . get_permalink( $post->ID ) . '">' . get_the_title( $post->ID ) . '</a>';

			// Unless comments are closed and there are no comments, show the comment count
			if ( ( 0 != $post->comment_count || 'closed' != $post->comment_status ) && empty($post->post_password) ) $html .= ' <span title="' . __('Comment Count', 'archives-loader') . '">(' . $post->comment_count . ')</span>';

			$html .= '</li>';
		}
		$html .= '</ul>';
	}

	echo $html;
}

/**
 * Get shortcut of posts at Homepage
 * @require km_substr
 */
function km_home_post($options = ''){
	
	$defaults = array(
		'post_ID' => false,
		'echo' => true,
		'ellipsis' => '...',
		'limit' => 300
	);

	$r = wp_parse_args( $options, $defaults );
	extract( $r, EXTR_SKIP );
	
	
	if($post_ID){
		$post = get_post($post_ID);
		
		if($post){
			$output = $post -> post_excerpt;
			
			if(empty($output)){
				$output = $post -> post_content;
			}
			
			if ( post_password_required($post) ) {
				$output = __('There is no excerpt because this is a protected post.');
			}
		}
	}else{
		$output = get_the_excerpt();
	}
	
	if($output){
		$output = apply_filters('the_excerpt', $output);
		$output = km_substr(strip_tags($output, '<p><a>'), $limit);
		$output = preg_replace('/<a((?!<\/a\s*>).)*$/', '', $output);
		$output = preg_replace(array('/<p>/', '/<\/p>/'), array('', '<br/>'), $output);
	}
	
	if($echo)
		echo $output . $ellipsis;
	else
		return $output . $ellipsis;
	
}

/**
 * Get Thumbnails of posts at Homepage
 */
function km_get_thumbnail($type = 'thumbnail', $this_post_ID = false, $default = 'i/default-thumb.jpg'){
	global $post, $STATIC;
	if( !$this_post_ID ){
		$this_post_ID = $post -> ID;
		$this_post = $post;
		
	}else{
		$this_post = get_post($this_post_ID);
	}
	
	$image = get_post_meta($this_post_ID, $type, true);
	

	if(empty($image)){
		$content = apply_filters('the_content', $this_post -> post_content);
	
		preg_match('/<img.*?src=[\'"]([^"]+)[\'"]/i', $content, $matches);//get the first image for thumbnail
		$image = $matches[1];
		
		
		if(empty($image)){
			$content = apply_filters('the_excerpt', $this_post -> post_excerpt);
		
			preg_match('/<img.*?src=[\'"]([^"]+)[\'"]/i', $content, $matches);
			$image = $matches[1];
			
			
			if(empty($image)) $image = $default;
		}
		
	}

	return $STATIC->get( $image );
}


/**
 * Kael.Me List Comments
 * for customized comments
 */
function km_list_comments($comment, $options, $depth) {
	global $STATIC;

	$GLOBALS['comment'] = $comment;
	$admin = $comment->comment_author_email == get_the_author_email();
	
	?><li id="comment-<?php comment_ID(); ?>" class="depth-<?php echo $depth; 

	?>" ><div class="com<?php if($admin) echo ' adminComment'; else echo ' singleComment';

	?>"><div class="<?php if($depth == 1) echo 'top-info'; else echo 'info'; ?>"><?php

	echo get_avatar( $comment->comment_author_email, '50', $STATIC->get('i/trans.png') );

	if($admin && $depth > 1) echo '<div class="admin-decoration"></div>';

	?><span class="author"><?php comment_author_link() ?></span><?php
	?><span class="time"><?php comment_date('M j, Y') ?>  <?php comment_time('H:i') ?> <?php edit_comment_link('edit','',''); ?></span></div><div class="content"><?php 

		comment_text();

	?></div><div class="arrow"></div><a href="#" class="t-re" title="click to reply"><span class="t-arrow"></span></a><?php

	if ($comment->comment_approved == '0') : 

	?><div class="small">Your comment is awaiting moderation.</div><?php 

	endif;

	echo '</div>';

} 


/**
 * altered from get_archives_link which located in wp_include/general-template.php
 */
function km_get_archives_link($url, $text, $format = 'html', $before = '', $after = '', $is_current = false, $count = '') {
	$text = wptexturize($text);
	$title_text = esc_attr($text);
	$url = esc_url($url);
	$class = $is_current ? ' class="this"' : '';

	$link_html = "<li$class>$before<a href='$url' title='$title_text'>$text$count</a>$after</li>";

	$link_html = apply_filters( "km_get_archives_link", $link_html );

	return $link_html;
}

/**
 * method: Kael.Me_get_archives
 * altered from wp_get_archives which located in wp_include/general-template.php, and km_get_archives is much more powerful
 * different from wp_get_archives:
 * 1. only deal with monthly archives
 * 2. compare with the current date
 * 
 */
function km_get_archives($options = '') {
	global $wpdb, $wp_locale;

	$defaults = array(
		'show_page_nav' => true,
		'show_single_nav' => false,
		'limit' => '',
		'format' => 'html', 
		'before' => '',
		'after' => '', 
		'show_post_count' => true,
		'echo' => 1,
		'current_year' => false,
		'current_month' => false,
		'first_open' => false   // if set the first element to .side-this however
	);

	$r = wp_parse_args( $options, $defaults );
	extract( $r, EXTR_SKIP );

	if ( '' != $limit ) {
		$limit = absint($limit);
		$limit = ' LIMIT '.$limit;
	}

	//filters
	$where = apply_filters('getarchives_where', "WHERE post_type = 'post' AND post_status = 'publish'", $r );
	$join = apply_filters('getarchives_join', "", $r);

	$output = '';

	$query = "SELECT YEAR(post_date) AS `year`, MONTH(post_date) AS `month`, count(ID) as posts FROM $wpdb->posts $join $where GROUP BY YEAR(post_date), MONTH(post_date) ORDER BY post_date DESC $limit";
	$key = md5($query);
	
	$cache = wp_cache_get( 'km_get_archives' , 'general');
	
	if ( !isset( $cache[ $key ] ) ) {
		$arcresults = $wpdb->get_results($query);
		$cache[ $key ] = $arcresults;
		wp_cache_add( 'km_get_archives', $cache, 'general' );
		
	} else {
		$arcresults = $cache[ $key ];
	}
	
	if ( $arcresults ) {
		$afterafter = $after;
		
		// at first, there's no year in the loop
		$current_loop_year = false;
		
		foreach ( (array) $arcresults as $arcresult ) {
			$loop_year = $arcresult->year;
			
			if($loop_year != $current_loop_year){
				if($current_loop_year) $output .= '</ul></div>';
				
				// is_archive, and is the current year
				// or
				// $first_open, and is the first element($current_loop_year == false)
				$class = $current_year == $loop_year || $first_open && !$current_loop_year ? ' side-this' : '';
				
				if($show_page_nav && $current_year == $loop_year){
					$page_nav = km_pagenavi(array('echo' => false));
					
					if($show_single_nav || $page_nav['pages'] > 1){
						$output .= "<div class='side-box side-archive$class'>";
						
						// mark side-t with .side-nav
						$output .= '<div class="side-t side-nav"><h3>' 
								. $loop_year 
								. '<span class="arrow"></span></h3><ul class="page-nav" id="page-nav">' 
								. $page_nav['html'] . 
								'</ul></div><ul class="side-c">';
								
					// if don't show single navi, and there's only one page, show default content
					}else{
						$output .= "<div class='side-box side-archive$class'><h3 class='side-t'>$loop_year<span class='arrow'></span></h3><ul class='side-c'>";
						
					}
				}else{
					$output .= "<div class='side-box side-archive$class'><h3 class='side-t'>$loop_year<span class='arrow'></span></h3><ul class='side-c'>";
				}
				
				$current_loop_year = $loop_year;
			}
			
			
			$url = get_month_link( $arcresult->year, $arcresult->month );
			$text = sprintf(__('%1$s %2$d'), $wp_locale->get_month($arcresult->month), $loop_year);
			
			if ( $show_post_count ){
				$count = "<span class='count'>($arcresult->posts)</span>";
			}
			
			$output .= km_get_archives_link($url, $text, $format, $before, $after, ($arcresult -> month == $current_month), $count);
		}
	}

	if ( $echo )
		echo $output . '</ul></div>';
	else
		return $output . '</ul></div>';
}



function km_list_categories( $options = '' ) {
	$defaults = array(
		'show_option_all' => '', 'orderby' => 'name',
		'order' => 'ASC', 'show_last_update' => 0,
		'style' => 'list', 'show_count' => 0,
		'hide_empty' => 1, 'use_desc_for_title' => 1,
		'child_of' => 0, 'feed' => '', 'feed_type' => '',
		'feed_image' => '', 'exclude' => '', 'exclude_tree' => '', 'current_category' => 0,
		'hierarchical' => true, 'title_li' => __( 'Categories' ),
		'echo' => 1, 'depth' => 0
	);

	$r = wp_parse_args( $options, $defaults );

	if ( !isset( $r['pad_counts'] ) && $r['show_count'] && $r['hierarchical'] ) {
		$r['pad_counts'] = true;
	}

	if ( isset( $r['show_date'] ) ) {
		$r['include_last_update_time'] = $r['show_date'];
	}

	if ( true == $r['hierarchical'] ) {
		$r['exclude_tree'] = $r['exclude'];
		$r['exclude'] = '';
	}

	extract( $r );

	$categories = get_categories( $r );
	
	// print_r($categories);

	$output = '';
	if ( $title_li && 'list' == $style )
			$output = '<li class="categories">' . $r['title_li'] . '<ul>';

	if ( empty( $categories ) ) {
		if ( 'list' == $style )
			$output .= '<li>' . __( "No categories" ) . '</li>';
		else
			$output .= __( "No categories" );
	} else {
		global $wp_query;

		if( !empty( $show_option_all ) )
			if ( 'list' == $style )
				$output .= '<li><a href="' .  get_bloginfo( 'url' )  . '">' . $show_option_all . '</a></li>';
			else
				$output .= '<a href="' .  get_bloginfo( 'url' )  . '">' . $show_option_all . '</a>';

		if ( empty( $r['current_category'] ) && is_category() )
			$r['current_category'] = $wp_query->get_queried_object_id();

		if ( $hierarchical )
			$depth = $r['depth'];
		else
			$depth = -1; // Flat.

		$output .= km_walk_category_tree( $categories, $depth, $r );
	}

	if ( $title_li && 'list' == $style )
		$output .= '</ul></li>';

	$output = apply_filters( 'wp_list_categories', $output );

	if ( $echo )
		echo $output;
	else
		return $output;
}


function km_walk_category_tree() {
	$args = func_get_args();
	// the user's options are the third parameter
	if ( empty($args[2]['walker']) || !is_a($args[2]['walker'], 'Walker') )
		$walker = new KM_Walker_Category;
	else
		$walker = $args[2]['walker'];

	return call_user_func_array(array( &$walker, 'walk' ), $args );
}




/**
 * altered from wp_list_pages which located in wp_include/post-template.php 
 */
function km_list_pages($options = '') {
	$defaults = array(
		'depth' => 0, 
		'show_date' => '',
		'date_format' => get_option('date_format'),
		'child_of' => 0, 
		'exclude' => '',
		'title_li' => __('Pages'), 
		'echo' => 1,
		'authors' => '', 
		'sort_column' => 'menu_order, post_title',
		'link_before' => '', 
		'link_after' => ''
	);

	$r = wp_parse_args( $options, $defaults );
	extract( $r, EXTR_SKIP );

	$output = '';
	$current_page = 0;

	// sanitize, mostly to keep spaces out
	$r['exclude'] = preg_replace('/[^0-9,]/', '', $r['exclude']);

	// Allow plugins to filter an array of excluded pages
	$r['exclude'] = implode(',', apply_filters('wp_list_pages_excludes', explode(',', $r['exclude'])));

	// Query pages.
	$r['hierarchical'] = 0;
	$pages = get_pages($r);

	if ( !empty($pages) ) {
		if ( $r['title_li'] )
			$output .= '<li class="pagenav">' . $r['title_li'] . '<ul>';

		global $wp_query;
		if ( is_page() || is_attachment() || $wp_query->is_posts_page )
			$current_page = $wp_query->get_queried_object_id();
		$output .= walk_page_tree($pages, $r['depth'], $current_page, $r);

		if ( $r['title_li'] )
			$output .= '</ul></li>';
	}

	$output = apply_filters('wp_list_pages', $output);

	if ( $r['echo'] )
		echo $output;
	else
		return $output;
}


/**
 * Kael.Me custom method to retrieve posts with certain parameters
 * and also for ajax use
 */
function km_list_posts($options = array()){
	
	// if $numberposts isn't empty, function get_posts will change $posts_per_page => $numberposts( default to 5 ); located in /wp-include/post.php
	$options['numberposts'] = 0;
	
	$posts = get_posts($options);
	
	$output = array();
	
	foreach($posts as $post){
		$permalink = get_permalink( $post -> ID );
		$title = get_the_title( $post -> ID );
		
		$t_cate_id = km_get_cate_ids($post -> ID);
		$t_cate_id = $t_cate_id[0];
		
		array_push(
			$output,

			join('', array(
				'<h2 class="list-title"><a title="" href="', $permalink, '"><img alt="', $title, '" src="', km_get_thumbnail('thumbnail', $post -> ID), 
				'"/></a></h2><div class="list-cont"><a href="', $permalink, '" class="pop-title">', $title, '</a><div class="pop-cont">',
				
				km_home_post( array('post_ID' => $post -> ID, 'echo' => false, 'limit' => 100)),
				
				'</div><div class="pop-info F"><a class="cate" href="',
				get_category_link($t_cate_id), '"><span class="i-folder"></span><span class="text">', get_cat_name($t_cate_id), '</span></a><a href="', 
				$permalink, '" class="more">more...</a></div></div>'
			))

		);
	
	}
	
	return $output;
}


/**
 * @return the count of posts for a specified time period
 */
function km_posts_count_by_month($options = ''){
	global $wpdb;
	
	$defaults = array(
		'year' => 0,
		'month' => '',
		'status' => 'publish'
	);

	$r = wp_parse_args( $options, $defaults );
	extract( $r, EXTR_SKIP );
	
	
	if( !$year ) return 0;
	if( !empty( $month ) ) $month = " AND MONTH(post_date) = $month";
	
	$query = "SELECT count(ID) as count FROM $wpdb->posts WHERE YEAR(post_date) = $year$month AND post_status = '$status'";
	$key = md5($query);
	
	$cache = wp_cache_get( 'km_posts_count' , 'general');
	
	if ( !isset( $cache[ $key ] ) ) {
		$count_result = $wpdb->get_row($query);
		$cache[ $key ] = $count_result;
		
		wp_cache_add( 'km_posts_count', $cache, 'general' );
		
	} else {
		$count_result = $cache[ $key ];
	}
	
	return $count_result->count;
}


/** 
 * get category ids of a certain post
 * @param {int}(optional) $post_ID
 */
function km_get_cate_ids($post_ID = false){
	
	// $id of the function get_the_category is also optional
	$cate_ids = array();
	
	foreach(get_the_category($post_ID) as $category){
		array_push($cate_ids, $category -> cat_ID);
	}
	
	return $cate_ids;
}


/** 
 * get item from the $wp_query
 */
function km_get_query_cat(){
	global $wp_query;
	
	if($wp_query){
		return $wp_query -> query_vars['cat'];
	}else{
		return false;
	}
}

function km_get_query_tag(){
	global $wp_query;
	
	if($wp_query){
		return $wp_query -> query_vars['tag'];
	}else{
		return false;
	}
}


function km_get_max_page(){
	global $wp_query;
	
	if($wp_query){
		return $wp_query -> max_num_pages;
	}else{
		return false;
	}	
}

function km_get_archive_year(){
	global $wp_query;
	
	if($wp_query){
		return $wp_query -> query_vars['year'];
	}else{
		return false;
	}
}

function km_get_archive_month(){
	global $wp_query;
	
	if($wp_query){
		return $wp_query -> query_vars['monthnum'];
	}else{
		return false;
	}
}

function km_get_latest_post(){
	$posts = get_posts("numberposts=1&orderby=post_date&order=DESC");
	
	return $posts[0];
}
?>
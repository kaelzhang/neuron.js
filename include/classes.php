<?php

/**
 * Create HTML list of categories.
 *
 * @package WordPress
 * @since 2.1.0
 * @uses Walker
 */
class KM_Walker_Category extends Walker {
	/**
	 * @see Walker::$tree_type
	 * @since 2.1.0
	 * @var string
	 */
	var $tree_type = 'category';

	/**
	 * @see Walker::$db_fields
	 * @since 2.1.0
	 * @todo Decouple this
	 * @var array
	 */
	var $db_fields = array ('parent' => 'parent', 'id' => 'term_id');

	/**
	 * @see Walker::start_lvl()
	 * @since 2.1.0
	 *
	 * @param string $output Passed by reference. Used to append additional content.
	 * @param int $depth Depth of category. Used for tab indentation.
	 * @param array $args Will only append content if style argument value is 'list'.
	 */
	function start_lvl(&$output, $depth, $args) {
		if ( 'list' != $args['style'] )
			return;
			
		$output .= "<ul class='side-c'>";
	}

	/**
	 * @see Walker::end_lvl()
	 * @since 2.1.0
	 *
	 * @param string $output Passed by reference. Used to append additional content.
	 * @param int $depth Depth of category. Used for tab indentation.
	 * @param array $args Will only append content if style argument value is 'list'.
	 */
	function end_lvl(&$output, $depth, $args) {
		if ( 'list' != $args['style'] )
			return;

		$output .= "</ul>";
	}

	/**
	 * @see Walker::start_el()
	 * @since 2.1.0
	 *
	 * @param string $output Passed by reference. Used to append additional content.
	 * @param object $category Category data object.
	 * @param int $depth Depth of category in reference to parents.
	 * @param array $args
	 */
	function start_el(&$output, $category, $depth, $args) {
		extract($args);
		
		// prepare data ---------------------------------------------------
		
		// get current category object
		// @param {object} _current_category
		if ( isset($current_category) && $current_category )
			$_current_category = get_category( $current_category );
		
		
		// is child?
		$is_child = $category -> category_parent;
		
		// is this category
		$is_this_category = isset($current_category) && $current_category && ($category->term_id == $current_category || $category->term_id == $_current_category->parent);
		
		// has navigation?
		if($is_this_category && !$is_child && $page_nav){
			$category_nav = $page_nav;
		}



		// generate html ---------------------------------------------------
		$cat_name = esc_attr( $category->name);
		$cat_name = apply_filters( 'list_cats', $cat_name, $category );
		
		
		if($is_child){
			$link = '<a href="';
		}else{
			if(!empty($category_nav)){
				$link = '<div class="side-t side-nav"><h3><a href="';
			}else{
				$link = '<a class="side-t" href="';
			}
		}
		
		
		$link .= get_category_link( $category->term_id ) . '" ';
		
		if ( $use_desc_for_title == 0 || empty($category->description) )
			$link .= 'title="' . sprintf(__( 'View all posts filed under %s' ), $cat_name) . '"';
		else
			$link .= 'title="' . esc_attr( strip_tags( apply_filters( 'category_description', $category->description, $category ) ) ) . '"';
		$link .= '>'. $cat_name;
		
		
		if ( $is_child && isset($show_count) && $show_count )
			$link .= ' <span class="count">(' . intval($category->count) . ')</span>';
		
		
		$link .= '</a>';
		
		if(!empty($category_nav)){
			$link .= '</h3><ul class="page-nav" id="page-nav">' . $category_nav . '</ul></div>';
		}
		
		// if(!$is_child) $link .= '</h3>';
		
		
/*
		if ( (! empty($feed_image)) || (! empty($feed)) ) {
			$link .= ' ';

			if ( empty($feed_image) )
				$link .= '(';

			$link .= '<a href="' . get_category_feed_link($category->term_id, $feed_type) . '"';

			if ( empty($feed) )
				$alt = ' alt="' . sprintf(__( 'Feed for all posts filed under %s' ), $cat_name ) . '"';
			else {
				$title = ' title="' . $feed . '"';
				$alt = ' alt="' . $feed . '"';
				$name = $feed;
				$link .= $title;
			}

			$link .= '>';

			if ( empty($feed_image) )
				$link .= $name;
			else
				$link .= "<img src='$feed_image'$alt$title" . ' />';
			$link .= '</a>';
			if ( empty($feed_image) )
				$link .= ')';
		}


		if ( isset($show_date) && $show_date ) {
			$link .= ' ' . gmdate('Y-m-d', $category->last_update_timestamp);
		}

*/		
			


		if ( 'list' == $args['style'] ) {
			
			$current_output = '';
			
			if($is_child){
				$class = '';
			}else{
				$class = 'side-box side-archive side-cate';
			}
			
			
			if ($is_this_category){
				if($is_child){
					$class .= 'this';
				}else{
					$class .= ' side-this';
				}
			}
				
			$current_output .=  !empty($class) ? ' class="' . $class . '"' : '';
			
			$current_output .= ">$link";
			
			
			if($is_child){
				$output .= "<li" . $current_output;
			}else{
				$output .= "<div". $current_output;
				
			}
			
		} else {
			$output .= "$link";
		}
	}

	/**
	 * @see Walker::end_el()
	 * @since 2.1.0
	 *
	 * @param string $output Passed by reference. Used to append additional content.
	 *  // @param object $page Not used.
	 * @param int $depth Depth of category. Not used.
	 * @param array $args Only uses 'list' for whether should append to output.
	 */
	function end_el(&$output, $category, $depth, $args) {
		if ( 'list' != $args['style'] )
			return;
			
		if($category -> parent){

			$output .= "</li>";
		}else{
			$output .= "</div>";
		}
	}

}

?>
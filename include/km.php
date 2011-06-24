<?php
# Prevent users from directly loading this class file
defined('KM_PORT') or die ('Access prohibited, kael.me portfolio');

class KM {

	public $post_ID;
	public $cat_ID = array();
	
	private $GET;
	private $POST;
	private $status = array();
	
	private $inc_sig = array(
		'header' => array(
			'index' => 'header.php',
			'single' => 'header.php'
		),
		'footer' => array(
			'index' => 'index-footer.php',
			'single' => 'footer.php'
		),
		'top' => array(
			'single' => 'top.php'
		),
		
		'logo' => array(
			'single' => 'logo.php'
		)
	);
	
	
	// @param {boolean} $check whether we should check the value or not
	function store($key, $value, $check = false){
		if(!$check || $value){
			$this->status[$key] = $value;
		}
	}
	
	function retrieve($key){
		return $this->status[$key];
	}
	
	function __construct(){
		//store the $_REQUEST to $params
		$this->POST = $_POST;
		
		//if KM_POST defined, the get method is prohibited
		if( !defined('KM_POST') ){
			$this->GET = $_GET;
			// print_r($this->GET['tab']);
			// echo $this->get('tab');
			// $this->ech();
		}
		
	//		else{
	//			echo 'km_post define';
	//		}
	}
	
	// initialize and format 'include' post-meta into $this->extra_inc array
	// the 'include' post-meta shoud be like:
	// required: (TWO whitespaces)
	// 		[abc/  directory]
	// optional:
	// 		[css1.css|css2.css  css]
	// 		[js1.js|js2.js  js]
	//		[php1.php|php2.php  php]
	function post_init(){
		//initialize including data
		$includes = self::get_custom('include');

		if( !empty($includes) ){
			
			for( $i = 0, $len = count($includes); $i < $len; $i++ ){
				$this->extra_inc[ $includes[$i][1] ] = explode('|', $includes[$i][0] );
			}
			
			if( !isset( $this->extra_inc['directory'] ) ) unset( $this->extra_inc );
		}
	}
	
	private function collapse( $msg = 'access denied' ) {
		header('HTTP/1.0 500 Internal Server Error');
		echo $msg;
		exit;
	}
	
	/*================================================*\
		Function sanitize $_REQUEST
	
	\*================================================*/
	
	// change log: 
	//		2010-02-19: correct a bug that will destroy the other request params which is not defined in $signature
	
	function sanitize( $signatures ){		
		
		foreach( $signatures as $name => $sig ){
			if( !isset( $this->GET[ $name ] ) && isset( $sig['required'] ) && $sig['required']  ){
				self::collapse('illegal arguments');
			}
			
			// only sanitize already-exists request params
			if( isset( $this->GET[ $name ] ) ){
				
				//limit the variable type of $_REQUEST
				if( isset( $sig['type'] ) ){
					settype( $this->GET[ $name ], $sig['type'] );
				}

				if( isset( $sig['filter'] ) && function_exists( $sig['filter'] ) ){
					$this->GET[ $name ] = $sig['filter']( $this->GET[ $name ] );
				}
			}
		}
	}
	
	
	// the global $_GET and $_REQUEST are already decoded
	// the replace of the $_REQUEST[''] method
	function get( $key, $default = false ){
		return isset( $this->GET[ $key ] ) ? $this->GET[ $key ] : $default;
	}
	
	function post( $key, $default = false ){
		return isset( $this->POST[ $key ] ) ? $this->POST[ $key ] : $default;
	}
	
	private function get_custom_meta( $type, $post_ID = false ){
		if( !$post_ID ){
			global $post;
			if( empty( $post ) ) return false;
			
			$post_ID = $post -> ID;
		}

		// if not exists, get_post_meta will return ''
		return get_post_meta($post_ID, $type, true );
	}
	
	
	private function wiki_slice( $content ){
	
		/**
		 [abdefg]  =>  abcdefg 
		 */
		preg_match_all('/(?<=\[)(?:[^\]]+)(?=\])/i', $content, $matches );
		
		$matches = $matches[0];
		
		$len = count($matches);
		if($len == 0) return '';
		
		for( $i = 0; $i < $len; $i ++ ){
		
			//array('link' => $match[0], 'text' => $match[1]);
			$ret[] = preg_split( '/\s\s/', $matches[$i] );
		}
		return $ret;
	}
	
	function get_custom($type, $post_ID = false){
		return self::wiki_slice( self::get_custom_meta( $type, $post_ID ) );
	}
	
	/*

	function side_des($isThis = false){
		$des = self::get_custom('side-des');

		if(!empty($des)){
			echo '<div class="side-box' . ( $isThis ? ' side-this' : '') . '"><h3 class="side-t">' . $des[0][1] . '</h3><ul class="side-c">';
			
			array_shift($des);
			
			for($i = 0, $len = count($des); $i < $len; $i ++){
				list($link, $text) = $des[$i];
				
				$class = ( $i == 0 ? 'first ' : '' ) . ( $i == $len - 1 ? 'last' : '' );
				if(!empty($class)){
					$class = ' class="' . trim($class) . '"';
				}
				
				if($link === '#'){
					echo '<li' . $class . '><p>' . $text . '</p></li>';
				}else{
					echo '<li' . $class . '><a href="' . $link . '">' . $text . '</a></li>';
				}
			}
			
			echo '</ul></div>';
			
			return true;
			
		}else{
			return false;
		}
	}

*/
	
	
	function feature_img(){
		$images = self::get_custom('f-img');
		
		if( !empty( $images ) ){
			echo '<div class="featured"><div class="f-wrap"><div class="f-wrap2">';

			$count = ' class="first"';
			foreach( $images as $image ){
				echo '<img alt="' . $image[1] . '" src="' . $image[0] . '"' . $count . '/>';
				$count = '';
			}

			echo '<a class="prev">previous image</a><a class="next">next image</a><div class="cover"></div><div class="f-action">';
			
			self::feature_action();
			
			echo '</div></div></div></div>';
		}
		
	}//end function echo_feature_img
	
	private function feature_action(){
		$actions = self::get_custom('f-action');
		
		if( !empty($actions) ){
			list($link, $text) = $actions[0];
			$class = count($actions) > 1 ? ' list' : '';
			
			echo '<h3 class="btn">';
			
			if( $link === '#' ){
				echo '<div class="' . str_replace(' ', '', $text). $class . '">' . $text . '<span class="action"></span></div></h3><ul>';
			}else{
				echo '<a class="' . str_replace(' ', '', $text). $class . '" href="' . $link . '">' . $text . '<span class="action"></span></a></h3><ul>';
			}

			array_shift( $actions );
	
			foreach( $actions as $action ){
				echo '<li><a href="' . $action[0] . '">' . $action[1] . '</a></li>';
			}
			
			echo '</ul>';
		}

	}
	
	// include method: include a php from theme files
	// @param {string} $part: 'header', 'footer', etc
	// @param {string} $type: page type: single article or category
	function inc($part, $type = 'single'){
		include(KM_CONT_PATH . $this->inc_sig[$part][$type] );
	}
	
	function inc_header($type = 'single'){
		self::inc('header', $type);
	}
	
	function inc_footer($type = 'single'){
		self::inc('footer', $type);
	}
	
	// include css for specific article
	// which has been defined at 'include' post-meta as  [css1.css|css2.css|...  css]
	function css(){
		if( isset( $this->extra_inc ) ){
			echo '<link rel="stylesheet" href="' . KM_FILE_PATH . 'demo/main.css" />';
			
			$csss = $this->extra_inc['css'];
			foreach( $csss as $css ){
				echo '<link rel="stylesheet" href="' . KM_FILE_PATH . 'demo/' . trim($this->extra_inc['directory'][0]) . $css . '" />';
			}
		}
		
	}
	
	// include javascript for specific article
	// which has been defined at 'include' post-meta as  [js1.js|js2.js|...  js]
	function js(){
		if( isset( $this->extra_inc ) ){
			$jss = $this->extra_inc['js'];
			foreach( $jss as $js ){
				echo '<script src="' . KM_FILE_PATH . 'demo/' . trim($this->extra_inc['directory'][0]) . $js . '" ></script>';
			}
			
			return true;
		
		}else return false;
		
	}
	
	// include php files for specific article
	// which has been defined at 'include' post-meta as  [php1.php|php2.php|...  php]
	
	// every time execute $KM->demo(), it will include only ONE php, and pointer assigned to the next
	function demo(){
		
		if( !isset( $this->extra_inc ) ) return false;
		
		$demo = each( $this->extra_inc['php'] );
		
		if( $demo ){
			$demo = ABSPATH . 's/demo/' . $this->extra_inc['directory'][0] . $demo['value'];
			
			if( file_exists($demo) ) include( $demo );
		}

		return $demo; //end flag
	}	

}//end class KM

$KM = new KM();

?>
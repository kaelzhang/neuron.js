<?php

require_once('static/version.php');

class StaticFiles {
	private $cdn_pattern;
	private $path = array();
	private $r_cdn_pattern = '/{CDN}/';
	private $r_script = '/(?<filename>.+)\.(?<extension>js|css)$/i';
	
	
	function __construct($config){
		$this->cdn_pattern = $config['cdnPattern'];
		$this->file_root = $config['dir'];
		
		$this->path = array(
			'js'	=> $config['jsPath'],
			'css'	=> $config['cssPath'],
			'res'	=> ''
		);
	}
	
	private function decorate($script_uri){
		if($script_uri != ''){
			$type = self::get_type($script_uri);
		
			if($type == 'js'){
				echo '<script src="' . $script_uri . '"></script>';
			}else if($type == 'css'){
				echo '<link rel="stylesheet" type="text/css" href="' . $script_uri . '" />';
			}
		}
	}
	
	private function get_cdn_server($path){
		$server = $this->cdn_pattern;
	
		return preg_replace( $this->r_cdn_pattern, strlen($path) % 3 + 1, $server );
	}
	
	private function full_path($path, $type = ''){
		if($type == ''){
			$type = self::get_type($path);
		}
	
		return self::get_cdn_server($path) . $this->path[$type];
	}
	
	private function get_type($path){
		preg_match( $this->r_script , $path, $match);
		
		if($match){
			$type = $match['extension'];	
		}
		
		if(!$type){
			$type = 'res';
		}
		
		return $type;
	}
	/*

	private function fail($s){
		header('HTTP/1.0 500 Internal Server Error');
		echo $s;
		exit;
	}
*/
	
/**
 * @public
 * --------------------------------------------------------------------------------- */
	
	// get root dir of js or css
	function root($path, $type = ''){
		if($type == ''){
			$type = self::get_type($path);
		}
	
		return $this->file_root . $this->path[$type];
	}
	
	// include a js or css into the page, use decoration
	function inc($paths, $fill_path = true){
		if(!is_array($paths)){
			$paths = preg_split('/,\s*/', $paths);
		}
	
		for($i = 0, $len = count($paths); $i < $len; $i ++){
			self::decorate( $fill_path ? self::get( $paths[$i] ) : $paths[$i] );
		}
	}
	
	// combo a group of js's and css's into the page
	function combo($paths, $type = ''){
		$paths = preg_split('/,\s*/', $paths);
		
		// if more than one file, must be decorated
		if( count($paths) === 1 ){
			self::inc($paths);
		}else{
			self::decorate( self::get_combo($paths, $type) );
		}
	}
	
	// get the absolute uri of js or css
	function get($path){
		return self::full_path($path) . $path;
	}
	
	// get the absolute uri of the comboed js or css
	function get_combo($paths, $type = ''){
		if(!is_array($paths)){
			$paths = preg_replace('/\s+/', '', $paths);
			preg_replace('/,/', $paths, $paths);
		}
		
		if($type == ''){
			$type = self::get_type($paths[0]);
		}
		
		// natcasesort($paths);
		
		$modified_time = 0;
		$failed = false;
		
		$js_combo = $type == 'js';
		
		if(!$js_combo && $type != 'css'){
			$failed = true;
		}
		
		for($i = 0, $len = count($paths); $i < $len; $i ++){
			if(self::get_type($paths[$i]) != $type){
				$failed = true;
				break;
			}
			
			// filetime() must get a dir file path but not a uri
			$modified_time += filemtime( self::root($paths[$i], $type) . $paths[$i] );
			
			$paths[$i] = preg_replace('/\//', '>', $paths[$i]);
		}
		
		if($failed){
			return '';
		}else{
			$paths = join(',', $paths);
			$extension = '.' . $type;
			
			return self::full_path( $paths ) . 'combo/--' . $paths . '--/' . $modified_time . $extension;
		}
	}
}

?>
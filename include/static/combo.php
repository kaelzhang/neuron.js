<?php 

require_once( '../../wp-config.php' );

function fail($s = '') {
	header('HTTP/1.0 500 Internal Server Error');
	echo $s;
	exit;
}

if (!strstr( $_SERVER['HTTP_REFERER'], get_option('home') ) || $_SERVER["REQUEST_METHOD"] != "GET") {
    fail();
}

require_once( '../config.php' );
require_once( KM_INCLUDE_PATH . 'km.php');
require_once( KM_INCLUDE_PATH . 'static.php');
// require_once( KM_INCLUDE_PATH . 'http-connection.php' );

global $KM;

$STATIC = new StaticFiles(array(
	'jsPath' 		=> KM_JS_PATH,
	'cssPath'		=> KM_CSS_PATH,
	'cdnPattern'	=> KM_FILE_SERVER_PATTERN,
	'dir'			=> KM_FILE_SERVER_DIR
));

$files 		= $KM->get('files');
$filename 	= $KM->get('name');

if($files == false || $filename == false){
	fail('Bad Request');
}


function kill_data(){
	return '';
}

$output = '';
$start_timestamp = microtime(true);
preg_match('/\.(?<extension>js|css)$/', $filename, $match);
$combo_type = $match['extension'];

if($combo_type != 'js' && $combo_type != 'css'){
	fail('Illegal combo type: ' . $combo_type);
}

$root_dir = $STATIC->root('', $combo_type);
$file_open_error = false;
$file_compression_timeout_error = true;

$paths = preg_split('/,/', preg_replace( array('/>/', '/\s+/'), array('/', ''), $files) );


/**
 * fetch file contents
 * ---------------------------------------------------------------------------------------------------- */
ob_start('kill_data');

for($i = 0, $len = count($paths); $i < $len; $i ++){
	$full_dir = $root_dir . $paths[$i];
	$file_content = file_get_contents( $full_dir );
	
	if($file_content == false){
		$file_open_error = $paths[$i] . ' not found';
		break;
	}else{
		$file_content = mb_convert_encoding($file_content, KM_ENCODING);
		$output .= $file_content;
	}
}

ob_end_clean();

// replace buildtime into 
$output = preg_replace('/%buildtime%/', date('M jS Y H:i:s e'), $output);
$dev_output = $output;


if($file_open_error){
	fail($file_open_error);
}

/**
 * compile with google closure
 * ---------------------------------------------------------------------------------------------------- */
 
$ch = curl_init('http://closure-compiler.appspot.com/compile');

curl_setopt_array($ch, array(
	CURLOPT_TIMEOUT			=> 5,
	CURLOPT_HTTPHEADER		=> array('Content-type: application/x-www-form-urlencoded'),
	CURLOPT_RETURNTRANSFER 	=> true,
	CURLOPT_POST			=> true,
	CURLOPT_POSTFIELDS		=> 'output_info=compiled_code&output_format=text&compilation_level=SIMPLE_OPTIMIZATIONS&js_code=' . urlencode($output)
));

$closure_response = curl_exec($ch);
curl_close($ch);

if($closure_response){
	$file_compression_timeout_error = false;
	$output = $closure_response;
}


/**
 * write cache
 * ---------------------------------------------------------------------------------------------------- */
function create_dir($dir){
	if(!is_dir($dir)){
		mkdir($dir);
		$fp = fopen($dir . 'index.php', 'w+');
		fclose($fp);
	}
}

function create_file($file, $open_type, $content){
	$fp = fopen( $file, $open_type);

	if($fp){
		fwrite($fp, $content);
		fclose($fp);
	}
}


/**
 * prevent warning information
 * if no permission to create directories and files, there wil be no cache
 */
ob_start('kill_data');

create_dir($root_dir . 'combo/');
create_dir($root_dir . 'combo/--' . $files . '--/');

// open file, truncate it to zero length, and then write it;
create_file($root_dir . 'combo/--' . $files . '--/' . $filename, 'w+', $output);
create_file($root_dir . 'combo/--' . $files . '--/latest.' . $combo_type, 'w+', $output);
create_file($root_dir . 'combo/--' . $files . '--/latest-dev.' . $combo_type, 'w+', $dev_output);

ob_end_clean();


if($combo_type == 'js'){
	header('Content-type: application/x-javascript');
}else{
	header('Content-type: text/css');
}

$time_cost = ( microtime(true) - $start_timestamp ) * 1000;

echo '/* runtime compression, cost ' . (int)$time_cost . 'ms */';

if($file_compression_timeout_error){
	echo '/* remote compression failed */';
}

echo $output;

?>
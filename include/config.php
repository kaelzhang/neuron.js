<?php

# FOR INVOCATION BY:
# - ajax-init.php
# - wp-content/.../functions.php

# Prevent users from directly loading this class file
defined('ABSPATH') or die ('Access prohibited, kael.me portfolio');

# configurations for kael.me 

# Kael.me Portfolio Version, this will be the valid web server entry point, enable includes.
define('KM_PORT', '2.0');
define('KM_ENCODING', 'UTF-8');

define('KM_INCLUDE_PATH', ABSPATH . 'include/');

define('KM_FILE_PATH', 'skin/' . get_option('template') . '/' );
define('KM_CONT_PATH', ABSPATH . KM_FILE_PATH . 'cont/');

define( 'KM_JS_PATH', 'lib/' ); 		// js root
define( 'KM_CSS_PATH', KM_FILE_PATH );	// css root

// defined in 'wp-content/themes/<theme-name>/functions.php'
# define('KM_CONT_PATH', ABSPATH . 'skin/<theme-name>/cont/');
# define( 'KM_CSS_PATH', '/skin/<theme-name>/');

# define( 'KM_FILE_SERVER_PATTERN', 'http://i{CDN}.kael.me/' );	// release setting
define( 'KM_FILE_SERVER_PATTERN', '/' );

define( 'KM_FILE_SERVER_DIR', ABSPATH );
# define( 'KM_FILE_SERVER_DIR', dirname(ABSPATH) . '/' );

?>
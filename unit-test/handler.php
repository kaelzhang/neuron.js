<?php

$name = $_GET['mod'];

require('tpl.php');

// name, integration = false, use_simple = false
inc_unit($name, false, true);
// inc_unit($name);

?>
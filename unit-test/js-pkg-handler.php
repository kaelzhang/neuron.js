<?php

$mod = $_GET['mod'];
$root = preg_replace('/\/[^\/]+$/', '', __DIR__) . '/lib/';

$content = file_get_contents($root . $mod . '.js');

$content = preg_replace('/KM.define\(/', 'KM.define("' . $mod . '",', $content );


header('Content-Type: application/x-javascript; charset=utf-8');

echo $content;


?>
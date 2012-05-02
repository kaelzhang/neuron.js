<?php

$page = (int)$_GET['page'];


echo json_encode(array(
	'content' => 'request: page=' . $page . '<br/>calculate: ' . $page * rand()
));



?>
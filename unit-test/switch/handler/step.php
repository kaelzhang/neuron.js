<?php

$start = (int)$_GET['start'];
$amount = (int)$_GET['amount'];
$items = array();


for($i = 0; $i < $amount; $i ++){
    array_push($items, array(
        'index' => $start + $i,
        'list'  => array(1, 2, 3, 4)
    ));
}

// reponse time: 2s
sleep(rand(0, 2));

echo json_encode(array(
    'start' => $start,
    'amount' => $amount,
    'items' => $items
));

?>
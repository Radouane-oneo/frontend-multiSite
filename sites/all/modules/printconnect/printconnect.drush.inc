<?php

function getAndRemoveCacheData($group = false, $key = false) {
    $f = "cache.txt";
    $cacheDataArray = file($f);
    if ($group != false) {
        foreach ($cacheDataArray as $key => $value) {
            $line = explode("|", $value);
            if ($group == $line[0]) {
                unset($cacheDataArray[$key]);
            }
            if (false != $key && $key == $line[1]) {
                unset($cacheDataArray[$key]);
                return;
            }
        }
        $result = array_values($cacheDataArray);
        file_put_contents($f, implode($result));
        chmod($f, 766);
    } else {
        unlink($f);
    }
}

function printconnect_drush_command() {
    $items = array();

    $items['print-clear-cache'] = array(
        'description' => "clear a print cache",
        'arguments' => array(
            'group' => 'clear the all web service belog to the same group',
        ),
        'options' => array(
            'apikey' => 'the print apikey',
            'entity' => 'the web service entity',
        ),
        'callback' => "clearCache",
        'aliases' => array('pcc'),
        'bootstrap' => DRUSH_BOOTSTRAP_DRUSH, // No bootstrap at all.
    );

    return $items;
}

function clearCacheByApiKeyAndEntity($apikey, $entity) {
    $f = "cache.txt";
    $cacheDataArray = file($f);
    foreach ($cacheDataArray as $key => $value) {
        
        if(isset($apikey) && isset($entity) && preg_match("@$apikey@", $value, $koko) && preg_match("@$entity@", $value)){
            unset($cacheDataArray[$key]);
        }
        if(isset($apikey) && preg_match("@$apikey@", $value) && $entity == null ){
            unset($cacheDataArray[$key]);
        }
        if($apikey == null && isset($entity) && preg_match("@$entity@", $value)){
            unset($cacheDataArray[$key]);
        }
    }
    $result = array_values($cacheDataArray);
    file_put_contents($f, implode($result));
    chmod($f, 766);
}

function clearCache($group=null) {
    $apikey = drush_get_option('apikey');
    $entity = drush_get_option('entity');

    if (isset($group)) {

        if ($group == 'all') {
            getAndRemoveCacheData();
        }
        if ($group == 'product') {
            getAndRemoveCacheData('product');
        }
        if ($group == 'price') {
            getAndRemoveCacheData('price');
        }
        if ($group == 'template') {
            getAndRemoveCacheData('template');
        }
        if ($group == 'standard') {
            getAndRemoveCacheData('standard');
        }
    } else {
        clearCacheByApiKeyAndEntity($apikey, $entity);
    }

}
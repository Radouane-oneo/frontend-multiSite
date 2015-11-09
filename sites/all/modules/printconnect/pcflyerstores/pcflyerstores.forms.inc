<?php
function pcflyerstores_picker_form($form, &$form_state, $countryCode = '', $region = '', $callback = FALSE) {  
     if ($callback){
       drupal_add_js(array('callback' => $callback), 'setting');  
     }
    
    $countryCode = $_SESSION["CountryCode"];
    $stores = $_SESSION["stores"];
       
    $form['searchZone']['search'] = array(
        '#type' => 'container',
        '#attributes' => array(
            'class' => array('search','txt_search_postal')),
    );
     
   
       $form['searchZone']['search']['postal'] = array(
        '#type' => 'textfield',
        '#size' => 90,
        '#id' => 'map-selector',
        '#attributes' => array(
            'placeholder' => t("Insérez votre code postal"),
        ),
    );

    $form['searchZone']['search']['BttSearch'] = array(
    '#markup' => '<input style="cursor:pointer;" id="btnsearch" type="button" class="form-submit" value="'.t('Find').'" />',
    );

    $form['selection'] = array(
        '#type' => 'container',
        '#id' => 'result',
        '#attributes' => array('class' => array('selection')),
    );

    
     $form['selection']['results'] = array(
        '#type' => 'fieldset',
        '#title' => t('Select your pickup point'),
        '#attributes' => array('class' => array('results')),
        '#prefix' => '<div id="replace_textfield_div">',
        '#suffix' => '</div>',
    );

    $form['selection']['results']['list'] = array(
        '#theme' => 'item_list',
        '#attributes' => array('id' => 'items_' . $region, 'class' => array('list')),
       
    );

    $form['selection']['results']['storeResultpager'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('storeResultpager'))
    );
    $form['selection']['results']['storeResultpager'] = array(
        '#markup' => '<a class="storeUp" href="#">Up</a><a class="storeDown" href="#">Down</a>',
    );
   $thpo=0;
    foreach ($stores as $store) {
	$store->po=$thpo;
        $item = array();
        $item['summary'] = array(
            '#theme' => 'pcflyerstores_store_summary',
            '#store' => $store,
            '#selectable' => TRUE, 
        );
	$thpo++;
        $form['selection']['results']['list']['#items'][] = drupal_render($item);
    }
    
    list($info) = _pcflyerstores_formitems($countryCode, $region);
  
   $form['info'] = $info;
    
    
    $form['country'] = array(
        '#type' => 'hidden',
        '#value' => $countryCode,
    );

    $form['region'] = array(
        '#type' => 'hidden',
        '#value' => $region,
    );
    
    $form['#id'] = 'pcflyerstores-picker-form';

    return $form;
}

function pcflyerstores_detail_form($form, &$form_state, $storeId) {
    $store = \printconnect\Stores\Factory::Get($storeId);
    $form['info'] = array(
        '#theme' => 'pcflyerstores_store_info',
        '#store' => $store,
    );

    return $form;
}

function pcflyerstores_landingpage_form ($form, &$form_state, $MystoreId = ''){
    $store = \printconnect\Stores\Factory::Get($MystoreId);
    $store->EnsureLoaded();

    drupal_set_title('flyerstore - '.$store->name, PASS_THROUGH);
    $form['info'] = array(
        '#theme' => 'pcflyerstores_landingpage_info',
        '#store' => $store,
    );
    return $form;
}

function pcflyerstores_search_form ($form, &$form_state ){
$countryCode = $_SESSION["CountryCode"];
$stores = $_SESSION["stores"];

$totalStors =0;
foreach ($stores as $store) {
$totalStors++ ;
}
$count = $totalStors; 

$form['searchZone']['search'] = array(
        '#type' => 'container',
        '#attributes' => array(
            'class' => array('search')),
    );

    $form['searchZone']['search']['postal'] = array(
        '#type' => 'textfield',
        '#size' => 50,
        '#id' => 'map-selector',
        '#attributes' => array(
            'placeholder' => t("Insérez votre code postal"),
        ),
    );

    $form['searchZone']['search']['BttSearch'] = array(
       '#markup' => '<input id="btnsearch" type="button" style="cursor:pointer;" class="form-submit" value="'.t('Find').'" />',
    );

    $form['selection'] = array(
        '#type' => 'container',
        '#id' => 'result',
        '#attributes' => array('class' => array('selection')),
    );

    
     $form['selection']['results'] = array(
        '#type' => 'fieldset',
        '#attributes' => array('class' => array('results')),
        '#prefix' => '<div id="replace_textfield_div">',
        '#suffix' => '</div>',
    );
   $t = array();
   $thpo=0;
   
  

    foreach ($stores as $store) {
	$store->po=$thpo;
        $item = array();
        $item['summary'] = array(
            '#theme' => 'pcflyerstores_store_summary',
            '#store' => $store,
            '#selectable' => TRUE,
        );
	$thpo++;
      $t[] = drupal_render($item);
    }
  
    $form['selection']['results']['list'] = array(
        '#theme' => 'item_list',
        '#items' => $t,
        '#attributes' => array('id' => 'items_' . $region, 'class' => array('list')),
       
    );

    $form['selection']['results']['storeResultpager'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('storeResultpager'))
    );
    $form['selection']['results']['storeResultpager'] = array(
        '#markup' => '<a class="storeDown" href="#">Up</a><a class="storeUp" href="#">Down</a>',
    );
    
   




  list($info) = _pcflyerstores_formitems($countryCode, $region);
  
  $form['info'] = $info;

  $form['allstors'] = array(
        '#type' => 'container',
        '#id' => 'allstors',
    );

    $form['allstors']['results'] = array(
        '#type' => 'container',
    );
    $form['allstors']['results']['title'] = array(
       '#type' => 'item',
       '#markup' => '<h1>'.t('Tous Nos FlyerStores').'</h1></br>'.t('Text !'),
    );

      $form['allstors']['results']['cont'] = array(
        '#type' => 'item',
        '#markup' => t('for now').'<div id="number">'.$count.'</div>'.t('flayerstor under your service'),
          
         '#id' => 'count',
    );
    
    
 $form['allstors']['results']['stores'] = array(
        '#type' => 'container',
        '#attributes' => array(
            'class' => array('results_stores')),
    );
   
    
    $itemliste = array();
    foreach ($stores as $store) {
        $exist = false;
        foreach ($itemliste as $key => $tabiteme) {
            foreach ($tabiteme as $value) {
                if ($value['city'] == $store->city) {
                    $exist = true;
                }
                 
            }
        }
        if (!$exist) {
            $itemliste[$store->region][$store->id] = array(
                'city' => $store->city,
                'postalCode' => $store->postalCode,
                'id' => $store->id,
            );
        }
        
    }
    
    //ksort($itemliste);
    uasort($itemliste, 'my_sort_function');

    foreach ($itemliste as $key => $value) {

        $item = array();
        $item['summary'] = array(
            '#theme' => 'pcflyerstores_store_detail',
            '#store' => $value,
            '#selectable' => TRUE,
        );

        $form['allstors']['results']['stores'][$key] = array(
        '#title' => t($key),
        '#prefix' => '<div class="stores-form" id="'.$key.'">',
        '#suffix' => '</div>',
        '#type' => 'item', 
        '#markup'=> drupal_render($item),
        '#attributes' =>array('class' => array('results-form')),
    );
        
    }
 
    $form['#id'] = 'pcflyerstores-search-form';
    return $form;
}

function my_sort_function($a, $b) {
    if ((count($a) == count($b))) {
        return 0;
    }

    return ((count($a) - count($b)) > 0) ? -1 : 1;
}

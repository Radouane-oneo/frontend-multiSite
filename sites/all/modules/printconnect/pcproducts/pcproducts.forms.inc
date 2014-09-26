<?php

use printconnect\Customers\Factory as CustomersFactory;
use printconnect\Products\Factory;
use printconnect\Products\Product;
use printconnect\Products\Products;
use printconnect\Products\Configurations;
use printconnect\Products\Toolbox;
use printconnect\Products\Pricing;
use printconnect\Products\Options;
use printconnect\Products\RelatedProducts;
use printconnect\Products\Templates;
use printconnect\Drupal\Functions;
use printconnect\Shipping;


function pcproducts_products_form($form, &$form_state) {
 $shop = printconnect\Shop\Configuration\Factory::Current();
  $items = array();
  $products = _pcproducts_activeproducts();
  $form['products'] = array(
      '#type' => variable_get('pc_flow', '') == 'printconcept' ? 'fieldset' : 'container',
      '#title' => t('Select a product'),
      '#attributes' => array('class' => array('all-products', 'clearfix')),
  );
  
  $unsetID = array(74,75,76,78,81);
  if($shop->id == 58){
      foreach ($unsetID as $valueunset) {
        foreach ($products as $key => $value) {
            if($valueunset == $value->id ){
                unset($products[$key]);
            }
        }
      }
    }

  foreach ($products as $product) {
    $build = array();
    
    $build['image'] = array(
        '#theme' => 'image',
        '#path' => printconnect_getimage('products', $product->id),
        '#attributes' => array('width' =>'194', 'height' => '187'),
        '#weight' => 10,  
        '#prefix' => '<div class="blocprd"><a href="products/' . $product->id.'">',
    );
    $build['name'] = array(
        '#markup' => $product->name,
        '#prefix' => '<h2>',
        '#suffix' => '</h2></a></div>',
        '#weight' => 20,
    );

    if (variable_get('pc_flow', '') == 'printconcept') {
      $build['image']['#weight'] = -10;
    }
    if (variable_get('pc_flow', '') == 'whitelabel') {
      $build['description'] = array(
          '#type' => 'container',
          '#attributes' => array('class' => array('description')),
          '#weight' => 30,
      );
      $build['description']['text'] = array(
          '#markup' => $product->shortDescription,
      );
    }

    $build['from'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('from')),
        '#weight' => 40,
    );
    $build['from']['text'] = array(
        '#markup' => '<span class="txt">' . t('from_price') . '</span> ' . theme('price', array('value' => $product->sellPrice)),
    );
    $build['order'] = array(
        '#prefix' => '<a class="order btn-cmd" href="products/' . $product->id.'"><span class="flesh"></span>',
        '#suffix' => '</a>',
        '#weight' => 50,
    );
    $build['order']['text'] = array(
        '#markup' => t('Order now'),
    );

   $items[] = drupal_render($build);
  }

  $form['products']['list']['#markup'] = theme('item_list', array('items' => $items, 'attributes' => array('class' => array('clearfix'))));

  
  $form['#cache'] = TRUE;
  return $form;
  
}

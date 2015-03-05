<?php

function printconcept_breadcrumb($vars) {
  $breadcrumb = $vars['breadcrumb'];
  if (!empty($breadcrumb)) {
    $breadcrumb[] = drupal_get_title();
    return '<div class="breadcrumb">' . implode(' > ', $breadcrumb) . '</div>';
  }
}

/*
 * Implements hook_preprocess_html
 */

function printconcept_preprocess_html(&$vars) {
  $args = arg();
  switch ($args[0]) {
    case 'checkout' :
      $vars['classes_array'][] = 'large-sidebar';
      break;
  }

  if (!empty($vars['page']['sidebar'])) {
    $vars['classes_array'][] = 'sidebar';
  }
}

/*
 * Implements hook_preprocess_block
 */

function printconcept_preprocess_block(&$vars) {
  if ($vars['block']->region == 'featured') {
    $vars['classes_array'][] = $vars['block_zebra'];
  }
  if ($vars['block_id'] == 1) {
    $vars['classes_array'][] = 'first';
  }
}

/*
 * Implements hook_preprocess_region
 */
/*
  function printconcept_preprocess_region(&$vars) {
  switch ($vars['region']) {
  case 'highlight':
  $vars['content'] = '<div class="rotator">' . $vars['content'] . '</div>';
  break;
  }
  } */

/*
 * Implements hook_preprocess_page
 */

function printconcept_preprocess_page(&$vars) {

  $args = arg();
  $step = FALSE;
  if ($args[0] == 'cart') {
    $step = 1;
  }
  if ($args[0] == 'checkout') {
    $step = 2;
//    foreach (element_children($vars['page']) as $region) {
//      if ($region == 'content' || $region == 'sidebar' || $region == 'triptych' || $region == 'header' || $region == 'subheader' || $region == 'top' || $region == 'closure') {
//        foreach (element_children($vars['page'][$region]) as $block) {
//     //     if ($block != 'system_main' && $block != 'pccart_cart' && $block != 'pclivecom_smallchat' && $block != 'pcbase_progress' && $block != 'pcpayments_secure' && $block != 'pcdevel_debug') {
//         //   hide($vars['page'][$region][$block]);
//       //   }
//        }
//      }
//    }
  }
  if ($args[0] == 'myprintconcept' && isset($args[1]) && $args[1] == 'orders' && isset($args[3]) && $args[3] == 'confirmation') {
    $step = 3;
  }
  /*
    if ($args[0] == 'ogone') {
    foreach (element_children($vars['page']) as $region) {
    if ($region == 'content' || $region == 'sidebar' || $region == 'triptych' || $region == 'header' || $region == 'subheader' || $region == 'top' || $region == 'closure') {
    foreach (element_children($vars['page'][$region]) as $block) {
    if ($block != 'system_main' && $block != 'pccart_cart' && $block != 'pclivecom_smallchat' && $block != 'pcbase_progress' && $block != 'pcpayments_secure' && $block != 'pcdevel_debug') {
    hide($vars['page'][$region][$block]);
    }
    }
    }
    }
    }
   */
  $progress = '100%';


  if ($step) {

    $vars['page']['content']['#sorted'] = 0;
    /*
      $vars['page']['content']['progress'] = array(
      '#markup' => theme('progress', array('progress' => $progress, 'step' => $step)),
      '#weight' => -1,
      );
     */
    $vars['page']['content']['progress'] = array(
        '#markup' => '<div class="box clearfix" id="printconcept-progress"><ul><li class="first ' . ($step == 1 ? 'selected' : '') . '"><div class="step font">' . t('Cart') . '</div></li><li class="second ' . ($step == 2 ? 'selected' : '') . '"><div class="step font">' . t('Delivery') . '</div></li><li class="third ' . ($step == 3 ? 'selected' : '') . '"><div class="step font">' . t('Done!') . '</div></li></ul><div class="bar"></div></div>',
        '#weight' => -1,
    );
  }
}

/*
 * Implements hook_process_page
 */

function printconcept_process_page(&$vars) {

  $args = arg();
  global $base_url;
  /*
    if ($vars['is_front']) {
    $vars['page']['header']['title'] = array(
    '#markup' => '<h1 class="title">' . $vars['site_name'] . ' ' . $vars['site_slogan'] . '</h1>',
    );
    }
    $vars['page']['top']['clear'] = array(
    '#weight' => 100,
    '#markup' => '<div class="clear"></div>',
    );

   */

//logo

  $logo = $vars['logo'];
  /*
    $shop = \printconcept\Shop\Configuration\Factory::Current();

    $shop->EnsureLoaded();

    $logo = url('file/' . $shop->logoLogin . '/' . variable_get('css_js_query_string', '0'));
    //$logo = 'http://www.s-p-a.be/media/images/samenspa_logo.png';
   */
  $logo = theme('image', array('path' => $logo));
  $logo = l($logo, '<front>', array('html' => TRUE, 'absolute' => true));

  $vars['page']['header']['logo'] = array(
      '#markup' => $logo,
      '#weight' => -100,
  );

  if (isset($vars['by'])) {
    $vars['page']['header']['by'] = array(
        '#markup' => $vars['by'],
    );
  }
}

function printconcept_block_view_locale_language_alter(&$block) {
  unset($block['subject']);
}

function printconcept_html_head_alter(&$vars) {
  $vars['X-UA-Compatible'] = array(
      '#type' => 'html_tag',
      '#tag' => 'meta',
      '#attributes' => array(
          'http-equiv' => 'X-UA-Compatible',
          'content' => 'IE=edge',
      ),
      '#weight' => -10000);

  return $vars;
}

function printconcept_form_pcproducts_productconfig_form_alter(&$form, &$form_state, $form_id) {
  $baseItems = array();
  $productId = $form_state['storage']['productId'];

//  foreach (element_children($form['step1']['configuration']['groups']) as $groupId) {
//    if (isset($form['step1']['configuration']['groups'][$groupId]['#default_value'])) {
//      $baseItems[$groupId] = $form['step1']['configuration']['groups'][$groupId]['#default_value'];
//    }
//  }

  $i = 0;
  foreach (element_children($form['step1']['configuration']['groups']) as $groupId) {
    if ($form['step1']['configuration']['groups'][$groupId]['#type'] == 'select') {

      if (isset($form['step1']['configuration']['groups'][$groupId]['#default_value'])) {
        $baseItems[$groupId] = $form['step1']['configuration']['groups'][$groupId]['#default_value'];
      }
      $items = array();
      foreach (element_children($form['step1']['configuration']['groups'][$groupId]['#options']) as $itemId) {
        $itemItems = $baseItems;
        $itemItems[$groupId] = $itemId;

        //$link = l('link', 'products/' . $productId . '/' . implode(',', $itemItems));
        $build = array(
            'image' => array(
                '#markup' => theme('image', array('path' => _pcproducts_getimage('items', $itemId))),
            ),
            'text' => array(
                '#type' => 'item',
                '#markup' => $form['step1']['configuration']['groups'][$groupId]['#options'][$itemId],
            ),
        );
//      $items[$itemId] = array(
//          'data' => l(drupal_render($build), 'products/' . $productId . '/' . implode(',', $itemItems), array('html' => TRUE)),
//          'id' => $itemId,
//      );
        $items[$itemId] = array(
            'data' => drupal_render($build),
            'id' => $itemId,
        );
      }

      $form['dropdowns'][$groupId] = array(
          '#type' => 'container',
          '#id' => $form['step1']['configuration']['groups'][$groupId]['#id'] . '-dropdown',
          '#attributes' => array('class' => array('dropdown')),
      );
      $form['dropdowns'][$groupId]['fieldset'] = array(
          '#type' => 'fieldset',
          '#title' => $form['step1']['configuration']['groups'][$groupId]['#title'],
          'items' => array(
              '#markup' => theme('item_list', array('items' => $items)),
          ),
          'clearfix' => array(
              '#markup' => '<div class="clearfix"/>',
          ),
      );
      $i++;
    }
  }

  $form['step1']['configuration']['text']['#markup'] = t('Select your options');
  unset($form['step1']['description']['text']);

  $customer = \printconnect\Customers\Factory::Current();
  $product = $form_state['storage']['product'];
  if (module_exists('pcsubtitle')) {
    if ($customer) {
      drupal_set_title_prefix(t('@firstName, you selected', array('@firstName' => $customer->firstName)));
    } else {
      drupal_set_title_prefix(t('You selected'));
    }
    drupal_set_subtitle($product->baseline);
  }
}

function printconcept_form_pcproducts_productoverview_form_alter(&$form, &$form_state, $form_id) {
  $customer = \printconnect\Customers\Factory::Current();
  $product = $form_state['storage']['product'];
  if (module_exists('pcsubtitle')) {
    if ($customer) {
      drupal_set_title_prefix(t('@firstName, you selected', array('@firstName' => $customer->firstName)));
    } else {
      drupal_set_title_prefix(t('You selected'));
    }
    drupal_set_subtitle($product->baseline);
  }
}

function printconcept_form_pccart_cart_form2_alter($form, &$form_state) {
  $customer = \printconnect\Customers\Factory::Current();

  if ($customer && $customer->firstName) {
    drupal_set_title(t('@firstName, do you have everything you need?', array('@firstName' => $customer->firstName)));
  } else {
    drupal_set_title(t('Do you have everything you need?'));
  }
  if (module_exists('pcsubtitle')) {
    drupal_set_subtitle(t('We have some very nice extras for you!'));
  }
}

function printconcept_form_pccheckout_personal_form_alter($form, &$form_state) {
  $customer = $form_state['storage']['customer'];
  if ($customer) {
    if ($customer->firstName != '') {
      drupal_set_title(t('Dear @firstName, please complete your details', array('@firstName' => $customer->firstName)));
    } else {
      drupal_set_title(t('Please complete your details'));
    }
  }
}

function printconcept_form_pccheckout_shipping_form_alter(&$form, &$form_state) {
  $customer = $form_state['storage']['customer'];
  $cart = _pccheckout_cart();
  $form['shipping']['delivery']['postalCode']['#title'] = t('PC and city');
  $form['shipping']['delivery']['city']['#title_display'] = 'invisible';
  if ($customer && $customer->firstName != '') {
    if ($cart && $cart->isPickup) {
      drupal_set_title(t('Dear @firstName, choose your pickup point', array('@firstName' => $customer->firstName)));
    } else {
      drupal_set_title(t('Dear @firstName, choose your delivery address', array('@firstName' => $customer->firstName)));
    }
  }
}

function printconcept_form_pccheckout_payment_form_alter($form, &$form_state) {
  $customer = $form_state['storage']['customer'];
  if ($customer) {
    if ($customer->firstName != '') {
      drupal_set_title(t('Dear @firstName, choose your payment method', array('@firstName' => $customer->firstName)));
    }
  }
}

function printconcept_init() {
  //variable_set('pcproducts_overviewenabled', true);
}
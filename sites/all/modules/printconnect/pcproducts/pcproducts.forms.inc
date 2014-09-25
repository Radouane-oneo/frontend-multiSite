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

function pcproducts_productconfig_form($form, &$form_state, $productId, $items = array(), $options = array(), $qty = FALSE, $edit = FALSE) {
  if (!is_numeric($productId)) {
    drupal_not_found();
    exit;
  }

  $product = Factory::Get($productId);

//  drupal_set_breadcrumb(array(l(t('Home'), NULL), l(t('Products'), 'products'), l($product->name, 'products/' . $product->id)));

  if (isset($form_state['values']['step1']['configuration']['groups'])) {
    $items = array_values($form_state['values']['step1']['configuration']['groups']);
    $items = array();
    foreach (element_children($form_state['values']['step1']['configuration']['groups']) as $key) {
      $items[] = $form_state['values']['step1']['configuration']['groups'][$key]['select'];
    }
  } else {
    if ($items) {
      $items = explode(',', $items);
    } else {
      $items = array();
    }
  }
  if (isset($form_state['values']['step2']['options']['list'])) {
    $options = array();
    foreach ($form_state['values']['step2']['options']['list'] as $key => $value) {
      if ($value) {
        $options[] = $key;
      }
    }
  } else {
    if (!$options) {
      $options = array();
    } else {
      $options = explode(',', $options);
    }
  }

  if (isset($form_state['storage']['quantity'])) {
    $qty = $form_state['storage']['quantity'];
  }

  $form['step1'] = array(
      '#type' => variable_get('pc_flow', '') == 'printconcept' ? 'fieldset' : 'container',
      '#attributes' => array('class' => array('step-1')),
      '#title' => t('Configure your product'),
  );

  $form['step1']['description'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('description')),
  );

  $form['step1']['description']['image'] = array(
      '#markup' => theme('image', array('path' => _pcproducts_getimage('products', $productId))),
  );


  $form['step1']['description']['text'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('text')),
  );

  $form['step1']['description']['text']['short'] = array(
      '#markup' => $product->shortDescription,
  );

  $form['step1']['configuration'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('configuration')),
  );

  $form['step1']['configuration']['text'] = array(
      '#markup' => '',
  );


  $defaults = Configurations\Factory::GetDefaults($productId, $items);
  $priceGroupId = $defaults->priceGroupId;

  $diff = array_diff($defaults->toolboxItems, $items);
  if (count($diff)) {
    $items = $defaults->toolboxItems;
  }
  if (!$qty) {
    $qty = $defaults->quantity;
  }


  $firstConfigId = $items[0];
  $tree = Configurations\Factory::GetTree($productId, $items);

  foreach ($tree->items as $group) {
    //if (count((array) $group->data) > 1) {
    if (count((array) $group->data) > 1 && !$edit) {
      $form['step1']['configuration']['groups'][$group->id]['select'] = array(
          '#type' => 'select',
          '#title' => $group->name,
          '#id' => 'group-' . $group->id,
          '#description' => t('Choose your @item', array('@item' => $group->name)),
          '#ajax' => array(
              'callback' => 'pcproducts_configform_step1_callback',
              'wrapper' => 'pcproducts-productconfig-form',
              'method' => 'replace',
              'effect' => 'none',
              'progress' => array(
                  'message' => NULL,
                  'type' => NULL,
              ),
          )
      );

      //  $form['tree']['#value'][$group->id]['name'] = $group->name;
      $defaultValue = false;
      foreach ($group->data as $item) {
        if ($item->id == $firstConfigId) {
          $firstConfigName = $item->name;
        }

        if (in_array($item->id, $items)) {
          $defaultValue = $item->id;
        }
        $detail = $item->detail;

        $text = $item->name;
        if ($detail) {
          $text .= ' (' . $detail . ')';
        }

        $form['step1']['configuration']['groups'][$group->id]['select']['#options'][$item->id] = $text;
      }
      $form['step1']['configuration']['groups'][$group->id]['select']['#default_value'] = $defaultValue;
    } else {


      $text = '';
      foreach ($group->data as $item) {
        if (in_array($item->id, $items)) {
          $detail = $item->detail;
          $text = $item->name;
          if ($detail) {
            $text .= ' (' . $detail . ')';
          }
          continue;
        }
      }


//      $data = (array) $group->data;
//      $item = array_shift($data);
//
//      $detail = $item->detail;
//
//      $text = $item->name;
//      if ($detail) {
//        $text .= ' (' . $detail . ')';
//      }

      $form['step1']['configuration']['groups']['select'][$group->id] = array(
          '#type' => 'item',
          '#title' => $group->name,
          '#markup' => '<div>' . $text . '</div>',
      );
      if ($item->id == $firstConfigId) {
        $firstConfigName = $item->name;
      }
    }
  }

  $title = $product->name . ' - ' . $firstConfigName;

  drupal_set_title($title);

  $form['step1']['title'] = array(
      '#type' => 'hidden',
      '#value' => $title,
  );


  $ajax = array(
      'callback' => 'pcproducts_configform_step2_callback',
      'wrapper' => 'step2',
      'method' => 'replace',
      'effect' => 'none',
      'progress' => array(
          'message' => NULL,
          'type' => NULL,
      ),
  );

  $form['step1']['clearfix'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('clearfix')),
  );

  $form['step2'] = array(
      '#type' => 'fieldset',
      '#attributes' => array('class' => array('step-2')),
      '#title' => t('Select your amount'),
      '#id' => 'step2',
  );


  $form['step2']['quantity'] = array(
      '#type' => 'tableselect',
      '#multiple' => FALSE,
      '#header' => array(
          'qty' => t('Quantity'),
          'filler' => array('data' => '', 'header' => '', 'class' => array('filler')),
          'priceexcvat' => array('data' => t('Price VAT excl.'), 'class' => array('price')),
          'priceincvat' => array('data' => t('Price VAT incl.'), 'class' => array('price')),
      /*  'priceperpiece' => t('Price per piece') */
      ),
      '#ajax' => $ajax,
      '#required' => TRUE,
      '#attributes' => array('class' => array('grid', 'clearfix')),
//      '#default_value' => $qty,
  );

  $form['step2']['custom_quantity'] = array(
      '#type' => 'textfield',
      '#title' => t('Enter any quantity or select a price above'),
      '#size' => 6,
      '#maxlength' => 6,
      '#default_value' => '',
      '#ajax' => $ajax,
      '#attributes' => array('class' => array('')),
  );


//  if ($form_state['triggering_element']['#name'] == "step2[custom_quantity]") {
//    $form['step2']['quantity']['#default_value'] = 'custom';
//  }
  if (count($options)) {

    $form['step2']['options'] = array(
        '#type' => 'fieldset',
        '#title' => t('Additional finishing'),
        '#collapsible' => TRUE,
        '#collapsed' => TRUE,
        '#attributes' => array('class' => array('options')),
    );

    $form['step2']['options']['list'] = array(
        '#type' => 'checkboxes',
        //'#title' => t('Additional finishing'),
        '#default_value' => $options,
        '#ajax' => $ajax,
        '#attributes' => array('class' => array('clearfix')),
    );
    if (variable_get('pc_flow', '') == 'printconcept') {
      $form['step2']['options']['list']['#type'] = 'tableselect';
      $form['step2']['options']['list']['#js_select'] = FALSE;
      $form['step2']['options']['list']['#multiple'] = TRUE;
      $form['step2']['options']['list']['#header'] = array('name' => '', 'priceexcvat' => '', 'priceincvat' => '');
      $form['step2']['options']['list']['#ajax'] = $ajax;
    }
  }
//  $form['step2']['footer'] = array(
//      '#type' => 'container',
//      '#id' => 'step2-footer',
//      '#attributes' => array('class' => array('footer', 'clearfix')),
//  );
//  $form['step2']['footer']['shipping'] = array(
//      '#type' => 'container',
//      '#attributes' => array('class' => array('dates')),
//  );


  global $user;

  if ($user->uid) {
    $form['step2']['link'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('directlink')),
        'content' => array(
            '#type' => 'item',
            '#title' => t('Direct link'),
            '#markup' => url('products/' . $productId . '/' . implode(',', $items) . '/' . implode(',', $options) . '/' . $qty, array('absolute' => TRUE)),
        ),
    );
  }

  $form['step2']['shipping'] = array(
      '#type' => 'fieldset',
      '#title' => t('Expected delivery'),
      '#attributes' => array('class' => array('shipping')),
  );


  $form['step2']['shipping']['deadline'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('deadline')),
  );

  if (variable_get('pc_flow', '') == 'printconcept') {
    $form['step2']['shipping']['shipping'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('shipping')),
    );
  }

  $form['step2']['shipping']['delivery'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('delivery')),
  );

  $form['step2']['shipping']['tooltip'] = array(
      '#type' => 'fieldset',
      '#collapsible' => true,
      '#collapsed' => true,
      '#title' => t('Supply times'),
      '#attributes' => array('class' => array('deadlines')),
      //'text' => array('#markup' => t('printconnect is fast blabla...')),      
      'table' => array(
          '#theme' => 'table',
          '#rows' => array(),
          '#header' => array(t('Supply before'), t('Expected delivery')),
      ),
      'notice' => array(
          '#type' => 'container',
          '#attributes' => array('class' => array('description')),
          'content' => array(
              '#markup' => t('Depending on your delivery address...'),
          ),
      ),
  );

//       $form['step2']['footer']['shipping']['text'] = array(
//           '#markup' => t('Expected delivery'),
//           '#prefix' => '<h2>',
//           '#suffix' => '</h2>',
//       );

  $form['step2']['templates'] = array(
      '#id' => 'templates',
      '#type' => 'fieldset',
      '#title' => t('How to prepare your printjob'),
      '#attributes' => array('class' => array('templates')),
  );

  $form['step2']['priceblock'] = array(
      '#theme' => 'priceblock',
      '#attributes' => array('id' => 'priceblock'),
  );

  $form['actions'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('form-actions', 'actions', 'clearfix')),
  );



  $form_state['storage']['quantity'] = $qty;
  $form_state['storage']['qty'] = $qty;
  $form_state['storage']['priceGroupId'] = $priceGroupId;
  $form_state['storage']['items'] = $items;
  $form_state['storage']['productId'] = $productId;
  $form_state['storage']['product'] = $product;
  $form_state['storage']['ajax'] = $ajax;
  $form_state['storage']['edit'] = $edit;

  //_pcproduct_productconfig_form_build_step1($form, $form_state, $productId, $items, $qty);
  _pcproduct_productconfig_form_build_step2($form, $form_state, $productId, $items, $qty, $options);

  //$form['#after_build'][] = 'pcproducts_productconfig_form_prerender';
  $form['#id'] = 'pcproducts-productconfig-form';
  $form['#tree'] = TRUE;
  $form['#cache'] = TRUE;

  return $form;
}

function pcproducts_productconfig_form_validate($form, &$form_state) {
  $qty = $form_state['values']['step2']['quantity'];
  if ($qty == 'custom') {
    $qty = $form_state['values']['step2']['custom_quantity'];
  }
  $form_state['storage']['qty'] = $qty;
  $form_state['storage']['quantity'] = $qty;
  $options = array();
  if (isset($form_state['values']['step2']['options']['list'])) {
    foreach ($form_state['values']['step2']['options']['list'] as $key => $value) {
      if ($value) {
        $options[] = $key;
      }
    }
  }
  $form_state['storage']['options'] = $options;
}

function _pcproduct_productconfig_form_build_step2(&$form, &$form_state, $productId, $items, $qty, $options) {
  $subtotal = 0;
  $priceGroupId = $form_state['storage']['priceGroupId'];

  $price = '';
  $pricePerPiece = '';
  $subtotal = 0;
  $customQty = TRUE;

  $base = FALSE;
  $pricings = Pricing\Factory::GetPricings($priceGroupId);
  $i = 0;
  $previous = FALSE;
  $listHasQuantity = FALSE;

  $quantities = array(
      'custom' => array(
          'qty' => '',
          'price' => '',
          'priceperpiece' => '',
          '#attributes' => array('class' => array('custom')),
          '#weight' => 100,
      ),
  );

  $quantities = array();

  foreach ($pricings as $pricing) {
    if (($pricing->quantity > $qty) && !$base) {
      $base = $previous;
    }

    if ($pricing->quantity == $qty) {
      $listHasQuantity = TRUE;
    }

    $pricingQuantity = (string) $pricing->quantity;

    if ($pricing->HasProperty('promoPrice') && $pricing->promoPrice != $pricing->sellPrice) {
      $sellPrice = $pricing->promoPrice;
      $oldPrice = theme('price', array('value' => $pricing->sellPrice, 'attributes' => array('class' => array('old'))));
    } else {
      $oldPrice = '';
      $sellPrice = $pricing->sellPrice;
    }


    $quantities[$pricingQuantity] = array(
        //'qty' => $pricing->quantity,
        'qty' => t('@qty pcs.', array('@qty' => number_format($pricing->quantity, 0, ',', '.'))),
        'oldprice' => $oldPrice,
        'filler' => array('data' => ''),
        'price' => theme('price', array('value' => $sellPrice, 'block' => TRUE)),
        'priceexcvat' => theme('price', array('value' => $sellPrice, 'block' => TRUE)),
        'priceincvat' => theme('price', array('value' => $sellPrice * (1 + $_SESSION['shop_vat']), 'block' => TRUE)),
        'priceperpiece' => theme('price', array('value' => $sellPrice / $pricingQuantity, 'block' => TRUE)),
    );
  }


  if ($listHasQuantity) {
    $defaultValue = $qty;
  } else {
    $defaultValue = 'custom';
  }



  if (isset($form_state['values']['step2']['custom_quantity']) && $form_state['values']['step2']['custom_quantity'] > 0) {
    $customQty = $form_state['values']['step2']['custom_quantity'];
    $price = Pricing\Factory::GetSellPrice($priceGroupId, $customQty);

    $quantities['custom']['#attributes'] = array('class' => array('custom'));
    $quantities['custom']['#weight'] = 100;
    $quantities['custom']['qty'] = t('@qty pcs.', array('@qty' => number_format($customQty, 0, ',', '.')));
    $quantities['custom']['filler'] = array('data' => '');
    $quantities['custom']['price'] = theme('price', array('value' => $price, 'block' => TRUE));
    $quantities['custom']['priceexcvat'] = theme('price', array('value' => $price, 'block' => TRUE));
    $quantities['custom']['priceincvat'] = theme('price', array('value' => $price * (1 + $_SESSION['shop_vat']), 'block' => TRUE));
    $quantities['custom']['priceperpiece'] = theme('price', array('value' => $price / $customQty, 'block' => TRUE));
  } else {
    $customQty = $qty;
  }


  $form['step2']['quantity']['#options'] = $quantities;
  $form['step2']['quantity']['#default_value'] = $defaultValue;
  //$form['step2']['quantity']['#default_value'] = 'custom';
//  foreach ($form['step2']['quantity']['#options'] as $key => $value) {
//    $form['step2']['quantity']['#options'][$key]['#value'] = $form['step2']['quantity']['#default_value'];
//  }

  $rows = array();
  $tablerows = array();

  $availableOptions = Options\Factory::GetOptions($productId, $items);
  $availableOptions = $availableOptions->toKeyedArray();
  foreach ($availableOptions as $optionId => $option) {
    if ($option->active) {
      $price = Options\Factory::GetPrice($option, $qty);
      $rows[$option->id] = $option->name . ' ( + ' . theme('price', array('value' => $price)) . ')';
      $tablerows[$option->id] = array(
          'name' => array('data' => $option->name, 'class' => array('name')),
          'priceexcvat' => array('data' => '+ ' . theme('price', array('value' => $price)), 'class' => array('priceexcvat')),
          'priceincvat' => array('data' => '+ ' . theme('price', array('value' => $price * (1 + $_SESSION['shop_vat']))), 'class' => array('priceincvat')),
      );
      //break;
    }
  }

  if ($form['step2']['options']['list']['#type'] == 'tableselect') {
    $form['step2']['options']['list']['#options'] = $tablerows;
  } else {
    $form['step2']['options']['list']['#options'] = $rows;
  }

  if (!count($rows)) {
    hide($form['step2']['options']);
  }

  $price = Pricing\Factory::GetSellPrice($priceGroupId, $qty);
  $subtotal += $price;

  foreach ($options as $optionId) {
    $option = $availableOptions[$optionId];
    if ($option) {
      $price = Options\Factory::GetPrice($option, $qty);
      $subtotal += $price;
    }
  }

  $shipsIn = FALSE;
  $deliveryDate = FALSE;
  $shipping = printconnect\Products\Shipping\Factory::Get($productId, $items, $options, $qty);

  if (count($shipping->items)) {

    $firstDeadline = $shipping->items[0];

    $deadlineDate = $firstDeadline->deadlineDate;
    if (isset($deadlineDate)) {
      $deadlineDate = strtotime($deadlineDate);
    }
    $shippingDate = $firstDeadline->shippingDate;
    if (isset($shippingDate)) {
      $datetime1 = new DateTime('now');
      $datetime2 = new DateTime($shippingDate);
      $shippingDate = strtotime($shippingDate);
    }
    $deliveryDate = $firstDeadline->deliveryDate;
    if (isset($deliveryDate)) {
      $deliveryDate = strtotime($deliveryDate);
    }

    if (isset($deadlineDate) && isset($shippingDate)) {
      $dt1 = new DateTime(date('Y-m-d', $deadlineDate));
      $dt2 = new DateTime(date('Y-m-d', $shippingDate));
      $shipsIn = $dt1->diff($dt2);
      $shipsIn = $shipsIn->days;
    }

    if ($deliveryDate) {

//      $form['step2']['shipping']['deadline'] = array(
//          '#type' => 'container',
//          '#attributes' => array('class' => array('deadline')),
//      );
//      $form['step2']['footer']['shipping']['deadline']['icon'] = array(
//          '#markup' => theme('image', array('path' => printconnect_getimage('shipping', 'pt_icon_1'))),
//      );

      $form['step2']['shipping']['deadline']['date'] = array(
          '#type' => 'markup',
          '#title' => t('Supply before'),
          '#prefix' => '<label>' . t('Supply before') . '</label>',
          '#markup' => format_date($deadlineDate),
      );

      if (variable_get('pc_flow', '') == 'printconcept') {
        $form['step2']['shipping']['shipping']['date'] = array(
            '#type' => 'markup',
            '#title' => t('Your order is ready for shipment'),
            '#prefix' => '<label>' . t('Your order is ready for shipment') . '</label>',
            '#markup' => format_date($shippingDate, 'short'),
        );
      }

      /*

        $form['step2']['shipping']['shipping'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('shipping')),
        );
       */
//      $form['step2']['footer']['shipping']['shipping']['icon'] = array(
//          '#markup' => theme('image', array('path' => printconnect_getimage('shipping', 'pt_icon_2'))),
//      );
      /*
        $form['step2']['shipping']['shipping']['date'] = array(
        '#type' => 'item',
        '#title' => t('Your order is ready for shipment'),
        '#markup' => format_date($shippingDate, 'short'),
        );
       */
//      $form['step2']['shipping']['delivery'] = array(
//          '#type' => 'container',
//          '#attributes' => array('class' => array('delivery')),
//      );
//
//      $form['step2']['footer']['shipping']['delivery']['icon'] = array(
//          '#markup' => theme('image', array('path' => printconnect_getimage('shipping', 'pt_icon_3'))),
//      );

      $form['step2']['shipping']['delivery']['date'] = array(
          '#type' => 'markup',
          '#title' => t('Expected delivery'),
          '#prefix' => '<label>' . t('Expected delivery') . '</label>',
          '#markup' => format_date($deliveryDate, 'short'),
      );

      $rows = array();
      foreach ($shipping->items as $deadline) {
        $rows[] = array(
            array(
                'class' => array('supply'),
                'data' => format_date(strtotime($deadline->deadlineDate), 'weekdayhour'),
            ),
            array(
                'class' => array('delivery'),
                'data' => format_date(strtotime($deadline->deliveryDate), 'weekday'),
            ),
        );
      }

      $form['step2']['shipping']['tooltip']['table']['#rows'] = $rows;
    }
  }

//  $form['step2']['footer']['priceblock']['table'] = array(
//      '#markup' => theme('priceblock', array('subtotal' => $subtotal)),
//  );

  $form['step2']['priceblock']['#subtotal'] = $subtotal;

  if (count($items)) {
    $templates = Templates\Factory::GetTemplates($productId, $items);
    $templates->EnsureLoaded();

    if (count($templates->items)) {
      $template = $templates->items[0];

      $templates = array();
      $templateImages = $template->templateImages;
      if ($templateImages) {
        foreach ($templateImages as $templateImage) {
          if ($templateImage->type == 'template' /* && $templateImage->language == $language->locale */) {

            $file = $templateImage->file;
            $templates[] = $file;
          }
        }
      }


      if ($template) {
        $form['step2']['templates']['text'] = array(
            '#markup' => t('Finalizing your design? Take into account these requirements:'),
        );

        $rows = array();
//        $rows[] = array('data' => array(theme('image', array('path' => drupal_get_path('module', 'pcproducts') . '/images/typo_check.png')), t('Size'), $template->size), 'no_striping' => TRUE);
//        $rows[] = array('data' => array(theme('image', array('path' => drupal_get_path('module', 'pcproducts') . '/images/typo_check.png')), t('Bleed'), $template->bleed), 'no_striping' => TRUE);
//        $rows[] = array('data' => array(theme('image', array('path' => drupal_get_path('module', 'pcproducts') . '/images/typo_check.png')), t('Color'), $template->colorMode), 'no_striping' => TRUE);
//        $rows[] = array('data' => array(theme('image', array('path' => drupal_get_path('module', 'pcproducts') . '/images/typo_check.png')), t('Resolution'), $template->resolution), 'no_striping' => TRUE);
        $rows[] = array('data' => array('', t('Size'), $template->size), 'no_striping' => TRUE);
        $rows[] = array('data' => array('', t('Bleed'), $template->bleed), 'no_striping' => TRUE);
        $rows[] = array('data' => array('', t('Color'), $template->colorMode), 'no_striping' => TRUE);
        $rows[] = array('data' => array('', t('Resolution'), $template->resolution), 'no_striping' => TRUE);
        $form['step2']['templates']['table'] = array(
            //'#markup' => theme('table', array('rows' => $rows, 'attributes' => array('class' => array('templates-table')))),
            '#theme' => 'table',
            '#rows' => $rows,
            '#attributes' => array('class' => array('templates-table')),
        );

        $form['step2']['templates']['link'] = array(
            '#theme' => 'helplink',
            '#title' => t('Read more'),
        );

//        if (count($templates)) {
//          $form['step2']['footer']['templates']['templates'] = array(
//              '#type' => 'container',
//              '#attributes' => array('class' => array('templates')),
//          );
//          $form['step2']['footer']['templates']['templates']['title'] = array(
//              '#markup' => t('Templates'),
//              '#prefix' => '<h3>',
//              '#suffix' => '</h3>',
//          );
//          $form['step2']['footer']['templates']['templates']['text'] = array(
//              '#markup' => t('Download your templates here'),
//              '#prefix' => '<div style="width:80%; margin-bottom:10px">',
//              '#suffix' => '</div>',
//          );
//          $items = array();
//          foreach ($templates as $template) {
//            $items[] = theme('pcfilesdownloadlink', array('file' => $template, 'content' => t('Download')));
//          }
//
//          $form['step2']['footer']['templates']['templates']['items']['#markup'] = theme('item_list', array('items' => $items));
//        }
      } else {
        hide($form['step2']['templates']);
      }
    }
  }


  $form_state['storage']['subtotal'] = $subtotal;
}

function pcproducts_productconfig_form_prerender(&$form) {
  $form['step2']['quantity']['#options']['custom']['qty'] = drupal_render($form['step2']['custom_quantity']);
  return $form;
}

function pcproducts_configform_step1_callback(&$form, &$form_state) {
  $qty = $form_state['values']['step2']['quantity'];
  $options = array();
  foreach ($form_state['values']['step2']['options']['list'] as $key => $value) {
    if ($value) {
      $options[] = $key;
    }
  }

  $productId = $form_state['storage']['productId'];
  $priceGroupId = $form_state['storage']['priceGroupId'];
  $items = $form_state['storage']['items'];
  //_pcproduct_productconfig_form_build_step1($form, $form_state, $productId, $items, $qty);
  _pcproduct_productconfig_form_build_step2($form, $form_state, $productId, $items, $qty, $options, $priceGroupId);
  return $form;
}

function pcproducts_configform_step2_callback(&$form, &$form_state) {
//  if ($form_state['triggering_element']['#name'] == 'step2[custom_quantity]') {
//    $qty = (int) $form_state['values']['step2']['custom_quantity'];
//  } else
  if ($form_state['values']['step2']['quantity'] == 'custom') {
    $qty = $form_state['values']['step2']['custom_quantity'];
  } else {
    $qty = $form_state['values']['step2']['quantity'];
  }
  $options = array();
  foreach ($form_state['values']['step2']['options']['list'] as $key => $value) {
    if ($value) {
      $options[] = $key;
    }
  }

  $items = $form_state['storage']['items'];
  $productId = $form_state['storage']['productId'];

  $form_state['storage']['options'] = $options;
  $form_state['storage']['quantity'] = $qty;

  _pcproduct_productconfig_form_build_step2($form, $form_state, $productId, $items, $qty, $options);

  drupal_alter('pcproducts_configform_step2_callback', $form, $form_state);

  return $form['step2'];
}

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
        // '#markup' => l($product->name, 'products/' . $product->id, array('html' => true, 'title' => $product->name)),
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
        //'#type' => 'item',
        //'#markup' => l(t('Order now'), 'products/' . $product->id, array('title' => $product->name)),
        '#markup' => t('Order now'),
    );

     $items[] = drupal_render($build);
      /*  $items[] = array(
          'data' => l(drupal_render($build), 'products/' . $product->id, array('html' => true, 'title' => $product->name)),  
              //  'class' => array($class),
      );*/
  }

  $form['products']['list']['#markup'] = theme('item_list', array('items' => $items, 'attributes' => array('class' => array('clearfix'))));

  
  
  return $form;
  
}

function pcproducts_productoverview_form($form, &$form_state, $productId) {
  //global $pcproductsProductId;
  //$productId = array_shift($args);
  //$pcproductsProductId = $productId;


  if (!is_numeric($productId)) {
    drupal_not_found();
    exit;
  }

  $product = Factory::Get($productId);
  $customer = CustomersFactory::Current();

  // drupal_set_title($product->name);

  $typeItems = Configurations\Factory::GetTypeItems($productId);

  drupal_add_html_head_link(array('rel' => 'canonical', 'href' => url('products/' . $productId)), TRUE);

  $form['products'] = array(
      '#type' => variable_get('pc_flow', '') == 'printconcept' ? 'fieldset' : 'container',
      '#title' => t('Select format'),
      '#attributes' => array('class' => array('config-1', 'clearfix')),
  );

  $items = array();
  $i = 0;
  foreach ($typeItems as $typeItem) {
    $build = array();
    $title = $product->name . ' ' . $typeItem->name;

    $build['title'] = array(
        '#prefix' => '<h2>',
        '#suffix' => '</h2>',
        //'#markup' => l($typeItem->name, "products/$productId/$typeItem->id", array('html' => TRUE, 'alt' => $title, 'title' => $title)),
        '#markup' => $typeItem->name,
        '#weight' => 10,
    );


//    $build['image'] = array(
//        '#markup' => theme('image', array('path' => printconnect_getimage('items', $typeItem->id), 'alt' => $title, 'title' => $title)),
//    );

    $build['image'] = array(
        '#theme' => 'image',
        '#path' => printconnect_getimage('items', $typeItem->id),
        '#weight' => 20,
    );

    if (variable_get('pc_flow', '') == 'printconcept') {
      $build['image']['#weight'] = -10;
    }


    if ($typeItem->detail != '') {
      $build['detail'] = array(
          '#prefix' => '(',
          '#suffix' => ')',
          '#markup' => $typeItem->detail,
          '#weight' => 30,
      );
    }

//    $items[] = array(
//        'data' => drupal_render($build),
//            //'class' => array($class),
//    );
//    $items[] = array(
//        'data' => l(drupal_render($build), "products/$productId/$typeItem->id", array('html' => TRUE, 'alt' => $title, 'title' => $title)),
//            //'class' => array($class),
//    );
    $items[] = l(drupal_render($build), "products/$productId/$typeItem->id", array('html' => TRUE, 'alt' => $title, 'title' => $title));
    //'class' => array($class),
  }

  $form['products']['list'] = array(
      '#markup' => theme('item_list', array('items' => $items, 'attributes' => array('class' => array('clearfix')))),
  );

  $form_state['storage']['product'] = $product;

  return $form;
}

function pcproducts_form_pcproducts_productconfig_form_alter(&$form, &$form_state) {
  if (variable_get('pc_flow', '') == 'printconcept') {

    foreach (element_children($form['step1']['configuration']['groups']) as $groupId) {
      $items = array();
      $form['step1']['configuration']['groups'][$groupId]['select']['#attributes']['class'][] = 'item';

      if (isset($form['step1']['configuration']['groups'][$groupId]['select']['#description'])) {
        $description = html_entity_decode($form['step1']['configuration']['groups'][$groupId]['select']['#description']);
        unset($form['step1']['configuration']['groups'][$groupId]['select']['#description']);
      } else {
        $description = '';
      }
      if (isset($form['step1']['configuration']['groups'][$groupId]['select']['#type']) && $form['step1']['configuration']['groups'][$groupId]['select']['#type'] == 'select') {
        // Find the active item
        $activeItem = null;
        if (isset($form_state['values']['step1']['configuration']['groups'][$groupId]['select'])) {
          $activeItem = $form_state['values']['step1']['configuration']['groups'][$groupId]['select'];
        } elseif (array_key_exists('#default_value', $form['step1']['configuration']['groups'][$groupId]['select'])) {
          $activeItem = $form['step1']['configuration']['groups'][$groupId]['select']['#default_value'];
        }


        foreach ($form['step1']['configuration']['groups'][$groupId]['select']['#options'] as $key => $value) {

          $build = array();

          $build['image'] = array(
              '#theme' => 'image',
              '#path' => printconnect_getimage('items', $key),
          );

          $build['name'] = array(
              '#type' => 'container',
              '#attributes' => array('class' => array()),
              'content' => array(
                  '#markup' => $value,
              ),
          );

          $items[$key] = l(drupal_render($build), '', array('fragment' => $key, 'external' => true, 'html' => true, 'attributes' => array('id' => $key)));
        }

        //$form['step1']['configuration']['groups'][$groupId]['select']['#attributes']['style'][] = 'display:none';


        $form['step1']['configuration']['groups'][$groupId]['replacement'] = array(
            '#type' => 'container',
            '#attributes' => array('class' => array('clearfix', 'replacement')),
        );

        $form['step1']['configuration']['groups'][$groupId]['replacement']['control'] = array(
            '#type' => 'item',
            '#title' => $form['step1']['configuration']['groups'][$groupId]['select']['#title'],
            '#attributes' => array('class' => array('clearfix')),
            '#markup' => l($activeItem = $form['step1']['configuration']['groups'][$groupId]['select']['#options'][$activeItem], '', array('fragment' => $key, 'external' => true, 'html' => true, 'attributes' => array('id' => $key, 'class' => array('select')))),
                //   '#markup' => '<div>' . $text . '</div>',
        );

        $form['step1']['configuration']['groups'][$groupId]['replacement']['dropdown'] = array(
            '#type' => 'fieldset',
            '#title' => $description,
            '#attributes' => array('class' => array('dropdown', 'clearfix')),
//          'description' => array(
//              '#type' => 'container',
//              '#attributes' => array('class' => array('description')),
//              'content' => array(
//                  '#markup' => $description,
//              ),
//          ),
            'list' => array(
                '#theme' => 'item_list',
                '#items' => $items,
                '#attributes' => array('class' => array('clearfix')),
            )
        );
      }
    }
  }
}
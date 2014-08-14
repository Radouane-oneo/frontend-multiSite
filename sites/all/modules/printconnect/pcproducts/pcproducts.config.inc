<?php
function reorganiseItems($items, $oldItems, $selectedToolBoxItem){
  $oldItems =  explode("-", $oldItems);
  $newIndex=array_search($selectedToolBoxItem, $items);
  $oldIndex=null;
  foreach($oldItems as $key=>$it) {
      if(array_search($it, $items) === false) {
          $oldIndex=$key;
          break;
      }
  }
  if($oldIndex != null && $newIndex != null) {
    if($newIndex > 1) {
         $oldIndex=1;
     }
      $temp=$items[$newIndex];
      $items[$newIndex]=$items[$oldIndex];
      $items[$oldIndex]=$temp;
  }
  return $items;
}
function reOrderGroup($itemsToOrder , $orderedKeys){
    $result=array();
        foreach($orderedKeys as $key){
            foreach ($itemsToOrder as $item) {
                if(($key==2 || $key==10 || $key==25) && ($item->id===2 || $item->id===10 || $item->id===25) ) {
                    $result[$key]=$item;
                    break;
                }
                if($item->id==$key) {
                    $result[$key]=$item;
                    break;
                }
            }
        }
     return $result;
}
function pcproducts_config_form($form, &$form_state, $productId = 1, $items = '', $options = '', $qty = FALSE, $edit = FALSE) {
    global $language;
  if (!is_numeric($productId)) {
    drupal_not_found();
    exit;
  }

 // $customer = printconnect\Customers\Factory::Current();
//    if ($customer) {
//        $ba = printconnect\Customers\BillingAccounts\Factory::GetBillingAccounts($customer, false);
//        printconnect\Customers\BillingAccounts\Factory::LoadBillingAccounts($ba);
//        $tvaBillingAccount = printconnect\Customers\VatException\Factory::GetVatExceptions($ba[0]->number,FALSE);
//        printconnect\Customers\VatException\Factory::LoadVatExceptions($tvaBillingAccount);
//        if ($tvaBillingAccount[0]->percentage) {
//            $_SESSION['shop_vat'] = $tvaBillingAccount[0]->percentage;
//        }
//    }
//    $cart = printconnect\Carts\Factory::Current();
//    updateTvaCart($cart, $_SESSION['shop_vat']);
//    printconnect\Carts\Factory::Save($cart);
//     variable_set('edit', $edit);
  drupal_set_breadcrumb(array(l(t('Home'), '<front>'), l(t('Products'), 'products')));
  $ajax = array(
      'callback' => 'pcproducts_config_callback',
      'wrapper' => 'pcproducts-config-form',
      'method' => 'replace',
      'effect' => 'fade',
      'progress' => array(
          'message' => NULL,
          'type' => NULL,
      )
  );

  //override with form_state
  if (isset($form_state['values']['product']['select'])) {
    $productId = $form_state['values']['product']['select'];
  }
  if (isset($form_state['values']['items'])) {
    $items = array();
    foreach ($form_state['values']['items'] as $selectedItem) {
      $items[] = $selectedItem['select'];
    }
    
//$items = $form_state['values']['items'];
  } else {
    $items = explode(',', $items);
  }
  if (isset($form_state['values']['quantity'])) {
    $qty = $form_state['values']['quantity'];
    if ($qty == 'custom') {
        $qty= $form_state['values']['custom'];        
    }
  }

  

  $products = \printconnect\Products\Factory::GetAll();
  $productOptions = array();
  $shop = printconnect\Shop\Configuration\Factory::Current();
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
    $productOptions[$product->id] = $product->name;
  }

  $product = \printconnect\Products\Factory::Get($productId);
  drupal_set_title($product->name);
  $form['description'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('description', 'clearfix')),
  );

  $form['description']['image'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('image')),
  );
  
  $form['description']['image']['image'] = array(
      '#theme' => 'image',
      '#path' => _pcproducts_getimage('products', $productId),
  );
  $form['description']['image']['name'] = array(
      '#prefix' => '<h3>',
      '#suffix' => '</h3>',
      '#markup' => $product->name,
  );
  $form['description']['text'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('text'))
  );  
  
  $form['description']['text']['short'] = array(
      '#markup' => $product->shortDescription,
  );
  $form['description']['text']['long'] = array(
      '#markup' => html_entity_decode($product->longDescription),
  );
   
    global $language;
    $lg = $language->prefix;
    switch ($lg) {
        case 'befr':
        case 'frfr':
	case 'lufr':
            $prefix = 'fr';
            break;
        case 'benl':
        case 'nlnl':
	case 'lunl':
            $prefix = 'nl';
            break;
        case 'en':
            $prefix = 'en';
            break;

        default:
            break;
    }
    
  $bannerUrl = variable_get('pc_images') . '/productpage_banners/banner_'.$prefix.'_'.$productId.'.jpg';
  $bannerUrl2 = variable_get('pc_images') . '/productpage_banners/banner_'.$prefix.'_'.$productId.'.png';

  if (getimagesize($bannerUrl) != FALSE || getimagesize($bannerUrl2) != FALSE){
    $bannerUrl = (getimagesize($bannerUrl)) ? $bannerUrl : $bannerUrl2;
    $form['description']['banner'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('banner')),
    );

    $form['description']['banner']['image'] = array(
        '#theme' => 'image',
        '#path' => $bannerUrl,
    );
  }

  $form['product']['select'] = array(
      '#type' => 'select',
      '#title' => t('Product'),
      '#options' => $productOptions,
      '#default_value' => $productId,
      '#ajax' => $ajax,
      '#description' => t('Select a product'),
  );

  $oldValues=$form_state['values']["slectedvalue"];
  $selectedToolBoxItem =$form_state['values']["selectedToolBoxItem"];
  $currentItems = $newItems = $items;
  
  $defaults = \printconnect\Products\Configurations\Factory::GetDefaults($productId, $items);
  $priceGroupId = $defaults->priceGroupId;
  $diff = array_diff($defaults->toolboxItems, $items);
  if(count($diff) == 1){
      foreach($diff as $k=>$v){
         $newItems[] = $diff[$k];
      }
  
      $newItems = array_filter($newItems);
  }
  if (count($diff)) {
    $items =  reorganiseItems($defaults->toolboxItems, $oldValues ,$selectedToolBoxItem);

  }
  if(count($diff) > 1){
      $newItems = $items;
  }
  if (!$qty) {
    $qty = $defaults->quantity;
  }
 $oldValueSelected=array();
 $tree = \printconnect\Products\Configurations\Factory::GetTree($productId, $newItems);
 

 $idsGroups = $form_state['storage']['idsGroups'];
 $groups = $tree->items;
 if($idsGroups != null) {
    $groups = reOrderGroup($tree->items,$idsGroups);
 }

 //$newItems  = array();
 $idsGroups = array();
 foreach ($groups as $key=>$group) {
    $idsGroups[$key] = $group->id;

    if (count((array) $group->data) > 1) {
      $form['items'][$group->id]['select'] = array(
          '#type' => 'select',
          '#title' => $group->name,
          '#id' => 'group-' . $group->id,
          '#ajax' => $ajax,
      );

      $defaultValue = false;
      $fistElement = current($group->data);
      $newItems[$group->id] = $fistElement->id;
      foreach ($group->data as $item) {
        if (in_array($item->id, $newItems)) {
          $defaultValue = $item->id;
        }
        if(in_array($item->id, $currentItems)) {
          $newItems[$group->id] = $item->id;
        }
        $detail = $item->detail;
        $text = $item->name;
        if ($detail) {
          $text .= ' |' . $detail . '|';
        }

        $form['items'][$group->id]['select']['#options'][$item->id] = $text;
      }
      $form['items'][$group->id]['select']['#default_value'] = $defaultValue;
      $oldValueSelected[] = $defaultValue;
    } else {
      $text = '';
      $fistElement = current($group->data);
      $newItems[$group->id] = $fistElement->id;
      foreach ($group->data as $item) {
        if(in_array($item->id, $currentItems)) {
          $newItems[$group->id] = $item->id;
        }
        if (in_array($item->id, $items)) {
          $detail = $item->detail;
          $text = $item->name;
          if ($detail) {
          }
          continue;
        }
      }

      $form['items'][$group->id]['select'] = array(
          '#type' => 'item',
          '#title' => $group->name,
          '#markup' => '<div class="text">' . $text . '</div>',
      );

    }

    $form['items'][$group->id]['select']['#description'] = t('description on toolbox ' . $group->id);
  }

  $defaults = \printconnect\Products\Configurations\Factory::GetDefaults($productId, $newItems);
  $priceGroupId = $defaults->priceGroupId;
  $allOptions = \printconnect\Products\Options\Factory::GetOptions($productId, $newItems);
  $allOptions = $allOptions->toKeyedArray();
  $availableOptions = array();
  $availableOptionsIds = array();
  foreach ($allOptions as $optionId => $option) {
      $availableOptionsIds[]=$option->id;
    if ($option->active) {
      $price = \printconnect\Products\Options\Factory::GetPrice($option, $qty);
      $availableOptions[$option->id] = $option->name . ' ( + ' . theme('price', array('value' => $price)) . ')';
    }
  }
if (isset($form_state['values']['options'])) {
    $options = array();
    foreach ($form_state['values']['options'] as $key => $value) {
      if ($value) {
        $options[] = $key;
      }
    }
  } else {
    if (!empty($options)) {
      $options = explode(',', $options);
    } else {
      $options = array();
    }
  }
  $optionsPrice = 0;
  foreach ($options as $optionId) {
      $isExist = false;
      foreach ($availableOptionsIds as $singleOption) {
          if ($singleOption ==  $optionId)
              $isExist = true;
      }
      
      if ($isExist) {
            $option = $allOptions[$optionId];
            $price = \printconnect\Products\Options\Factory::GetPrice($option, $qty);
            $optionsPrice += $price;
      }
  }

  if (count($availableOptions)) {
    $form['options'] = array(
        '#type' => 'checkboxes',
        '#title' => t('Options'),
        '#options' => $availableOptions,
        '#default_value' => $options,
        '#attributes' => array('class' => array('clearfix')),
        '#ajax' => $ajax,
    );
    $form['options']['default'] = array(
        '#type' => 'container',
        '#id' => 'default-options-text',
        '#attributes' => array('style' => array('display: none;')),
    );
    $form['options']['default']['text'] = array(
        '#markup' => t('No options selected'),
    );
  }

  $price = '';
  $pricePerPiece = '';
  $subtotal = 0;
  $customQty = TRUE;
  $base = FALSE;
  $pricings = \printconnect\Products\Pricing\Factory::GetPricings($priceGroupId);
  $i = 0;
  $previous = FALSE;
  $listHasQuantity = FALSE;
  $quantities = array(
      'custom' => array(
          'qty' => '',
          'oldprice' => '',
          'price' => '',
          'priceperpiece' => '',
          'priceinclvat' => '',
          '#attributes' => array('class' => array('custom')),
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
      $price = theme('price', array('value' => $sellPrice, 'attributes' => array('class' => array('promo'))));
    } else {
      $oldPrice = '';
      $sellPrice = $pricing->sellPrice;
      $price = theme('price', array('value' => $sellPrice));
    }

    $quantities[$pricingQuantity] = array(
        'qty' => t('@qty pcs.', array('@qty' => number_format($pricing->quantity, 0, ',', '.'))),
        'oldprice' => $oldPrice,
        'price' => $price,
        'priceperpiece' => theme('price', array('value' => $sellPrice / $pricingQuantity)),
        'priceinclvat' => theme('price', array('value' => $sellPrice * (1 + $_SESSION['shop_vat']))),
    );
  }

  $quantities['custom'] = array(
      'qty' => '',
      'oldprice' => '',
      'price' => '',
      'priceperpiece' => '',
      'priceinclvat' => '',
      '#attributes' => array('class' => array('custom')),
  );

  $customQty = FALSE;
  if (isset($form_state['values']['custom'])) {
    if (is_numeric($form_state['values']['custom'])) {
      $customQty = $form_state['values']['custom'];
      $price = \printconnect\Products\Pricing\Factory::GetSellPrice($priceGroupId, $customQty);
      $quantities['custom'] = array(
          'qty' => t('@qty pcs.', array('@qty' => number_format($customQty, 0, ',', '.'))),
          'price' => theme('price', array('value' => $price)),
          'priceperpiece' => theme('price', array('value' => $price / $customQty)),
          'priceinclvat' => theme('price', array('value' => $price * (1 + $_SESSION['shop_vat']))),
          'oldprice' => '',
      );
    }
  } elseif (!$listHasQuantity) {
    $customQty = $qty;
    $price = \printconnect\Products\Pricing\Factory::GetSellPrice($priceGroupId, $customQty);
    $quantities['custom'] = array(
        'qty' => t('@qty pcs.', array('@qty' => number_format($customQty, 0, ',', '.'))),
        'price' => theme('price', array('value' => $price)),
        'priceperpiece' => theme('price', array('value' => $price / $customQty)),
        'priceinclvat' => theme('price', array('value' => $price * (1 + $_SESSION['shop_vat']))),
        'oldprice' => '',
    );
  }

  if ($listHasQuantity) {
    $defaultValue = $qty;
  } else {
    $defaultValue = 'custom';
  }
  
if($productId == 88){
    unset($quantities['custom']);
}

  $form['quantity'] = array(
      '#type' => 'tableselect',
      '#multiple' => FALSE,
      '#header' => array('qty' => t('Quantity'), 'oldprice' => '', 'price' => t('Price VAT excl.'), 'priceinclvat' => t('Price VAT incl.')),
      '#required' => FALSE,
      '#attributes' => array('class' => array('grid', 'clearfix')),
      '#options' => $quantities,
      '#default_value' => $defaultValue,
      '#ajax' => $ajax,
      '#sticky' => FALSE,
  );
if($productId != 88){

     $form['custom'] = array(
      '#type' => 'textfield',
      '#title'=>  t('Enter your amount'),
      );
     
    $form['calculer'] = array(
       '#type' => 'button',
       '#value' => t('Calculer'),
       '#ajax' => $ajax,
    );
}

  if (!$listHasQuantity) {
    $form['custom']['#default_value'] = $qty;
  }

  $form['actions'] = array('#type' => 'container', '#attributes' => array('class' => array('actions', 'form-actions')));
  if ($qty == 'custom') {
    $qty = $customQty;
  }

  if (is_numeric($qty)) {
    $price = \printconnect\Products\Pricing\Factory::GetSellPrice($priceGroupId, $qty);
  } else {
    $price = 0;
  }
  $subtotal += $price;
  $subtotal += $optionsPrice;
  $total = $subtotal * (1 + $_SESSION['shop_vat']);
  $form['actions']['price'] = array(
      '#id' => 'price',
      '#theme' => 'price',
      '#value' => $subtotal,
      '#attributes' => array('id' => 'price'),
      '#title' => t('Total excl. VAT'),
  );

  $shipsIn = FALSE;
  $deliveryDate = FALSE;
  $shipping = \printconnect\Products\Shipping\Factory::Get($productId, $items, $options, $qty);
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
      $form['shipping'] = array(
          '#type' => 'fieldset',
          '#attributes' => array('class' => array('shipping')),
          '#title' => t('Expected delivery'),
      );
      $form['shipping']['deadline'] = array(
          '#type' => 'container',
          '#attributes' => array('class' => array('deadline')),
      );
      $form['shipping']['deadline']['date'] = array(
          '#type' => 'item',
          '#title' => t('Supply before @time', array('@time' => format_date($deadlineDate, 'custom', 'H:i'))),
          '#markup' => '<span class="day">' . format_date($deadlineDate, 'weekday') . '</span><span class="date">' . format_date($deadlineDate, 'custom', 'd/m') . '</span>',
      );
      $form['shipping']['delivery'] = array(
          '#type' => 'container',
          '#attributes' => array('class' => array('delivery')),
      );

      $form['shipping']['delivery']['date'] = array(
          '#type' => 'item',
          '#title' => t('Expected delivery'),
          '#markup' => '<span class="day">' . format_date($deliveryDate, 'weekday') . '</span><span class="date">' . format_date($deliveryDate, 'custom', 'd/m') . '</span>',
      );
    }
  }

  $rows = array();
  foreach ($shipping->items as $deadline) {
    $rows[] = array(
        array(
            'class' => array('supply'),
            'data' => \printconnect\Drupal\Functions::FormatDate(strtotime($deadline->deadlineDate), 'weekdayhour'),
        ),
        array(
            'class' => array('delivery'),
            'data' => format_date(strtotime($deadline->deliveryDate), 'weekday'),
        ),
    );
  }
  $form['shipping']['deadlines']['tooltip']['content'] = array(
      '#type' => 'fieldset',
      '#collapsible' => true,
      '#collapsed' => true,
      '#title' => t('Supply times'),
      '#attributes' => array('class' => array('deadlines')),
      '#id' => 'deadlinestooltip',
      'table' => array(
          '#theme' => 'table',
          '#rows' => $rows,
          '#header' => array(t('Supply before'), t('Expected delivery')),
      ),
      'notice' => array('#markup' => t('Depending on your delivery address...')),
  );

  if (count($newItems)) {
    $templates = \printconnect\Products\Templates\Factory::GetTemplates($productId, $newItems);
    $templates->EnsureLoaded();
    if (count($templates->items)) {
      $template = $templates->items[0];
      $templates = array();
      $file = FALSE;
      $templateImages = $template->templateImages;
      if ($templateImages) {
        foreach ($templateImages as $templateImage) {
          if ($templateImage->type == 'template' && $templateImage->language == $language->code) {
            $file = $templateImage->file;
            $templates[] = $file;
          }
        }
      }
      if ($template) {
        $form['templates'] = array(
            '#id' => 'templates',
            '#type' => 'fieldset',
            '#title' => t('Design documents'),
            '#attributes' => array('class' => array('templates')),
        );
        $form['templates']['text'] = array(
            '#type' => 'container',
            '#attributes' => array('class' => array('text')),
            'content' => array(
                '#markup' => t('Finalizing your design? Take into account these requirements:'),
            ),
        );

        switch (true) {
          case $template->thumbnail && $file:
            $form['templates']['image'] = array(
                '#type' => 'container',
                '#attributes' => array(
                    'class' => array('image'),
                ),
                'content' => array(
                    '#theme' => 'pcfilesdownloadlink',
                    '#file' => $file,
                    '#content' => array(
                        '#theme' => 'pcfilesimage',
                        '#file' => $template->thumbnail,
                    ),
                ),
            );
            break;
          case (!$template->thumbnail && $file):
            $form['templates']['image'] = array(
                '#type' => 'container',
                '#attributes' => array('class' => array('image', 'edit-description-image'), 'id' =>'pcproducts-config-formImage2'),
            );
            $templateitems[] = theme('pcfilesdownloadlink', array('file' => $file));
            $form['templates']['image']['items']['#markup'] = theme('item_list', array('items' => $templateitems));
            $form['templates']['image']['image'] = array(
                '#theme' => 'image',
                '#path' => _pcproducts_getimage('products', $productId),
                
            );
            $form['templates']['image']['name'] = array(
               '#prefix' => '<h3>',
               '#suffix' => '</h3>',
               '#markup' => $product->name,
            );
            break;
          case $template->thumbnail && !$file:
            $form['templates']['image'] = array(
                '#type' => 'container',
                '#attributes' => array(
                    'class' => array('image'),
                ),
                'content' => array(
                    '#theme' => 'pcfilesimage',
                    '#file' => $template->thumbnail,
                ),
            );
            break;
           case !$template->thumbnail && !$file:
            $form['templates']['image'] = array(
                '#type' => 'container',
                '#attributes' => array('class' => array('image', 'edit-description-image'), 'id' =>'pcproducts-config-formImage2'),
            );
            
            $form['templates']['image']['items']['#markup'] = theme('item_list', array());
            $form['templates']['image']['image'] = array(
                '#theme' => 'image',
                '#path' => _pcproducts_getimage('products', $productId),
                
            );
            $form['templates']['image']['name'] = array(
               '#prefix' => '<h3>',
               '#suffix' => '</h3>',
               '#markup' => $product->name,
            );
            break;
        }
        $form['templates']['desciption'] = array(
            '#type' => 'container',
            '#attributes' => array('class' => array('description')),
        );
        $form['templates']['desciption']['name'] = array(
            '#type' => 'container',
            '#attributes' => array('class' => array('name')),
            'content' => array(
                '#markup' => t('Size') . ' : ' . $template->size,
            ),
            '#title' => t('Size'),
        );
        $form['templates']['desciption']['size'] = array(
            '#type' => 'item',
            '#markup' => $template->size,
            '#title' => t('Size') . ' : ',
        );
        $form['templates']['desciption']['bleed'] = array(
            '#type' => 'item',
            '#markup' => $template->bleed,
            '#title' => t('Bleed') . ' : ',
        );
        $form['templates']['desciption']['color'] = array(
            '#type' => 'item',
            '#markup' => $template->colorMode,
            '#title' => t('Color') . ' : ',
        );
        $form['templates']['desciption']['resolution'] = array(
            '#type' => 'item',
            '#markup' => $template->resolution,
            '#title' => t('Resolution') . ' : ',
        );
        $form['templates']['linkToDownload'] = array(
            '#type' => 'container',
            '#attributes' => array('class' => array('link')),
        );
        $form['templates']['linkToDownload']['link'] = array(
                '#type' => 'item',
                'content' => array(
                    '#theme' => 'pcfilesdownloadlink',
                    '#file' => $file,
                    '#content' => array(
                        '#markup'=> t('Download all design document')
                    ),
                ),
            );
      }
    }
  }

  global $user;
  if ($user->uid) {
    $form['link'] = array(
        '#type' => 'item',
        '#title' => t('Direct link'),
        '#markup' => url('products/' . $productId . '/' . implode(',', $newItems) . '/' . implode(',', $options) . '/' . $qty, array('absolute' => TRUE)),
    );
  }
    $form['slectedvalue']=array(
        '#type'=>'hidden',
        "#id"=>'slectedvalue',
        '#value'=>  implode("-", $oldValueSelected)
    );
      $form['selectedToolBoxItem']=array(
        '#type'=>'hidden',
        "#id"=>'selectedToolBoxItem',
    );
  $form['#id'] = 'pcproducts-config-form';
  $form['#tree'] = TRUE;
  $form['#cache'] = TRUE;
  $form['#pre_render'] = array('pcproduct_config_form_pre_render');
  $form_state['#cache'] = TRUE;
  $form_state['storage']['priceGroupId'] = $priceGroupId;
  $form_state['storage']['qty'] = $qty;
  $form_state['storage']['quantity'] = $qty;
  $form_state['storage']['productId'] = $productId;
  $form_state['storage']['items'] = $newItems;
  $form_state['storage']['options'] = $options;
  $form_state['storage']['edit'] = $edit;
  $form_state['storage']['idsGroups']=  $idsGroups;
  return $form;
}

function pcproducts_config_callback(&$form, &$form_state) {
  return $form;
}

function pcproducts_config_price_callback(&$form, &$form_state) {
  $qty = $form_state['values']['quantity'];
  $priceGroupId = $form_state['storage']['priceGroupId'];
  $price = \printconnect\Products\Pricing\Factory::GetSellPrice($priceGroupId, $qty);
  $subtotal = $price;
  $form['priceblock'] = array(
      '#markup' => theme('priceblock', array('subtotal' => $subtotal, 'attributes' => array('id' => 'priceblock'))),
  );
  $total = $subtotal * (1 + $_SESSION['shop_vat']);
  $form['price']['#value'] = $subtotal;
  return $form['price'];
}

function pcproducts_form_pcproducts_config_form_alter(&$form, &$form_state) {
  $edit = variable_get('edit');
  if ($form['product']['select']['#type'] == 'select') {
    $products = \printconnect\Products\Factory::GetAll();
    $primaryItem = current($form['items']);
    $currentPrimaryItem = $primaryItem['select']['#default_value'];
    $config = $primaryItem['select']['#title'] . ': ' . $primaryItem['select']['#options'][$currentPrimaryItem];
    $items = array();
      $shop = printconnect\Shop\Configuration\Factory::Current();
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
      $build = array(
          'image' => array(
              '#theme' => 'image',
              '#path' => _pcproducts_getimage('products', $product->id)
          ),
          'text' => array(
              '#type' => 'container',
              '#attributes' => array('class' => array('text')),
              'content' => array(
                  '#markup' => $product->name,
              ),
          )
      );
    if ($edit) {
        $var = explode('/',$_GET['q']);
        unset($var[0],$var[1]);
        $items[$product->id] = l(drupal_render($build), 'products/' . $product->id.'/'. implode('/', $var), array('html' => true));
    } else {
        $items[$product->id] = l(drupal_render($build), 'products/' . $product->id, array('html' => true));
    }
    }

    $description = $form['product']['select']['#description'];
    unset($form['product']['select']['#description']);
    $form['product']['dropdown'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('dropdown', 'products', 'clearfix')),
        'description' => array(
            '#type' => 'container',
            '#attributes' => array('class' => array('description')),
            'content' => array(
                '#markup' => $description,
            ),
        ),
        'list' => array(
            '#theme' => 'item_list',
            '#items' => $items,
        )
    );
  }

  foreach (element_children($form['items']) as $groupId) {
    $items = array();
    $form['items'][$groupId]['select']['#attributes']['class'][] = 'item';
    $description = $form['items'][$groupId]['select']['#description'];
    unset($form['items'][$groupId]['select']['#description']);
    if ($form['items'][$groupId]['select']['#type'] == 'select') {
      $activeItem = null;
      if (array_key_exists('#default_value', $form['items'][$groupId]['select'])) {
        $activeItem = $form['items'][$groupId]['select']['#default_value'];
      }

      foreach ($form['items'][$groupId]['select']['#options'] as $key => $value) {
        preg_match('/\|(.*)\|/', $value, $matches);

        if ($matches) {
          $detail = $matches[0];
          $value = str_replace($detail, '', $value);
          $detail = str_replace('|', '', $detail);
          $form['items'][$groupId]['select']['#options'][$key] = $value;
        } else {
          $detail = FALSE;
        }

        $build = array(
            'image' => array(
                '#theme' => 'image',
                '#path' => _pcproducts_getimage('items', $key)
            ),
            'text' => array(
                '#type' => 'container',
                '#attributes' => array('class' => array('text')),
                'content' => array(
                    '#markup' => $value,
                ),
            ),
        );

        if ($detail) {
          $build['detail'] = array(
              '#type' => 'container',
              '#attributes' => array('class' => array('detail')),
              'content' => array(
                  '#markup' => $detail,
              ),
          );
        }
        $items[$key] = l(drupal_render($build), '', array('fragment' => '', 'external' => true, 'html' => true, 'attributes' => array('id' => $key)));
      }

      $form['items'][$groupId]['dropdown'] = array(
          '#type' => 'container',
          '#attributes' => array('class' => array('dropdown', 'clearfix')),
          'description' => array(
              '#type' => 'container',
              '#attributes' => array('class' => array('description')),
              'content' => array(
                  '#markup' => $description,
              ),
          ),
          'list' => array(
              '#theme' => 'item_list',
              '#items' => $items,
          )
      );
    }
  }
}

function pcproduct_config_form_pre_render($form) {
  $form['quantity']['#options']['custom']['qty'] = drupal_render($form['custom']);
  return $form;
}
function updateTvaCart(\printconnect\Object $cart,$tva) {
    
    foreach($cart->orderItems as $orderItem){
        $orderItem->vat = $tva;
        $orderItem->priceIncVAT = $orderItem->price * (1 + $tva);
    }
    $cart->orderItemShipping->vat = $tva;
    $cart->vat = $tva;
    $cart->convertedVatAmount = $cart->convertedSubTotalAmount * $tva;
    $cart->vatAmount = $cart->convertedVatAmount;
    $cart->convertedTotalAmount = $cart->convertedSubTotalAmount * (1 + $tva);
    $cart->totalAmount = $cart->convertedTotalAmount;
    $cart->codAmount = $cart->totalAmount;
    $cart->convertedCodAmount = $cart->convertedTotalAmount;
}

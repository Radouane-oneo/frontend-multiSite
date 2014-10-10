<?php

use printconnect\Templates\Factory;
use printconnect\Products;
use printconnect\Products\Configurations;
use printconnect\Products\Pricing;
use printconnect\Products\Shipping;
use printconnect\Carts;
use printconnect\Drupal\Functions;
use printconnect\Files;

function pctemplates_config_form($form, &$form_state, $productId, $templateId) {
  global $language;
  if (isset($language->code)) {
    $languageCode = $language->code;
  } else {
    $languageCode = 'en_US';
  }
  try {
    $template = Factory::Get($templateId);
    $template->EnsureLoaded();
  } catch (\Exception $ex) {
    drupal_not_found();
    exit;
  }
  if (!$template->active) {
    drupal_not_found();
    exit;
  }

  $dtTemplate = printconnect\DesignTool\Templates\Factory::Get($template->designToolTemplateId);
  $dtTemplate->EnsureLoaded();
  $dimension = $template->Dimension;
  $product = Products\Factory::Get($productId);
  drupal_set_title(t('Step') . '2 : ' . t('configure your') . ' ' . strtolower($product->name));
  $form['details'] = array(
      '#type' => 'container',
  );

  $form['details']['pages'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('pages')),
  );

  $pages = 0;
  $thumbnails = array();
  foreach ($dtTemplate->thumbnails as $thumbnail) {
    if (!$thumbnails[$thumbnail->page]) {
      $thumbnails[$thumbnail->page] = $thumbnail;
    }
    if ($languageCode == $thumbnail->language) {
      $thumbnails[$thumbnail->page] = $thumbnail;
    }
  }

  foreach ($thumbnails as $page => $thumbnail) {
    $page = $thumbnail->page;
    if ($page == 1) {
      $title = t('Outside');
    } else {
      $title = t('Inside');
    }
    $thumbnail = Files\Factory::Get($thumbnail->fileId);
    $thumbnail->EnsureLoaded();
    $form['details']['pages'][$page] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('page')),
        'title' => array(
            '#markup' => '<h4>' . $title . '</h4>',
        ), 
        'image' => array('#markup' => l(theme('image', array('path' => $thumbnail->serverUrl)), current_path(), array('html' => true, 'fragment' => 'startdesign'))),
    );
    $pages++;
  }

  if ($pages == 0) {
    $thumbnail = Files\Factory::Get($template->designTemplates->thumbnail->file);
    $thumbnail->EnsureLoaded();
    $form['details']['pages']['thumbnail'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('page')),
        'title' => array(
            '#markup' => '<h4>' . t('Thumbnail') . '</h4>',
        ),
        'image' => array(
            '#markup' => theme('image', array('path' => $thumbnail->url)),
        ),
    );
  }
  $form['details']['description'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('description')),
  );

  $form['details']['description']['details']['header'] = array(
      '#markup' => '<h4 class="details">' . t('Details') . '</h4>',
  );

  $form['details']['description']['details']['name'] = array(
      '#type' => 'item',
      '#title' => t('Name'),
      '#markup' => $template->designTemplates->name,
  );
  $form['details']['description']['details']['designer'] = array(
      '#type' => 'item',
      '#title' => t('Designer'),
      '#markup' => 'printconnect.com',
  );

  foreach ($template->filters as $filter) {
    if ($filter->id > 0) {
      $items = array();
      foreach ($filter->items as $item) {
        $items[] = l($item->name, _pctemplates_link($productId), array('query' => array($filter->id => $item->id), 'attributes' => array('rel' => 'nofollow')));
      }

      $form['details']['description']['details']['filter'][$filter->id] = array(
          '#type' => 'item',
          '#title' => ucfirst($filter->name),
          '#markup' => '<div>' . implode(', ', $items) . '</div>',
      );
    }
  }

  $form['details']['description']['dimension']['header'] = array(
      '#markup' => '<h4 class="dimension">' . t('Dimension') . '</h4>',
  );

  $form['details']['description']['dimension']['name'] = array(
      '#type' => 'item',
      '#markup' => $dimension->name,
  );

  if (isset($_SESSION['pctemplates'][$productId])) {
    $query = $_SESSION['pctemplates'][$productId];
  } else {
    $query = array();
  }

  $form['back'] = array(
      '#type' => 'item',
      '#markup' => l(t('Back to overview'), _pctemplates_link(($productId)), array('query' => $query, 'attributes' => array('rel' => 'nofollow'))),
  );

  return $form;
}

function pctemplates_configblock_form($form, &$form_state, $productId, $templateId) {

  module_invoke('pcsubtitle', 'set', array('subtitle' => t('Looking for the best designs? Try one of our FREE templates!')));
  $qty = FALSE;
  $items = array();
  try {
    $template = Factory::Get($templateId);
    $template->EnsureLoaded();
  } catch (\Exception $ex) {
    return;
  }
  $items[] = $template->Dimension->id;
  $product = Products\Factory::Get($productId);
  if (isset($form_state['values']['configuration']['groups'])) {
    $groups = $form_state['values']['configuration']['groups'];
    $av = array_values($groups);
    $items = array_merge($items, $av);
  }

  $defaults = Configurations\Factory::GetDefaults($productId, $items);
  $defaults->EnsureLoaded();
  $priceGroupId = $defaults->priceGroupId;
  $diff = array_diff($defaults->toolboxItems, $items);
  if (count($diff)) {
    $items = $defaults->toolboxItems;
  }

  if (isset($form_state['values']['quantity'])) {
    if ($form_state['values']['quantity'] == 'custom') {
      $qty = $form_state['values']['custom_quantity'];
      $selectedQty = 'custom';
    } else {
      $qty = $form_state['values']['quantity'];
      $selectedQty = $qty;
    }
  }

  if (!$qty) {
    $qty = $defaults->quantity;
    $selectedQty = $qty;
  }

  $form['configuration'] = array(
      '#type' => 'fieldset',
      '#title' => t('Configure') . ' ' . strtolower($product->name),
      '#attributes' => array(
          'class' => array('configuration'),
      )
  );

  $tree = Configurations\Factory::GetTree($productId, $items);
  $toolboxItems = array();
  $ajax = array(
      'callback' => 'pctemplates_configblock_form_callback',
      'wrapper' => 'pctemplates-configblock-form',
      'method' => 'replace',
      'effect' => 'fade',
      'progress' => array(
          'message' => NULL,
          'type' => NULL,
      ),
  );

  foreach ($tree->items as $group) {
    if ($group->type == 1) {
      if (count((array) $group->data) > 1) {
        $form['configuration']['groups'][$group->id] = array(
            '#type' => 'select',
            '#title' => $group->name,
            '#group' => $group->id,
            '#ajax' => $ajax,
        );
        $defaultValue = false;
        foreach ($group->data as $item) {
          if (in_array($item->id, $items)) {
            $defaultValue = $item->id;
          }
          $form['configuration']['groups'][$group->id]['#options'][$item->id] = $item->name;
        }

        $form['configuration']['groups'][$group->id]['#default_value'] = $defaultValue;
      } else {
        $data = (array) $group->data;
        $item = array_shift($data);
        $form['configuration']['groups'][$group->id] = array(
            '#type' => 'item',
            '#title' => ucfirst($group->name),
            '#markup' => '<div class="text">' . $item->name . '</div>',
        );
      }
    }
  }

  $price = '';
  $pricePerPiece = '';
  $subtotal = 0;
  $base = FALSE;
  $pricings = Pricing\Factory::GetPricings($priceGroupId);
  $i = 0;
  $previous = FALSE;
  $listHasQuantity = FALSE;
  $prices = array();
  foreach ($pricings as $pricing) {
    if ($pricing->quantity == $qty) {
      $listHasQuantity = TRUE;
    }

    $pricingQuantity = (string) $pricing->quantity;
    $form['price'][$pricingQuantity] = array(
        '#type' => 'hidden',
        '#value' => $pricing->sellPrice,
    );
    $prices[$pricingQuantity] = array(
        'qty' => array(
            'data' => theme('number', array('value' => $pricingQuantity, 'suffix' => t('pcs.'))),
            'class' => 'qty',
            '#weight' => 100,
        ),
        'price' => array(
            'data' => theme('price', array('value' => $pricing->sellPrice)),
            'class' => 'price',
        ),
    );

    $i++;
    $previous = $pricing;
  }

  $prices['custom'] = array(
      '#attributes' => array('class' => array('custom')),
      'qty' => array(
          'data' => 'custom',
          'class' => 'qty',
      ),
      'price' => array(
          'data' => '',
          'class' => 'price',
      ),
  );

  $form['configuration']['custom_quantity'] = array(
      '#title' => t('Custom quantity'),
      '#type' => 'textfield',
      '#size' => 10,
      '#maxlength' => 6,
      '#default_value' => '',
      '#id' => 'edit-custom_quantity',
  );

  $price = Pricing\Factory::GetSellPrice($priceGroupId, $qty);
  $subtotal += $price;

  if (isset($form_state['values']['custom_quantity']) && is_numeric($form_state['values']['custom_quantity'])) {
    $customQty = $form_state['values']['custom_quantity'];
    $price = Pricing\Factory::GetSellPrice($priceGroupId, $customQty);
    $prices['custom']['qty']['data'] = theme('number', array('value' => $customQty, 'suffix' => t('pcs.')));
    $prices['custom']['price']['data'] = theme('price', array('value' => $price));
  } else {
    $customQty = $qty;
    $price = NULL;
  }

  $form['configuration']['header'] = array(
      '#type' => 'item',
      '#title' => t('Pricing'),
      '#markup' => t('Design + print included!'),
  );

  $form['configuration']['quantity'] = array(
      '#type' => 'tableselect',
      '#title' => t('Pricing'),
      '#header' => array(
          'qty' => array(
              'class' => 'qty',
          ),
          'price' => array(
              'class' => 'price',
          ),
      ),
      '#default_value' => $selectedQty,
      '#multiple' => false,
      '#options' => $prices,
      '#attributes' => array(
          'class' => array('grid'),
      ),
      '#ajax' => $ajax,
  );

  $form_state['storage']['subtotal'] = $subtotal;
  $form['priceblock'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('priceblock'), 'id' => 'priceblock')
  );
  $form['priceblock']['subtotal'] = array(
      '#id' => 'edit-subtotal',
      '#type' => 'item',
      '#title' => t('Subtotal'),
      '#markup' => theme('price', array('value' => $subtotal)),
  );

  $vat = \printconnect\Drupal\Functions::Round($subtotal * $_SESSION['shop_vat']);
  $form['priceblock']['vat'] = array(
      '#id' => 'edit-vat',
      '#type' => 'item',
      '#title' => t('VAT'),
      '#markup' => theme('price', array('value' => $vat)),
  );

  $total = $subtotal + $vat;
  $form['priceblock']['total'] = array(
      '#id' => 'edit-total',
      '#type' => 'item',
      '#title' => t('Total'),
      '#markup' => theme('price', array('value' => $total, 'total' => TRUE)),
  );
  $designtoollinkParams = array(
      'designtoolTemplateId' => $template->designToolTemplateId,
      'title' => $product->name,
      'content' => t('Start design'),
      'ribbons' => 'design',
      'callback' => 'templates/callback/order/',
      'oi' => array(
          'priceGroupId' => $priceGroupId,
          'quantity' => $qty,
          'options' => array(),
      ),
      'versioning' => TRUE,
      'attributes' => array('class' => array('button', 'action')),
  );

  $form_state['storage']['designtoollinkParams'] = $designtoollinkParams;
  $form['customize'] = array(
      '#markup' => theme('designtoollink', $designtoollinkParams),
      '#weight' => -100,
  );
  $form['customize2'] = array(
      '#markup' => theme('designtoollink', $designtoollinkParams),
      '#weight' => 90,
  );
  $shipping = Shipping\Factory::Get($productId, $items, array(), $qty);
  $firstDeadline = $shipping->items[0];
  $deadlineDate = $firstDeadline->deadlineDate;
  if (isset($deadlineDate)) {
    $deadlineDate = strtotime($deadlineDate);
  }
  $shippingDate = $firstDeadline->shippingDate;
  if (isset($shippingDate)) {
    $shippingDate = strtotime($shippingDate);
  }

  $form['shipping'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('shipping')),
      '#weight' => 100,
  );
  $form['shipping']['header'] = array(
      '#markup' => '<h4 class="shipping">' . t('Production and shipping') . '</h4>',
  );
  $form['shipping']['deadline'] = array(
      '#type' => 'item',
      '#title' => t('Next deadline'),
      '#markup' => format_date($deadlineDate),
  );
  $form['shipping']['date'] = array(
      '#type' => 'item',
      '#title' => t('Print will be shipped'),
      '#markup' => format_date($shippingDate, 'short'),
  );
  $form['shipping']['deadlines'] = array(
      '#type' => 'fieldset',
      '#title' => t('Supply times'),
      '#id' => 'deadlines',
  );
  $form['shipping']['deadlines']['text2'] = array(
      '#markup' => t('printconnect is fast blabla...'),
  );
  $rows = array();
  foreach ($shipping as $deadline) {
    $rows[] = array(
        t('Supply before') . ' ' . Functions::FormatDate(strtotime($deadline->deadlineDate), 'custom', 'l H:i'),
        array(
            'data' => t('Shipping_deadline') . ' ' . format_date(strtotime($deadline->shippingDate), 'custom', 'l'),
            'class' => array('delivery'),
        ),
    );
  }

  $form['shipping']['deadlines']['table']['#markup'] = theme('table', array('rows' => $rows));
  $form['shipping']['deadlines']['text1'] = array(
      '#type' => 'container',
      '#attributes' => array(
          'class' => array('box'),
      ),
      'content' => array('#markup' => t('Depending on your delivery address...')),
  );
  $form['shipping']['deadline_text'] = array(
      '#markup' => l(t('More on delivery times: click here'), '', array('attributes' => array('class' => array('fancybox')), 'fragment' => 'deadlines', 'external' => TRUE)),
  );
  $form_state['storage']['priceGroupId'] = $priceGroupId;
  $form_state['storage']['items'] = $items;
  $form_state['storage']['productId'] = $productId;
  $form_state['storage']['qty'] = $qty;
  $form['#cache'] = TRUE;
  $form_state['cache'] = TRUE;
  $form['#tree'] = TRUE;
  $form['#id'] = 'pctemplates-configblock-form';

  return $form;
}

function pctemplates_configblock_form_callback($form, &$form_state) {
  return $form;
}

function pctemplates_callback($type) {
  if (isset($_GET['userKey'])) {
    $customerId = $_GET['userKey'];
    $hash = $_GET['hash'];
    $verification = sha1($customerId . 'agD04vQPx1?FSspl');
    if ($hash == $verification) {
      pccustomersbase_login($customerId);
    }
  }

  if (isset($_GET['w']) && isset($_GET['h'])) {
    $w = $_GET['w'];
    $h = $_GET['h'];
    print '<script type="text/javascript">
  var addedWidth = 20 + parseInt('.$w.');
    var docWt = 0, docScrollWidth, docOffsetWidth;
    var doc =top.document;
    if (doc.body.scrollWidth)
      docWt = docScrollWidth= doc.body.scrollWidth;
    else
      docWt = docOffsetWidth = doc.body.offsetWidth;
    if (docScrollWidth && docOffsetWidth) docHt = Math.max(docScrollWidth, docOffsetWidth);
    var offSet = Math.round((docWt- ' . $w . ')/2);
    if(offSet < 10){
        offSet = 10;
    }
    top.jQuery("#fancybox-wrap").css({left: offSet + "px"});
    top.jQuery("#fancybox-inner").width(' . $w . ');
    top.jQuery("#fancybox-inner").height(' . $h . ');
    top.jQuery("#fancybox-wrap").width(' . $w . ');
    top.jQuery("#fancybox-wrap").height(' . $h . ');
    top.jQuery("#fancybox-content").width(addedWidth);
    top.jQuery("#fancybox-content").height(' . $h . ');
  top.jQuery("#fancybox-frame").width(' . $w . ');
    </script>';
    exit;
  }

  switch ($_GET['doClose']) {
    case 2:

    case 1:
      print "<script type=\"text/javascript\">top.jQuery.fancybox.close();</script>";
      break;
    default:
      if (!isset($_GET['versionsaved'])) {
        $file = $_GET['fileid'];
        $thumbnail = $_GET['thumbid'];
        $jobId = $_GET['jobid'];
        $priceGroupId = $_GET['priceGroupId'];
        $qty = $_GET['qty'];
        $vatPercentage = $_GET['vat'];
        module_invoke('pcdesigntool', 'save', $jobId, 'design');
        $cart = Carts\Factory::CurrentOrCreate();
        if (!$cart) {
          $cart = Carts\Factory::Create();
        }
        Carts\Factory::Save($cart);
        $item = Carts\Factory::CreateItem($cart, $priceGroupId, $qty, NULL, NULL, NULL, $vatPercentage);
        $item->file = $file;
        $item->thumbnail = $thumbnail;
        $item->design_tool_job_id = $jobId;

        if (isset($_GET['myPcId']) && $_GET['myPcId']) {
          $_SESSION['savedDesigns'][$item->id] = $_GET['myPcId'];
        }

        Carts\Factory::SaveItem($item);
        print "<script type=\"text/javascript\">top.location = '" . url('cart') . "';</script>";
        break;
      }
  }
  return;
}

function getItemParent($form_state,$templateItems = null,$productId = null) {
    
  if(!isset($form_state['values']['items']) || empty($form_state['values']['items'])) {
     foreach ($templateItems as $key => $item) {
         $parentId = $key;
         if(reset($item)->id == $productId){
             return $parentId ;
         }
     }
    return NULL;
  }

  foreach ($form_state['values']['items'] as $item) {
    if(preg_match('/-/', $item['select'])){
      list($itemId, $parentId) = explode('-', $item['select']);
      return $parentId;
    }
  }

  return NULL;
}

function getDefaultItemsByParent($parentId, $templateItems, $form_state = array()) {
  $items = array();
  $selectedItems = array();
  if(isset($form_state['items']) && !empty($form_state['items'])) {
      foreach($form_state['items'] as $sItem) {
          if(!preg_match('/-/', $sItem['select'])){
              $selectedItems[] = $sItem['select'];
          }
      }
  }

  $defaultItems = array();
  if(property_exists($templateItems, $parentId)){
      $dItems = reset($templateItems->$parentId);
      $items[] = $dItems->id;
      foreach ($dItems->children as $ditems) {
          foreach($ditems as $item){
            if(in_array($item->id, $selectedItems)) {
              $items[$item->groupId] = $item->id;
            }
          }

          $defaultItems[$ditems[0]->groupId] = $ditems[0]->id;
      }
  }

  $items = array_replace_recursive($defaultItems, $items);

  $returedItems = array();
  foreach($items as $item) {
      $returedItems[] = $item;
  }

  return $returedItems;
}

function pctemplates_config_form2($form, &$form_state, $templateId, $productId = NULL) {
  global $language;
  $qty = FALSE;

  if (isset($language->code)) {
    $languageCode = $language->code;
  } else {
    $languageCode = 'en_US';
  }
  try {
    $template = Factory::Get($templateId);
    
    $template->EnsureLoaded();
    
    $dtTemplate = printconnect\DesignTool\Templates\Factory::Get($template->designTemplates->designToolTemplateId);
    $dtTemplate->EnsureLoaded();
  } catch (\Exception $ex) {
 
  }
  if (!$template->designTemplates->active || !count($template->designTemplates->products)) {
    drupal_not_found();
    exit;
  }
  $parentId = getItemParent($form_state,$template->templateItems,$productId);
  $title = html_entity_decode($template->designTemplates->name);
  drupal_set_title($title, PASS_THROUGH);

  $dimension  = $template->designTemplates->filters[0]->items[0];
  $hasProduct = TRUE;
  
  if(!$productId) {
    $productId = $template->designTemplates->products[0]->id;
    $hasProduct = FALSE;
  }

  $ajax = array(
      'callback' => 'pctemplates_config_form2_callback',
      'wrapper' => 'pctemplates-config-form2',
      'method' => 'replace',
      'effect' => 'fade',
      'progress' => array(
          'message' => NULL,
          'type' => NULL,
      )
  );

  $items = $template->defaultItems;
  if($parentId) {
    $items = getDefaultItemsByParent($parentId, $template->templateItems, $form_state);
  }
  if (isset($form_state['values']['items'])) {
    foreach ($form_state['values']['items'] as $selectedItem) {
      $items[] = $selectedItem['select'];
    }
  }
  if (isset($form_state['values']['quantity'])) {
    $qty = $form_state['values']['quantity'];
  }

  $defaults = \printconnect\Products\Configurations\Factory::GetDefaults($productId, $items);

  $priceGroupId = $defaults->priceGroupId;
  $diff = array_diff($defaults->toolboxItems, $items);
  if (count($diff)) {
    $items = $defaults->toolboxItems;
    foreach ($items as $key => $value) {
      if ($value == 11) {
        $items[$key] = 10;
      }
    }
  }
  if (!$qty) {
    $qty = $defaults->quantity;
  }

  $productsItems = $items;
  $tree = \printconnect\Products\Configurations\Factory::GetTree($productId, $items);
  $form['pages'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('pages')),
  );

  $pages = 0;
$product = Products\Factory::Get($productId);
   
    drupal_set_title(t('step') . ' 2 : ' . t('configure your') . ' ' . strtolower($product->name));
    $form['details'] = array(
        '#type' => 'container',
    );
    $form['details']['pages'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('pages')),
    );
    $pages = 0;
    
    foreach ($dtTemplate->thumbnails as $thumbnail) {

        $page = $thumbnail->page;
        if ($page == 1) {
            $title = t('Outside');
        } else {
            $title = t('Inside');
        }

        $form['details']['pages'][$page] = array(
            '#type' => 'container',
            '#attributes' => array('class' => array('page')),
            'title' => array(
            '#markup' => '<h4>' . $title . '</h4> ',
            ),
            '#prefix'=>'<div class="allContentImage">', 
            'image' => array(
            '#theme' => 'designtoollink',
            '#designtoolTemplateId' => $template->designTemplates->designToolTemplateId,
            '#title' => $template->designTemplates->name,
            '#content' => array(
                '#theme' => 'pcfilesimage',
                '#file' => $thumbnail->fileId,
                '#attributes' => array('class' => 'thumbnailSize'),
            ),
            '#ribbons' => 'design',
            '#callback' => 'templates/callback/order/',
            '#oi' => array(
                'priceGroupId' => $priceGroupId,
                'quantity' => $qty,
                'options' => array(),
            ),
            '#versioning' => TRUE,
            ),
            '#suffix' => '</div>', 
            );
        $pages++;
    }
  if ($pages == 0) {
    $thumbnail = Files\Factory::Get($template->designTemplates->thumbnail->file);
    $thumbnail->EnsureLoaded();
    $form['pages']['thumbnail'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('page')),
        'title' => array('#markup' => '<h4>' . t('Thumbnail') . '</h4>', ),
        'image' => array(
            '#theme' => 'pcfilesimage',
            '#file' => $template->designTemplates->thumbnail->file,
        ),
        'image' => array(
            '#theme' => 'designtoollink',
            '#designtoolTemplateId' => $template->designTemplates->designToolTemplateId,
            '#title' => $template->designTemplates->name,
            '#content' => array(
                '#theme' => 'pcfilesimage',
                '#file' => $template->designTemplates->thumbnail->file,
            ),
            '#ribbons' => 'design',
            '#callback' => 'templates/callback/order/',
            '#oi' => array(
                'priceGroupId' => $priceGroupId,
                'quantity' => $qty,
                'options' => array(),
            ),
            '#versioning' => TRUE,
        ),
    );
  }

/*  foreach ($tree->items as $group) {
    switch (true) {
      case $group->id == $dimension->group:
        $detail = $dimension->detail;
        $text = $dimension->name;
        if ($detail) {
          $text .= ' (' . $detail . ')';
        }

        $form['items'][$group->id]['select'] = array(
            '#type' => 'item',
            '#title' => $group->name,
            '#markup' => '<div class="text">' . $text . '</div>',
        );
        break;

      case count((array) $group->data) > 1:
        foreach ($group->data as $item) {
          if (in_array($item->id, $items)) {
            $defaultValue = $item->id;
          }
          $detail = $dimension->detail;
          $text = $dimension->name;
          if ($detail) {
            $text .= ' (' . $detail . ')';
          }

          $form['items'][$group->id]['select'] = array(
              '#type' => 'item',
              '#title' => $group->name,
              '#markup' => '<div class="text">' . $text . '</div>',
          );
          break;
        }
        break;

        $form['items'][$group->id]['select'] = array(
            '#type' => 'select',
            '#title' => $group->name,
            '#id' => 'group-' . $group->id,
            '#ajax' => $ajax,
        );

        $defaultValue = false;
        foreach ($group->data as $item) {
          if (in_array($item->id, $items)) {
            $defaultValue = $item->id;
          }
          $detail = $item->detail;
          $text = $item->name;
          if ($detail) {
            $text .= ' (' . $detail . ')';
          }

          $form['items'][$group->id]['select']['#options'][$item->id] = $text;
        }
        $form['items'][$group->id]['select']['#default_value'] = $defaultValue;
        break;
      default:
        $data = (array) $group->data;
        $item = array_shift($data);
        if ($item) {
          $detail = $item->detail;
          $text = $item->name;
          if ($detail) {
            $text .= ' (' . $detail . ')';
          }

          $form['items'][$group->id]['select'] = array(
              '#type' => 'item',
              '#title' => $group->name,
              '#markup' => '<div class="text">' . $text . '</div>',
          );
        }
    }
    if (isset($form['items'][$group->id])) {
      $form['items'][$group->id]['select']['#description'] = t('description on toolbox ' . $group->id);
    }
  }*/

  foreach($template->templateParents as $dkey => $parent) {
      if($hasProduct && $parent->groupId == 0){
        if($parent->id == $productId){
          $text = $parent->itemName;

          $form['items'][$parent->groupId]['select'] = array(
              '#type'   => 'item',
              '#title'  => $parent->type,
              '#markup' => $text,
              '#value'  => $parent->id
          );
        }
        continue;
      }
      $text = $parent->itemName;
      if ($parent->itemDetail && $parent->groupId > 0) {
        $text .= ' (' . $parent->itemDetail . ')';
      }
//      if($dkey == 0){ 
//          
//        $form['items'][$parent->groupId]['select'] = array(
//            '#type' => 'select',
//            '#title' => $parent->type,
//            '#id' => 'group-' . $parent->groupId,
//            '#ajax' => $ajax,
//        );
//
//        if($parent->groupId == 0) {
//            $txtDescription = t('Select a product');
//        }else {
//            $txtDescription = t('description on toolbox ' . $parent->groupId);
//        }
//
//        $form['items'][$parent->groupId]['select']['#description'] = $txtDescription;
//        if(!$parentId) {
//            $form['items'][$parent->groupId]['select']['#default_value'] = $parent->id . '-' . $parent->primaryId;
//        }
//      }
//
//      $form['items'][$parent->groupId]['select']['#options'][$parent->id . '-' . $parent->primaryId] = $text;
//      if($parentId && $parentId == $parent->primaryId) {
//          $form['items'][$parent->groupId]['select']['#default_value'] = $parent->id . '-' . $parent->primaryId;
//      }
        if ($dkey == 0) { 
            $txtDescription = (0 == $parent->groupId)
                ? t('Select a product')
                : t(sprintf('description on toolbox %s', $parent->groupId));
            $text = $form['items'][$parent->groupId]['select']['#description'] = $txtDescription;
        if(!$parentId) {
           $text =  $form['items'][$parent->groupId]['select']['#default_value'] = sprintf('%s-%s', $parent->id, $parent->primaryId);
        }
        $form['items'][$parent->groupId]['select'] = array(
            '#type'   => 'item',
            '#title'  => $parent->type,
            '#markup' => sprintf('<div class="text">%s</div>', $parent->itemName),
        );
      }
  }
  if($parentId && property_exists($template->templateItems, $parentId)){
      $section = $template->templateItems->$parentId;
  }else {
      $section = reset($template->templateItems);
  }
  $section = reset($section);
  foreach($section->children as $dType => $dItems) {
      if(count($dItems) == 1){
          $text = $dItems[0]->itemName;
          if ($dItems[0]->itemDetail && $dItems[0]->groupId > 0) {
            $text .= ' (' . $dItems[0]->itemDetail . ')';
          }

          $form['items'][$dItems[0]->groupId]['select'] = array(
              '#type'   => 'item',
              '#title'  => $dType,
              '#markup' => '<div class="text">' . $text . '</div>',
              '#value'  => $dItems[0]->id
          );
      } else {
        $form['items'][$dItems[0]->groupId]['select'] = array(
            '#type' => 'select',
            '#title' => $dType,
            '#id' => 'group-' . $dItems[0]->groupId,
            '#ajax' => $ajax,
        );

        foreach($dItems as $dItem) {
            $text = $dItem->itemName;
            if ($dItem->itemDetail && $dItem->groupId > 0) {
              $text .= ' (' . $dItem->itemDetail . ')';
            }

            $form['items'][$dItem->groupId]['select']['#options'][$dItem->id] = $text;
        }
      }

      if($dItems[0]->groupId == 0) {
          $txtDescription = t('Select a product');
      }else {
          $txtDescription = t('description on toolbox ' . $dItems[0]->groupId);
      }
      
      $form['items'][$dItems[0]->groupId]['select']['#description'] = $txtDescription;
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
          'price' => '',
          'priceperpiece' => '',
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
    } else {
      $oldPrice = '';
      $sellPrice = $pricing->sellPrice;
    }

    $quantities[$pricingQuantity] = array(
        'qty' => t('@qty pcs.', array('@qty' => number_format($pricing->quantity, 0, ',', '.'))),
        'oldprice' => $oldPrice,
        'price' => theme('price', array('value' => $sellPrice)),
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
      );
    }
  }

  $form['quantity'] = array(
      '#type' => 'tableselect',
      '#multiple' => FALSE,
      '#header' => array('qty' => t('Quantity'), 'oldprice' => '', 'price' => t('Price VAT excl.'), 'priceinclvat' => t('Price VAT incl.')),
      '#required' => TRUE,
      '#attributes' => array('class' => array('grid', 'clearfix')),
      '#options' => $quantities,
      '#default_value' => $qty,
      '#ajax' => $ajax,
      '#sticky' => FALSE,
  );

  $form['custom'] = array(
      '#type' => 'textfield',
      '#ajax' => $ajax,
      '#description' => t('Enter your amount'),
  );

  if ($qty == 'custom') {
    $qty = $customQty;
  }

  if (is_numeric($qty)) {
    $price = \printconnect\Products\Pricing\Factory::GetSellPrice($priceGroupId, $qty);
  } else {
    $price = 0;
  }
  $subtotal += $price;
  $total = $subtotal * (1 + $_SESSION['shop_vat']);
  $form['priceblock'] = array(
      '#id' => 'priceblock',
      '#theme' => 'priceblock',
      '#subtotal' => $subtotal,
      '#attributes' => array('id' => 'priceblock'),
  );

  $designtoollinkParams = array(
      'designtoolTemplateId' => $template->designTemplates->designToolTemplateId,
      'title' => $template->designTemplates->name,
      'content' => t('Start design'),
      'ribbons' => 'design',
      'callback' => 'templates/callback/order/',
      'oi' => array(
          'priceGroupId' => $priceGroupId,
          'quantity' => $qty,
          'options' => array(),
      ),
      'versioning' => TRUE,
      'attributes' => array('class' => array('button', 'action')),
  );

  $form['actions'] = array('#type' => 'container', '#attributes' => array('class' => array('actions', 'form-actions', 'clearfix')));
  if (variable_get('pc_flow', '') == 'flyer') {
    $form['actions']['price'] = array(
        '#id' => 'price',
        '#theme' => 'price',
        '#value' => $total,
        '#attributes' => array('id' => 'price'),
        '#title' => t('Total incl. VAT'),
    );
  }

  $form['actions']['design'] = array(
      '#prefix' => '<div class="button-wrapper">',
      '#suffix' => '</div>',
      '#theme' => 'designtoollink',
      '#designtoolTemplateId' => $template->designTemplates->designToolTemplateId,
      '#title' => $template->designTemplates->name,
      '#content' => t('Start design'),
      '#ribbons' => 'design',
      '#callback' => 'templates/callback/order/',
      '#oi' => array(
          'priceGroupId' => $priceGroupId,
          'quantity' => $qty,
          'options' => array(),
      ),
      '#versioning' => TRUE,
      '#attributes' => array('class' => array('button', 'action')),
  );

  $form['specifications'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('specifications')),
  );
  $productItems = array();
  foreach ($template->designTemplates->products as $product) {
    $productItems[] = l($product->name, 'templates', array('query' => array('products' => $product->id), 'attributes' => array('rel' => 'nofollow')));
  }
  $form['specifications']['products'] = array(
      '#type' => 'item',
      '#title' => t('Product'),
      '#markup' => '<div>' . implode(', ', $productItems) . '</div>',
  );

  $form['specifications']['filters'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('filters')),
  );
  foreach ($template->designTemplates->filters as $filter) {
    $filterItems = array();
    foreach ($filter->items as $item) {
      $filterItems[] = l($item->name, 'templates', array('query' => array($filter->id => $item->id), 'attributes' => array('rel' => 'nofollow')));
    }

    $form['specifications']['filters'][$filter->id] = array(
        '#type' => 'item',
        '#title' => ucfirst($filter->name),
        '#markup' => '<div>' . implode(', ', $filterItems) . '</div>',
    );
  }

  if (variable_get('pc_flow', '') == 'flyer') {
    $shipsIn = FALSE;
    $deliveryDate = FALSE;
    $shipping = \printconnect\Products\Shipping\Factory::Get($productId, $items, array(), $qty);
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
            '#markup' => '<span class="day">' . format_date($deadlineDate, 'custom', 'l') . '</span><span class="date">' . format_date($deadlineDate, 'custom', 'd/m') . '</span>',
        );
        $form['shipping']['delivery'] = array(
            '#type' => 'container',
            '#attributes' => array('class' => array('delivery')),
        );
        $form['shipping']['delivery']['date'] = array(
            '#type' => 'item',
            '#title' => t('Expected delivery'),
            '#markup' => '<span class="day">' . format_date($deliveryDate, 'custom', 'l') . '</span><span class="date">' . format_date($deliveryDate, 'custom', 'd/m') . '</span>',
        );
      }
    }

    $rows = array();
    foreach ($shipping->items as $deadline) {
      if ($deadline->deadlineDate && $deadline->deliveryDate) {
        $rows[] = array(
            array(
                'class' => array('supply'),
                'data' => \printconnect\Drupal\Functions::FormatDate(strtotime($deadline->deadlineDate), 'custom', 'l H:i'),
            ),
            array(
                'class' => array('delivery'),
                'data' => format_date(strtotime($deadline->deliveryDate), 'custom', 'l'),
            ),
        );
      }
    }
    if (count($rows)) {
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
    }
  }

  $form['#id'] = 'pctemplates-config-form2';
  $form['#tree'] = TRUE;
  $form['#cache'] = TRUE;
  $form['#pre_render'] = array('pctemplates_config_form2_pre_render');
  $form_state['#cache'] = TRUE;
  $form_state['storage']['priceGroupId'] = $priceGroupId;
  $form_state['storage']['qty'] = $qty;
  $form_state['storage']['quantity'] = $qty;
  $form_state['storage']['productId'] = $productId;
  $form_state['storage']['items'] = $items;

  return $form;
}

function pctemplates_config_form2_callback(&$form, &$form_state) {
  return $form;
}

function pctemplates_config_form2_pre_render($form) {
  $form['quantity']['#options']['custom']['qty'] = drupal_render($form['custom']);
  return $form;
}

function pctemplates_form_pctemplates_config_form2_alter(&$form, &$form_state) {
  if (variable_get('pc_flow', '') == 'flyer') {
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
          $oldKey = $key;
          if(preg_match('/-/', $key)){
            list($key, $primaryId) = explode('-', $key);
          }
          $value = str_replace(' (', '<br/><div class="detail"> (', $value);
          $value = str_replace(')', ')</div>', $value);
          preg_match('/\((.*)\)/', $value, $matches);
          if ($matches) {
            $detail = $matches[0];
            $value = preg_replace('/\((.*)\)/', '', $value);
          } else {
            $detail = FALSE;
          }

          $imageType = 'items';
          if($groupId == 0) {
              $imageType = 'products';
          }

          $build = array(
              'image' => array(
                  '#theme' => 'image',
                  '#path' => _pcproducts_getimage($imageType, $key)
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
          $items[$oldKey] = l(drupal_render($build), '', array('fragment' => '', 'external' => true, 'html' => true, 'attributes' => array('id' => $oldKey)));
        }

        $form['items'][$groupId]['dropdown'] = array(
            '#type' => 'container',
            '#attributes' => array('class' => array('dropdown', 'clearfix')),
            '#default_value' => $activeItem,
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
}

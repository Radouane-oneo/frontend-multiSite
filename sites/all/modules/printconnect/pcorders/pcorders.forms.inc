<?php
use printconnect\Invoices\Invoice;
use printconnect\Invoices\Factory;
function pcorders_order_form($form, &$form_state, $orderId, $confirmation = FALSE) {
\printconnect\Carts\Factory::Clear();
$order = \printconnect\Orders\Factory::Get($orderId, false);

$customer = \printconnect\Customers\Factory::Get($order->customer);
$cart = \printconnect\Carts\Factory::Current(FALSE);
  
  drupal_set_title(t('Details of your order @number : @status', array('@number' => $order->number, '@status' => $order->status)));
 
  $form['status'] = array(
      '#markup' => t('Your order is now in status %status', array('%status' => $order->status)),
  );
  /*
    $form['order'] = array(
    '#type' => 'fieldset',
    '#title' => t('Order') . ' ' . $order->number,
    );
   */
  $form['status'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('box', 'clearfix', 'orderstatus')),
          //  '#title' => t('Order status'),
  );

  if (variable_get('pc_flow', FALSE) == 'flyer' && $order->orderStatus->id != 16) {

    $form['status']['history'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('history')),
    );

    $form['status']['history']['title'] = array(
        '#prefix' => '<img src="//drs2.veinteractive.com/DataReceiverService.asmx/Pixel?journeycode=88106375-6036-4D45-8034-757F36A59936" width="1" height="1"/><h2>',
        '#markup' => t('From order to delivery'),
        '#suffix' => '</h2>',
    );

    $statusses = \printconnect\Orders\Factory::GetStatusses();

    $i = 0;
    foreach ($statusses as $status) {
      if (in_array($status->id, array(3, 8, 9, 10, 15))) {
        $items[$i] = array(
            'data' => $status->translated,
            'class' => array('step' . ($i + 1)),
        );
        $i++;
      }
    }

    $items[4]['data'] = t('Delivered');

    if (!isset($order->orderShippingAddress->pickupPointId) || $order->orderShippingAddress->pickupPointId == 0) {
      unset($items[15]);
    }

    $listClass = '';

    $items[0]['data'] = '<div class="date">' . format_date(strtotime($order->creationDate), 'medium', 'd-m-y') . '</div>' . $items[0]['data'];

    $items[2]['data'] = '<div class="date">' . format_date(strtotime($order->expectedShippingDate), 'medium', 'd-m-y') . '</div>' . $items[2]['data'];

    $items[4]['data'] = '<div class="date">' . format_date(strtotime($order->expectedDeliveryDate), 'medium', 'd-m-y') . '</div>' . $items[4]['data'];

    switch ($order->orderStatus->id) {
      case 8:
        $items[1]['class'][] = 'active';
        $listClass = 'step2-active';
        break;
      case 9:
        $items[2]['class'][] = 'active';
        $listClass = 'step3-active';
        break;
      case 10:
        $items[3]['class'][] = 'active';
        $listClass = 'step4-active';
        break;
      case 15:
      case 11:
      case 14:
        $items[4]['class'][] = 'active';
        $listClass = 'step5-active';
        break;
      default:
      /*    $items[0]['class'][] = 'active';
        $listClass = 'step1-active'; */
    }

    $form['status']['history']['list'] = array(
        '#markup' => theme('item_list', array('items' => $items, 'attributes' => array('class' => array($listClass)))),
    );

    global $base_url;


    // if ($confirmation) {
    $form['thanks'] = array(
        '#type' => 'fieldset',
        '#attributes' => array('class' => array('box', 'clearfix')),
        'title' => array(
            '#markup' => t('Dear @name', array('@name' => $customer->firstName)),
            '#prefix' => '<h2>',
            '#suffix' => '</h2>',
        ),
        'text' => array(
            '#markup' => t('Congratulations on your order. From now on, it`s our task to provide you with the best prints possible.'),
        ),
    );
  }
  $form['header'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('headerorder'))
    );
  $form['header']['right'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('headerright'))
    );
  $form['header']['right']['title'] = array(
        '#markup' => "<span class='title'>".t('etat de votre commande').":</span>"
    );
  $form['header']['right']['status'] = array(
        '#markup' => "<span class='status'>".$order->status."</span>"
    );
  $form['header']['left'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('headerleft'))
    );
  $form['header']['left']['send'] = array(
        '#markup' => "<div class='deliverydate'><span class='send'>".t('delivery date').":</span><span class='senddate'>".format_date(strtotime($order->expectedDeliveryDate), 'medium', 'd-m-y')."</span></div>"
    );
  $form['header']['left'] ['livraison'] = array(
        '#markup' => "<div class='shippingdate'><span class='livraison'>".t('shipping date').":</span><span class='senddate'> ".format_date(strtotime($order->expectedShippingDate), 'medium', 'd-m-y')."</span></div>"
    );
  
  $form['deliveryinvoice'] = array(
      '#type' => 'container',
      '#attributes' => array('id' => array('delivery-invoice'))
   );
  
  $form['deliveryinvoice']['invoice'] = array(
      '#type' => 'fieldset',
      '#attributes' => array('class' => array('invoice')),
      '#title' => t('Invoice address')
  );
  var_dump($order->invoices);
echo count($order->invoices);

  if ($order->customerReference) {
    $form['deliveryinvoice']['invoice']['reference'] = array(
        '#markup' => $order->customerReference,
    );
  }

  if ($order->billingAccount) {
        $Billingaddresses = \printconnect\Customers\BillingAccounts\Factory::Get($order->billingAccount);
    $form['deliveryinvoice']['invoice']['address'] = array('#markup' => theme('address', array('address' => $Billingaddresses)));
  } else {
    $a = new stdClass();
    $a->name = $customer->name;

    $form['deliveryinvoice']['invoice']['address'] = array('#markup' => theme('address', array('address' => $a)));
  }
  if ($order->neutralShipping) {
    $form['deliveryinvoice']['invoice']['info'] = array(
        '#prefix' => '<div class="smaller neutral">',
        '#markup' => t('Your order is shipped neutral'),
        '#suffix' => '</div>',
    );
  }

  if ($order->orderShippingAddress) {
    $form['deliveryinvoice']['delivery'] = array(
        '#type' => 'fieldset',
        '#attributes' => array('class' => array('delivery')),
        '#title' => t('This orders delivery'),
    );
    $form['deliveryinvoice']['delivery']['address'] = array('#markup' => theme('address', array('address' => $order->orderShippingAddress)));

    $form['deliveryinvoice']['delivery']['info'] = array(
        '#prefix' => '<div class="smaller">',
        '#markup' => t('Your order will by delivered at the given address, at last 24 hours after shipping.'),
        '#suffix' => '</div>',
    );
  }

  $form['deliveryinvoice']['delivery']['info'] = array(
        '#prefix' => '<div class="smaller">',
        '#markup' => t('Your order will by delivered at the given address, at last 24 hours after shipping.'),
        '#suffix' => '</div>',
    );
  
  $form['order'] = array(
      '#prefix' => '<div class="clearfix"></div>',
      '#type' => 'fieldset',
      '#title' => t('Details of your order @number', array('@number' => $order->number)),
      '#attributes' => array('class' => array('order')),
  );

  $form['order']['details'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('details')),
  );
  /*
    $form['order']['details']['title'] = array(
    '#prefix' => '<h2>',
    '#markup' => ('Details of your order'),
    '#suffix' => '</h2>',
    );
   */
  $totalPrice = 0;
  $idproducts = null;
  foreach ($order->productItems as $item) {

    $form['order']['details']['item'][$item->id] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('blocJob', 'item', 'clearfix'))
    );

    $form['order']['details']['item'][$item->id]['image'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('image')),
    );
    if (count($item->files)) {        
      foreach ($item->files as $file) {
          if (isset($file->thumbnail)) {
          $form['order']['details']['item'][$item->id]['image']['thumb'] = array(
              '#theme' => 'pcfilesthumb',
              '#file' => $file->thumbnail,
          );
        }
        /*$form['order']['details']['item'][$item->id]['image']['download'] = array(
            '#theme' => 'pcfilesdownloadlink',
            '#file' => pcdesigntool_preview_url($file->designToolJobId),
            '#title' => t('Download preview'),
        );*/
      }
    } else {
      $form['order']['details']['item'][$item->id]['image']['product'] = array(
          '#theme' => 'image',
          '#path' => printconnect_getimage('products', $item->configuration->productId),
      );

    }
    
    $form['order']['details']['item'][$item->id]['description'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('description')),
    );   

    $form['order']['details']['item'][$item->id]['description']['name'] = array(
        '#prefix' => '<h3>',
        '#markup' => $item->quantity . ' ' . $item->configuration->name,
        '#suffix' => '</h3>',
    );
    if($item->refJob){
        $form['order']['details']['item'][$item->id]['description']['refJob'] = array(
              '#markup' => '<label class="labelOrder">' . t('Reference product') .' <span class="refJob">'. $item->refJob.'</span></label>',
        );
    }
    $price = $item->convertedPrice;

    foreach ($item->options as $option) {
      $price +=  $option->convertedPrice;
    }

    $price *= (1-$item->discount);

    $form['order']['details']['item'][$item->id]['price'] = array('#markup' => theme('price', array('value' => $price)));
    if ($item->customWidth == 0 && $item->customHeight == 0){
        if($price < $item->originPrice){
            global $language;
            $lg = $language->prefix;
            $arrayLanguage = array('befr', 'lufr', 'frfr');
            if (in_array($lg, $arrayLanguage))
                $promoPrice = '<del>'.$item->originPrice.' &euro;</del>';
            else
                $promoPrice = '<del>&euro; '.$item->originPrice.'</del>';
            
            $form['order']['details']['item'][$item->id]['description']['promoPrice'] = array(
            '#prefix' => '<div class="order-origin-price">',
            '#suffix' => '</div>',
            '#markup' => $promoPrice,
            );
        }
    }
    if (count($item->files) == 0) { 
      $form['order']['details']['item'][$item->id]['blocDesigner'] = array(
          '#markup' => '<div id="designerWarning"><p>'.t('WarningDesigner').'</p><p>'.t('DesignerEmail').'<span>'.$item->emailDesigner.'</span></p></div>',
          );
    }

    $totalPrice += $price; // total product price for tracking vente

    $rows = array();

    foreach ($item->configuration->config as $config) {
        if ($item->customWidth != 0 && $item->customHeight != 0 && $config->code == 'CF'){
            $title = $item->customWidth.' X '. $item->customHeight. ' mm';
        }else
        {
            $title = $config->name;
        }
      $rows[] = '<label class="labelOrder">' . $config->groupName . '</label>' . $title;
    }

    foreach ($item->options as $option) {
      $rows[] = '<label>' . $option->optionName . '</label>';// . theme('price', array('value' => $option->convertedPrice, 'block' => TRUE));
    }

    $form['order']['details']['item'][$item->id]['description']['config'] = array(
        '#theme' => 'table',
        '#rows' => $rows,
            //'#markup' => theme('item_list', array('items' => $rows)),
    );

    $form['order']['details']['item'][$item->id]['description']['config'] = array(
        '#theme' => 'item_list',
        '#items' => $rows,
            //'#markup' => theme('item_list', array('items' => $rows)),
    );
    
    if (isset($item->tracking)) {
      foreach ($item->tracking as $box) {
        $form['order']['details']['item'][$item->id]['description']['tracking'] = array(
            '#markup' => l(t('Track'), $box->trackingLink, array('attributes' => array('target' => '_new', /* 'class' => array('button', 'display-block') */))),
        );
      }
    }
    if(count($item->fotoliaItems)|| $item->fileCheck){
        $form['order']['details']['item'][$item->id]['blocfotoliacontrol']= array(
                    '#type' => 'container',
                    '#attributes' => array('class' => array('clearfix' , 'blocfotoliacontrol')),
                    );
          if( $item->fileCheck ){
            $priceControl = $item->fileCheck->price;
            $form['order']['details']['item'][$item->id]['blocfotoliacontrol']['control']= array(
                    '#type' => 'container',
                    '#attributes' => array('class' => array('bloccontrol' , 'clearfix')),
                    );
            $form['order']['details']['item'][$item->id]['blocfotoliacontrol']['control']['text'] = array(
                    '#markup' => '<h3>'.t('Control professional').'</h3>',
                    );
            $form['order']['details']['item'][$item->id]['blocfotoliacontrol']['control']['price'] = array(
                    'price' => array(
                            '#theme' => 'price',
                            '#value' => $priceControl,
                            '#attributes' => array('class' => array('priceControl')),
                            ));
            $totalprice+=$priceControl;
        }
        if(count($item->fotoliaItems)){
                
                foreach ($item->fotoliaItems as  $fotoliaitem){
                    $form['order']['details']['item'][$item->id]['blocfotoliacontrol']['fotolia'][$fotoliaitem->id]= array(
                      '#type' => 'container',
                      '#attributes' => array('class' => array('blocfotolia')),
                    );
                    $form['order']['details']['item'][$item->id]['blocfotoliacontrol']['fotolia'][$fotoliaitem->id]['libelle']= array(
                            '#markup' => '<span class="fotoliaLabele">'.t("Fotolia image").' "'.$fotoliaitem->id.'"</span>'                             
                            );
                     $form['order']['details']['item'][$item->id]['blocfotoliacontrol']['fotolia'][$fotoliaitem->id]['price'] = array(
                    'price' => array(
                            '#theme' => 'price',
                            '#value' => intval($fotoliaitem->price)
                            ));
                    $totalprice+=intval($fotoliaitem->price);
                }
            }         
    }    
    
    $form_state['storage']['itemid'][$item->id] = $item->id;
    $idproducts .= $item->configuration->productId.','; // ids product for tracking
  }

    $form['order']['extra'] = _pcorders_order_form_build_overview($order);
    if ($_SESSION['shop_vat'] != 0) {
        $form['order']['priceblock'] = array(
            '#markup' => theme('priceblock', array(
                'subtotal' => $order->subTotalAmount,
                'vatAmount' => $order->vatAmount,
                'total' => $order->totalAmount,
                'attributes' => array('class' => array('clearfix')))),
        );
    }
    
    $form['order']['actions'] = array(
        '#type' => 'actions',
    );
    if ($_SESSION['shop_vat'] != 0) {
        $form['order']['actions']['price'] = array(
            '#theme' => 'price',
            '#value' => $order->totalAmount,
            '#title' => t('Total incl. VAT'),
        );
    }
    if (count($order->invoices) != 0){
            $invoices = $order->invoices;
        
          $rows = array();
          foreach ($invoices as $invoice) {
            if (Factory::GetBalance($invoice) > 1) {
              $flag = '<div class="flag">&nbsp</div>';
              $class = 'topay';
              $balance = Factory::GetBalance($invoice);
            } else {
              $flag = '<div>&nbsp</div>';
              $class = '';
              $balance = 0;
            }

            $rows[] = array(
                /*array('data' => $flag),*/
                array('data' => format_date(strtotime($invoice->creationDate), 'custom', 'd/m/Y')),
                /*array('data' => ''),*/
                array(
                    'data' => theme('price', array('value' => $invoice->totalAmount, 'attributes' => array('class' => array($class)))),
                ),
                array(
                    'data' => theme('price', array('value' => $balance)),
                ),
                l($invoice->order, 'myprintconnect/orders/' . $invoice->order),
        //          array('data' => l($invoice->number, printconnect\Files\Factory::getFileUrl($invoice->pdf), array('attributes' => array('class' => 'pdf', 'target' => '_blank')))),
                array('data' => theme('pcfilesdownloadlink', array('file' => $invoice->pdf, 'title' => $invoice->number, 'attributes' => array('class' => array('pdf'))))),
            );
          }

          $form['invoices']['list'] = array(
              '#type' => 'item',
              '#markup' => theme('table', array('rows' => array_reverse($rows), 'header' => array(/*'', */t('Date'), /*t('Method'), */t('Amount'), t('Outstanding'), t('Order'), ''/*t('Invoice')*/), 'empty' => t('No invoices found'), 'attributes' => array('class' => array('list'))))
          );
    }
    
    
    $form_state['storage']['cartId'] = $cart->id;
    $form_state['storage']['order'] = $order;
    $form_state['storage']['customer'] = $customer;
    $form_state['storage']['confirmation'] = $confirmation;

    if($confirmation){
          $form['tracking_vente'] = array(
            '#markup' => '<script type="text/javascript" src="https://action.metaffiliation.com/trk.php?mclic=S4ADAB1011&argmon='.$totalPrice.'&argann='.$orderId.'" ></script>
                          <noscript><img src="https://action.metaffiliation.com/trk.php?mclic=N4ADAB1011&argmon='.$totalPrice.'&argann='.$orderId.'" width="1" height="1" border="0" />
                          </noscript>',
          );
          $form['tracking_products'] = array(
            '#markup' => '<script type="text/javascript" src="http://img.metaffiliation.com/u/15/p44459.js?zone=fincommande&montant='.$totalPrice.'&listeids='.$idproducts.'&idtransaction='.$orderId.'"></script>',
          );
    }
    
//$form['order']['#value'] = $order;
//$form['customer']['#value'] = $customer;
//$form['confirmation']['#value'] = $confirmation;
  return $form;
}

function _pcorders_order_form_build_overview($order) {
  $discounts = FALSE;

  if ($order) {
    $rows = array();

    if ($order->orderItemsAdditional) {
      foreach ($order->orderItemsAdditional as $item) {
        $rows[] = array(
            'data' => array(
                t('Extra'),
                $item->description,
                theme('price', array('value' => $item->price, 'block' => TRUE)),
            ),
            'class' => array('orderItemsAdditional'),
        );
      }
    }
   if ($order->discountItems) {
     foreach ($order->discountItems as $discount) {
      if($discount->productName != "Fotolia Image"){
        $label = t('Discount');
         $rows[] = array(
             'data' => array(
                 $label,
                 $discount->productName,
                 theme('price', array('value' => $discount->price, 'block' => TRUE)),
             ),
             'class' => array('discount'),
         );
      }       
     }
   }
    if (isset($order->orderItemShipping)) {
      $type = \printconnect\Shipping\Types\Factory::Get($order->orderItemShipping->shippingTypeResellerShop);
      $rows[] = array(
          'data' => array(
              t('Shipping'),
              $type->shippingType->tag,
              //array('data' => '', 'class' => array('filler')),
              theme('price', array('value' => $order->orderItemShipping->price, 'free' => TRUE, 'block' => TRUE)),
          ),
      );
    }

    if (count($order->orderItemsPayment)) {
      foreach ($order->orderItemsPayment as $payment) {
        $rows[] = array(
            'data' => array(
                t('Payment'),
                $payment->description,
                // array('data' => '', 'class' => array('filler')),
                theme('price', array('value' => $payment->price, 'free' => TRUE, 'block' => TRUE)),
            ),
        );
      }
    }

    if (count($order->orderItemFileCheck)) {

      $rows[] = array(
          'data' => array(
              '',
              t('File check'),
              //array('data' => '', 'class' => array('filler')),
              theme('price', array('value' => $order->orderItemFileCheck->convertedPrice, 'free' => TRUE, 'block' => TRUE)),
          ),
      );
    }

    $build = array(
        '#type' => 'fieldset',
        '#attributes' => array('class' => array('overview')),
        '#title' => t('Extra'),
    );
//    $build['title'] = array(
//        '#markup' => t('Order overview'),
//        '#prefix' => '<h2>',
//        '#suffix' => '</h2>',
//    );
    $build['table'] = array(
        '#theme' => 'table',
//        '#header' => array(
//            t('Description'),
//            t('Price'),
//        ),
        '#rows' => $rows,
    );
  }

  return $build;
}

function pcorders_order_form_reorder($form, $form_state) {
    $cartId = $form_state['storage']['cartId'];
    $jobid = $form_state['triggering_element']['#name'];
//    $order = $form_state['storage']['order'];

  $newCart = \printconnect\Orders\Factory::Reorder($cartId, $jobid);
  $_SESSION['cartid'] = $newCart->id;
  drupal_goto('cart');
}

function _pcorders_designtoolcallback() {
  $file = $_GET['fileid'];
  $thumbnail = $_GET['thumbid'];
  $id = $_GET['id'];
  $jobId = $_GET['jobid'];
  $orderID = $_GET['orderId'];

  if ($id) {
    $order = \printconnect\Orders\Factory::Get($orderId);
    $item = \printconnect\Orders\Factory::GetItem($order, $id);
    $item->EnsureLoaded();
    $item->file = $file;
    $item->thumbnail = $thumbnail;
    $item->design_tool_job_id = $jobId;
    $item->cart_item = $id;

    \printconnect\Carts\Factory::SaveItem($item);
//\printconnect\Carts\Factory::RefreshItem($item);
// \printconnect\Carts\Factory::Refresh($cart);
  }
  print update_domain();
  print '<script type="text/javascript">top.location = top.location;</script>';
  exit;
}

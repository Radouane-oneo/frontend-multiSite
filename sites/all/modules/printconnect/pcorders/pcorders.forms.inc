<?php

function pcorders_order_form($form, &$form_state, $orderId, $confirmation = FALSE) {
\printconnect\Carts\Factory::Clear();
$order = \printconnect\Orders\Factory::Get($orderId, false);
$customer = \printconnect\Customers\Factory::Get($order->customer);
$cart = \printconnect\Carts\Factory::Current(FALSE);
  drupal_set_title(t('Details of your order @number : @status', array('@number' => $order->number, '@status' => $order->status)));
      $inline_script ="<!-- Facebook Conversion Code for Commande Flyer.fr -->
                        <script>(function() {
                        var _fbq = window._fbq || (window._fbq = []);
                        if (!_fbq.loaded) {
                        var fbds = document.createElement('script');
                        fbds.async = true;
                        fbds.src = '//connect.facebook.net/en_US/fbds.js';
                        var s = document.getElementsByTagName('script')[0];
                        s.parentNode.insertBefore(fbds, s);
                        _fbq.loaded = true;
                        }
                        })();
                        window._fbq = window._fbq || [];
                        window._fbq.push(['track', '6018439902582', {'value':'$order->totalAmount','currency':'EUR'}]);
                        </script>
                        <noscript><img class='fcb_price' height='1' width='1' alt='' style='display:none' src='https://www.facebook.com/tr?ev=6018439902582&amp;cd[value]=$order->totalAmount&amp;cd[currency]=EUR&amp;noscript=1' /></noscript>";

    $element_fcb = array(
                        '#type' => 'markup',
                        '#markup' => $inline_script,
                        '#weight' => 5
                    );

    drupal_add_html_head($element_fcb, 'script_tag_fcb');


  // drupal_set_title(t('Order confirmation - @number - ', array('@number' => $order->number)));

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
    if (variable_get('pc_flow', '') == 'flyer') {
      $form['thanks']['social'] = array(
          '#type' => 'container',
          '#attributes' => array('class' => array('social')),
          'facebook' => array(
          '#markup' => '<div class="fb-like" data-href="' . $base_url . '" data-send="false" data-width="450" data-show-faces="true" data-action="recommend"></div>
                        <div id="fb-root"></div>
                      <script>(function(d, s, id) {
                        var js, fjs = d.getElementsByTagName(s)[0];
                        if (d.getElementById(id)) return;
                        js = d.createElement(s); js.id = id;
                        js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
                        fjs.parentNode.insertBefore(js, fjs);
                      }(document, "script", "facebook-jssdk"));</script>',
          ),
          'twitter' => array(
              '#markup' => '<a href="https://twitter.com/share" class="twitter-share-button" data-url="' . $base_url . '" data-text="' . t('Just ordered!') . '">Tweet</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>'
          ),
      );
    }
  }
//
//  $form['addressing'] = array(
//      '#type' => 'container',
//      '#attributes' => array('class' => array('box', 'clearfix')),
//  );
  if ($order->orderShippingAddress) {
    $form['delivery'] = array(
        '#type' => 'fieldset',
        '#attributes' => array('class' => array('delivery')),
        '#title' => t('This orders delivery'),
    );

//    $form['addressing']['delivery']['title'] = array(
//        '#prefix' => '<h2>',
//        '#markup' => t('This orders delivery'),
//        '#suffix' => '</h2>'
//    );
    /*
      if ($order->expectedShippingDate) {
      $form['order']['addressing']['delivery']['date'] = array(
      '#prefix' => '<div class="shippingdate">',
      '#markup' => t('This order will be shipped on %date', array('%date' => format_date(strtotime($order->expectedShippingDate), 'short'))),
      '#suffix' => '</div>'
      );
      }
     */
    $form['delivery']['address'] = array('#markup' => theme('address', array('address' => $order->orderShippingAddress)));

    $form['delivery']['info'] = array(
        '#prefix' => '<div class="smaller">',
        '#markup' => t('Your order will by delivered at the given address, at last 24 hours after shipping.'),
        '#suffix' => '</div>',
    );
  }
  $form['invoice'] = array(
      '#type' => 'fieldset',
      '#attributes' => array('class' => array('invoice')),
      '#title' => t('Invoice address'),
  );
//
//  $form['addressing']['invoice']['title'] = array(
//      '#prefix' => '<h2>',
//      '#markup' => t('Invoice address'),
//      '#suffix' => '</h2>',
//  );

  if ($order->customerReference) {
    $form['invoice']['reference'] = array(
        '#markup' => $order->customerReference,
    );
  }

  if ($order->billingAccount) {
        $Billingaddresses = \printconnect\Customers\BillingAccounts\Factory::Get($order->billingAccount);
    $form['invoice']['address'] = array('#markup' => theme('address', array('address' => $Billingaddresses)));
  } else {
    $a = new stdClass();
    $a->name = $customer->name;

    $form['invoice']['address'] = array('#markup' => theme('address', array('address' => $a)));
  }
  if ($order->neutralShipping) {
    $form['invoice']['info'] = array(
        '#prefix' => '<div class="smaller">',
        '#markup' => t('Your order is shipped neutral'),
        '#suffix' => '</div>',
    );
  }

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
        '#attributes' => array('class' => array('item', 'clearfix'))
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
        $form['order']['details']['item'][$item->id]['image']['download'] = array(
            '#theme' => 'pcfilesdownloadlink',
            '#file' => pcdesigntool_preview_url($file->designToolJobId),
            '#title' => t('Download preview'),
        );
        /*
          $jobId = $file->designToolJobId;

          $form['order']['details']['item'][$item->id]['link'] = array(
          '#markup' => theme('designtoollink', array(
          'title' => $item->productName,
          'content' => theme('pcfilesthumb', array('file' => $file->thumbnail)),
          'html' => TRUE,
          'params' => array(
          'id' => $item->id,
          'cartid' => $cart->id,
          ),
          'callback' => 'order/callback/',
          'versioning' => FALSE,
          'jobId' => $jobId,
          'params' => array(
          'id' => $item->id,
          ),
          'attributes' => array('class' => array('designtool', 'iframe', 'display-block')),
          )),
          );

         */
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


    $price = $item->convertedPrice;

    foreach ($item->options as $option) {
      $price +=  $option->convertedPrice;
    }

    $price *= (1-$item->discount);

    $form['order']['details']['item'][$item->id]['description']['price'] = array('#markup' => theme('price', array('value' => $price)));

    if($price < $item->originPrice){
        $promoPrice = '<del>&euro; '.$item->originPrice.'</del>';
        $form['order']['details']['item'][$item->id]['description']['promoPrice'] = array(
        '#prefix' => '<div class="order-origin-price">',
        '#suffix' => '</div>',
        '#markup' => $promoPrice,
        );
    }
    $form['order']['details']['item'][$item->id]['description']['name'] = array(
        '#prefix' => '<h3>',
        '#markup' => $item->quantity . ' ' . $item->configuration->name,
        '#suffix' => '</h3>',
    );

    $totalPrice += $price; // total product price for tracking vente

    $rows = array();

    foreach ($item->configuration->config as $config) {
//      $rows[] = array(
//          'no_striping' => TRUE,
//          'data' => array('<label>' . $config->groupName . '</label>', $config->name, ''),
//      );
      $rows[] = '<label class="labelOrder">' . $config->groupName . '</label>' . $config->name;
    }

    foreach ($item->options as $option) {
//      $rows[] = array(
//          'no_striping' => TRUE,
//          'data' => array('', $option->optionName, theme('price', array('value' => $option->convertedPrice))),
//      );
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
    if($item->refJob){
        $form['order']['details']['item'][$item->id]['description']['refJob'] = array(
              '#markup' => '<label class="labelOrder">' . t('Reference product') .' : '. $item->refJob.'</label>',
        );
    }
    if (isset($item->tracking)) {
      foreach ($item->tracking as $box) {
        $form['order']['details']['item'][$item->id]['description']['tracking'] = array(
            '#markup' => l(t('Track'), $box->trackingLink, array('attributes' => array('target' => '_new', /* 'class' => array('button', 'display-block') */))),
        );
      }
    }
    $form['order']['details']['item'][$item->id]['description']['recommander'] = array(
        '#type' => 'submit',
        '#value' => t('Recommander'),
        '#name' => $item->id,
        '#has_garbage_value' => FALSE,
        '#attributes' => array('class' => array('recommander')),
//        '#validate' => array('pcorders_order_form_recommander_validate'),
        '#submit' => array('pcorders_order_form_reorder'),
    );
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

    $form['actions'] = array(
        '#type' => 'actions',
    );

        if (variable_get('pc_flow', '') == 'flyer') {
            if ($_SESSION['shop_vat'] != 0) {
                $form['actions']['price'] = array(
                    '#theme' => 'price',
                    '#value' => $order->totalAmount,
                    '#title' => t('Total incl. VAT'),
                );
            } else {
                $form['actions']['price'] = array(
                    '#theme' => 'price',
                    '#value' => $order->totalAmount,
                    '#title' => t('Total excl. Vat'),
                );
            }
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

    foreach ($order->orderItems as $item) {
        $configs = $item->configuration->config;
        $primaryItem = $configs[0];
        if ($item->fileCheck) {
            $rows[] = array(
                'data' => array(
                  t('Control professional').' '.$item->quantity . ' ' . t('pcs.') . ' ' . $item->configuration->name . ' - ' . $primaryItem->name,
                    '',theme('price', array('value' => $item->fileCheck->price, 'free' => TRUE)),
                ),
            );
        }
    }

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
        $label = t('Discount');
        if($discount->productName == 'Fotolia Image') {
          $label = t('Supplément');
        }
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

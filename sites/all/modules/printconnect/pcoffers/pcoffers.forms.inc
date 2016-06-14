<?php

use printconnect\Offers\Factory;
use printconnect\Offers\Offer;
use printconnect\Customers\Factory as CustomersFactory;

function pcoffers_offer_form($form, &$form_state, $hash) {
  $offer = Factory::GetById($hash);
  drupal_set_title(t('Offer translate') . " $offer->number");

  $items = $offer->offerItems;
  $offerItemsAdditional = $offer->offerItemsAdditional;
  $form['offer']['items'] = array(
      '#type' => 'container',
  );
  foreach ($items as $item) {

    //$price = $item->convertedUnitAmount;
    $price = $item->unitAmount;
    $options = array();
    foreach ($item->options as $option) {
      $price+=$option->subTotalAmount;
      $options[] = $option->description;
    }


    $form['offer']['items'][$item->id] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('item', 'clearfix')),
    );

    $form['offer']['items'][$item->id]['description'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('description')),
    );

    $priceGroup = \printconnect\Products\PriceGroups\Factory::Get($item->productPriceGroupId);
    $productId = $priceGroup->product;

    $form['offer']['items'][$item->id]['image'] = array(
        '#theme' => 'image',
        '#path' => _pcproducts_getimage('products', $productId),
    );

    $form['offer']['items'][$item->id]['description']['title'] = array(
        '#type' => 'item',
        '#title' => t('Description'),
        '#markup' => $item->description,
    );

    $form['offer']['items'][$item->id]['description']['quantity'] = array(
        '#type' => 'item',
        '#markup' => $item->quantity . ' ' . t('pcs.'),
    );

    if (count($options)) {
      //var_dump($options);
      $form['offer']['items'][$item->id]['description']['options'] = array(
          '#theme' => 'item_list',
          '#items' => $options,
      );
    }



    $form['offer']['items'][$item->id]['description']['price'] = array(
        '#theme' => 'price',
        '#value' => $item->unitAmount,
    );

    if ($item->comment !== null) {
      $form['offer']['items'][$item->id]['footer'] = array(
          '#type' => 'container',
          '#attributes' => array('class' => array('footer', 'clearfix')),
          '#weight' => 100,
      );
      $form['offer']['items'][$item->id]['footer']['comment'] = array(
          '#type' => 'item',
          '#title' => t('Comment'),
          '#markup' => $item->comment,
      );
    }
  }

  foreach ($offerItemsAdditional as $item) {
    $form['offer']['additionalItems'][$item->id] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('additionalItems', 'clearfix')),
    );

    $form['offer']['additionalItems'][$item->id]['description'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('description')),
    );

    $form['offer']['additionalItems'][$item->id]['description']['title'] = array(
        '#type' => 'item',
        '#title' => t('Description'),
        '#markup' => $item->description,
    );

    $form['offer']['additionalItems'][$item->id]['description']['quantity'] = array(
        '#type' => 'item',
        '#markup' => $item->quantity . ' ' . t('pcs.'),
    );

    $form['offer']['additionalItems'][$item->id]['description']['price'] = array(
        '#theme' => 'price',
        '#value' => $item->convertedUnitAmount,
    );
  }

  $form['offer']['footer']['priceblock']['block'] = array(
      '#theme' => 'priceblock',
      '#subtotal' => $offer->subTotalAmount,
      '#vatAmount' => $offer->vatAmount,
  );

  $today = new DateTime();
  $expireDate = new DateTime($offer->expirationDate);
  if ($expireDate > $today) {
    $form['offer']['actions'] = array(
        '#type' => 'actions',
    );

    $form['offer']['actions']['price'] = array(
        '#theme' => 'price',
        '#value' => $offer->totalAmount,
        '#title' => t('Total incl. VAT'),
    );
    if ($offer->status->tag == 'offerStatusOpen') {
      $form['offer']['actions']['submit'] = array(
          '#type' => 'submit',
          '#value' => t('Add to cart'),
          '#attributes' => array('class' => array('large', 'cart')),
      );

      $form['reject'] = array(
          '#type' => 'submit',
          '#value' => t('Reject'),
          '#attributes' => array('class' => array( 'reject')),
          '#submit' => array('_pcoffers_offer_reject'),
      );
    }
  }

  $form_state['storage']['offer'] = $offer;

  return $form;
}

function pcoffers_offer_form_submit($form, &$form_state) {
  $offer = $form_state['storage']['offer'];
  $cart = Factory::CreateCart($offer);

  if ($cart === false) {
    drupal_set_message(t('Your offer has already been used.'), 'error');
    return;
  }

  $_SESSION['cartid'] = $cart->id;

  $form_state['storage']['offer'] = $offer;
  drupal_goto('cart');
}

function pcoffers_offerentry_form($form, &$form_state) {
  $form['hash'] = array(
      '#type' => 'textfield',
      '#title' => t('Enter your offer code'),
  );

  $form['actions'] = array(
      '#type' => 'actions',
  );

  $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Submit'),
  );

  return $form;
}

function pcoffers_offerentry_form_validate($form, &$form_state) {
  $hash = $form_state['values']['hash'];
  $offer = Factory::GetById($hash);

  if (!$offer) {
    form_set_error('hash', t('Offer not found'));
  }
}

function pcoffers_offerentry_form_submit($form, &$form_state) {
  drupal_goto('offer/hash/' . $form_state['values']['hash']);
}

function _pcoffers_offer_reject($form, &$form_state) {
  $offer = $form_state['storage']['offer'];

  Factory::RejectOffer($offer);

  drupal_goto('myprintconnect/offers');
}

function _pcoffers_offers_form() {
  $customer = CustomersFactory::Current();
  $offers = Factory::GetAllByCustomer($customer, FALSE);
  $today = new DateTime();

  $rows = array();
  foreach ($offers as $offer) {
    $expireDate = new DateTime($offer->expirationDate);
    $status = t('Open');
    $link = l($offer->number, "myprintconnect/offers/$offer->hash", array('html' => TRUE, 'attributes' => array('class' => array('open'))));
    if ($offer->rejected) {
      $status = t('Rejected');
      $link = $offer->number;
    } elseif ($expireDate < $today) {
      $status = t('Expired');
    }

    //drupal_set_message(print_r($offer));
    
    //$status = $offer->status;
    $status = $offer->status->translate;

    $detail = _pcoffers_get_items($offer);
    $rows[] = array(
         $link,
        format_date(strtotime($offer->creationDate), 'medium', 'd-m-y'),
        theme('price', array('value' => $offer->subTotalAmount)),
        render($detail),
        $status,
    );
  }

  $form['myoffers'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('myoffers')),
      '#weight' => 10,
  );
  $form['myoffers']['list'] = array(
      '#markup' => theme(
              'table', array(
          'rows' => $rows,
          'header' => array(
              t('Number'),
              t('Created'),
              t('Price'),
              t('Items'),
              t('Status')
          ),
          'empty' => t('No offers'),
          'attributes' => array(
              'class' => array(
                  'list',
                  'offers'
              )
          )
              )
      )
  );

  return $form;
}

function _pcoffers_get_items(Offer $offer) {
  $result = array();
  $items = $offer->offerItems;
  $additionalItems = $offer->offerItemsAdditional;
  foreach ($items as $item) {
    $result[] = array(
        'data' => $item->description,
        'id' => 'offer_item_' . $item->id,
    );
  }
  foreach ($additionalItems as $item) {
    $result[] = array(
        'data' => $item->description,
        'id' => 'offer_item_' . $item->id,
    );
  }

  return theme_item_list(
                  array(
                      'items' => $result,
                      'title' => null,
                      'type' => 'ul',
                      'attributes' => array(
                          'class' => 'itemlist'
                      )
                  )
  );
}


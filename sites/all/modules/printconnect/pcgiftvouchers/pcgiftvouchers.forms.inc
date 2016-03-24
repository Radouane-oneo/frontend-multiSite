<?php

function pcgiftvouchers_config_form($form, &$form_state, $giftVoucherId = FALSE) {
  $giftVoucher = FALSE;
  if ($giftVoucherId) {
    $giftVoucher = \printconnect\GiftVouchers\Factory::Get($giftVoucherId);
    if (in_array($giftVoucher->amount, array(25, 100, 250))) {
      $defaultOption = $giftVoucher->amount;
    } else {
      $defaultOption = 'custom';
    }
    $amount = $giftVoucher->amount;
  } else {
    $defaultOption = 25;
    $amount = 25;
  }

  $form_state['storage']['giftvoucher'] = $giftVoucher;

  $ajax = array(
      'callback' => 'pcgiftvouchers_config_form_callback',
      'wrapper' => 'priceblock',
      'method' => 'replace',
      'effect' => 'fade',
      'progress' => array(
          'message' => NULL,
          'type' => NULL,
      ),
  );
  $options = array(
      '25' => array(
          'amount' => theme('price', array('value' => 25)),
          'text' => t('Ideal for business cards'),
          '#attributes' => array('no_striping' => TRUE),
      ),
      '100' => array(
          'amount' => theme('price', array('value' => 100)),
          'text' => t('Ideal for envelopes'),
          '#attributes' => array('no_striping' => TRUE),
      ),
      '250' => array(
          'amount' => theme('price', array('value' => 250)),
          'text' => t('Ideal for print packages'),
          '#attributes' => array('no_striping' => TRUE),
      ),
      'custom' => array(
          'amount' => t('Choose an amount'),
          '#attributes' => array('no_striping' => TRUE, 'class' => array('custom')),
      )
  );


  $form['giftvouchers'] = array(
      '#type' => 'fieldset',
      '#title' => t('Gift vouchers'),
  );

  $form['giftvouchers']['content'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('content', 'clearfix')),
  );

   $form['giftvouchers']['content']['text'] = array(
      '#type' => 'item',
      '#markup' => t('Prints as a gift! Intro text on giftvouchers'),
  );
  
  $form['giftvouchers']['content']['amount'] = array(
      '#id' => 'amount',
      //  '#title' => t('Choose an amount'),
      '#type' => 'textfield',
      '#size' => 6,
      '#maxlength' => 6,
      '#ajax' => $ajax,
      '#default_value' => $giftVoucher ? $giftVoucher->convertedAmount : 25,
      '#states' => array(
          'visible' => array(
              ':input[name="amounts"]' => array('value' => 'custom'),
          ),
      ),
  );

  $form['giftvouchers']['content']['amounts'] = array(
      '#type' => 'tableselect',
      '#multiple' => FALSE,
      '#options' => $options,
      '#header' => array('amount' => t('Amount'), 'text' => t('Text')),
      '#default_value' => $defaultOption,
      '#ajax' => $ajax,
      '#attributes' => array('class' => array('grid', 'clearfix')),
          //'25' => array('#title_display' => 'invisible'),
  );

  $form['giftvouchers']['footer'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('footer', 'clearfix')),
  );

  $form['giftvouchers']['footer']['delivery'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('delivery')),
  );

  $form['giftvouchers']['footer']['delivery']['image'] = array(
      '#markup' => theme('image', array('path' => drupal_get_path('module', 'pcgiftvouchers') . '/postal.jpg')),
  );
  $form['giftvouchers']['footer']['delivery']['text'] = array(
      '#type' => 'item',
      '#markup' => t('This product will be shipped with BPost'),
  );

  $form['giftvouchers']['footer']['price'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('pricing')),
  );
  $form['giftvouchers']['footer']['price']['block'] = array(
      '#id' =>  'priceblock',
      '#type' => 'item',
      '#markup' => theme('priceblock', array('subtotal' => $amount))
  );


  $form['#pre_render'][] = 'pcgiftvouchers_config_form_prerender';

  return $form;
}

function pcgiftvouchers_config_form_prerender(&$form) {
  $form['giftvouchers']['content']['amounts']['#options']['custom']['amount'] .= drupal_render($form['giftvouchers']['content']['amount']);
  return $form;
}

function pcgiftvouchers_config_form_validate($form, &$form_state) {
  if ($form_state['values']['amounts'] != 'custom') {
    $amount = $form_state['values']['amounts'];
  } else {
    $amount = $form_state['values']['amount'];
  }

  $form_state['storage']['amount'] = $amount;

}

function pcgiftvouchers_config_form_submit($form, &$form_state) {
// drupal_goto('myprintconnect/credit');
}

function pcgiftvouchers_config_form_callback(&$form, &$form_state) {
  $amount = $form_state['storage']['amount'];
  $form['giftvouchers']['footer']['price']['block']['#markup'] = theme('priceblock', array('subtotal' => $amount));
  return $form['giftvouchers']['footer']['price']['block'];
}
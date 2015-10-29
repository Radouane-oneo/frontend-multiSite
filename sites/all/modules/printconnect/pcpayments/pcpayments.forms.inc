<?php

//http://www.printconnect.be/paymentrequest/key/7009_6da9

use printconnect\Payments\Requests;
use printconnect\PaymentMethods;
use printconnect\Drupal\Functions;

function pcpayments_request_form($form, &$form_state, $key) {

  $cost = 0;
  $rate = 0;

  try {
    $request = Requests\Factory::GetByKey($key);
    $request->EnsureLoaded();
  } catch (\Exception $ex) {
    $form['info'] = array('#markup' => t('This payment request does not exists (anymore)...'));
    return $form;
  }
  $amount = $request->amount;

  $paymentMethods = PaymentMethods\Factory::GetAll();

  $options = array();
  $methods = array();


  $first = FALSE;

  foreach ($paymentMethods as $value) {
    if ($value->paymentMethod->internalName != 'cod' && $value->paymentMethod->internalName != 'invoice') {
      if (!$first) {
        $first = $value;
      }

      $cost = $value->CalculateCost($amount);

      $methods[$value->id] = array(
          //'image' => theme('image', array('path' => printconnect_getimage('paymentmethods', $value->paymentMethod->internalName))),
          'name' => $value->paymentMethod->tag,
          'cost' => theme('price', array('value' => $cost, 'free' => TRUE)),
          'description' => $value->paymentMethod->descriptionTag,
      );
    }
  }
  variable_set("methodePayement", $methods);
  $default = FALSE;

  if (isset($form_state['values']['payment']['method'])) {
    $default = $form_state['values']['payment']['method'];
  } else {
    $default = $value->id;
  }

  $amount = $request->amount;
  $paymentMethod = PaymentMethods\Factory::Get($default);

  $cost = $paymentMethod->CalculateCost($amount);
  //$amount += $cost;
  $vat = $request->vat;
  $vatAmount = $amount * $vat;
  $total = $amount * (1 + $vat);


  $ajax = array(
      'callback' => 'pcpayments_request_form_callback',
      'wrapper' => 'pcpayments-request-form',
      'method' => 'replace',
      'effect' => 'fade',
      'progress' => array(
          'message' => NULL,
          'type' => NULL,
      ),
  );
  $form['info'] = array(
      '#markup' => t('Payment request intro'),
      '#weight'=> 0,
      );
  $form['wrapper'] = array(
      "#id"=>"wrapperDescription",
      '#type' => 'container',
      '#weight'=> 1,
  );
  $form['wrapper']['description'] = array(
      '#type' => 'item',
      '#title' => strtoupper(t('Description')) . ' : ',
      '#markup' => "<div class ='textDescription'>$request->description</div>",
  );
  $form['wrapperPayement_Price'] = array(
      '#type' => 'container',
      '#attributes' => array('id' => 'wrapperPayement_Price'),
       '#weight'=> 2,
  );
  $form['wrapperPayement_Price']['payment'] = array(
      '#type' => 'fieldset',
      '#attributes' => array('class' => array('payment')),
  );

  $form['wrapperPayement_Price']['payment']['method'] = array(
      '#type' => 'tableselect',
      '#multiple' => FALSE,
      '#options' => $methods,
      '#header' => array('name' => t('Name'), 'cost' => t('Cost'), 'description' => t('Description')),
//      '#header' => array('image' => '', 'name' => '', 'cost' => ''/* , 'description' => '' */),
      //'#default_value' => $defaultOption,
      '#ajax' => $ajax,
      '#required' => TRUE,
      '#attributes' => array('class' => array('grid', 'clearfix','methodePayement','rows-6')),
      '#default_value' => $default,
  );
    $form['wrapperPayement_Price']['payment']["aboutMethode"] = array(
      '#type' => 'item',
      '#id' => 'edit-aboutmethode',
      '#markup' => t('textImagePayment'),
    );
    
     $form['wrapperPayement_Price']["textpayment"] = array(
      '#type' => 'item',
      '#id' => 'textpaymentRequest',
      '#markup' => "<p></p>",
    );

    $form['actions'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('actions', 'form-actions')),
        '#weight'=> 10,
      );
    $form['actions']['price'] = array(
      '#id' => 'price',
      '#theme' => 'price',
      '#value' => $amount+$vatAmount,
      '#attributes' => array('id' => 'price'),
      '#title' => t('VAT incl.'),
    );
  $form['actions']['button'] = array(
      '#type' => 'submit',
      '#value' => t('Proceed'),
      '#attributes' => array('class' => array('button', 'action', 'continue', 'large', 'right')),
  );
  $form['#id'] ="pcpayments-request-form";
  $form_state['storage']['totalExclVat'] = $amount;
  $form_state['storage']['total'] = $total;
  $form_state['storage']['request'] = $request;
  $form_state['storage']['order'] = $request->order;
  $form_state['cache'] = TRUE;

  return $form;
}

function pcpayments_request_form_submit($form, &$form_state) {
  $paymentgateway = variable_get('pc_paymentgateway', 'pcogone');
  $paymentgateway = 'pcpayments';
   $paymentMethod = \printconnect\PaymentMethods\Factory::Get($form_state['values']['method']);
  \printconnect\PaymentMethods\Factory::LoadPaymentMethod($paymentMethod);

  if ($paymentMethod->paymentMethod->internalName == 'transfer' || $paymentMethod->paymentMethod->internalName == 'cheque') {
    $request = $form_state['storage']['request'];
    drupal_goto('myprintconnect/orders/' . $request->order . '/confirmation');
  }
  // $requestInfo = \printconnect\Payments\Requests\Info\Factory::CreatePaymentRequest($request->id, $paymentMethodId);
  if (function_exists(($paymentgateway . '_processpayment'))) {
    $request = $form_state['storage']['request'];
    $url = call_user_func($paymentgateway . '_processpayment', $form_state['values']['method'], '', $request->id, $form_state['storage']['total'], array(
        'accept' => 'myprintconnect/orders/' . $request->order,
        'cancel' => 'paymentrequest/key/' . $request->key,
        'paymentRequest' => $request,
        
            ));

    drupal_goto($url);
    $_SESSION['paymentrequest'][$request->key]['redirect'] = $url;
  } else {
    form_set_error('method', t('Not implemented.'));
  }
}

function pcpayments_request_form_callback(&$form, &$form_state) {
  $request = $form_state['storage']['request'];
  $amount = $request->amount;
  $paymentMethodId = $form_state['values']['method'];
  $paymentMethod = PaymentMethods\Factory::Get($paymentMethodId);

  $cost = $paymentMethod->CalculateCost($amount);
  $amount += $cost;
  $vat = $request->vat;
  $vatAmount = $amount * $vat;
  $total = $amount * (1 + $vat);
  $form_state['storage']['amount'] = $amount;
  $form_state['storage']['vatAmount'] = $vatAmount;
  $form_state['storage']['total'] = $total;
  $methodePayement=  variable_get("methodePayement");

  //$amount = $form_state['storage']['amount'];
  //$vatAmount = $form_state['storage']['vatAmount'];
  //$form['payment']['footer']['price']['block']['#markup'] = theme('priceblock', array('subtotal' => $amount, 'vatAmount' => $vatAmount));
  $form['priceblock']['#subtotal'] = $amount;
  $form['priceblock']['#vatAmount'] = $vatAmount;
  //return $form['payment']['footer']['price']['block'];
  $form['actions']['price']['#value']=$total;
  $rows = variable_get("items");
  array_pop($rows);
  $rows[] = array(
      'no_striping' => TRUE,
      'class' => array('productItem'),
      'data' => array(
          $paymentMethod->paymentMethod->tag,
          array(
              'data' => theme('price', array('value' => $cost, 'free' => TRUE)),
              'class' => array('text-right'),
          ),
      ),
  );
  $rows[] = array(
        'no_striping' => TRUE,
        'data' => array(
            t('VAT'),
            array(
                'data' => theme('price', array('value' =>$vatAmount, 'free' => TRUE)),
                'class' => array('text-right'),
            ),
        ),
    );
  $form['order']['list'] = array(
      '#markup' => theme('table', array('rows' => $rows)),
  );
  $form['wrapperPayement_Price']["textpayment"]["#markup"]='<p>' . $methodePayement[$form_state['values']['method']]['description'] .'</p>';
  return $form;
}

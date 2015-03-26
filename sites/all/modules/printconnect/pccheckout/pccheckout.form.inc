<?php

use printconnect\Carts\Factory as CartsFactory;
use printconnect\Diagnostics\Debug;
use printconnect\Drupal\Forms;
use printconnect\Drupal\Functions;
use printconnect\Customers\Addresses;
use printconnect\Customers;
use printconnect\Carts;
use printconnect\PaymentMethods;
use printconnect\PickupPoints;
use printconnect\Products\Options;
use printconnect\Products\Configurations;
use \printconnect\Products\Toolbox;
use \printconnect\Products\PriceGroups;
use \printconnect\Products;

function pccheckout_personal_form($form, &$form_state) {
  $customer = Customers\Factory::Current();

  $form['personal'] = array(
      '#type' => 'fieldset',
      '#title' => t('Your details'),
      '#collapsible' => FALSE,
      '#attributes' => array('class' => array('first')),
  );

  $firstName = $customer->firstName;
  $lastName = $customer->lastName;


//  $form['personal']['header'] = array(
//      '#prefix' => '<h2>',
//      '#markup' => t('Your details'),
//      '#suffix' => '</h2>',
//  );

  $form['personal']['text'] = array(
      '#prefix' => '<p>',
      '#suffix' => '</p>',
      '#markup' => t('In case something is unclear, we need your contact details.'),
  );
  $form['personal']['firstName'] = array(
      '#type' => 'textfield',
      '#title' => t('First name'),
      '#required' => TRUE,
      '#size' => 30,
      '#default_value' => $firstName,
  );
  $form['personal']['lastName'] = array(
      '#type' => 'textfield',
      '#title' => t('Last name'),
      '#required' => TRUE,
      '#size' => 30,
      '#default_value' => $lastName,
  );
  $form['personal']['phone'] = array(
      '#type' => 'textfield',
      '#title' => t('Mobile number'),
      '#required' => TRUE,
      '#size' => 30,
      '#default_value' => $customer ? $customer->phone : '',
  );

  $form['actions'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('form-actions', 'clearfix')),
  );
  $form['actions']['submit'] = array(
      '#name' => 'personal-submit',
      '#type' => 'submit',
      '#value' => t('Continue'),
      '#attributes' => array('class' => array('action', 'button', 'large', 'continue')),
  );


  $form['#id'] = 'pccheckout-checkout-form';

  $form['shipping'] = array(
      '#type' => 'fieldset',
      '#title' => t('Shipping'),
      '#collapsible' => FALSE,
      '#attributes' => array('class' => array('second', 'disabled', 'collapsed')),
  );

  $form['payment'] = array(
      '#type' => 'fieldset',
      '#title' => t('Payment'),
      '#collapsible' => FALSE,
      '#attributes' => array('class' => array('third', 'disabled', 'collapsed')),
  );

  return $form;
}

function pccheckout_personal_form_submit($form, &$form_state) {
  global $language;
  $customer = Customers\Factory::Current();
  $customer->firstName = $form_state['values']['firstName'];
  $customer->lastName = $form_state['values']['lastName'];
  $customer->phone = $form_state['values']['phone'];
  if (isset($language->id)) {
    $customer->language = $language->id;
  } else {
    $customer->language = 1;
  }
  Customers\Factory::Save($customer);

  drupal_goto('checkout/shipping');
  exit;
}

function pccheckout_shipping_form($form, &$form_state) {
  $customer = Customers\Factory::Current();
  $cart = _pccheckout_cart();
  $shopConfig = \printconnect\Shop\Configuration\Factory::Current();
  $defaultCountry = \printconnect\Countries\Factory::Get($shopConfig->defaultCountry);
  $defaultShippingAddress = FALSE;
  $defaultBillingAddress = FALSE;
  $defaultNeedInvoice = FALSE;


  if ($cart->shipping_address) {
    $defaultShippingAddress = \printconnect\Customers\Addresses\Factory::Get($cart->shipping_address, FALSE);
  }
  if ($cart->billing_address) {
    $defaultBillingAddress = \printconnect\Customers\Addresses\Factory::Get($cart->billing_address, FALSE);
    $defaultNeedInvoice = TRUE;
  }

  $addresses[0] = ' - ' . t('New') . ' - ';
  foreach (Addresses\Factory::GetAddresses($customer) as $address) {
    if ($address->company != '') {
      $addresses[$address->id] = $address->company;
    } else {
      $addresses[$address->id] = $address->name;
    }
    if (!$defaultShippingAddress && $address->defaultShipping) {
      $defaultShippingAddress = $address;
      $form_state['storage']['defaultShippingAddress'] = $defaultShippingAddress ? $defaultShippingAddress : FALSE;
    }
    if (!$defaultBillingAddress && $address->defaultBilling) {
      $defaultBillingAddress = $address;
//$defaultNeedInvoice = TRUE;
    }
  }

  $shippingTypes = \printconnect\Shipping\Types\Factory::GetAll();
  foreach ($shippingTypes as $type) {
    if ($cart->orderItemShipping->shippingTypeResellerShop == $type->id) {
      $form_state['storage']['shippingType'] = $type->shippingType->type;
      $shippingType = $type->shippingType->type;
    }
  }
  $deliveryCountries = array();
  $items = printconnect\Countries\Factory::GetAll();
  foreach ($items as $country) {
    $countries[$country->id] = $country->tag;
    if ($country->active /* && ($shippingType <> 'shippingTypeBpostHome' || $country->id == 21) */) {
      $deliveryCountries[$country->id] = $country->tag;
    }
  }



  $shippingTypes = \printconnect\Shipping\Types\Factory::GetAll();


  foreach ($shippingTypes as $type) {
    if ($cart->orderItemShipping->shippingTypeResellerShop == $type->id) {
      $form_state['storage']['shippingType'] = $type->shippingType->type;
    }
  }


  $form['shipping'] = array(
      '#type' => 'fieldset',
      '#title' => t('Shipping'),
      '#collapsible' => FALSE,
      '#attributes' => array('class' => array('second')),
  );

  if ($cart && $cart->isPickup) {
//<editor-fold defaultstate="collapsed" desc="Pickup">

    $form['shipping']['pickup']['text'] = array(
        '#prefix' => '<p>',
        '#suffix' => '</p>',
        '#markup' => t('You specified to pick this parcel up at a pick up point.'),
    );
    /*
      $form['shipping']['pickup']['id'] = array(
      '#type' => 'hidden',
      '#default_value' => $cart->pickuppoint ? $cart->pickuppoint->id : '',
      '#attributes' => array('class' => array('id')),
      );

      $form['shipping']['pickup']['country'] = array(
      '#type' => 'hidden',
      '#default_value' => $cart->pickuppoint ? $cart->pickuppoint->country : '',
      '#attributes' => array('class' => array('country-code')),
      );

     */

    $form['shipping']['pickup']['contact'] = array(
        '#type' => 'textfield',
        '#title' => t('Who will pick up your print work?'),
        '#required' => TRUE,
        '#default_value' => isset($cart->pickuppoint) && isset($cart->pickuppoint->contactName) ? $cart->pickuppoint->contactName : ($customer ? $customer->name : ''),
        '#size' => 30,
    );

    $form['shipping']['pickup']['sms'] = array(
        '#type' => 'textfield',
        '#title' => t('SMS'),
        '#default_value' => isset($cart->pickuppoint) && isset($cart->pickuppoint->phone) ? $cart->pickuppoint->phone : ($customer ? $customer->phone : ''),
        '#size' => 30,
    );

    $form['shipping']['pickup']['email'] = array(
        '#type' => 'textfield',
        '#title' => t('Email'),
        '#default_value' => isset($cart->pickuppoint) && isset($cart->pickuppoint->email) ? $cart->pickuppoint->email : ($customer ? $customer->email : ''),
        '#size' => 30,
    );

    $form['shipping']['pickup']['neutral'] = array(
        '#type' => 'checkbox',
        '#title' => t('Neutral shipping'),
        '#default_value' => $cart->neutralShipping,
    );

//</editor-fold>
  } else {
//<editor-fold defaultstate="collapsed" desc="Delivery">

    if ($cart && $cart->HasProperty('shipping_address') && !$cart->isPickup) {
      $defaultShippingAddress = Addresses\Factory::Get($cart->shipping_address);
      $defaultShippingAddress->EnsureLoaded();
    }

    $form['shipping']['delivery'] = array(
        '#type' => 'container',
        '#id' => 'delivery',
    );

    $form['shipping']['delivery']['text'] = array(
        '#prefix' => '<p>',
        '#suffix' => '</p>',
        '#markup' => t('You specified a delivery for this order. Whom shall we ship it to?'),
    );

    $form['shipping']['delivery']['address'] = array(
        '#type' => 'select',
        '#title' => t('Address'),
        '#options' => $addresses,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->id : 0,
        '#ajax' => array(
            'callback' => 'pccheckout_shipping_form_delivery_address_callback',
            'wrapper' => 'delivery',
            'method' => 'replace',
            'effect' => 'fade',
            'progress' => array(
                'message' => NULL,
                'type' => NULL,
            ),
        ),
    );
//  }

    $form['shipping']['delivery']['name'] = array(
        '#type' => 'textfield',
        '#title' => t('Name'),
        '#required' => TRUE,
        '#size' => 30,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->name : ($customer ? $customer->name : ''),
    );

    $form['shipping']['delivery']['company'] = array(
        '#type' => 'textfield',
        '#title' => t('Company'),
        '#required' => FALSE,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->company : '',
        '#size' => 30,
    );
    $form['shipping']['delivery']['street'] = array(
        '#type' => 'textfield',
        '#title' => t('Street'),
        '#required' => TRUE,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->street : '',
        '#size' => 30,
    );
    $form['shipping']['delivery']['postalCode'] = array(
        '#type' => 'textfield',
        '#title' => t('Postal code'),
        '#required' => TRUE,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->postalCode : '',
        '#size' => 30,
    );
    $form['shipping']['delivery']['city'] = array(
        '#type' => 'textfield',
        '#title' => t('City'),
        '#required' => TRUE,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->city : '',
        '#size' => 30,
    );
    $form['shipping']['delivery']['country'] = array(
        '#type' => 'select',
        '#title' => t('Country'),
        '#required' => TRUE,
        '#empty_value' => 0,
        '#options' => $deliveryCountries,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->country : $defaultCountry->id,
    );
    $form['shipping']['delivery']['phone'] = array(
        '#type' => 'textfield',
        '#title' => t('Phone'),
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->phone : ($customer ? $customer->phone : ''),
        '#size' => 30,
    );

    if (variable_get('pc_flow', FALSE) == 'flyer') {
      $form['shipping']['delivery']['neutral'] = array(
          '#type' => 'checkbox',
          '#title' => t('Neutral shipping'),
          '#default_value' => $cart ? $cart->neutralShipping : false,
      );
    }

//</editor-fold>
  }

  $form['shipping']['invoice'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('box', 'invoice')),
  );
  $form['shipping']['invoice']['header'] = array(
      '#type' => 'fieldset',
      '#attributes' => array('class' => array('header', 'invoice')),
      '#title' => t('Need an invoice?'),
  );
//  $form['shipping']['invoice']['header']['title'] = array(
//      '#markup' => '<h2>' . t('Need an invoice?') . '</h2>',
//  );
  $form['shipping']['invoice']['header']['needinvoice'] = array(
      '#type' => 'checkbox',
      '#default_value' => $defaultNeedInvoice,
      '#title' => t('I need an invoice for my tax collector'),
  );
  $form['shipping']['invoice']['address'] = array(
      '#type' => 'container',
      '#id' => 'invoice-address',
      '#states' => array(
          'invisible' => array(
              'input[name="shipping[invoice][header][needinvoice]"]' => array('checked' => FALSE),
          ),
      ),
  );

  $form['shipping']['invoice']['address']['address'] = array(
      '#type' => 'select',
      '#title' => t('Address'),
      '#options' => $addresses,
      '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->id : 0,
      '#ajax' => array(
          'callback' => 'pccheckout_shipping_form_invoice_address_callback',
          'wrapper' => 'invoice-address',
          'method' => 'replace',
          'effect' => 'fade',
          'progress' => array(
              'message' => NULL,
              'type' => NULL,
          ),
      ),
  );

  $states = array(
      'required' => array(
          'input[name="shipping[invoice][header][needinvoice]"]' => array('checked' => TRUE),
      ),
  );

  $form['shipping']['invoice']['address']['company'] = array(
      '#type' => 'textfield',
      '#title' => t('Company'),
      '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->company : '',
      '#size' => 30,
      '#states' => $states,
  );
  $form['shipping']['invoice']['address']['name'] = array(
      '#type' => 'textfield',
      '#title' => t('Name'),
      '#size' => 30,
      '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->name : ($customer ? $customer->name : ''),
      '#states' => $states,
  );
  $form['shipping']['invoice']['address']['street'] = array(
      '#type' => 'textfield',
      '#title' => t('Street'),
      '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->street : '',
      '#size' => 30,
      '#states' => $states,
  );
  $form['shipping']['invoice']['address']['postalCode'] = array(
      '#type' => 'textfield',
      '#title' => t('Postal code'),
      '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->postalCode : '',
      '#size' => 30,
      '#states' => $states,
  );
  $form['shipping']['invoice']['address']['city'] = array(
      '#type' => 'textfield',
      '#title' => t('City'),
      '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->city : '',
      '#size' => 30,
      '#states' => $states,
  );
  $form['shipping']['invoice']['address']['country'] = array(
      '#type' => 'select',
      '#title' => t('Country'),
      '#options' => $countries,
      '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->country : $defaultCountry->id,
      '#states' => $states,
      '#ajax' => array(
          'callback' => 'pccheckout_shipping_form_invoice_address_country_callback',
          'wrapper' => 'vatNumber',
          'method' => 'replace',
          'effect' => 'fade',
          'progress' => array(
              'message' => NULL,
              'type' => NULL,
          ),
      ),
  );


  if ($defaultBillingAddress) {
    $country = printconnect\Countries\Factory::Get($defaultBillingAddress->country);
  } else {
    $country = FALSE;
  }


  $form['shipping']['invoice']['address']['vatNumber'] = array(
      '#prefix' => '<div id="vatNumber">',
      '#suffix' => '</div>',
      '#id' => 'vatNumber',
      '#type' => 'vatfield',
      '#title' => t('Vat number'),
      '#attributes' => array('class' => array('vat')),
      '#default_value' => $defaultBillingAddress ? ($defaultBillingAddress->vatNumber != '' ? $defaultBillingAddress->vatNumber : $country->iso) : $defaultCountry->iso,
  );

  $form['shipping']['invoice']['address']['reference'] = array(
      '#type' => 'textfield',
      '#title' => t('Reference'),
      //    '#required' => TRUE,
      '#default_value' => $cart ? $cart->customerReference : '',
      '#size' => 30,
  );

  $form['actions'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('form-actions', 'clearfix')),
  );

  $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Continue'),
      '#attributes' => array('class' => array('action', 'button', 'large', 'continue')),
  );

  $form_state['storage']['customer'] = $customer;
  $form_state['storage']['cart'] = $cart;


  $form['#tree'] = TRUE;
  $form['#cache'] = FALSE;
  $form['#id'] = 'pccheckout-checkout-form';

  $form['personal'] = array(
      '#type' => 'fieldset',
      '#title' => l(t('Your details'), 'checkout/personal'),
      '#collapsible' => FALSE,
      '#attributes' => array('class' => array('first', 'collapsed')),
      '#weight' => -10,
  );

  $form['payment'] = array(
      '#type' => 'fieldset',
      '#title' => t('Payment'),
      '#collapsible' => FALSE,
      '#attributes' => array('class' => array('third', 'disabled', 'collapsed')),
  );

  return $form;
}

function pccheckout_shipping_form_invoice_address_callback($form, $form_state) {
  $addressId = $form_state['values']['shipping']['invoice']['address']['address'];
  if ($addressId == 0) {
    $form['shipping']['invoice']['address']['name']['#value'] = '';
    $form['shipping']['invoice']['address']['company']['#value'] = '';
    $form['shipping']['invoice']['address']['street']['#value'] = '';
    $form['shipping']['invoice']['address']['postalCode']['#value'] = '';
    $form['shipping']['invoice']['address']['city']['#value'] = '';
    $form['shipping']['invoice']['address']['country']['#value'] = '';
    $form['shipping']['invoice']['address']['phone']['#value'] = '';
    $form['shipping']['invoice']['address']['vatNumber']['country']['#value'] = '';
    $form['shipping']['invoice']['address']['vatNumber']['number']['#value'] = '';
  } else {
    $address = Addresses\Factory::Get($addressId);
    $address->EnsureLoaded();

    $country = printconnect\Countries\Factory::Get($address->country);

    $form['shipping']['invoice']['address']['name']['#value'] = $address->name;
    $form['shipping']['invoice']['address']['company']['#value'] = $address->company;
    $form['shipping']['invoice']['address']['street']['#value'] = $address->street;
    $form['shipping']['invoice']['address']['postalCode']['#value'] = $address->postalCode;
    $form['shipping']['invoice']['address']['city']['#value'] = $address->city;
    $form['shipping']['invoice']['address']['country']['#value'] = $address->country;
    $form['shipping']['invoice']['address']['phone']['#value'] = $address->phone;
    $form['shipping']['invoice']['address']['vatNumber']['country']['#value'] = $country->vatPrefix;
    $form['shipping']['invoice']['address']['vatNumber']['number']['#value'] = _pccheckout_vatnumber($address->vatNumber);
  }
  return $form['shipping']['invoice']['address'];
}

function pccheckout_shipping_form_invoice_address_country_callback($form, $form_state) {
  $country = printconnect\Countries\Factory::Get($form_state['values']['shipping']['invoice']['address']['country']);

  $form['shipping']['invoice']['address']['vatNumber']['country']['#value'] = $country->vatPrefix;

  return $form['shipping']['invoice']['address']['vatNumber'];
}

function pccheckout_shipping_form_delivery_address_callback($form, $form_state) {
  $addressId = $form_state['values']['shipping']['delivery']['address'];
  if ($addressId == 0) {
    $form['shipping']['delivery']['name']['#value'] = '';
    $form['shipping']['delivery']['company']['#value'] = '';
    $form['shipping']['delivery']['street']['#value'] = '';
    $form['shipping']['delivery']['postalCode']['#value'] = '';
    $form['shipping']['delivery']['city']['#value'] = '';
    $form['shipping']['delivery']['country']['#value'] = '';
    $form['shipping']['delivery']['phone']['#value'] = '';
  } else {
    $address = Addresses\Factory::Get($addressId);
    $address->EnsureLoaded();

    $form['shipping']['delivery']['name']['#value'] = $address->name;
    $form['shipping']['delivery']['company']['#value'] = $address->company;
    $form['shipping']['delivery']['street']['#value'] = $address->street;
    $form['shipping']['delivery']['postalCode']['#value'] = $address->postalCode;
    $form['shipping']['delivery']['city']['#value'] = $address->city;
    $form['shipping']['delivery']['country']['#value'] = $address->country;
    $form['shipping']['delivery']['phone']['#value'] = $address->phone;
  }
  return $form['shipping']['delivery'];
}

function pccheckout_shipping_form_validate(&$form, &$form_state) {
  $customer = $form_state['storage']['customer'];
  $cart = $form_state['storage']['cart'];

  if ($form_state['values']['shipping']['invoice']['header']['needinvoice']) {

    $addressId = $form_state['values']['shipping']['invoice']['address']['address'];

    if ($addressId == 0) {
      $address = Addresses\Factory::Create();
      $address->phone = $customer->phone;
    } else {
      $address = Addresses\Factory::Get($addressId);
      $address->EnsureLoaded();
    }
    Forms::LoadObject($form_state['values']['shipping']['invoice']['address'], $address);
    $address->customer = $customer->id;
    try {
      Addresses\Factory::Validate(clone $address);
    } catch (\printconnect\Dal\Exception $ex) {
      Forms::HandleException($ex, $form, 'shipping[invoice][address][');
    }
    $form_state['storage']['shipping']['invoice']['address'] = $address;
  }
  if ($cart && $cart->isPickup) {
    /*
      if (isset($form_state['values']['shipping']['pickup']['id']) && $form_state['values']['shipping']['pickup']['id'] == '') {
      form_set_error('shipping][pickup][new', t('Please select a pickup point'));
      } */
  } else {
    if (isset($form_state['values']['shipping']['delivery']['address'])) {
      $addressId = $form_state['values']['shipping']['delivery']['address'];

      $countryId = $form_state['values']['shipping']['delivery']['country'];

// TEST
//$countryId = 73;

      if ($countryId) {
        $country = \printconnect\Countries\Factory::Get($countryId);
        $city = urlencode($form_state['values']['shipping']['delivery']['city']);
        $postal = urlencode($form_state['values']['shipping']['delivery']['postalCode']);

        $url = 'http://maps.googleapis.com/maps/api/distancematrix/json?origins=Belgium&destinations=' . $postal . ',' . $country->tag . '&language=nl-BE&sensor=false';
// form_set_error('shipping][delivery][country', $url);
        $data = drupal_http_request($url);
        $result = json_decode($data->data);

        if ($result->rows[0]->elements[0]->status == 'ZERO_RESULTS' || $result->rows[0]->elements[0]->status == 'NOT_FOUND' || $result->rows[0]->elements[0]->distance->value > 2500000) {
          form_set_error('shipping][delivery][postalCode', t('There appears to be something wrong with your shipping address'));
        }
      }

      if ($addressId == 0) {
        $address = Addresses\Factory::Create();
        $address->firstName = $customer->firstName;
        $address->lastName = $customer->lastName;
        $address->phone = $customer->phone;
      } else {
        $address = Addresses\Factory::Get($addressId);
        $address->EnsureLoaded();
      }

      Forms::LoadObject($form_state['values']['shipping']['delivery'], $address);
      $address->customer = $customer->id;
      try {
        Addresses\Factory::Validate(clone $address);
      } catch (\printconnect\Dal\Exception $ex) {
        Forms::HandleException($ex, $form, 'shipping][delivery][');
      }
      $form_state['storage']['shipping']['delivery']['address'] = $address;
    }
  }

  if (isset($form['shipping']['giftvouchers'])) {

    $addressId = $form_state['values']['shipping']['giftvouchers']['address']['address'];

    if ($addressId == 0) {
      $address = Addresses\Factory::Create();
      $address->firstName = $customer->firstName;
      $address->lastName = $customer->lastName;
      $address->phone = $customer->phone;
    } else {
      $address = Addresses\Factory::Get($addressId);
      $address->EnsureLoaded();
    }

    Forms::LoadObject($form_state['values']['shipping']['giftvouchers'], $address);
    $address->customer = $customer->id;
    try {
      Addresses\Factory::Validate(clone $address);
    } catch (\printconnect\Dal\Exception $ex) {
      Forms::HandleException($ex, $form, 'shipping][giftvouchers][');
    }
    $form_state['storage']['shipping']['giftvouchers']['address'] = $address;

//    drupal_set_message('validate vouchers');
  }
}

function pccheckout_shipping_form_submit(&$form, &$form_state) {
  $customer = $form_state['storage']['customer'];
  $cart = $form_state['storage']['cart'];

  //drupal_set_message(print_r($form_state['values'], TRUE));

  if (isset($form_state['storage']['shipping']['delivery']['address'])) {
    $address = $form_state['storage']['shipping']['delivery']['address'];
    Addresses\Factory::Save($address);

    $cart->shipping_address = $address->id;
    $cart->Remove('pickuppoint');

    $cart->neutralShipping = isset($form_state['values']['shipping']['delivery']['neutral']) ? $form_state['values']['shipping']['delivery']['neutral'] : FALSE;
  }

  if (isset($form_state['storage']['shipping']['invoice']['address'])) {
    $address = $form_state['storage']['shipping']['invoice']['address'];
    Addresses\Factory::Save($address);

    $cart->country = $form_state['values']['shipping']['invoice']['address']['country'];
    $cart->vatNumber = $form_state['values']['shipping']['invoice']['address']['vatNumber'];
    $cart->billing_address = $address->id;
  } else {
    $cart->Remove('billing_address');
    $cart->Remove('country');
    $cart->Remove('vatNumber');
  }

  if (isset($form_state['values']['shipping']['pickup']['id']) || (isset($form_state['values']['pcflyerstores']['id']) && $form_state['values']['pcflyerstores']['id'])) {
    switch ($form_state['storage']['shippingType']) {
      case 'shippingTypeBpostPickupPoint':
        $poi = \printconnect\bPost\Factory::Get($form_state['values']['shipping']['pickup']['id']);
        $poi->EnsureLoaded();
        $cart->pickuppoint = $poi->cartObject;
        break;
//      case 'shippingTypeMondialRelay':
//        $pickuppoint = PickupPoints\Factory::Get($form_state['values']['shipping']['pickup']['id'], $form_state['values']['shipping']['pickup']['country']);
//        $pickuppoint->EnsureLoaded();
//        $cart->pickuppoint = $pickuppoint;
//        break;
      case 'shippingTypeStore' :
        $store = \printconnect\Stores\Factory::Get($form_state['values']['pcflyerstores']['id']);
        $store->EnsureLoaded();
        $cart->pickuppoint = $store->cartObject;
        break;
    }

    $cart->pickuppoint->contactName = $form_state['values']['shipping']['pickup']['contact'];
    $cart->pickuppoint->email = $form_state['values']['shipping']['pickup']['email'];
    $cart->pickuppoint->phone = $form_state['values']['shipping']['pickup']['sms'];

    $cart->neutralShipping = isset($form_state['values']['shipping']['pickup']['neutral']) ? $form_state['values']['shipping']['pickup']['neutral'] : FALSE;
  }

  foreach ($cart->giftVouchers as $giftVoucher) {
    if (isset($form_state['storage']['shipping']['giftvouchers']['address'])) {
      $address = $form_state['storage']['shipping']['giftvouchers']['address'];
      Addresses\Factory::Save($address);
      $addressId = $address->id;
    } else {
      $addressId = $cart->shipping_address;
    }

    $giftVoucher->address = $addressId;

    \printconnect\GiftVouchers\Factory::Save(new \printconnect\GiftVouchers\GiftVoucher($giftVoucher));
  }


  Addresses\Factory::ClearAddressesCache($customer);

  Carts\Factory::Save($cart);

  drupal_goto('checkout/payment');
// exit;
}

function pccheckout_payment_form2($form, &$form_state) {
  $customer = Customers\Factory::Current();
  $cart = _pccheckout_cart();
  $form['payment'] = array(
      '#id' => 'payment',
      '#type' => 'fieldset',
      '#title' => t('Payment'),
      '#collapsible' => FALSE,
      '#attributes' => array('class' => array('third')),
  );

  $form['payment']['method']['table'] = array(
      '#title' => t('Select payment method'),
      '#type' => 'tableselect',
      '#multiple' => FALSE,
      '#options' => array(),
      '#header' => array('image' => '', 'name' => '', /* 'filler' => array('data' => '', 'header' => '', 'class' => array('filler')), */ 'cost' => ''/* , 'description' => '' */),
      '#ajax' => array(
          'callback' => 'pccheckout_payment_form2_callback',
          'wrapper' => 'payment',
          'method' => 'replace',
          'effect' => 'fade',
          'progress' => array(
              'message' => NULL,
              'type' => NULL,
          ),
      ),
      '#required' => TRUE,
      '#attributes' => array('class' => array('grid', 'clearfix')),
  );


  $form['payment']['footer'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('box', 'clearfix')),
  );

  $form['payment']['footer']['priceblock'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('right')),
  );

  $form['payment']['footer']['priceblock'] = array(
      '#theme' => 'priceblock',
      '#subtotal' => $cart->subTotalAmount,
      '#vatAmount' => $cart->vatAmount,
      '#total' => $cart->totalAmount,
      '#attributes' => array('class' => array('last'), 'id' => 'priceblock'),
  );

  $form['actions'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('clearfix', 'actions', 'form-actions')),
  );
  $form['actions']['agree'] = array(
      '#type' => 'checkbox',
      '#title' => t('I agree with the !termsandconditionslink', array('!termsandconditionslink' => theme('generalconditionslink'))),
      '#required' => TRUE,
  );
  $form['actions']['submit'] = array(
      '#prefix' => '<div class="button-wrapper">',
      '#suffix' => '</div>',
      '#type' => 'submit',
      '#value' => t('Confirm'),
      '#attributes' => array('class' => array('action', 'button', 'large', 'continue', 'display-block')),
  );

  $form_state['storage']['customer'] = $customer;
  $form_state['storage']['cart'] = $cart;

  $form['#tree'] = TRUE;
  $form['#id'] = 'pccheckout-checkout-form';

  $form['personal'] = array(
      '#type' => 'fieldset',
      '#title' => l(t('Your details'), 'checkout/personal'),
      '#collapsible' => FALSE,
      '#attributes' => array('class' => array('first', 'collapsed')),
      '#weight' => -10,
  );

  $form['shipping'] = array(
      '#type' => 'fieldset',
      '#title' => l(t('Shipping'), 'checkout/shipping'),
      '#collapsible' => FALSE,
      '#attributes' => array('class' => array('second', 'collapsed')),
      '#weight' => -5,
  );

//  $form['payment']['cart'] = module_invoke('pccart', 'block_view', 'cart');


  pccheckout_payment_form_build_methods($form, $form_state);

  return $form;
}

function pccheckout_payment_form2_callback($form, &$form_state) {
  $cart = $form_state['storage']['cart'];
  if (isset($form_state['values']['payment']['method']['table'])) {
//$paymentMethod = PaymentMethods\Factory::Get($form_state['values']['payment']['method']);
    $cart->payment_method = $form_state['values']['payment']['method']['table'];
  } else {
    $cart->payment_method = 0;
  }
  Carts\Factory::Save($cart);
  $cart = Carts\Factory::Current(FALSE);

// $form['payment']['footer']['priceblock']['block'] = array('#markup' => theme('priceblock', array('subtotal' => $cart->subTotalAmount, 'vatAmount' => $cart->vatAmount, 'total' => $cart->totalAmount, 'attributes' => array('class' => array('last'), 'id' => 'priceblock'))));
// $form['payment']['cart'] = module_invoke('pccart', 'block_view', 'cart');


  $form['payment']['footer']['priceblock']['#subtotal'] = $cart->subTotalAmount;
  $form['payment']['footer']['priceblock']['#vatAmount'] = $cart->vatAmount;
  $form['payment']['footer']['priceblock']['#total'] = $cart->totalAmount;

  return $form['payment'];
}

function pccheckout_payment_form2_submit($form, $form_state) {
  $cart = $form_state['storage']['cart'];
  $customer = $form_state['storage']['customer'];

  if (isset($form_state['values']['payment']['method']['table']) && $form_state['values']['payment']['method']['table']) {
    $cart->payment_method = $form_state['values']['payment']['method']['table'];
  } else {
    $cart->payment_method = 0;
  }

  Carts\Factory::Save($cart);

  $cart = Carts\Factory::Current(FALSE);


  $id = $cart->id;

  if ($cart->totalAmount == 0) {
    \printconnect\Carts\Factory::Process($cart, 'invoice');
    \printconnect\Carts\Factory::Delete();
    drupal_goto('myprintconnect/orders/' . $id . '/confirmation');
  } else {
    $paymentMethod = \printconnect\PaymentMethods\Factory::Get($form_state['values']['payment']['method']['table']);

    switch (strtolower($paymentMethod->paymentMethod->internalName)) {
      case 'cod':
        \printconnect\Carts\Factory::Process($cart, 'cod');
//\printconnect\Carts\Factory::Delete();
        drupal_goto('myprintconnect/orders/' . $id . '/confirmation');
        break;
      case 'invoice' :
        \printconnect\Carts\Factory::Process($cart, 'invoice');
//\printconnect\Carts\Factory::Delete();
        drupal_goto('myprintconnect/orders/' . $id . '/confirmation');
        break;
      case 'transfer' :
        Carts\Factory::Process($cart, 'transfer');
//Carts\Factory::Delete();
        drupal_goto('myprintconnect/orders/' . $id . '/confirmation');
        break;
       case 'cheque' :
        Carts\Factory::Process($cart, 'cheque');
//Carts\Factory::Delete();
        drupal_goto('myprintconnect/orders/' . $id . '/confirmation');
        break;
      default:
        $paymentgateway = variable_get('pc_paymentgateway', 'pcpayments');
        $paymentgateway = 'pcpayments';
        if (function_exists(($paymentgateway . '_processpayment'))) {
          //$paymentgateway = variable_get('pc_paymentgateway', 'pcogone');
          
          $url = call_user_func($paymentgateway . '_processpayment', $cart->payment_method, $customer->name, $cart->id, $cart->totalAmount, array(
              'accept' => 'myprintconnect/orders/' . $cart->id . '/confirmation',
              'cancel' => url('checkout/payment'),
                  ));

//$_SESSION['agree'][$cart->id] = TRUE;
          drupal_goto($url);
        } else {
          form_set_error('method', t('Not implemented.'));
        }
    }
  }

  drupal_set_message('submit');
}

function _pccheckout_cart() {
  $cart = Carts\Factory::Current(FALSE);

  if (!$cart || !$cart->isFilled) {
    drupal_goto('cart');
    exit;
  }

  foreach ($cart->productItems as $item) {
    if (!count($item->files)) {
      drupal_set_message(t('Please upload a file for all your items'), 'warning');
      drupal_goto('cart');
      exit;
    }
  }

  return $cart;
}

function pccheckout_checkout_form2($form, &$form_state) {

  _pccustomers_ensureloggedin();
  $cart = _pccheckout_cart();
  $customer = Customers\Factory::Current();

//<editor-fold defaultstate="collapsed" desc="Personal" >

  $form['personal'] = array(
      '#type' => 'fieldset',
      '#title' => t('Register or login'),
      '#collapsible' => FALSE,
      '#attributes' => array('class' => array('first')),
  );

  $firstName = $customer->firstName;
  $lastName = $customer->lastName;


  $form['personal']['header'] = array(
      '#prefix' => '<h2>',
      '#markup' => t('Your details'),
      '#suffix' => '</h2>',
  );

  $form['personal']['text'] = array(
      '#markup' => t('In case something is unclear, we need your contact details.'),
  );
  $form['personal']['firstName'] = array(
      '#type' => 'textfield',
      '#title' => t('First name'),
      '#required' => TRUE,
      '#size' => 30,
      '#default_value' => $firstName,
  );
  $form['personal']['lastName'] = array(
      '#type' => 'textfield',
      '#title' => t('Last name'),
      '#required' => TRUE,
      '#size' => 30,
      '#default_value' => $lastName,
  );
  $form['personal']['phone'] = array(
      '#type' => 'textfield',
      '#title' => t('Mobile number'),
      '#required' => TRUE,
      '#size' => 30,
      '#default_value' => $customer ? $customer->phone : '',
  );

//</editor-fold>
//<editor-fold defaultstate="collapsed" desc="Shipping" >
  $shopConfig = \printconnect\Shop\Configuration\Factory::Current();
  $defaultCountry = \printconnect\Countries\Factory::Get($shopConfig->defaultCountry);
  $defaultShippingAddress = FALSE;
  $defaultBillingAddress = FALSE;
  $defaultNeedInvoice = FALSE;

  $addresses[0] = ' - ' . t('New') . ' - ';
  foreach (Addresses\Factory::GetAddresses($customer) as $address) {
    if ($address->company != '') {
      $addresses[$address->id] = $address->company;
    } else {
      $addresses[$address->id] = $address->name;
    }
    if (!$defaultShippingAddress && $address->defaultShipping) {
      $defaultShippingAddress = $address;
      $form_state['storage']['defaultShippingAddress'] = $defaultShippingAddress ? $defaultShippingAddress : FALSE;
    }
    if (!$defaultBillingAddress && $address->defaultBilling) {
      $defaultBillingAddress = $address;
    }
  }

  $shippingTypes = \printconnect\Shipping\Types\Factory::GetAll();
  foreach ($shippingTypes as $type) {
    if ($cart->orderItemShipping->shippingTypeResellerShop == $type->id) {
      $form_state['storage']['shippingType'] = $type->shippingType->type;
      $shippingType = $type->shippingType->type;
    }
  }
  $deliveryCountries = array();
  $items = printconnect\Countries\Factory::GetAll();
  foreach ($items as $country) {
    $countries[$country->id] = $country->tag;
    if ($country->active && ($shippingType <> 'shippingTypeBpostHome' || $country->id == 21)) {
      $deliveryCountries[$country->id] = $country->tag;
    }
  }



  $shippingTypes = \printconnect\Shipping\Types\Factory::GetAll();


  foreach ($shippingTypes as $type) {
    if ($cart->orderItemShipping->shippingTypeResellerShop == $type->id) {
      $form_state['storage']['shippingType'] = $type->shippingType->type;
    }
  }


  $form['shipping'] = array(
      '#type' => 'fieldset',
      '#title' => t('Shipping'),
      '#collapsible' => FALSE,
      '#attributes' => array('class' => array('second')),
  );

  if ($cart && $cart->isPickup) {
//<editor-fold defaultstate="collapsed" desc="Pickup">

    $form['shipping']['pickup']['text'] = array(
        '#markup' => t('You specified to pick this parcel up at a pick up point.'),
    );

    $form['shipping']['pickup']['id'] = array(
        '#type' => 'hidden',
        '#default_value' => $cart->pickuppoint ? $cart->pickuppoint->id : '',
        '#attributes' => array('class' => array('id')),
    );

    $form['shipping']['pickup']['country'] = array(
        '#type' => 'hidden',
        '#default_value' => $cart->pickuppoint ? $cart->pickuppoint->country : '',
        '#attributes' => array('class' => array('country-code')),
    );

    $form['shipping']['pickup']['contact'] = array(
        '#type' => 'textfield',
        '#title' => t('Who will pick up your print work?'),
        '#required' => TRUE,
        '#default_value' => $customer ? $customer->name : '',
        '#size' => 30,
    );

    $form['shipping']['pickup']['sms'] = array(
        '#type' => 'textfield',
        '#title' => t('SMS'),
        '#default_value' => $customer ? $customer->phone : '',
        '#size' => 30,
    );

    $form['shipping']['pickup']['email'] = array(
        '#type' => 'textfield',
        '#title' => t('Email'),
        '#default_value' => $customer ? $customer->email : '',
        '#size' => 30,
    );

    $form['shipping']['pickup']['neutral'] = array(
        '#type' => 'checkbox',
        '#title' => t('Neutral shipping'),
        '#default_value' => $cart->neutralShipping,
    );

//</editor-fold>
  } else {
//<editor-fold defaultstate="collapsed" desc="Delivery">

    if ($cart && $cart->HasProperty('shipping_address') && !$cart->isPickup) {
      $defaultShippingAddress = Addresses\Factory::Get($cart->shipping_address);
      $defaultShippingAddress->EnsureLoaded();
    }

    $form['shipping']['delivery'] = array(
        '#type' => 'container',
        '#id' => 'delivery',
    );

    $form['shipping']['delivery']['text'] = array(
        '#markup' => t('You specified a delivery for this order. Whom shall we ship it to?'),
    );

    $form['shipping']['delivery']['address'] = array(
        '#type' => 'select',
        '#title' => t('Address'),
        '#options' => $addresses,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->id : 0,
        '#ajax' => array(
            'callback' => 'pccheckout_shipping_form_delivery_address_callback',
            'wrapper' => 'delivery',
            'method' => 'replace',
            'effect' => 'fade',
            'progress' => array(
                'message' => NULL,
                'type' => NULL,
            ),
        ),
    );
//  }

    $form['shipping']['delivery']['name'] = array(
        '#type' => 'textfield',
        '#title' => t('Name'),
        '#required' => TRUE,
        '#size' => 30,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->name : ($customer ? $customer->name : ''),
    );

    $form['shipping']['delivery']['company'] = array(
        '#type' => 'textfield',
        '#title' => t('Company'),
        '#required' => FALSE,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->company : '',
        '#size' => 30,
    );
    $form['shipping']['delivery']['street'] = array(
        '#type' => 'textfield',
        '#title' => t('Street'),
        '#required' => TRUE,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->street : '',
        '#size' => 30,
    );
    $form['shipping']['delivery']['postalCode'] = array(
        '#type' => 'textfield',
        '#title' => t('Postal code'),
        '#required' => TRUE,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->postalCode : '',
        '#size' => 30,
    );
    $form['shipping']['delivery']['city'] = array(
        '#type' => 'textfield',
        '#title' => t('City'),
        '#required' => TRUE,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->city : '',
        '#size' => 30,
    );
    $form['shipping']['delivery']['country'] = array(
        '#type' => 'select',
        '#title' => t('Country'),
        '#required' => TRUE,
        '#empty_value' => 0,
        '#options' => $deliveryCountries,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->country : $defaultCountry->id,
    );
    $form['shipping']['delivery']['phone'] = array(
        '#type' => 'textfield',
        '#title' => t('Phone'),
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->phone : ($customer ? $customer->phone : ''),
        '#size' => 30,
    );

    $form['shipping']['delivery']['neutral'] = array(
        '#type' => 'checkbox',
        '#title' => t('Neutral shipping'),
        '#default_value' => $cart ? $cart->neutralShipping : false,
    );

//</editor-fold>
  }

  $form['shipping']['invoice'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('box', 'invoice')),
  );
  $form['shipping']['invoice']['header'] = array(
      '#type' => 'fieldset',
      '#attributes' => array('class' => array('header', 'invoice')),
      '#title' => t('Need an invoice?')
  );
//  $form['shipping']['invoice']['header']['title'] = array(
//      '#markup' => '<h2>' . t('Need an invoice?') . '</h2>',
//  );
  $form['shipping']['invoice']['header']['needinvoice'] = array(
      '#type' => 'checkbox',
      '#default_value' => $defaultNeedInvoice,
      '#title' => t('I need an invoice for my tax collector'),
  );
  $form['shipping']['invoice']['address'] = array(
      '#type' => 'container',
      '#id' => 'invoice-address',
      '#states' => array(
          'invisible' => array(
              'input[name="shipping[invoice][header][needinvoice]"]' => array('checked' => FALSE),
          ),
      ),
  );

  $form['shipping']['invoice']['address']['address'] = array(
      '#type' => 'select',
      '#title' => t('Address'),
      '#options' => $addresses,
      '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->id : 0,
      '#ajax' => array(
          'callback' => 'pccheckout_shipping_form_invoice_address_callback',
          'wrapper' => 'invoice-address',
          'method' => 'replace',
          'effect' => 'fade',
          'progress' => array(
              'message' => NULL,
              'type' => NULL,
          ),
      ),
  );

  $states = array(
      'required' => array(
          'input[name="shipping[invoice][header][needinvoice]"]' => array('checked' => TRUE),
      ),
  );

  $form['shipping']['invoice']['address']['company'] = array(
      '#type' => 'textfield',
      '#title' => t('Company'),
      '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->company : '',
      '#size' => 30,
      '#states' => $states,
  );
  $form['shipping']['invoice']['address']['name'] = array(
      '#type' => 'textfield',
      '#title' => t('Name'),
      '#size' => 30,
      '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->name : ($customer ? $customer->name : ''),
      '#states' => $states,
  );
  $form['shipping']['invoice']['address']['street'] = array(
      '#type' => 'textfield',
      '#title' => t('Street'),
      '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->street : '',
      '#size' => 30,
      '#states' => $states,
  );
  $form['shipping']['invoice']['address']['postalCode'] = array(
      '#type' => 'textfield',
      '#title' => t('Postal code'),
      '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->postalCode : '',
      '#size' => 30,
      '#states' => $states,
  );
  $form['shipping']['invoice']['address']['city'] = array(
      '#type' => 'textfield',
      '#title' => t('City'),
      '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->city : '',
      '#size' => 30,
      '#states' => $states,
  );
  $form['shipping']['invoice']['address']['country'] = array(
      '#type' => 'select',
      '#title' => t('Country'),
      '#options' => $countries,
      '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->country : $defaultCountry->id,
      '#states' => $states,
      '#ajax' => array(
          'callback' => 'pccheckout_shipping_form_invoice_address_country_callback',
          'wrapper' => 'vatNumber',
          'method' => 'replace',
          'effect' => 'fade',
          'progress' => array(
              'message' => NULL,
              'type' => NULL,
          ),
      ),
  );


  if ($defaultBillingAddress) {
    $country = printconnect\Countries\Factory::Get($defaultBillingAddress->country);
  } else {
    $country = FALSE;
  }


  $form['shipping']['invoice']['address']['vatNumber'] = array(
      '#prefix' => '<div id="vatNumber">',
      '#suffix' => '</div>',
      '#id' => 'vatNumber',
      '#type' => 'vatfield',
      '#title' => t('Vat number'),
      '#attributes' => array('class' => array('vat')),
      '#default_value' => $defaultBillingAddress ? ($defaultBillingAddress->vatNumber != '' ? $defaultBillingAddress->vatNumber : $country->iso) : $defaultCountry->iso,
  );

  $form['shipping']['invoice']['address']['reference'] = array(
      '#type' => 'textfield',
      '#title' => t('Reference'),
      //    '#required' => TRUE,
      '#default_value' => $cart ? $cart->customerReference : '',
      '#size' => 30,
  );

//$form += $shipping;
//</editor-fold>
//<editor-fold defaultstate="collapsed" desc="Payment">

  $form['payment'] = array(
      '#id' => 'payment',
      '#type' => 'fieldset',
      '#title' => t('Payment'),
      '#collapsible' => FALSE,
      '#attributes' => array('class' => array('third')),
  );

//if ($cart && $cart->subTotalAmount > 0) {

  $paymentMethods = PaymentMethods\Factory::GetAll();

  $options = array();
  $methods = array();

  $default = $cart->payment_method;

  $first = FALSE;


  foreach ($paymentMethods as $value) {
//      if (!(strtolower($value->paymentMethod->internalName) == 'invoice') ||
//              ( $customer && $customer->freeOfCashPayment
//              && isset($form_state['values']['payment']['needinvoice'])
//              && $form_state['values']['payment']['needinvoice'] == TRUE) ||
//              $cart->totalAmount == 0
//      ) {
//      $customer->freeOfCashPayment = TRUE;

    if (
            ($cart->onlyPostal && strtolower($value->paymentMethod->internalName) == 'cod' ) ||
            (strtolower($value->paymentMethod->internalName) == 'invoice' && !$customer->freeOfCashPayment) ||
            (strtolower($value->paymentMethod->internalName) == 'cod' && $cart->totalAmount > 1200)
    ) {
//break;
//Payment method niet toegelaten
    } else {
//  if ( isset($form_state['values']['payment']['needinvoice']) && $form_state['values']['payment']['needinvoice'] == TRUE) {
      if (!$first) {
        $first = $value->id;
      }

      $subTotalWithoutPayment = $cart->subTotalAmountWithoutPayment;
      $cost = $value->CalculateCost($subTotalWithoutPayment);

      $options[$value->id] = ''; //t($value->paymentMethod->internalName);

      if (is_string($value->paymentMethod->descriptionTag)) {
        $description = $value->paymentMethod->descriptionTag;
      } else {
        $description = '';
      }


      $methods[$value->id] = array(
          'code' => $value->paymentMethod->internalName,
          'image' => Functions::GetImage('paymentmethods', $value->paymentMethod->internalName),
          'name' => $value->paymentMethod->tag,
          'cost' => $cost,
          'description' => $description,
      );
      $methods[$value->id] = array(
          'image' => theme('image', array('path' => printconnect_getimage('paymentmethods', $value->paymentMethod->internalName))),
          'name' => $value->paymentMethod->tag,
          'cost' => theme('price', array('value' => $cost)),
          'description' => $value->paymentMethod->descriptionTag,
      );
    }
//  }
  }

  $form['payment']['header'] = array(
      '#markup' => t('Select payment method'),
      '#prefix' => '<h2>',
      '#suffix' => '</h2>',
  );


  $form['payment']['method'] = array(
      '#title' => t('Select payment method'),
      '#type' => 'radios',
      //'#required' => TRUE,
      '#options' => $options,
      '#default_value' => $default,
          //'#title' => t('Payment methods'),
  );

  $form['payment']['method'] = array(
      '#title' => t('Select payment method'),
      '#type' => 'tableselect',
      '#multiple' => FALSE,
      '#options' => $methods,
      '#header' => array('image' => '', 'name' => '', 'cost' => '', 'description' => ''),
      '#ajax' => array(
          'callback' => 'pccheckout_payment_form_callback',
          'wrapper' => 'payment',
          'method' => 'replace',
          'effect' => 'fade',
          'progress' => array(
              'message' => NULL,
              'type' => NULL,
          ),
      ),
      '#required' => TRUE,
      '#attributes' => array('class' => array('grid', 'clearfix')),
  );

  if (array_key_exists($default, $options)) {
    $form['payment']['method']['#default_value'] = $default;
  } else {

    $form['payment']['method']['#default_value'] = $first;
  }
//  }

  $form['payment']['footer'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('box', 'clearfix')),
  );

  $form['payment']['footer']['priceblock'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('right')),
  );

  $form['payment']['footer']['priceblock']['block'] = array('#markup' => theme('priceblock', array('subtotal' => $cart->subTotalAmount, 'vatAmount' => $cart->vatAmount, 'total' => $cart->totalAmount, 'attributes' => array('class' => array('last'), 'id' => 'priceblock'))));

  $form['payment']['footer']['terms'] = array(
      '#type' => 'checkbox',
      '#title' => t('I agree with the ') . l(t('terms and conditions'), 'termsandconditions', array('attributes' => array('target' => '_blank'))),
      '#required' => TRUE,
      '#default_value' => isset($_SESSION['agree'][$cart->id]) ? $_SESSION['agree'][$cart->id] : FALSE,
  );


  $form['payment']['footer']['priceblock']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Confirm'),
      '#attributes' => array('class' => array('action', 'button', 'large', 'continue', 'display-block')),
  );



//</editor-fold>

  $form_state['storage']['customer'] = $customer;
  $form_state['storage']['cart'] = $cart;

  $form['#tree'] = TRUE;
  $form['#id'] = 'pccheckout-checkout-form';
  return $form;
}

function pccheckout_checkout_form2_validate($form, &$form_state) {
  $customer = $form_state['storage']['customer'];
  $cart = $form_state['storage']['cart'];

  if ($form_state['values']['shipping']['invoice']['header']['needinvoice']) {

    $addressId = $form_state['values']['shipping']['invoice']['address']['address'];

    if ($addressId == 0) {
      $address = Addresses\Factory::Create();
      $address->phone = $customer->phone;
    } else {
      $address = Addresses\Factory::Get($addressId);
      $address->EnsureLoaded();
    }
    Forms::LoadObject($form_state['values']['shipping']['invoice']['address'], $address);
    $address->customer = $customer->id;
    try {
      Addresses\Factory::Validate(clone $address);
    } catch (\printconnect\Dal\Exception $ex) {
      Forms::HandleException($ex, $form, 'shipping[invoice][address][');
    }
    $form_state['storage']['shipping']['invoice']['address'] = $address;
  }
  if ($cart && $cart->isPickup) {
    if (!isset($form_state['values']['shipping']['pickup']['id']) || $form_state['values']['shipping']['pickup']['id'] == '') {
      form_set_error('shipping][pickup][new', t('Please select a pickup point'));
    }
  } else {
    if (isset($form_state['values']['shipping']['delivery']['address'])) {
      $addressId = $form_state['values']['shipping']['delivery']['address'];

      $countryId = $form_state['values']['shipping']['delivery']['country'];
      $country = \printconnect\Countries\Factory::Get($countryId);
      $city = urlencode($form_state['values']['shipping']['delivery']['city']);
      $postalCode = urlencode($form_state['values']['shipping']['delivery']['postalCode']);

      $url = 'http://maps.googleapis.com/maps/api/distancematrix/json?origins=Belgium&destinations=' . $postal . ',' . $country->name . '&language=nl-BE&sensor=false';
// form_set_error('shipping][delivery][country', $url);
      $data = drupal_http_request($url);
      $result = json_decode($data->data);

      if ($result->rows[0]->elements[0]->status == 'ZERO_RESULTS' || $result->rows[0]->elements[0]->status == 'NOT_FOUND' || $result->rows[0]->elements[0]->distance->value > 2500000) {
        form_set_error('shipping][delivery][postalCode', t('There appears to be something wrong with your shipping address'));
      }


      if ($addressId == 0) {
        $address = Addresses\Factory::Create();
        $address->firstName = $customer->firstName;
        $address->lastName = $customer->lastName;
        $address->phone = $customer->phone;
      } else {
        $address = Addresses\Factory::Get($addressId);
        $address->EnsureLoaded();
      }

      Forms::LoadObject($form_state['values']['shipping']['delivery'], $address);
      $address->customer = $customer->id;
      try {
        Addresses\Factory::Validate(clone $address);
      } catch (\printconnect\Dal\Exception $ex) {
        Forms::HandleException($ex, $form, 'shipping][delivery][');
      }
      $form_state['storage']['shipping']['delivery']['address'] = $address;
    }
  }

  if (isset($form['shipping']['giftvouchers'])) {

    $addressId = $form_state['values']['shipping']['giftvouchers']['address']['address'];

    if ($addressId == 0) {
      $address = Addresses\Factory::Create();
      $address->firstName = $customer->firstName;
      $address->lastName = $customer->lastName;
      $address->phone = $customer->phone;
    } else {
      $address = Addresses\Factory::Get($addressId);
      $address->EnsureLoaded();
    }

    Forms::LoadObject($form_state['values']['shipping']['giftvouchers'], $address);
    $address->customer = $customer->id;
    try {
      Addresses\Factory::Validate(clone $address);
    } catch (\printconnect\Dal\Exception $ex) {
      Forms::HandleException($ex, $form, 'shipping][giftvouchers][');
    }
    $form_state['storage']['shipping']['giftvouchers']['address'] = $address;

//    drupal_set_message('validate vouchers');
  }
}

function pccheckout_checkout_form2_submit($form, &$form_state) {
  global $language;
  $customer = $form_state['storage']['customer'];
  $customer->firstName = $form_state['values']['personal']['firstName'];
  $customer->lastName = $form_state['values']['personal']['lastName'];
  $customer->phone = $form_state['values']['personal']['phone'];
  if (isset($language->id)) {
    $customer->language = $language->id;
  } else {
    $customer->language = 1;
  }
  Customers\Factory::Save($customer);

  $cart = $form_state['storage']['cart'];

  if (isset($form_state['storage']['shipping']['delivery']['address'])) {
    $address = $form_state['storage']['shipping']['delivery']['address'];
    Addresses\Factory::Save($address);

    $cart->shipping_address = $address->id;
    $cart->Remove('pickuppoint');

    $cart->neutralShipping = $form_state['values']['shipping']['delivery']['neutral'];
  }

  if (isset($form_state['storage']['shipping']['invoice']['address'])) {
    $address = $form_state['storage']['shipping']['invoice']['address'];
    Addresses\Factory::Save($address);

    $cart->country = $form_state['values']['shipping']['invoice']['address']['country'];
    $cart->vatNumber = $form_state['values']['shipping']['invoice']['address']['vatNumber'];
    $cart->billing_address = $address->id;
  } else {
    $cart->Remove('billing_address');
    $cart->Remove('country');
    $cart->Remove('vatNumber');
  }

  if (isset($form_state['values']['shipping']['pickup']['id'])) {
    switch ($form_state['storage']['shippingType']) {
      case 'shippingTypeBpostPickupPoint':
        $poi = \printconnect\bPost\Factory::Get($form_state['values']['shipping']['pickup']['id']);
        $poi->EnsureLoaded();
        $cart->pickuppoint = $poi->cartObject;
        break;
      case 'shippingTypeMondialRelay':
        $pickuppoint = PickupPoints\Factory::Get($form_state['values']['shipping']['pickup']['id'], $form_state['values']['shipping']['pickup']['country']);
        $pickuppoint->EnsureLoaded();
        $cart->pickuppoint = $pickuppoint;
        break;
    }

    $cart->pickuppoint->contactName = $form_state['values']['shipping']['pickup']['contact'];
    $cart->pickuppoint->email = $form_state['values']['shipping']['pickup']['email'];
    $cart->pickuppoint->phone = $form_state['values']['shipping']['pickup']['sms'];

    $cart->neutralShipping = $form_state['values']['shipping']['pickup']['neutral'];
  }

  foreach ($cart->giftVouchers as $giftVoucher) {
    if (isset($form_state['storage']['shipping']['giftvouchers']['address'])) {
      $address = $form_state['storage']['shipping']['giftvouchers']['address'];
      Addresses\Factory::Save($address);
      $addressId = $address->id;
    } else {
      $addressId = $cart->shipping_address;
    }

    $giftVoucher->address = $addressId;

    \printconnect\GiftVouchers\Factory::Save(new \printconnect\GiftVouchers\GiftVoucher($giftVoucher));
  }

  Addresses\Factory::ClearAddressesCache($customer);

  Carts\Factory::Save($cart);




  pccheckout_payment_form_submit($form, $form_state);
}

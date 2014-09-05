<?php

use printconnect\SamplePacks\Factory;
use printconnect\Customers;
use printconnect\Customers\Addresses;
use printconnect\Drupal\Functions;
use printconnect\Drupal\Forms;

function pcsamplepacks_request_form($form, $form_state) {
  if (isset($_SESSION['samplePackCustomerEmail'])) {

    $customer = Customers\Factory::GetByEmail($_SESSION['samplePackCustomerEmail']);
    if ($customer) {
      $customer->EnsureLoaded();
    }
    $email = $_SESSION['samplePackCustomerEmail'];
  } else {
    $customer = Customers\Factory::Current();
    if ($customer) {
      $email = $customer->email;
    }
  }

  $form['about'] = array(
      '#markup' => t('About requesting a samplepack'),
  );


  $defaultAddress = FALSE;
  if ($customer) {
    $addresses = array();

    //$addresses[0] = ' - ' . t('New') . ' - ';

    foreach (Addresses\Factory::GetAddresses($customer) as $address) {
      //$address->EnsureLoaded();
      if ($address->company != '') {
        $addresses[$address->id] = $address->company;
      } else {
        $addresses[$address->id] = $address->name;
      }

      if ($address->defaultShipping) {
        $defaultAddress = $address;
      }
    }
    //if (count($addresses)) {
    $form['address'] = array(
        '#type' => 'select',
        '#title' => t('Address'),
        '#options' => $addresses,
        '#default_value' => $defaultAddress ? $defaultAddress->id : 0,
        '#ajax' => array(
            'callback' => 'pcsamplepacks_request_form_address_callback',
            'wrapper' => 'pcsamplepacks-request-form',
            'method' => 'replace',
            'effect' => 'slide',
            'progress' => array(
                'message' => NULL,
                'type' => NULL,
            ),
        ),
    );
    //}
  }

  $countries = array();
  $items = \printconnect\Countries\Factory::GetAll();
  foreach ($items as $country) {
    $countries[$country->id] = $country->tag;
  }

  $languages = array();
  $items = \printconnect\Languages\Factory::GetAll();
  foreach ($items as $language) {
    $languages[$language->id] = $language->displayName;
  }


  $shopConfig = \printconnect\Shop\Configuration\Factory::Current();
  /*
    $form['email'] = array(
    '#type' => 'hidden',
    '#default_value' => $email,
    );
   */
  $form['name'] = array(
      '#type' => 'textfield',
      '#title' => t('Name'),
      '#default_value' => $defaultAddress ? $defaultAddress->name : '',
      '#required' => TRUE,
  );
  $form['company'] = array(
      '#type' => 'textfield',
      '#title' => t('Company'),
      '#default_value' => $defaultAddress ? $defaultAddress->company : '',
      '#required' => FALSE,
  );
  $form['street'] = array(
      '#type' => 'textfield',
      '#title' => t('Street'),
      '#default_value' => $defaultAddress ? $defaultAddress->street : '',
      '#required' => TRUE,
  );
  $form['postalCode'] = array(
      '#type' => 'textfield',
      '#title' => t('Postal code'),
      '#default_value' => $defaultAddress ? $defaultAddress->postalCode : '',
      '#required' => TRUE,
  );
  $form['city'] = array(
      '#type' => 'textfield',
      '#title' => t('City'),
      '#default_value' => $defaultAddress ? $defaultAddress->city : '',
      '#required' => TRUE,
  );
  $form['country'] = array(
      '#type' => 'select',
      '#title' => t('Country'),
      '#options' => $countries,
      '#default_value' => $defaultAddress ? $defaultAddress->country : $shopConfig->defaultCountry,
      '#required' => TRUE,
  );

  $form['actions'] = array(
      '#type' => 'actions',
  );

  $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Request'),
      '#attributes' => array('class' => array('button')),
  );

  $form['#id'] = 'pcsamplepacks-request-form';


  return $form;
}

function pcsamplepacks_request_form_address_callback($form, &$form_state) {
  $addressId = $form_state['values']['address'];
  if ($addressId == 0) {
    $form['name']['#value'] = '';
    $form['company']['#value'] = '';
    $form['street']['#value'] = '';
    $form['postalCode']['#value'] = '';
    $form['city']['#value'] = '';
    $form['country']['#value'] = '';
    $form['phone']['#value'] = '';
  } else {
    $address = \printconnect\Customers\Addresses\Factory::Get($addressId);

    $form['name']['#value'] = $address->name;
    $form['company']['#value'] = $address->company;
    $form['street']['#value'] = $address->street;
    $form['postalCode']['#value'] = $address->postalCode;
    $form['city']['#value'] = $address->city;
    $form['country']['#value'] = $address->country;
    $form['phone']['#value'] = $address->phone;
  }

  return $form;
}

function pcsamplepacks_request_form_submit($form, $form_state) {
  global $language;

  $samplePack = Factory::Create();
  Forms::LoadObject($form_state['values'], $samplePack);
  $samplePack->firstName = $form_state['values']['name'];
  $samplePack->lastName = $form_state['values']['company'];
  if (isset($language->id)) {
    $samplePack->language = $language->id;
  }
  //$samplePack->language = 1;

  Factory::Save($samplePack);

//  $_SESSION['samplePackId'] = $samplePack->id;
  $_SESSION['samplepack'] = serialize($samplePack);
  drupal_set_message(t('Sample pack requested'));
  drupal_goto('samplepack/requested');
}

function pcsamplepacks_requested_form($form, $form_state) {
  $samplePack = NULL;

//  if (isset($_SESSION['samplePackId'])) {
//    $samplePack = Factory::Get($_SESSION['samplePackId']);
//    $samplePack->EnsureLoaded();
//    $samplePack->country->EnsureLoaded();
//    $samplePack->language->EnsureLoaded();
//  }
  if (isset($_SESSION['samplepack'])) {
    $samplePack = unserialize($_SESSION['samplepack']);
  } else {
    //  drupal_not_found();
  }

  // drupal_set_message(print_r($samplePack, true));



  $form['description'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('description', 'clearfix')),
  );

  $form['description']['image'] = array(
      '#theme' => 'image',
      '#path' => printconnect_getimage('samplepacks', 'samplepack'),
  );

  $form['description']['text'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('text')),
  );


  $form['description']['text']['title'] = array(
      '#prefix' => '<h3>',
      '#suffix' => '</h3>',
      '#markup' => t('Dear @name', array('@name' => $samplePack->name)),
  );

  $form['description']['text']['thanks'] = array(
      '#prefix' => '<p>',
      '#suffix' => '</p>',
      '#markup' => t('Thanks for your request. We will send your sampleflip as soon as possible to the given address.'),
  );



  $form['address'] = array(
      '#type' => 'fieldset',
      '#title' => t('Address'),
      'content' => array(
          '#theme' => 'address',
          '#address' => $samplePack,
      )
  );

  return $form;

  return theme('pcsamplepacks_requested', array('samplePack' => $samplePack));
}


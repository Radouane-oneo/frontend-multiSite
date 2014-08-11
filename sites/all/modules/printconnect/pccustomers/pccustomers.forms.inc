<?php

use printconnect\Customers\Addresses;
use printconnect\Customers\Factory;
use printconnect\Drupal\Forms;
use printconnect\Customers\Factory as CustomersFactory;
function pccustomers_dashboard_form($form, &$form_state) {
  _pccustomers_ensureloggedin();
  $customer = Factory::Current();

  drupal_set_title(t('Welcome @name', array('@name' => $customer->name)));
  $form_state['storage']['customer'] = $customer;
  return $form;
}

function pccustomers_addresses_form($form, $form_state) {
  _pccustomers_ensureloggedin();
  $customer = Factory::Current();
  $addresses = Addresses\Factory::GetAddresses($customer, FALSE);

  $form['addresses'] = array(
      '#type' => 'container',
      '#title' => t('Your addresses'),
  );

  $rows = array();

  foreach ($addresses as $address) {

    $form['addresses'][$address->id]['edit'] = array(
        '#markup' => l(t('edit'), 'myprintconnect/addresses/' . $address->id, array('attributes' => array('class' => 'edit'))),
    );

    $form['addresses'][$address->id]['remove'] = array(
        '#type' => 'submit',
        '#name' => 'delete_address_' . $address->id,
        '#value' => t('Delete'),
        '#attributes' => array('class' => array('remove', 'noreplace')),
        '#validate' => array('pccustomers_addresses_form_delete_validate'),
        '#submit' => array('pccustomers_addresses_form_delete_submit'),
    );

    $rows[] = array(
        $address->name,
        $address->company,
        $address->city,
        drupal_render($form['addresses'][$address->id]['edit']),
        drupal_render($form['addresses'][$address->id]['remove']),
    );
  }


  $variables['header'] = array(
      t('Name'),
      t('Company'),
      t('City'),
      '',
      '',
  );
  
  $variables['rows'] = $rows;
  $variables['attributes'] = array('class' => array('list', 'addresses'));
  $variables['empty'] = t('No addresses');
  $variables['caption'] = NULL;
  $variables['colgroups'] = NULL;
  $variables['sticky'] = NULL;

  $form['addresses']['table'] = array(
      '#markup' => theme_table($variables),
  );

  $form['addresses']['add'] = array(
      '#markup' => l(t('Add an address'), 'myprintconnect/addresses/new'),
  );
  
/* Billingaddresses */
  
    $form['items'] = array(
      '#type' => 'item',
      '#title' => t('My Billing Address'),
      '#prefix' => '<h1>',
      '#suffix' => '</h1>', 
    );
  
    $Billingcustomer =  \printconnect\Customers\Factory::Current();
    $rowsBilling = array();
    $allbellingacounts = \printconnect\Customers\BillingAccounts\Factory::GetBillingAccounts($Billingcustomer, false);
    
foreach ( $allbellingacounts as $MyBillingaddress) {
 if (!is_null($MyBillingaddress->id)){
    $form['Billingaddresses'][$MyBillingaddress->id]['edit'] = array(
        '#markup' => l(t('edit'), 'myprintconnect/editBillingaddresses/' . $MyBillingaddress->id, array('attributes' => array('class' => 'edit'))),
    );

//    $form['Billingaddresses'][$MyBillingaddress->id]['remove'] = array(
//        '#type' => 'submit',
//        '#name' => 'delete_address_' . $MyBillingaddress->id,
//        '#value' => t('Delete'),
//        '#attributes' => array('class' => array('remove', 'noreplace')),
//        '#validate' => array('pccustomers_Billingaddress_form_delete_validate'),
//        '#submit' => array('pccustomers_Billingaddress_form_delete_submit'),
//    );
    $rowsBilling[] = array(
        $MyBillingaddress->name,
        $MyBillingaddress->company,
        $MyBillingaddress->city,
        drupal_render($form['Billingaddresses'][$MyBillingaddress->id]['edit']),
        drupal_render($form['Billingaddresses'][$MyBillingaddress->id]['remove']),
    );
}
  }
  $variablesBilling['header'] = array(
      t('Name'),
      t('Company'),
      t('City'),
      '',
      '',
  );
  $variablesBilling['rows'] = $rowsBilling;
  $variablesBilling['attributes'] = array('class' => array('list', 'addresses'));
  $variablesBilling['empty'] = t('No addresses');
  $variablesBilling['caption'] = NULL;
  $variablesBilling['colgroups'] = NULL;
  $variablesBilling['sticky'] = NULL;

  $form['Billingaddresses']['table'] = array(
      '#markup' => theme_table($variablesBilling),
  );

  $form['Billingaddresses']['add'] = array(
      '#markup' => l(t('Add an Billing address'), 'myprintconnect/mybillingaddress/new'),
  );
  
  return $form;
}

function pccustomers_Billingaddress_form_delete_validate($form, $form_state) {
//drupal_set_message('validate');
}

function pccustomers_addresses_form_delete_submit($form, $form_state) {
  $id = $form_state['triggering_element']['#array_parents'][1];
  $customer = Factory::Current();

  Addresses\Factory::Delete($id);
  Addresses\Factory::ClearAddressesCache($customer);

  drupal_set_message(t('The address was removed'));

// $form_state['rebuild'] = TRUE;
}
function pccustomers_addresses_form_delete_validate($form, $form_state) {
//drupal_set_message('validate');
}

function pccustomers_Billingaddress_form_delete_submit($form, $form_state) {
  $id = $form_state['triggering_element']['#array_parents'][1];
  $customer = Factory::Current();
  \printconnect\Customers\BillingAccounts\Factory::Delete($id);
   \printconnect\Customers\BillingAccounts\Factory::ClearBillingAccountsCache($customer);
  drupal_set_message(t('The address was removed'));
}

/**
 * Defines the profile form
 */
function pccustomers_profile_form($form, &$form_state) {
  _pccustomers_ensureloggedin();
  $customer = Factory::Current();
//  $form['profile'] = array(
//      '#type' => 'container',
//      '#title' => t('Profile'),
//  );

  $form['email'] = array(
      '#type' => 'textfield',
      '#title' => t('Email'),
      '#required' => TRUE,
      '#size' => 71,
      '#default_value' => $customer->email,
      '#description' => t('Your email address'),
      '#attributes' => array('class' => array('hint')),
  );

  $form['firstName'] = array(
      '#type' => 'textfield',
      '#title' => t('First name'),
      '#required' => TRUE,
      '#size' => 71,
      '#default_value' => $customer->firstName,
  );
  $form['lastName'] = array(
      '#type' => 'textfield',
      '#title' => t('Last name'),
      '#required' => TRUE,
      '#size' => 71,
      '#default_value' => $customer->lastName,
  );
  $form['company'] = array(
      '#type' => 'textfield',
      '#title' => t('Company'),
      '#required' => FALSE,
      '#size' => 71,
      '#default_value' => $customer->company,
  );
  $form['phone'] = array(
      '#type' => 'textfield',
      '#title' => t('Phone'),
      '#required' => TRUE,
      '#size' => 71,
      '#default_value' => $customer->phone,
  );

  $options = array();
  $shopConfig = printconnect\Shop\Configuration\Factory::Current();
  foreach ($shopConfig->languages as $language) {
    $options[$language->id] = $language->displayName;
  }
  /*
    $form['language'] = array(
    '#type' => 'select',
    '#title' => t('Language'),
    '#required' => TRUE,
    //'#size' => 30,
    '#default_value' => $customer->language,
    '#options' => $options,
    );
   */
  $form['actions'] = array(
      '#type' => 'actions',
  );

  $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Submit'),
  );

  return $form;
}

/*
 * Profile form validation function
 */

function pccustomers_profile_form_validate($form, &$form_state) {
  global $language;
  if (!is_numeric($form_state['values']['phone'])) {
     form_set_error('phone',t('Please enter your Phone Number as Number value.'));
  }
  if (is_numeric($form_state['values']['phone']) && strlen($form_state['values']['phone']) >= 10) {
      form_set_error('phone',t('Please enter a valid phone number.'));
  }
  if (!valid_email_address($form_state['values']['email'])) {
    form_set_error('email', t('Email is not valid'));
  }
  try {
    $customer = Factory::Current();
    Forms::LoadObject($form_state['values'], $customer);

    if (isset($language->id)) {
      $customer->language = $language->id;
    } else {
      $customer->language = 1;
    }

    Factory::Validate(clone $customer);
    $form_state['storage']['customer'] = $customer;
  } catch (\printconnect\Dal\Exception $ex) {
   // Forms::HandleException($ex, $form);
    return TRUE;
  }
}

/**
 * Profile form submit function
 */
function pccustomers_profile_form_submit($form, &$form_state) {
  $customer = $form_state['storage']['customer'];

  Factory::Save($customer);
  drupal_set_message(t('Saved'));
}
/**
 * Defines the changepassword form
 */
function pccustomers_changepassword_form($form, &$form_state) {
  _pccustomers_ensureloggedin();
  $customer = Factory::Current();
  $form['changepassword'] = array(
      '#type' => 'container',
      '#title' => t('Change your password'),
  );

  $form['oldPassword'] = array(
      '#type' => 'password',
      '#title' => t('Old password'),
      '#size' => 71,
      '#attributes' => array('autocomplete' => 'off'),
      '#required' => TRUE,
  );

  $form['password'] = array(
      '#type' => 'password',
      '#title' => t('New password'),
      '#size' => 71,
      '#maxlength' => 20,
      '#attributes' => array('autocomplete' => 'off'),
      '#required' => TRUE,
  );

  $form['passwordConfirm'] = array(
      '#type' => 'password',
      '#title' => t('Confirm password'),
      '#size' => 71,
      '#maxlength' => 20,
      '#attributes' => array('autocomplete' => 'off'),
      '#required' => TRUE,
  );

  $form['actions'] = array(
      '#type' => 'actions',
  );
  $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Submit'),
  );

  $form_state['storage']['customer'] = $customer;

  return $form;
}

/**
 * Change password form validation
 */
function pccustomers_changepassword_form_validate($form, &$form_state) {
  try {
    $customer = $form_state['storage']['customer'];
    if (!Factory::GetByEmailAndPassword($customer->email, $form_state['values']['oldPassword'])) {
      form_set_error('oldPassword', t('Your old password is not correct.'));
    }

    if ($form_state['values']['password'] != $form_state['values']['passwordConfirm']) {
      form_set_error('', t("Your passwords don't match."));
    }

    Forms::LoadObject($form_state['values'], $customer);
    $form_state['storage']['customer'] = $customer;
  } catch (\printconnect\Dal\Exception $ex) {
    Forms::HandleException($ex, $form);
    return FALSE;
  }
}

/**
 * Change password submit
 */
function pccustomers_changepassword_form_submit($form, &$form_state) {
  $customer = $form_state['storage']['customer'];

  Factory::ChangePassword($customer);
  drupal_set_message(t('Your password has been changed'));
  drupal_goto('myprintconnect/profile');
}

/**
 * Defines the address form
 */
function pccustomers_address_form($form, $form_state, $addressId) {
  _pccustomers_ensureloggedin();
  $address = Addresses\Factory::Get($addressId);
  $customer = Factory::Current();

  if ($address->customer != $customer->id) {
    drupal_access_denied();
    exit;
  }

//  $form['address'] = array(
//      '#type' => 'fieldset',
//      '#title' => t('Address'),
//  );

  $form['name'] = array(
      '#type' => 'textfield',
      '#title' => t('Name'),
      '#required' => TRUE,
      '#size' => 71,
      '#default_value' => $address->name,
  );
  $form['company'] = array(
      '#type' => 'textfield',
      '#title' => t('Company'),
      '#size' => 71,
      '#default_value' => $address->company,
  );
  $form['phone'] = array(
      '#type' => 'textfield',
      '#title' => t('Phone'),
      '#size' => 71,
       '#required' => TRUE,
      '#default_value' => $address->phone,
  );
  $form['street'] = array(
      '#type' => 'textfield',
      '#title' => t('Street'),
      '#required' => TRUE,
      '#size' => 71,
      '#default_value' => $address->street,
  );
  $form['postalCode'] = array(
      '#type' => 'textfield',
      '#title' => t('PostalCode'),
      '#required' => TRUE,
      '#size' => 71,
      '#default_value' => $address->postalCode,
      '#attributes' => array('class' => array('postalCode')),
  );
  $form['city'] = array(
      '#type' => 'textfield',
      '#title' => t('City'),
      '#required' => TRUE,
      '#size' => 71,
      '#default_value' => $address->city,
      '#attributes' => array('class' => array('city')),
  );
  $options = array();
  $countries = printconnect\Countries\Factory::GetAll();
  foreach ($countries as $country) {
    $options[$country->id] = $country->tag; 
  }
  natsort($options);
  $form['country'] = array(
      '#type' => 'select',
      '#title' => t('Country'),
      '#required' => TRUE,
      '#options' => $options,
      '#default_value' => $address->country,
  );

//  $form['vatNumber'] = array(
//      '#type' => 'vatfield',
//      '#title' => t('Vat number'),
//      '#attributes' => array('class' => array('vat')),
//      '#default_value' => $address->vatNumber,
//  );
//
//  $form['defaultBilling'] = array(
//      '#type' => 'checkbox',
//      '#title' => t('This is the default invoice address'),
//      '#default_value' => $address->defaultBilling,
//  );
//
//  $form['defaultShipping'] = array(
//      '#type' => 'checkbox',
//      '#title' => t('This is the default shipping address'),
//      '#default_value' => $address->defaultShipping,
//  );

  $form['actions'] = array(
      '#type' => 'actions',
  );

  $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Save'),
      '#attributes' => array('class' => array('button')),
  );

  $form['back'] = array(
      '#markup' => theme('linkbutton', 'myprintconnect/addresses', t('Back')),
  );

  return $form;
}
function pccustomers_address_Billingaddresses_form($form, $form_state, $BillingaddressesId) {

  _pccustomers_ensureloggedin();
  $Billingaddresses = \printconnect\Customers\BillingAccounts\Factory::Get($BillingaddressesId);
  $customer = Factory::Current();
 /*if ($Billingaddresses->customer != $customer->id) {
    drupal_access_denied();
    exit;
  }*/
  $form['name'] = array(
      '#type' => 'textfield',
      '#title' => t('Name'),
      '#required' => TRUE,
      '#size' => 71,
      '#default_value' => $Billingaddresses->name,
  );

  
  $form['street'] = array(
      '#type' => 'textfield',
      '#title' => t('Street'),
      '#required' => TRUE,
      '#size' => 71,
      '#default_value' => $Billingaddresses->street,
  );
  $form['postalCode'] = array(
      '#type' => 'textfield',
      '#title' => t('PostalCode'),
      '#required' => TRUE,
      '#size' => 71,
      '#default_value' => $Billingaddresses->postalCode,
      '#attributes' => array('class' => array('postalCode')),
  );
  $form['city'] = array(
      '#type' => 'textfield',
      '#title' => t('City'),
      '#required' => TRUE,
      '#size' => 71,
      '#default_value' => $Billingaddresses->city,
      '#attributes' => array('class' => array('city')),
  );
  $options = array();
  $countries = printconnect\Countries\Factory::GetAll();
  foreach ($countries as $country) {
    $options[$country->id] = $country->tag; 
  }
  natsort($options);
  $form['country'] = array(
      '#type' => 'select',
      '#title' => t('Country'),
      '#required' => TRUE,
      '#disabled' => TRUE,
      '#options' => $options,
//      '#ajax' => array(
//          'callback' => 'pccheckout_billingaccount_country_callback',
//          'wrapper' => 'vatNumber',
//          'method' => 'replace',
//          'effect' => 'fade',
//          'progress' => array(
//              'message' => NULL,
//              'type' => NULL,
//          ),
//      ),
      '#default_value' => $Billingaddresses->country,
  );
  
  $form['isCompany'] = array(
        '#type' => 'checkbox',
        '#title' => t('Are you a company ?'),
        '#attributes' => array(
            'id' => 'isUserCompany',
            'checked'=> false
        )
  );
  
  $form['company'] = array(
      '#type' => 'textfield',
      '#title' => t('Company'),
      '#size' => 71,
      '#default_value' => $Billingaddresses->company,
  );
    $country = printconnect\Countries\Factory::Get($Billingaddresses->country);

  $form['vatNumber'] = array(
      '#prefix' => '<div id="vatNumber">',
      '#suffix' => '</div>',
      '#type' => 'vatfield',
      '#title' => t('Vat number'),
      '#attributes' => array('class' => array('vat')),
      '#default_value' => $country->vatPrefix,
      '#disabled' => TRUE,
  );
  $form['actions'] = array(
      '#type' => 'actions',
  );

  $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Save'),
      '#attributes' => array('class' => array('button')),
  );

  $form['back'] = array(
      '#markup' => theme('linkbutton', 'myprintconnect/addresses', t('Back')),
  );

  return $form;
}
/**
 * Address form validation
 */
function pccustomers_address_form_validate($form, &$form_state) {
 $tva = substr($form_state['values']['vatNumber'], 2, 2);
 
  if (!is_numeric($form_state['values']['phone'])) {
     form_set_error('phone',t('Please enter your Phone Number as Number value.'));
  }
  if (is_numeric($form_state['values']['phone']) && strlen($form_state['values']['phone'])!= 10) {
      form_set_error('phone',t('Please enter your Phone Number as 10 Number.'));
  }
  if(!empty($tva)){
 if (!is_numeric($tva)) {
    form_set_error('vatNumber',t('Please enter your VAT Number as Number value.'));
  }
   if (is_numeric($tva) && strlen($tva)!= 2) {
      form_set_error('vatNumber',t('Please enter your Phone Number as 2 Number.'));
  }
  }
  try {
    $id = $form_state['build_info']['args'][0];

    $address = Addresses\Factory::Get($id);
    $address->EnsureLoaded();
    Forms::LoadObject($form_state['values'], $address);

    Addresses\Factory::Validate(clone $address);
    $form_state['storage']['address'] = $address;
  } catch (\printconnect\Dal\Exception $ex) {
    Forms::HandleException($ex, $form);
  }
}
function pccustomers_address_Billingaddresses_form_validate($form, &$form_state) {
   $customer = Factory::Current();

 $tva = substr($form_state['values']['vatNumber'], 2, 2);
  if($form_state['values']['isCompany']){
    if (!empty($form_state['values']['company'])) {
        if (strlen($form_state['values']['vatNumber']) == 2 && is_string($form_state['values']['vatNumber'])) {
            form_set_error('Vat number', t('Le champ N° de TVA est requis.'));
        }
    }
    if(empty($form_state['values']['company'])){
          if(is_numeric(substr($form_state['values']['vatNumber'],2)) && is_string(substr($form_state['values']['vatNumber'],0,2))){
              form_set_error('company', t('Le champ Entreprise est requis.'));
          }
      }
  }
  if(!empty($tva)){
 if (!is_numeric($tva)) {
    form_set_error('vatNumber',t('Please enter your VAT Number as Number value.'));
  }
   if (is_numeric($tva) && strlen($tva)!= 2) {
      form_set_error('vatNumber',t('Please enter your Phone Number as 2 Number.'));
  }
  }
  try {
    $id = $form_state['build_info']['args'][0];
    $address = \printconnect\Customers\BillingAccounts\Factory::Get( $id);
    $address->EnsureLoaded();
  
    Forms::LoadObject($form_state['values'], $address);
     $address->customer = $customer->id;
    \printconnect\Customers\BillingAccounts\Factory::Validate(clone $address);
    $form_state['storage']['address'] = $address;
  } catch (\printconnect\Dal\Exception $ex) {
    Forms::HandleException($ex, $form);
  }
}
/**
 * Address form submit
 */
function pccustomers_address_form_submit($form, &$form_state) {
  $address = $form_state['storage']['address'];
  Addresses\Factory::Save($address);

  drupal_set_message(t('Saved'));
}
function pccustomers_address_Billingaddresses_form_submit($form, &$form_state) {
  $billingAccount = $form_state['storage']['address'];
  $customerbillingAccount = Factory::Current();
  \printconnect\Customers\BillingAccounts\Factory::Save($billingAccount);
   switch($billingAccount->vatStatus) {
            case 'vat_tag_3' :
                form_set_error('company][vatNumber', t('Your Vat Number is invalid'));
                return false;
            break;
            case 'vat_tag_8' :
                form_set_error('company][vatNumber', t('Your Vat Number is inactive'));
                return false;
            break;
            default:
            break;
       }   
  $customerbillingAccount->billingAccount = $billingAccount->id;
  \printconnect\Customers\Factory::Save($customerbillingAccount);
  \printconnect\Customers\BillingAccounts\Factory::ClearBillingAccountsCache($customerbillingAccount);
  
  drupal_set_message(t('Saved'));
  drupal_goto('myprintconnect/addresses');
}
/**
 * Defines the new address form
 */
function pccustomers_newaddress_form($form, $form_state) {
  _pccustomers_ensureloggedin();

  $form['name'] = array(
      '#type' => 'textfield',
      '#title' => t('Name'),
      '#required' => TRUE,
      '#size' => 71,
  );

  $form['phone'] = array(
      '#type' => 'textfield',
      '#title' => t('Phone'),
      '#size' => 71,
      '#required' => TRUE,
  );

  $form['street'] = array(
      '#type' => 'textfield',
      '#title' => t('Street'),
      '#required' => TRUE,
      '#size' => 71,
  );

  $form['postalCode'] = array(
      '#type' => 'textfield',
      '#title' => t('PostalCode'),
      '#required' => TRUE,
      '#size' => 71,
      '#attributes' => array('class' => array('postalCode')),
  );

  $form['city'] = array(
      '#type' => 'textfield',
      '#title' => t('City'),
      '#required' => TRUE,
      '#size' => 71,
      '#attributes' => array('class' => array('city')),
  );

  $options = array();
  $countries = \printconnect\Countries\Factory::GetAll();
  foreach ($countries as $country) {
    $options[$country->id] = $country->tag;
  }
  natsort($options);
  $form['country'] = array(
      '#type' => 'select',
      '#title' => t('Country'),
      '#required' => TRUE,
      '#options' => $options,
      '#ajax' => array(
          'callback' => 'pccheckout_billingaccount_country_callback',
          'wrapper' => 'vatNumber',
          'method' => 'replace',
          'effect' => 'fade',
          'progress' => array(
              'message' => NULL,
              'type' => NULL,
          ),
      ),
  );
  
  $form['company'] = array(
      '#type' => 'textfield',
      '#title' => t('Company'),
      '#size' => 71,
  );
//  $form['vatNumber'] = array(
//      '#prefix' => '<div id="vatNumber">',
//      '#suffix' => '</div>',
//      '#type' => 'vatfield',
//      '#title' => t('Vat number'),
//      '#attributes' => array('class' => array('vat')),
//  );
//
//  $form['defaultBilling'] = array(
//      '#type' => 'checkbox',
//      '#title' => t('This is the default invoice address'),
//  );
//
//  $form['defaultShipping'] = array(
//      '#type' => 'checkbox',
//      '#title' => t('This is the default shipping address'),
//  );

  $form['actions'] = array(
      '#type' => 'actions',
  );

  $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Save'),
  );

  $form['back'] = array(
      '#markup' => theme('linkbutton', 'myprintconnect/addresses', t('Back')),
  );

  return $form;
}
function pccustomers_newaddress_Billingaddresses_form($form, $form_state) {
 _pccustomers_ensureloggedin();
 
    $statu = array(
           'visible' => array(
             ':input[name="option"]' => array('value' => 'societe'),
           ),
         );
 

  $active = array(
          t('personellement') => t('personellement'),
          t('societe') => t('societe')
      );
    
  
    $form['summary'] = array(
        '#type' => 'fieldset',
        '#title' => t('Billing addresses'),
        '#prefix' => '<div id="FormBillingaddresses">',
        '#suffix' => '</div>',
    );
    
      $form['summary']['popup']= array(
        '#type' => 'fieldset',
        '#prefix' => '<span id="fademe" class="black_overlay">',
        '#suffix' => '</span>',
         
       );
    
    $form['summary']['popup']['message'] = array(
        '#type' => 'container',
        '#prefix' => '<div id="light" class="white_content">',
        '#suffix' => '</div>',
    );
    
    $form['summary']['popup']['message']['text'] = array(
        '#markup' => '<p>' . t('this billing address is already exist would you want load this address as your default billing address') . '</p>',
    );
    
    $form['summary']['popup']['message']['valid'] = array(
    '#type' => 'button',
    '#value' => t('Valider'),
     '#class' => array('valid-button'),
        '#ajax' => array(
            'callback' => 'pccustomers_validat_vat_callback',
            'wrapper' => 'FormBillingaddresses',
            'method' => 'replace',
            'effect' => 'fade',
            'progress' => array(
                'message' => NULL,
                'type' => NULL,
            ),
        ),
        );
    
    $onclick = "document.getElementById('light').style.display='none';document.getElementById('fademe').style.display='none'";
    
    $form['summary']['popup']['message']['null'] = array(
        '#markup' => '<input type="button" id="null-address-vat" name="null_address_vat" value="' . t('Annuler') . '" class="button_null_address_vat" onclick = "'.$onclick.'">',
    );
 
    $form['summary']['option'] = array(
    '#type' => 'radios',
    '#title' => t('Quelle type de commande ?'),
    '#default_value' => isset($node->active) ? $node->active : t('personellement'),
    '#options' => $active,
  
  );

 $form['summary']['vatNumber'] = array(
      '#type' => 'textfield',
      '#title' => t('VatNumber'),
      '#attributes' => array('class' => array('vat')),
      '#size' => 71,
      '#states' => $statu, 
      '#ajax' => array(
            'callback' => 'pccustomers_newaddress_Billingaddresses_form_callback',
            'wrapper' => 'FormBillingaddresses',
            'method' => 'replace',
            'effect' => 'fade',
            'progress' => array(
                'message' => NULL,
                'type' => NULL,
            ),
        ),
  );
 
  $form['summary']['company'] = array(
      '#type' => 'textfield',
      '#title' => t('Company'),
      '#size' => 71,
       '#states' => $statu, 
  );

  $form['summary']['name'] = array(
      '#type' => 'textfield',
      '#title' => t('Name'),
      '#size' => 71,
      '#required' => TRUE,
  );

  $form['summary']['street'] = array(
      '#type' => 'textfield',
      '#title' => t('Street'),
      '#size' => 71,
      '#required' => TRUE,
  );

  $form['summary']['postalCode'] = array(
      '#type' => 'textfield',
      '#title' => t('PostalCode'),
      '#size' => 71,
      '#required' => TRUE,
      '#attributes' => array('class' => array('postalCode')),
  );

  $form['summary']['city'] = array(
      '#type' => 'textfield',
      '#title' => t('City'),
      '#size' => 71,
      '#required' => TRUE,
      '#attributes' => array('class' => array('city')),
  );

  $options = array();
  $countries = \printconnect\Countries\Factory::GetAll();
  foreach ($countries as $country) {
    $options[$country->id] = $country->tag;
  }
  natsort($options);
  $form['summary']['country'] = array(
      '#type' => 'select',
      '#title' => t('Country'),
  
      '#options' => $options,
      '#required' => TRUE,
      '#ajax' => array(
          'callback' => 'pccheckout_billingaccount_country_callback',
          'wrapper' => 'vatNumber',
          'method' => 'replace',
          'effect' => 'fade',
          'progress' => array(
              'message' => NULL,
              'type' => NULL,
          ),
      ),
  );
    $form['summary']['id'] = array(
      '#type' => 'hidden',
      '#title' => t('id'),
      '#size' => 71,

  );
    
  $form['actions'] = array(
      '#type' => 'actions',
  );

  $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Save'),
      '#name' => 'Billingaddresses_address_submit',
      '#validate' => array('pccustomers_newaddress_form_Billingaddresses_validate'),
      '#submit' => array('pccustomers_newaddress_form_Billingaddresses_submit'),
  );

  $form['back'] = array(
      '#markup' => theme('linkbutton', 'myprintconnect/addresses', t('Back')),
  );

 return $form;
}

function pccustomers_newaddress_Billingaddresses_form_callback(&$form, &$form_state) {
    $address = $form_state['values']['vatNumber'];
    $billingAccount = \printconnect\Customers\BillingAccounts\Factory::Get($address);
    \printconnect\Customers\BillingAccounts\Factory::LoadBillingAccountVat($billingAccount);
    if (isset($billingAccount->number)) {
        $form['summary']['popup']['#prefix'] = '<span id="fademe" class="black_overlay2">';
    }
  return $form['summary'];
}

function pccustomers_validat_vat_callback(&$form, &$form_state) {
   $val = $form_state['values']['vatNumber'];
   $billingAccount = \printconnect\Customers\BillingAccounts\Factory::Get($val);
   \printconnect\Customers\BillingAccounts\Factory::LoadBillingAccountVat($billingAccount);
        $form['summary']['popup']['#prefix'] = '<span id="fademe" class="black_overlay">';
        $form['summary']['id']['#value'] = $billingAccount->id;
        $form['summary']['name']['#value'] = $billingAccount->name;
        $form['summary']['company']['#value'] = $billingAccount->company;
        $form['summary']['street']['#value'] = $billingAccount->street;
        $form['summary']['postalCode']['#value'] = $billingAccount->postalCode;
        $form['summary']['city']['#value'] = $billingAccount->city;
        $form['summary']['country']['#value'] = $billingAccount->country;
      
 return $form['summary'];
}


function pccheckout_billingaccount_country_callback($form, $form_state) {
  
  $country = printconnect\Countries\Factory::Get($form_state['values']['country']);
  $form['vatNumber']['country']['#value'] = $country->vatPrefix;
  return $form['vatNumber'];
}

/**
 * New address form validation
 */
function pccustomers_newaddress_form_validate($form, &$form_state) {
    
  if (!is_numeric($form_state['values']['phone'])) {
     form_set_error('phone',t('Please enter your Phone Number as Number value.'));
  }
  if (is_numeric($form_state['values']['phone']) && strlen($form_state['values']['phone'])!= 10) {
      form_set_error('phone',t('Please enter your Phone Number as 10 Number.'));
  }
    $tva = substr($form_state['values']['vatNumber'], 2, 2);
     if(!empty($tva)){
 if (!is_numeric($tva)) {
    form_set_error('vatNumber',t('Please enter your VAT Number as Number value.'));
  }
   if (is_numeric($tva) && strlen($tva)!= 2) {
      form_set_error('vatNumber',t('Please enter your Phone Number as 2 Number.'));
  }
  }
  try {
    $customer = Factory::Current();
    $address = Addresses\Factory::Create();

    Forms::LoadObject($form_state['values'], $address);
    $address->customer = $customer->id;

    Addresses\Factory::Validate($address);
  } catch (\printconnect\Dal\Exception $ex) {
    Forms::HandleException($ex, $form);
    return false;
  }
}


function pccustomers_newaddress_form_Billingaddresses_validate($form, &$form_state) {
  if($form_state['values']['vatNumber']){
      if(!empty($form_state['values']['company'])){
        if(strlen($form_state['values']['vatNumber'])== 2 && is_string($form_state['values']['vatNumber'])){
            form_set_error('Number', t('Le champ N° de TVA est requis.'));
        }
      }
      if(empty($form_state['values']['vatNumber'])){
        if(is_numeric(substr($form_state['values']['vatNumber'],2)) && is_string(substr($form_state['values']['vatNumber'],0,2))){
            form_set_error('company', t('Le champ Entreprise est requis.'));
        }
      }
 }

    $tva = substr($form_state['values']['vatNumber'], 2, 2);
     if(!empty($tva)){
 if (!is_numeric($tva)) {
    form_set_error('vatNumber',t('Please enter your VAT Number as Number value.'));
  }
   if (is_numeric($tva) && strlen($tva)!= 2) {
      form_set_error('vatNumber',t('Please enter your Phone Number as 2 Number.'));
  }
  }

}
/**
 * New address form submit
 */
function pccustomers_newaddress_form_submit($form, &$form_state) {
  try {
    $customer = Factory::Current();
    $address = Addresses\Factory::Create();
    Forms::LoadObject($form_state['values'], $address);
    $address->customer = $customer->id;

    Addresses\Factory::Save($address);
    Addresses\Factory::ClearAddressesCache($customer);

    drupal_set_message(t('Saved'));
    drupal_goto('myprintconnect/addresses');
  } catch (\printconnect\Dal\Exception $ex) {
    Forms::HandleException($ex, $form);
    return false;
  }
}
function pccustomers_newaddress_form_Billingaddresses_submit($form, &$form_state) {
    $Billingcustomer = Factory::Current();
    $Billingaddress = \printconnect\Customers\BillingAccounts\Factory::Create();
    Forms::LoadObject($form_state['values'], $Billingaddress);
    $Billingaddress->customer = $Billingcustomer->id;
     if(isset($form_state['values']['isDefault'])){
        $billingAccount->isDefault = $form_state['values']['isDefault'];
      }
    \printconnect\Customers\BillingAccounts\Factory::Save($Billingaddress);
    \printconnect\Customers\BillingAccounts\Factory::ClearBillingAccountsCache($Billingcustomer);
    switch($Billingaddress->vatStatus) {
         case 'vat_tag_3' :
             form_set_error('Number', t('Your Vat Number is invalid'));
             return false;
         break;
         case 'vat_tag_8' :
             form_set_error('Number', t('Your Vat Number is inactive'));
             return false;
         break;
         default:
         break;
    }

    $form_state['rebuild'] = true;
    drupal_set_message(t('societe'));
    drupal_goto('myprintconnect/addresses');
}


function pccustomers_login_form($form, &$form_state, $redirect = 'myprintconnect') {
  if (isset($_GET['return'])) {
    $redirect = $_GET['return'];
  }

  $form['login'] = array(
      '#type' => variable_get('pc_flow', '') == 'printconcept' ? 'fieldset' : 'container',
      '#title' => t('Login or register'),
  );
//  $form['login']['advantages'] = array(
//      '#markup' => t('Account advantages'),
//  );
//if (variable_get('pc_fbappid', '187894038012933') || variable_get('pc_googleappid', '630860089189.apps.googleusercontent.com')) {
  if (variable_get('pc_fbappid', FALSE) || variable_get('pc_googleappid', FALSE)) {

    $form['login']['openauth'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('openauth')),
    );
    if (variable_get('pc_fbappid', '228019944073196')) {
      $form['login']['openauth']['facebook'] = array(
          '#theme' => 'pccustomers_facebookconnect',
          '#redirect' => $redirect,
      );
    }
    if (variable_get('pc_googleappid', '630860089189.apps.googleusercontent.com')) {
      $form['login']['openauth']['google'] = array(
          '#theme' => 'pccustomers_googleconnect',
          '#redirect' => $redirect,
      );
    }
    $form['login']['openauth']['text'] = array(
        '#type' => 'item',
        '#markup' => t('Or'),
        '#attributes' => array('class' => array('clearfix')),
    );
  }

//  $form['login']['options'] = array(
//      '#type' => 'radios',
//      '#default_value' => 'existing',
//      '#options' => array(
//          'existing' => t("I'm a customer already"),
//          'new' => t("I'm not a customer yet"),
//      ),
//  );
   $form['login']['decription'] = array(
       '#markup'=>"Déja client? ".l('Connectez-vous.','#',array('attributes' => array('class' => 'logbl'))),
        '#weight' => 6,
   );
  $form['login']['email'] = array(
      '#type' => 'textfield',
      '#title' => t('Email'),
      '#required' => TRUE,
      '#weight' => 7,
      '#attributes' => array('class' => array('customer-email', 'hint')),
      '#description' => t('Your email address'),
  );
  $form['login']['password'] = array(
      '#type' => 'password',
      '#title' => t('Password'),
      '#required' => TRUE,
      '#attributes' => array('autocomplete' => 'off', 'class' => array('hint')),
      '#weight' => 8,
      '#description' => t('Your password'),
  );
  
  
  $form['login']['actions'] = array(
      '#type' => 'actions',
      '#attributes' => array('class' => array('form-actions', 'clearfix')),
  );


  $form['login']['actions']['forgot'] = array(
      '#markup' => l(t('Forgot your password?'), 'myprintconnect/forgotpassword', array('query' => array('return' => $redirect), 'attributes' => array('class' => array('link')))),
  );

  $form['login']['actions']['login'] = array(
      '#type' => 'submit',
      '#value' => t('Login'),
      '#weight' => 9,
      '#validate' => array('pccustomers_login_form_login_validate'),
      '#submit' => array('pccustomers_login_form_submit'),
      '#attributes' => array('class' => array('action', 'large', 'login', 'noreplace', 'button')),
      '#limit_validation_errors' => array(
          array('email'),
          array('password'),
      ),
  );

   /*Secont form */
  
  
   $form['login']['decriptionnew'] = array(
       '#markup'=>"Nouveau client? ".l('Créer votre compte.','#',array('attributes' => array('class' => 'logbl'))),
        '#weight' => 10,
   );
   $form['login']['emailnew'] = array(
        '#type' => 'textfield',
        '#title' => t('Email'),
        '#required' => TRUE,
        '#weight' => 11,
        '#attributes' => array('class' => array('customer-email', 'hint')),
        '#description' => t('Your email address'),
    );
  $form['login']['newpassword'] = array(
      '#type' => 'password',
      '#title' => t('Choose your password'),
      '#required' => TRUE,
      '#attributes' => array('autocomplete' => 'off', 'class' => array('hint')),
      '#weight' => 12,
      '#description' => t('Your password'),
  );
    $form['login']['actions']['register'] = array(
 
      '#type' => 'submit',
      '#value' => t('Register'),
      '#weight' => 13,
      '#validate' => array('pccustomers_login_form_register_validate'),
      '#submit' => array('pccustomers_login_form_submit'),
      '#attributes' => array('class' => array('action', 'large', 'register', 'noreplace', 'button')),
      '#limit_validation_errors' => array(
          array('emailnew'),
          array('newpassword'),
      ),
    );
  /* End second form */
    
    
  /*
    $form['forgot'] = array(
    '#type' => 'fieldset',
    '#title' => t('Forgot your password?'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#states' => array(
    'collapsed' => array(
    '#edit-login' => array('collapsed' => FALSE),
    ),
    ),
    );
    $form['forgot']['text'] = array(
    '#markup' => t("No problem, just fill in your email address below, we'll send you a temporary password that you can change on the site."),
    );

    $form['forgot']['email'] = array(
    '#type' => 'textfield',
    '#title' => t('Email'),
    '#required' => TRUE,
    '#size' => 25,
    );
    $form['forgot']['actions'] = array(
    '#type' => 'actions',
    '#attributes' => array('class' => array('form-actions', 'clearfix')),
    );
    $form['forgot']['actions']['forgot'] = array(
    // '#name' => 'forgot',
    '#type' => 'submit',
    '#value' => t('Submit'),
    '#attributes' => array('class' => array('action', 'button', 'large', 'continue')),
    '#validate' => array('pccustomers_login_form_forgot_validate'),
    '#submit' => array('pccustomers_login_form_forgot_submit'),
    '#limit_validation_errors' => array(
    array('forgot', 'email'),
    ),
    );

   */

  $form_state['storage']['redirect'] = urldecode($redirect);

  $form['#tree'] = FALSE;
  $form['#cache'] = TRUE;
  return $form;
}


/**
 * Deuxieme form authentification
 * @param type $form
 * @param type $form_state
 */
function pccustomers_loginnew_form($form, &$form_state) {
 

    $form['login']['emailnew'] = array(
        '#type' => 'textfield',
        '#title' => t('Email'),
        '#required' => TRUE,
        '#size' => 71,
        '#attributes' => array('class' => array('customer-email', 'hint')),
        '#description' => t('Your email address'),
    );
  $form['login']['newpassword'] = array(
      '#type' => 'password',
      '#title' => t('Choose your password'),
      '#required' => TRUE,
      '#attributes' => array('autocomplete' => 'off', 'class' => array('hint')),
      '#size' => 71,
      '#description' => t('Your password'),
  );
    $form['login']['actions']['register'] = array(
        //'#name' => 'register',
      '#type' => 'submit',
      '#value' => t('Register'),
      '#validate' => array('pccustomers_login_form_register_validate'),
      '#submit' => array('pccustomers_login_form_submit'),
      '#attributes' => array('class' => array('action', 'large', 'register', 'noreplace', 'button')),
//      '#states' => array(
//          'visible' => array(
//              'input[name="options"]' => array('value' => 'new'),
//          //  '#edit-forgot' => array('collapsed' => TRUE),
//          ),
//      ),

      '#limit_validation_errors' => array(
          array('emailnew'),
          array('newpassword'),
      ),
  );
  
    $form_state['storage']['redirect'] = urldecode($redirect);

  $form['#tree'] = FALSE;
  $form['#cache'] = TRUE;
  return $form;
  
  
}
//
//function pccustomers_login_forms() {
//  $build = array();
//
//  $loginForm = drupal_get_form('pccustomers_login_form');
//  $forgotPasswordForm = drupal_get_form('pccustomers_forgotpassword_form', TRUE);
//
//  $build['login'] = $loginForm;
//  $build['forgot'] = $forgotPasswordForm;
//
//  return $build;
//}

function pccustomers_login_form_login_validate(&$form, &$form_state) {
  global $language;

//  if (!(isset($form_state['values']['password']) || count($form_state['values']['password']) < 5)) {
//    form_set_error('password', t('Password not long enough'));
//  }

  $customer = Factory::Login($form_state['values']['email'], $form_state['values']['password']);
  if ($customer && !$customer->blocked) {

    if (!valid_email_address($customer->email)) {
      form_set_error('email', t('Not a valid email address'));
      return false;
    }

    if (isset($language->id)) {
      $customer->language = $language->id;
    } else {
      $customer->language = 1;
    }
    $form_state['storage']['customer'] = $customer;
    return true;
  } else {
    form_set_error('email', t('Cannot log in using the given email and password.'));
    return false;
  }
}

function pccustomers_login_form_register_validate(&$form, &$form_state) {
  global $language;

  if (!valid_email_address($form_state['values']['emailnew'])) {
    form_set_error('emailnew', t('Not a valid email address'));
    return;
  }
  if (!isset($form_state['values']['newpassword']) || strlen($form_state['values']['newpassword']) < 5) {
    form_set_error('newpassword', t('Password not long enough'));
    return;
  }
  $customer = Factory::GetByEmail($form_state['values']['emailnew']);
  if ($customer) {
    form_set_error('emailnew', t('This email address is already registered'));
    return FALSE;
  } else {
    $form_state['values']['email']=$form_state['values']['emailnew'];
    $customer = Factory::Create();
    Forms::LoadObject($form_state['values'], $customer);
    $customer->password = $form_state['values']['newpassword'];
    $customer->repeatpassword = $customer->password;

    if (isset($language->id)) {
      $customer->language = $language->id;
    } else {
      $customer->language = 1;
    }

//try gravatar 
    $url = "https://secure.gravatar.com/" . md5(strtolower(trim($form_state['values']['email']))) . ".json";
    $response = drupal_http_request($url);
    switch ((int) $response->code) {
      case 200:
        $gravatarData = json_decode($response->data);
        if (isset($gravatarData->entry[0]) && isset($gravatarData->entry[0]->name)) {
          $customer->firstName = $gravatarData->entry[0]->name->givenName;
          $customer->lastName = $gravatarData->entry[0]->name->familyName;
        }
        break;
    }
    try {
      Factory::Validate($customer);
    } catch (\printconnect\Dal\Exception $ex) {
//      form_set_error(NULL, ex);
      Forms::HandleException($ex, $form);

//return FALSE;
    }

    $form_state['storage']['customer'] = $customer;
    $form_state['storage']['new_customer'] = TRUE;

    return true;
  }
}

/*
 * Login   submit
 */

function pccustomers_login_form_submit($form, &$form_state) {
  $customer = $form_state['storage']['customer'];
  Factory::Save($customer);

  Factory::LoginByObject($customer);

  if (isset($_GET['return'])) {
    drupal_goto($_GET['return']);
  } elseif (isset($form_state['storage']['redirect'])) {
    drupal_goto($form_state['storage']['redirect']);
  } else {
    drupal_goto('myprintconnect');
  }
}

/*
  function pccustomers_login_form_forgot_validate($form, &$form_state) {
  try {
  $customer = Factory::GetByEmail($form_state['values']['forgot']['email']);
  if ($customer) {
  $form_state['storage']['customer'] = $customer;
  return true;
  } else {
  form_set_error('forgot][email', t('Email not found.'));
  return false;
  }
  } catch (\printconnect\Dal\Exception $ex) {
  Forms::HandleException($ex, $form, '');
  return FALSE;
  }
  }

  function pccustomers_login_form_forgot_submit($form, $form_state) {
  //$customer = $form_state['storage']['customer'];
  //Factory::RequestNewPassword($customer);
  drupal_set_message(t('A new password will be sent to this email address'));
  }
 */

function pccustomers_forgotpassword_form($form, $form_state) {
  $redirect = FALSE;
  if (isset($_GET['return'])) {
    $redirect = $_GET['return'];
  }



//  if ($fieldset) {
//    $form['forgot'] = array(
//        '#type' => 'fieldset',
//        '#title' => t('Forgot your password?'),
//        '#collapsible' => TRUE,
//        '#collapsed' => TRUE,
//    );
//  }


  $form['forgot'] = array(
      '#type' => variable_get('pc_flow', '') == 'printconcept' ? 'fieldset' : 'container',
      '#title' => t('Forgot your password?'),
  );

  $form['forgot']['text'] = array(
      '#markup' => t("No problem, just fill in your email address below, we'll send you a temporary password that you can change on the printconnect.com site."),
  );

  $form['forgot']['forgotemail'] = array(
      '#type' => 'textfield',
      '#title' => t('Email'),
      '#required' => TRUE,
      '#size' => 50,
  );


  $form['forgot']['actions'] = array(
      '#type' => 'actions',
  );

  if ($redirect) {
    $form['forgot']['actions']['back'] = array(
        '#markup' => l(t('Login or register'), 'myprintconnect/login', array('query' => array('return' => $redirect), 'attributes' => array('class' => array('link')))),
    );
  }
  $form['forgot']['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Continue'),
      '#attributes' => array('class' => array('button', 'large', 'continue')),
  );

  $form_state['storage']['redirect'] = $redirect;

  return $form;
}

function pccustomers_forgotpassword_form_validate($form, &$form_state) {
  try {
    $customer = Factory::GetByEmail($form_state['values']['forgotemail']);
    if ($customer) {
      $form_state['storage']['customer'] = $customer;
      return true;
    } else {
      form_set_error('', t('Email not found.'));
      return false;
    }
  } catch (\printconnect\Dal\Exception $ex) {
    Forms::HandleException($ex, $form, '');
    return FALSE;
  }
}

function pccustomers_forgotpassword_form_submit($form, $form_state) {
  $customer = $form_state['storage']['customer'];
  Factory::RequestNewPassword($customer);
  drupal_set_message(t('A new password will be sent to this email address'));

  if (isset($_GET['return'])) {
    drupal_goto('myprintconnect/login', array('query' => array('return' => $_GET['return'])));
  } elseif (isset($form_state['storage']['redirect'])) {
    drupal_goto('myprintconnect/login', array('query' => array('return' => $form_state['storage']['redirect'])));
  } else {
    drupal_goto('myprintconnect/login');
  }
}

function pccustomers_credit_form($form, &$form_state) {
   $customer = CustomersFactory::Current();
   $account = \printconnect\Customers\Credit\Factory::Get($customer, FALSE);
  $form['value'] = array(
      '#type' => 'item',
      '#markup' => t('Your store credit amount sdfsdfsdf : !value', array('!value' => theme('price', array('value' => $account->credits)))),
  );

  $form['text'] = array(
      '#type' => 'item',
      '#markup' => t('Use your store credit to pay your next orders'),
  );



  $rows = array();

  $transactions = $account->history;

  usort($transactions, function ($a, $b) {
            return strtotime($a->creationDate) < strtotime($b->creationDate);
          });


  foreach ($transactions as $transaction) {
    $orderLink = '';

    if (isset($transaction->order)) {
      $order = \printconnect\Orders\Factory::Get($transaction->order);
      $orderLink = l(t('Payment of order @id', array('@id' => $transaction->order)), 'myprintconnect/orders/' . $transaction->order);
      $orderLink = l($order->number, 'myprintconnect/orders/' . $transaction->order);
      $reference = t('Payment of order !order', array('!order' => $orderLink));
    } else {
      $reference = $transaction->reference;
    }

    $debet = '';
    $credit = '';

    if ($transaction->convertedAmount > 0) {
      $credit = theme('price', array('value' => $transaction->convertedAmount));
    } else {
      $debet = theme('price', array('value' => abs($transaction->convertedAmount)));
    }

    $rows[] = array(
        format_date(strtotime($transaction->creationDate), 'short'),
        $reference,
        //$orderLink,
//  format_date(strtotime($history->creationDate . " +1 year")),
        $credit,
        $debet,
    );
  }

  $table = theme('table', array('rows' => $rows, 'empty' => t('No data found'), 'header' => array(t('Date'), t('Reference'), t('Credit'), t('Debet')), 'attributes' => array('class' => array('grid'))));

  $form['history'] = array(
      '#type' => 'item',
      //'#title' => t('History'),
      '#markup' => $table,
  );


  return $form;
}

function pccustomers_redeem_form($form, &$form_state) {

  _pccustomers_ensureloggedin();
  $form['code'] = array(
      '#type' => 'textfield',
      '#title' => t('Code'),
      '#required' => TRUE,
  );
  $form['redeem'] = array(
      '#type' => 'submit',
      '#value' => t('Redeem'),
  );

  return $form;
}

function pccustomers_redeem_form_validate($form, &$form_state) {
  try {
    \printconnect\Customers\Credit\Factory::Redeem(Factory::Current(), $form_state['values']['code']);
  } catch (\printconnect\Dal\Exception $ex) {
    form_set_error('code', implode("\n", $ex->errors));
  }
}

function pccustomers_redeem_form_submit($form, &$form_state) {
  drupal_goto('myprintconnect/credit');
}


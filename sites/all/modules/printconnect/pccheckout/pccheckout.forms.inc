<?php

use printconnect\Customers\Factory as CustomersFactory;

function pccheckout_redirect() {
    _pccustomers_ensureloggedin();
    $customer = \printconnect\Customers\Factory::Current();
    $addresses = \printconnect\Customers\Addresses\Factory::GetAddresses($customer);
    if (!$customer->firstName || !$customer->lastName || !$customer->phone || !$addresses->count) {
        drupal_goto('checkout/personal');
    } else {
        drupal_goto('checkout/invoiceanddelivery');
    }
}

function pccheckout_login() {
    module_load_include('inc', 'pccustomers', 'pccustomers.forms');
    return drupal_get_form('pccustomers_login_form');
}

function pccheckout_personal_form($form, &$form_state) {
    _pccustomers_ensureloggedin();
    $defaultShippingAddress = FALSE;
    $defaultBillingAddress = FALSE;
    $countries = array();
    $cart = \printconnect\Carts\Factory::Current();
    $customer = \printconnect\Customers\Factory::Current();

    $shopConfig = \printconnect\Shop\Configuration\Factory::Current();
    $defaultCountry = \printconnect\Countries\Factory::Get($shopConfig->defaultCountry);

    foreach (\printconnect\Customers\Addresses\Factory::GetAddresses($customer, false) as $address) {
        if ($address->defaultShipping) {
            $defaultShippingAddress = $address;
        }
        if ($address->defaultBilling) {
            $defaultBillingAddress = $address;
        }
    }

    foreach (\printconnect\Countries\Factory::GetAll() as $country) {
        $countries = array (
       "21"=>t('Belgique'),
       "73"=>t('France'),
       "150"=>t('Pays-Bas'),
       "199"=>t('Espagne'),
       "124"=>t('Luxembourg'),
     );
    }

    if ($defaultBillingAddress) {
        $country = \printconnect\Countries\Factory::Get($defaultBillingAddress->country);
    } else {
        $country = FALSE;
    }


    $form['personal'] = array(
        '#type' => 'fieldset',
        '#title' => t('Personal'),
        '#collapsible' => FALSE,
    );
    
    
    
    $form['personal']['popup']= array(
        '#type' => 'fieldset',
        '#prefix' => '<span id="fademe" class="black_overlay" style=" height: 612px;">',
        '#suffix' => '</span>',
         
       );
    
    $form['personal']['popup']['message'] = array(
        '#type' => 'container',
        '#prefix' => '<div id="light" class="white_content">',
        '#suffix' => '</div>',
    );
    
    $form['personal']['popup']['message']['text'] = array(
        '#markup' => '<p>' . t('this billing address is already exist would you want load this address as your default billing address') . '</p>',
    );
    
    $form['personal']['popup']['message']['valid'] = array(
    '#type' => 'markup',
    '#markup' => '<input type="button" name="valid-button" value="' . t('Valider') . '" class="valid-button-btt" >',
        );
    
    $form['personal']['popup']['message']['null'] = array(
        '#type' => 'markup',
        '#markup' => '<input type="button" id="null-address-vat" name="null_address_vat" value="' . t('Annuler') . '" class="button_null_address_vat" >',
    );

    $form['personal']['firstName'] = array(
        '#type' => 'textfield',
        '#title' => t('First name'),
        '#required' => TRUE,
        '#size' => 30,
        '#default_value' => $customer->firstName,
    );
    $form['personal']['lastName'] = array(
        '#type' => 'textfield',
        '#title' => t('Last name'),
        '#required' => TRUE,
        '#size' => 30,
        '#default_value' => $customer->lastName,
    );
    $form['personal']['phone'] = array(
        '#type' => 'textfield',
        '#title' => t('Mobile number'),
        '#required' => TRUE,
        '#size' => 30,
        '#default_value' => $customer->phone,
    );

    $form['address'] = array(
        '#type' => 'fieldset',
        '#title' => t('Address'),
    );

    $form['address']['street'] = array(
        '#type' => 'textfield',
        '#title' => t('Street'),
        '#required' => TRUE,
        '#size' => 30,
    );
    $form['address']['postalCode'] = array(
        '#type' => 'textfield',
        '#title' => t('Postal code'),
        '#required' => TRUE,
        '#size' => 30,
        '#attributes' => array(
            'placeholder' => '75000',
        )
    );
    $form['address']['city'] = array(
        '#type' => 'textfield',
        '#title' => t('City'),
        '#required' => TRUE,
        '#size' => 30,
        '#attributes' => array(
            'placeholder' => t('Paris'),
        )
    );
    $form['address']['country'] = array(
        '#type' => 'select',
        '#title' => t('Country'),
        '#required' => TRUE,
        '#empty_value' => 0,
        '#options' => $countries,
    );

    
    $form['company'] = array(
        '#type' => 'fieldset',
        '#title' => t('Company')
    );
    
    $form['company']['isCompany'] = array(
        '#type' => 'checkbox',
        '#title' => t('Are you a company ?'),
        '#attributes' => array(
            'id' => 'isUserCompany',
            'checked'=> 'false'
        )
    );

    $form['company']['company'] = array(
        '#type' => 'textfield',
        '#title' => t('Company'),
        '#required' => FALSE,
        '#size' => 30,
        '#attributes' => array(
            'id' => 'companyInput'
        )
    );

    $form['company']['vatNumber'] = array(
        '#attributes' => array('id' => 'vatNumber'),
        '#id' => 'vatNumber',
        '#prefix' => '<div id="vatNumber">',
        '#suffix' => '</div>',
        '#type' => 'vatfield',
        '#title' => t('Vat number'),
        '#required' => FALSE,
    );

    $form['actions'] = array(
        '#type' => 'actions',
        '#attributes' => array('class' => array('actions', 'clearfix')),
    );
    $form['actions']['submit'] = array(
        '#name' => 'personal-submit',
        '#type' => 'submit',
        '#value' => t('Continue'),
        '#attributes' => array('class' => array('action', 'button', 'large', 'continue')),
    );

    $form['#id'] = 'pccheckout-personal-form';

    $form_state['storage']['customer'] = $customer;
    $form_state['storage']['address'] = $defaultShippingAddress;

    return $form;
}


function pccheckout_personal_form_validate($form, &$form_state) {
    global $language;
    $customer = $form_state['storage']['customer'];
 
    if(!empty($form_state['values']['postalCode']) && !is_numeric($form_state['values']['postalCode'])){
        form_set_error('postalCode', t('Le champ Code postal doit être numérique.'));
        return false;
    }
    if(is_numeric($form_state['values']['postalCode']) && strlen($form_state['values']['postalCode'])<4){
        form_set_error('postalCode', t('Le champ Code postal doit être supérieur à 3 chiffres.'));
        return false;
    } 
    if(strlen($form_state['values']['city'])<2){
        form_set_error('city', t('Le champ ville est trop court.'));
        return false;  
    }
    if(empty($form_state['values']['postalCode']) or 
              empty($form_state['values']['city']) or 
              empty($form_state['values']['street'])){
            return false;       
    }
  
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

    \printconnect\Drupal\Forms::LoadObject($form_state['values'], $customer);
    if (isset($language->id)) {
        $customer->language = $language->id;
    } else {
        $customer->language = 1;
    }

    $address = $form_state['storage']['address'];
    if (!$address) {
        $address = \printconnect\Customers\Addresses\Factory::Create();
        $address->firstName = $customer->firstName;
        $address->lastName = $customer->lastName;
        $address->phone = $customer->phone;
    }

    $address->name = $customer->firstName . ' ' . $customer->lastName;
    $address->defaultShipping = true;
    $address->defaultBilling = true;
    $address->customer = $customer->id;

    \printconnect\Drupal\Forms::LoadObject($form_state['values'], $address);

    try {
        \printconnect\Customers\Addresses\Factory::Validate(clone $address);
    } catch (\printconnect\Dal\Exception $ex) {
        \printconnect\Drupal\Forms::HandleException($ex, $form, 'personal][');
    }
    $form_state['storage']['address'] = $address;
    $form_state['storage']['customer'] = $customer;
}

function pccheckout_personal_form_submit($form, &$form_state) {
    $billingAccount = $form_state['storage']['address'];
    $customerbillingAccount = $form_state['storage']['customer'];
    \printconnect\Customers\BillingAccounts\Factory::Save($billingAccount);
    switch ($billingAccount->vatStatus) {
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
    \printconnect\Customers\Addresses\Factory::Save($billingAccount);
    \printconnect\Customers\Factory::Save($customerbillingAccount);
    \printconnect\Customers\BillingAccounts\Factory::ClearBillingAccountsCache($customerbillingAccount);
    drupal_goto('checkout/invoiceanddelivery');
}


function pccheckout_invoiceanddelivery_form($form, &$form_state) {
    _pccustomers_ensureloggedin();
    $cart = \printconnect\Carts\Factory::Current();
    if (isset($_SESSION['shipping']['object']) && !isset($cart->orderItemShipping)) {
	\printconnect\Carts\Factory::saveInCache($cart, array(
            'orderItemShipping' => $_SESSION['shipping']['object'],
        ));
	$cart->orderItemShipping = $_SESSION['shipping']['object'];
    }
    $defaultShippingAddress = FALSE;
    $defaultBillingAddress = FALSE;
    $customer = \printconnect\Customers\Factory::Current();
    $shippingTypes = \printconnect\Shipping\Types\Factory::GetAll();
    $shippingType = FALSE;
    
    $form_state['storage']['shippingType'] = FALSE;
    foreach ($shippingTypes as $type) {
        if (!isset($cart->orderItemShipping)) {
            drupal_goto('cart');
        }
        if ($cart->orderItemShipping->shippingTypeResellerShop == $type->id) {
            $form_state['storage']['shippingType'] = $type->shippingType->type;
            $shippinginfo = $type;
            $shippingType = $type->shippingType->type;
        }
    }
    $items = \printconnect\Countries\Factory::GetAll();
      foreach ($items as $country) {
             $countries[$country->id] = $country->tag;
      }

     $deliveryCountries = array (
        "21"=>t('Belgique'),
        "73"=>t('France'),
        "150"=>t('Pays-Bas'),
        "199"=>t('Espagne'),
        "124"=>t('Luxembourg'),
      );
    
    if ($cart->orderItemShipping->shippingTypeResellerShop == 351) {
        $deliveryCountries = array();
        $country = \printconnect\Countries\Factory::Get(73);
        $deliveryCountries[$country->id] = $country->tag;
    }
      $addresses = array();
    $addresses[0] = t('New');
    $billingAccounts = printconnect\Customers\BillingAccounts\Factory::GetBillingAccounts($customer, false);
    $mybillingAccounts = printconnect\Customers\BillingAccounts\Factory::LoadBillingAccounts($billingAccounts);
    foreach ($mybillingAccounts as $address) {
        
        if (!is_null($address->id)) {
             $option = array();
             if ($address->company) {
                 $option[] = $address->company;
             }
             elseif ($address->name) {
                     $option[] = $address->name;
             }
             $option[] = $address->street.' , '.$address->postalCode.' '.$address->city;
             $addresses[$address->id] = implode(' - ', $option);
             asort($addresses);
             if ($address->isDefault) {
                 $defaultBillingAddress = $address;
             }
         }
      
    }

    $AllShippingAddress = array();

    foreach (printconnect\Customers\Addresses\Factory::GetAddresses($customer, FALSE) as $address) {
        if ($address->company != '') {
          $AllShippingAddress[$address->id] = $address->company;
        } else {
          $AllShippingAddress[$address->id] = $address->name;
        }
        $AllShippingAddress[$address->id] .= ' - '.$address->street.' , '.$address->postalCode.' '.$address->city;
        if (!$defaultShippingAddress && $address->defaultShipping) {
          $defaultShippingAddress = $address;
          $form_state['storage']['defaultShippingAddress'] = $defaultShippingAddress ? $defaultShippingAddress : FALSE;

        }
    }
    
    foreach ($mybillingAccounts as $address) {          
        if (!is_null($address->id)) {
            $option = array();
            if ($address->company) {
                $option[] = $address->company;
            }elseif ($address->name) {
                $option[] = $address->name;
            }
            $option[] = $address->street.' , '.$address->postalCode.' '.$address->city;
            $idadresse = $address->id;
            $AllShippingAddress[$idadresse.'-B'] = implode(' - ', $option);//.' '.t('(Adresse de facturation)');
        }           
    }
    asort($AllShippingAddress);
    $form['summary'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('summary', 'clearfix')),
    );

    $form['summary']['invoice'] = array(
        '#type' => 'container',
        '#type' => 'fieldset',
        '#title' => t('Invoice address'),
        '#attributes' => array('class' => array('invoice')),
    );

    $form['summary']['invoice']['selected'] = array(
        '#theme' => 'address',
        '#address' => $defaultBillingAddress,
    );
    $form['summary']['invoice']['change'] = array(
        '#markup' => '<a id="toggle-invoice-form" href="#invoice-address" class="toggle">' . t('Change invoice address') . '</a>',
        '#weight' => 200,
    );
    if ($form_state['storage']['shippingType'] == 'shippingTypeStore') {
        $form['summary']['shipping'] = array(
            '#type' => 'fieldset',
            '#title' => t('Shipping address flyer store'),
            '#attributes' => array('class' => array('shipping')),
        );
    }else{
        $form['summary']['shipping'] = array(
            '#type' => 'fieldset',
            '#title' => t('Shipping address'),
            '#attributes' => array('class' => array('shipping')),
        );
    }
  
    
    if($form_state['storage']['shippingType'] == 'shippingTypeStore') {
        
        $form['summary']['shipping']['selected'] = array(
            '#markup' => '<div id="detail">'
            . '<h6></h6>'
            . '<div class="address"></div>'
            . '<div class="phone"></div>'
            . '<div class="fax"></div>'
            . '<div class="email"></div>'
            . '</div>',
        );
    }else{
      $form['summary']['shipping']['selected'] = array(
            '#theme' => 'address',
            '#address' => $defaultShippingAddress,
        );  

    }
    if ($form_state['storage']['shippingType'] == 'shippingTypeStore') {
    //if ($cart->orderItemShipping->shippingTypeResellerShop != 204) {
       // if (!isset($cart->pickuppoint)) {

            $form['summary']['shipping']['change'] = array(
                '#markup' => '<a id="toggle-shipping-form" href="#shipping-address" class="toggle">' . t('Change shipping address flyer store') . '</a>',
                '#weight' => 200,
            );
       // }
    }else{
         $form['summary']['shipping']['change'] = array(
                '#markup' => '<a id="toggle-shipping-form" href="#shipping-address" class="toggle">' . t('Change shipping address') . '</a>',
                '#weight' => 200,
            );
    }
    
    /* invoice address */
    $form['invoice']['address'] = array(
        '#type' => 'fieldset',
        '#title' => '<div class="invoiceaddress">'.t('Invoice address').'</div>',
        '#attributes' => array('id' => 'invoice-address', 'class' => array('tohiding','styleform')),
    );
     $form['invoice']['address']['current'] = array(
        '#type' => 'fieldset',
        '#attributes' => array('id' => 'invoice'),
    );
     

   $form['invoice']['address']['current']['popup']= array(
        '#type' => 'fieldset',
        '#prefix' => '<span id="fademe" class="black_overlay">',
        '#suffix' => '</span>',
         
       );
    
    $form['invoice']['address']['current']['popup']['message'] = array(
        '#type' => 'container',
        '#prefix' => '<div id="light" class="white_content">',
        '#suffix' => '</div>',
    );
    
    $form['invoice']['address']['current']['popup']['message']['text'] = array(
        '#markup' => '<p>' . t('this billing address is already exist would you want load this address as your default billing address') . '</p>',
    );
    
    $form['invoice']['address']['current']['popup']['message']['valid'] = array(
    '#type' => 'markup',
    '#markup' => '<input type="button" name="valid-button" value="' . t('Valider') . '" class="valid-button-btt" >',
        );
    
    $form['invoice']['address']['current']['popup']['message']['null'] = array(
        '#type' => 'markup',
        '#markup' => '<input type="button" id="null-address-vat" name="null_address_vat" value="' . t('Annuler') . '" class="button_null_address_vat" >',
    );
    $form['invoice']['address']['current']['textleft'] = array(
         '#prefix' => '<div class="headerforminvoice forminvoiceheader">',  
         '#markup' => '<div class="blocright"><span>'.t('Select from addressbook').'</span>'.t('line2invoice').'</div>',
        );
    
    $form['invoice']['address']['current']['select'] = array(
        '#type' => 'select',
        
        '#suffix' => '</div>',
        '#attributes' => array('class' => array('selectBilling2')),
        '#options' => $addresses,
        '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->id : 0,

    );
    
    $form['invoice']['address']['current']['name'] = array(
        '#type' => 'textfield',
        '#required' => TRUE,
        '#title' => t('Name'),
        '#size' => 30,
        '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->name : ($customer ? $customer->name : ''),
    );

    $form['invoice']['address']['current']['street'] = array(
        '#type' => 'textfield',
        '#title' => t('Street'),
        '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->street : '',
        '#size' => 30,
         '#required' => TRUE,
    );

     $form['invoice']['address']['current']['postalCode'] = array(
        '#type' => 'textfield',
         '#required' => TRUE,
        '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->postalCode : '',
        '#title' => t('Postal code and City'),
        '#size' => 6,
        '#attributes' => array(
            'placeholder' => '1000',
            'id' => 'edit-invoice-address-current-postalCode'
        )
    );
    $form['invoice']['address']['current']['city'] = array(
        '#type' => 'textfield',
        '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->city : '',
        '#size' => 30,
        '#title' => t('City'),
        //'#required' => TRUE,
        '#attributes' => array(
            'placeholder' => t('Brussel'),
        )
    );  
    
    $form['invoice']['address']['current']['country'] = array(
        '#type' => 'select',
        '#required' => TRUE,
        '#attributes' => array('id' => 'edit-invoice-address-current-country','class' => array('selectStyle')),
        '#title' => t('Country'),
        '#options' => $countries,
        '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->country : $defaultCountry->id ,
    );

    $form['invoice']['address']['current']['isCompany'] = array(
        '#type' => 'checkbox',
        '#title_display' => 'before',
        '#title' => t('Are you a company ?'),
        '#attributes' => array(
            'id' => 'isUserCompany',
            'checked'=> false
        ),
        '#default_value' => false,
    );
    if ($defaultBillingAddress) {
        $country = \printconnect\Countries\Factory::Get($defaultBillingAddress->country);
    } else {
        $country = FALSE;
    }

    $form['invoice']['address']['current']['company'] = array(
        '#type' => 'textfield',
        '#title' => t('Company'),
        '#default_value' => $defaultBillingAddress ? $defaultBillingAddress->company : '',
        '#size' => 30,
      //   '#required' => TRUE,
        '#attributes' => array(
            'id' => 'companyInput'
        )
    );
    $form['invoice']['address']['current']['vatNumber'] = array(
        '#prefix' => '<div id="vatNumber">',
        '#suffix' => '</div>',
        '#id' => 'vatNumber',
       // '#required' => TRUE,
        '#type' => 'vatfield',
        '#title' => t('Vat number'),
        '#attributes' => array('class' => array('vat'), 'id' => 'vatNumber'),
        '#default_value' => $defaultBillingAddress ? ($defaultBillingAddress->vatNumber != '' ? $defaultBillingAddress->vatNumber : $country->iso) : $defaultCountry->iso,
    );  
    
    $form['invoice']['address']['actions'] = array(
        '#type' => 'container',
    );
    $form['invoice']['address']['actions']['message'] = array(
        '#type' => 'hidden',
        '#value' => t('message tva exist'),
    );

    $form['invoice']['address']['actions']['submit'] = array(
        '#type' => 'submit',
        '#value' => t('Save'),
        '#name' => 'invoice_address_submit',
        '#validate' => array('pccheckout_invoiceanddelivery_form_invoice_validate'),
        '#submit' => array('pccheckout_invoiceanddelivery_form_invoice_submit'),
    );

    /* Shipping address */

    if ($form_state['storage']['shippingType'] == 'shippingTypeStore') {
        $form['shipping']['detail'] = array(
            '#type' => 'fieldset',
            '#title' => t('line1bloc3'),
            '#attributes' => array('id' => 'shipping-address', 'class' => array('tohiding','styleform')),
        );
    }else{
        $form['shipping']['detail'] = array(
            '#type' => 'fieldset',
            '#markup' => '<div class="invoiceaddress">'.t('Shipping address').'</div>',
            '#attributes' => array('id' => 'shipping-address', 'class' => array('tohiding','styleform')),
        );
    }
    $form['shipping']['detail']['current'] = array(
        '#type' => 'fieldset',
        '#attributes' => array('id' => 'shipping'),
    );
    $form['shipping']['detail']['current']['textleft'] = array(
         '#prefix' => '<div class="headerforminvoice"><div class="invoiceaddress">'.t('Shipping address').'</div>',  
         '#markup' => '<div class="blocright"><span>'.t('Select from addressbook').'</span>'.t('line2shipping').'</div>',
        );
    $form['shipping']['detail']['current']['select'] = array(
        '#type' => 'select',
        '#suffix' => '</div>',
        '#attributes' => array('class' => array('selectBilling2')),
        '#options' => $AllShippingAddress,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->id : 0,

    );
 
    $mess = drupal_get_messages("validate-msg");
    if (isset($mess["validate-msg"][0]) && !empty($mess["validate-msg"][0])){
        $form['shipping']['detail']['current']['message'] = array(
            '#markup' => '<div id="messageadressefacturation">'.$mess["validate-msg"][0].'</div>',
        );
    }
     $form['shipping']['detail']['current']['name'] = array(
        '#type' => 'textfield',
        '#title' => t('votre nom livraison'),
        '#size' => 30,
        '#required' => TRUE,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->name : ($customer ? $customer->name : ''),
    );
    $form['shipping']['detail']['current']['street'] = array(
        '#type' => 'textfield',
        '#title' => t('Street'),
        '#attributes' => array('id' => 'edit-shipping-detail-current-street'),
        '#required' => TRUE,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->street : '',
        '#size' => 30,
    );
    $form['shipping']['detail']['current']['postalCode'] = array(
        '#type' => 'textfield',
         '#required' => TRUE,
        '#title' => t('Postal code and City'),
        '#attributes' => array('id' => 'edit-shipping-detail-current-postalCode'),
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->postalCode : '',
        '#size' => 6,
    );
  
     $form['shipping']['detail']['current']['city'] = array(
        '#type' => 'textfield',
         '#required' => TRUE,
         '#attributes' => array('id' => 'edit-shipping-detail-current-city'),
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->city : '',
        '#size' => 30,
    );
  
    $form['shipping']['detail']['current']['country'] = array(
        '#type' => 'select',
         '#required' => TRUE,
        '#title' => t('Country'),
        '#attributes' => array('id' => 'edit-shipping-detail-current-country' ,'class' => array('selectStyle')),
        '#required' => TRUE,
        '#options' => $deliveryCountries,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->country : $defaultCountry->id,
    );
     $form['shipping']['detail']['current']['company'] = array(
        '#type' => 'textfield',
        '#title' => t('livraison entreprise').' <span title="Ce champ est requis." class="form-required">*</span>',
        '#required' => false,
        '#default_value' => $defaultShippingAddress ? $defaultShippingAddress->company : '',
        '#size' => 30,
    );
    $form['shipping']['detail']['current']['actions'] = array(
        '#type' => 'container',
    );
    $form['shipping']['detail']['current']['actions']['submit'] = array(
        '#type' => 'submit',
        '#value' => t('Save'),
        '#name' => 'shipping_address_submit',
        '#validate' => array('pccheckout_invoiceanddelivery_form_shipping_validate'),
        '#submit' => array('pccheckout_invoiceanddelivery_form_shipping_submit'),
    );

    $form['shipping']['neutral'] = array(
        'line' => array('#markup' => '<p class= "lineSeparator">' . t('Neutral shipping') . '</p>'),
        'text' => array(
            '#type' => 'item',
            '#markup' => '<p class = "neutralDescritpion">' . t('More about neutral shipping') . '</p>',
        ),
        'check' => array(
            '#type' => 'checkbox',
            '#title' => t('Neutral shipping'),
            '#default_value' => $cart->neutralShipping,
            '#id' => 'neutralRadio'
        )
    );
    $form['actions'] = array(
        '#type' => 'actions',
        '#attributes' => array('class' => array('clearfix')),
    );

    $form['actions']['submit'] = array(
        '#type' => 'submit',
    );

    
    $form['actions']['submit']['#value'] = t('Payment');
    $form['actions']['submit']['#attributes'] = array('class' => array('payment'));
    
    $form['#cache'] = TRUE;
    $form['#tree'] = TRUE;
     $form['#id'] = 'pccheckout-invoiceanddelivery-form';
    $form_state['storage']['customer'] = $customer;
    $form_state['storage']['cart'] = $cart;

    return $form;
}
function pccheckout_invoiceanddelivery_form_invoice_validate($form, &$form_state) {
    
  if(empty($form_state['values']['invoice']['address']['current']['postalCode']) or 
              empty($form_state['values']['invoice']['address']['current']['city']) or 
              empty($form_state['values']['invoice']['address']['current']['street'])){
        return false;
       
    }
   if(!empty($form_state['values']['invoice']['address']['current']['postalCode']) && !is_numeric($form_state['values']['invoice']['address']['current']['postalCode'])){
        form_set_error('postalCode', t('Le champ Code postal doit être numérique.'));
    }
    if(is_numeric($form_state['values']['invoice']['address']['current']['postalCode']) && strlen($form_state['values']['invoice']['address']['current']['postalCode'])<4){
        form_set_error('postalCode', t('Le champ Code postal doit être supérieur à  3 chiffres.'));
        return false;
    } 
  if($form_state['values']['invoice']['address']['current']['isCompany']){
    if (!empty($form_state['values']['invoice']['address']['current']['company'])) {
        if (strlen($form_state['values']['invoice']['address']['current']['vatNumber']) == 2 && is_string($form_state['values']['invoice']['address']['current']['vatNumber'])) {
            form_set_error('invoice][address][current][vatNumber', t('Le champ N° de TVA est requis.'));
        }
    }
    if(empty($form_state['values']['invoice']['address']['current']['company'])){
          if(is_numeric(substr($form_state['values']['invoice']['address']['current']['vatNumber'],2)) && is_string(substr($form_state['values']['invoice']['address']['current']['vatNumber'],0,2))){
              form_set_error('invoice][address][current][company', t('Le champ Entreprise est requis.'));
          }
      }   
    if(empty($form_state['values']['invoice']['address']['current']['company'])){
        form_set_error('invoice][address][current][company', t('message erreur entreprise obligatoire'));        
    }
  }
  
    $cart = \printconnect\Carts\Factory::Current();
    $customer = $form_state['storage']['customer'];
    $billingAccountId = $form_state['values']['invoice']['address']['current']['select'];
    
        if($_POST['billingAccountResult']){
              $billingAccountId = $_POST['billingAccountResult'];
              $form_state['values']['invoice']['address']['current']['select']=$billingAccountId;
         }   

    if ($billingAccountId == "0") {
        $billingAccount = \printconnect\Customers\BillingAccounts\Factory::Create();
        $billingAccount->firstName = $customer->firstName;
        $billingAccount->lastName = $customer->lastName;
        $billingAccount->phone = $customer->phone;
    } else {
        $billingAccount = \printconnect\Customers\BillingAccounts\Factory::Get($billingAccountId);
        $billingAccount->EnsureLoaded();
        $form_state['storage']['$billingAccount'] = $billingAccount;
        $form_state['storage']['cart'] = $cart;
    }
 
    \printconnect\Drupal\Forms::LoadObject($form_state['values']['invoice']['address']['current'], $billingAccount);
    $billingAccount->customer = $customer->id;
    try {
        \printconnect\Customers\BillingAccounts\Factory::Validate(clone $billingAccount);
        //j'ai ajouté cette ligne pour corriger le bug BUGS-3987
         $_SESSION['billingAccountId'] = $billingAccountId;
    } catch (\printconnect\Dal\Exception $ex) {
        \printconnect\Drupal\Forms::HandleException($ex, $form, 'invoice][address][current][');
    }
    $form_state['storage']['invoice']['address'] = $billingAccount;
}

function pccheckout_invoiceanddelivery_form_invoice_submit($form, &$form_state) {
    $billingaccoutcustomer = \printconnect\Customers\Factory::Current();
    $billingAccount = $form_state['storage']['invoice']['address'];
    if (isset($form_state['storage']['invoice']['address'])) {
        if ($billingAccount->select == 0) {
            \printconnect\Customers\BillingAccounts\Factory::Save($billingAccount);
            $billingaccoutcustomer->billingAccount = $billingAccount->id;
            \printconnect\Customers\Factory::Save($billingaccoutcustomer);
            \printconnect\Customers\BillingAccounts\Factory::ClearBillingAccountsCache($billingaccoutcustomer);
        } else {
            \printconnect\Customers\BillingAccounts\Factory::Save($billingAccount);
            \printconnect\Customers\Factory::Save($billingaccoutcustomer);
            \printconnect\Customers\BillingAccounts\Factory::ClearBillingAccountsCache($billingaccoutcustomer);
        }
        switch ($billingAccount->vatStatus) {
            case 'vat_tag_3' :
                form_set_error('invoice][address][current][vatNumber', t('Your Vat Number is invalid'));
                return false;
                break;
            case 'vat_tag_8' :
                form_set_error('invoice][address][current][vatNumber', t('Your Vat Number is inactive'));
                return false;
                break;
            default:
                break;
        }
        drupal_set_message(t('Adress valider'));
    } else {
        drupal_set_message(t('Please check your adrres '), 'error');
    }
}

function pccheckout_invoiceanddelivery_form_shipping_validate($form, &$form_state) {
    $customer = $form_state['storage']['customer'];
    //$addressId = $form_state['values']['shipping']['detail']['current']['select'];
    
     if(empty($form_state['values']['shipping']['detail']['current']['company'])){
        form_set_error('shipping][detail][current][company', t('Le champ nom entreprise est requis'));
        return false;
    } 
    $address = \printconnect\Customers\Addresses\Factory::Create();
    $address->firstName = $customer->firstName;
    $address->lastName = $customer->lastName;
    $address->phone = $customer->phone;
    \printconnect\Drupal\Forms::LoadObject($form_state['values']['shipping']['detail']['current'], $address);
    $address->customer = $customer->id;
    try {
        \printconnect\Customers\Addresses\Factory::Validate(clone $address);
        //j'ai ajouté cette ligne pour corriger le bug BUGS-3987
+       $_SESSION['shippingAddress'] = $form_state['values']['shipping']['detail']['current']['select'];
    } catch (\printconnect\Dal\Exception $ex) {
        \printconnect\Drupal\Forms::HandleException($ex, $form, 'shipping][detail][current][');
    }

    $address->defaultBilling = FALSE;
    $address->defaultShipping = TRUE;
    $form_state['storage']['shipping']['address'] = $address;
}

function pccheckout_invoiceanddelivery_form_shipping_submit($form, &$form_state) {
    if (isset($form_state['storage']['shipping']['address'])) {
        $address = $form_state['storage']['shipping']['address'];
        \printconnect\Customers\Addresses\Factory::Save($address);

	$cart = \printconnect\Carts\Factory::Current();
        $cart->shipping_address = $address->id;
        \printconnect\Carts\Factory::Save($cart);

        \printconnect\Carts\Factory::saveInCache($cart, array(
            'shipping_address' => $cart->shipping_address,
        ));
        drupal_set_message(t('message adresse de livraison'));
    }
}

function pccheckout_invoiceanddelivery_form_validate($form, &$form_state) {

    pccheckout_invoiceanddelivery_form_invoice_validate($form, $form_state);

    switch ($form_state['storage']['shippingType']) {
        case 'shippingTypeStore':
        case 'shippingTypePrinter':
        case 'shippingTypeBpostPickupPoint':
        case 'shippingTypeStoreInAntwerpen':
        break;
        default:

        pccheckout_invoiceanddelivery_form_shipping_validate($form, $form_state);
    }
}

function pccheckout_invoiceanddelivery_form_submit($form, &$form_state) {
    $billingaccoutcustomer = \printconnect\Customers\Factory::Current();
    $cart = \printconnect\Carts\Factory::Current();
    $billingAccount = $form_state['storage']['$billingAccount'];
    
    if (isset($form_state['storage']['invoice']['address'])) {
        $address = $form_state['storage']['invoice']['address'];
        $billingAccountId = $address->id;
        $cart->billingAccount = $billingAccountId;
        $isNeutralActive = 0;
        if ($form_state['values']['shipping']['neutral']['check'] == 1) {
            $isNeutralActive = 1;
        }
         
        $cart->neutralShipping = $isNeutralActive;
        if ($billingAccount->discountPercentage != null && count($cart->discountItems) == 0) {
            $discount = \printconnect\Carts\Discounts\Factory::Create($cart->id, $billingAccount->discountCode);
            \printconnect\Carts\Discounts\Factory::Save($discount);
        }
	
	$billingAccount = \printconnect\Customers\BillingAccounts\Factory::Get($billingAccountId);
        $billingAccount->EnsureLoaded();
	$billingAccount->cart = $cart->id;
   
        \printconnect\Customers\BillingAccounts\Factory::Save($billingAccount);

    }
    $contactName = $form_state['values']['shipping']['detail']['contact'];
    $email = $form_state['values']['shipping']['detail']['email'];
    $phone = $form_state['values']['shipping']['detail']['phone'];
    switch ($form_state['storage']['shippingType']){
       case 'shippingTypeStore':
       case 'shippingTypePrinter':
       case 'shippingTypeStoreInAntwerpen':
            if($form_state['storage']['shippingType'] == 'shippingTypeStoreInAntwerpen'){
                $form_state['values']['pcflyerstores']['id'] = 111;
		$cart->shipping_type = '8-D';
		printconnect\Carts\Factory::saveInCache($cart, array(
            	    'shipping_type' => $cart->shipping_type,
                )); 
            }

            if($form_state['storage']['shippingType'] == 'shippingTypeStore' && isset($form_state['values']['pcflyerstores']['id']) && $form_state['values']['pcflyerstores']['id'] == 22) {
                $cart->shipping_type = '11-D';
                $cart->pickuppoint = TRUE;
		printconnect\Carts\Factory::saveInCache($cart, array(
                    'shipping_type' => $cart->shipping_type,
		    'pickuppoint' => TRUE,
                ));
            }

            if (isset($form_state['values']['pcflyerstores']['id']) && !empty($form_state['values']['pcflyerstores']['id'])) {
                $poi = \printconnect\Stores\Factory::Get($form_state['values']['pcflyerstores']['id']);
                $poi->EnsureLoaded();
                $cart->pickuppoint = $poi->cartObject;
                $cart->pickuppoint->contactName = ($contactName) ? $contactName : $form_state['storage']['defaultShippingAddress']->name;
                $cart->pickuppoint->email = ($email) ? $email : $form_state['storage']['defaultShippingAddress']->email;
                $cart->pickuppoint->phone = ($phone) ? $phone :$form_state['storage']['defaultShippingAddress']->phone;
		printconnect\Carts\Factory::saveInCache($cart, array(
                    'pickuppoint' => $cart->pickuppoint,
                ));
            } else {
                $cart->pickuppoint = FALSE;
		printconnect\Carts\Factory::saveInCache($cart, array(
                    'pickuppoint' => FALSE,
                ));
            }
            
            break;
            
        case 'shippingTypeBpostPickupPoint':
            if (isset($form_state['values']['pcbpost']['id']) && !empty($form_state['values']['pcbpost']['id']) && $form_state['values']['pcbpost']['id'] > 100000) {
                $poi = \printconnect\bPost\Factory::Get($form_state['values']['pcbpost']['id']);
                $poi->EnsureLoaded();
                $cart->pickuppoint = $poi->cartObject;
                $cart->pickuppoint->contactName = $contactName;
                $cart->pickuppoint->email = $email;
                $cart->pickuppoint->phone = $phone;
		printconnect\Carts\Factory::saveInCache($cart, array(
                    'pickuppoint' => $cart->pickuppoint,
                ));
            } else {
                $cart->pickuppoint = FALSE;
		printconnect\Carts\Factory::saveInCache($cart, array(
                    'pickuppoint' => FALSE,
                ));
            }
            break;
        default:
            if (isset($form_state['storage']['shipping']['address'])) {
                $address = $form_state['storage']['shipping']['address'];
		$cart = \printconnect\Carts\Factory::Current();
		$cart->pickuppoint = FALSE;
                \printconnect\Customers\Addresses\Factory::Save($address);
                $cart->shipping_address = $address->id;
            }
    }

    \printconnect\Carts\Factory::Save($cart);
  if(!isset($cart->billingAccount) or empty($cart->billingAccount)){
        $billingAccount = $form_state['storage']['invoice']['address'];
        AttacheBillingAccount($cart, $billingAccount->id , $form_state);
  }
    drupal_goto('checkout/payment');

}
function getFotolia($jobId) {
    $url = variable_get('pc_designtoolurl');
    $url .= '/rest/get-fotolia-images/j/' . $jobId;
    
    $response = file_get_contents($url);
    
    $response = json_decode($response, 1);
    if(isset($response['data']['Fotolia'])){
        return $response['data']['Fotolia'];
    }else {
        return array();
    }
}

function getPreflight($jobId) {
    $url = variable_get('pc_designtoolurl');
    $url .= '/rest/getpreflightinfo?j='.$jobId;
    $response = file_get_contents($url);
    $response = json_decode($response, 1);
    if(isset($response['data']['preflightInfo']) &&  !empty($response['data']['preflightInfo'])){
        return $response['data']['preflightInfo'];
    }else {
        return array();
    }
}
function pccheckout_upload_form($form, &$form_state) {
    _pccustomers_ensureloggedin();
    $cart = \printconnect\Carts\Factory::Current(FALSE);
    \printconnect\Carts\Factory::deleteFotolias($cart);
    $fotoliaPrice = 0;
    $preflightPrice = 0;
    $mypreflight = 0;
    if($cart->fotoliaPrice){
        $fotoliaPrice = $cart->fotoliaPrice;
        $preflightPrice = $cart->preflightPrice;
    }
    
    $fotolia = array();
    $preflight = array();
    $fotoliaPrice = str_replace('.', ',', $fotoliaPrice);
    $preflightPrice = str_replace('.', ',', $preflightPrice); 
    foreach ($cart->orderItems as $orderItem) {
        $fotoliaImages = getFotolia($orderItem->id);
        if (!empty($fotoliaImages)) {
            foreach($fotoliaImages as $image) {
                $pricefotolias = \printconnect\Carts\Factory::getFotoliaPrice($image['type']);
                $fotoliaPrice = str_replace('.', ',', $pricefotolias->price);
                $fotolia[$orderItem->id][] = '<span>'.t('Image').'&nbsp;"'.$image['id'].'"</span><div class="fotolia-price">â‚¬&nbsp;'.$fotoliaPrice.'</div>';
            } 
            $resultfotolia = \printconnect\Carts\Factory::SaveFotolia($cart->id, $orderItem->id, $fotoliaImages);
        }

        $preflights = getPreflight($orderItem->id);
        if (!empty($preflights)) {
            foreach($preflights as $singlePreflight) {
                $preflight[$orderItem->id][] = '<span>"'.t('Preflight').'&nbsp;"</span><div class="fotolia-price">â‚¬&nbsp;'.$preflightPrice.'</div>';
            }
            $result = \printconnect\Carts\Factory::SavePreflight($cart->id, $orderItem->id, $preflights);
        }
    }
    $emailDesigner = FALSE;
    $weight = 0;
    if ($cart) {
        $checkableItems = array();
        foreach ($cart->productItems as $item) {

            if (isset($item->emailDesigner)) {
                $emailDesigner = $item->emailDesigner;
            }

            $configs = $item->configuration->config;

            $items = array();

            foreach ($configs as $config) {
                $items[] = $config->toolboxItemId;
            }

            $firstConfig = array_shift($configs);

            $product = \printconnect\Products\Factory::Get($item->configuration->productId);

            $form['cart']['items'][$item->id] = array(
                '#type' => 'container',
                '#attributes' => array('class' => array('item', 'clearfix')),
                '#weight' => $weight,
            );

            $weight--;

            $form['cart']['items'][$item->id]['description'] = array(
                '#type' => 'container',
                '#attributes' => array('class' => array('description')),
            );

            $form['cart']['items'][$item->id]['description']['title'] = array(
                '#prefix' => '<h3>',
                '#suffix' => '</h3>',
                '#markup' => $item->quantity . ' ' . t('pcs.') . ' ' . $product->name . ' ' . $firstConfig->name,
            );

            if (count($item->files)) {

                $form['cart']['items'][$item->id]['#attributes']['class'][] = 'uploaded';

                foreach ($item->files as $file) {
                    $form['cart']['items'][$item->id]['file'] = array(
                        '#type' => 'container',
                        '#attributes' => array('class' => array('image')),
                    );

                    $key = $file->id;
                    $jobId = $file->designToolJobId;


                    $savedDesignId = NULL;

                    if (isset($_SESSION['savedDesigns'][$item->id])) {
                        $savedDesignId = $_SESSION['savedDesigns'][$item->id];
                    }

                    $options = array();
                    foreach ($item->options as $option) {
                        $options[] = $option->option;
                    }

                    $form['cart']['items'][$item->id]['file']['link'] = array(
                        '#markup' => theme('designtoollink', array(
                            'title' => $product->name . ' ' . $firstConfig->name,
                            'content' => theme('pcfilesthumb', array('file' => $file->thumbnail)),
                            'html' => TRUE,
                            'oi' => array(
                                'priceGroupId' => $item->productPriceGroupId,
                                'quantity' => $item->quantity,
                                'options' => $options,
                            ),
                            'params' => array(
                                'id' => $item->id,
                                'cartid' => $cart->id,
                            ),
                            'versioning' => FALSE,
                            'jobId' => $jobId,
                            'params' => array(
                                'id' => $item->id,
                                'cartid' => $cart->id,
                            ),
                            'savedDesignId' => $savedDesignId,
                            'attributes' => array('class' => array('designtool', 'iframe', 'display-block')),
                        )),
                    );


                    $form['cart']['items'][$item->id]['file']['preview'] = array(
                        '#prefix' => '<div>',
                        '#suffix' => '</div>',
                        '#markup' => l(t('Download preview'), pcdesigntool_preview_url($jobId), array('attributes' => array('target' => 'blank', 'class' => array('clearfix')))),
                    );
                }
            } else {
                $templates = \printconnect\Products\Templates\Factory::GetTemplates($item->configuration->productId, $items);

                $form['cart']['items'][$item->id]['#attributes']['class'][] = 'not-uploaded';

                if (count($templates->items)) {
                    $template = $templates->items[0];

                    $_SESSION['cart']['items'][$item->id]['template'] = $template->id;

                    $options = array();

                    foreach ($item->options as $option) {
                        $options[] = $option->option;
                    }

                    $uploadBox = array();
                    $uploadBox['container'] = array(
                        '#type' => 'container',
                        '#attributes' => array('class' => array('upload-box', 'box')),
                    );
                    $uploadBox['container']['text'] = array(
                        '#type' => 'container',
                        '#attributes' => array('class' => array('text')),
                    );
                    $uploadBox['container']['text']['content'] = array(
                        '#markup' => t('Upload'),
                    );

                    $form['cart']['items'][$item->id]['upload']['link'] = array(
                        '#markup' => theme('designtoollink', array(
                            'templateId' => $template->id,
                            'title' => $product->name . ' ' . $firstConfig->name,
                            'content' => drupal_render($uploadBox),
                            'html' => true,
                            'oi' => array(
                                'priceGroupId' => $item->productPriceGroupId,
                                'quantity' => $item->quantity,
                                'options' => $options,
                            ),
                            'params' => array(
                                'id' => $item->id,
                                'cartid' => $cart->id,
                            ),
                            'versioning' => FALSE,
                            'attributes' => array('class' => array('upload', 'designtool', 'iframe', 'display-block')),
                        )),
                    );
                    $form['cart']['items'][$item->id]['proflink'] = array(
                        '#theme' => 'designtoolproflink',
                        '#templateId' => $template->id,
                        '#title' => $product->name . ' ' . $firstConfig->name,
                        '#params' => array(
                            'id' => $item->id,
                            'cartid' => $cart->id,
			    'currencyPreflight' => 'euro',
                            'pricePreflight' =>$cart->preflightPrice,
                        ),
                        '#attributes' => array('class' => array('proupload', 'designtool', 'iframe')),
                    );

                    /*
                      $form['cart']['items'][$item->id]['designer']['check'] = array(
                      '#type' => 'checkbox',
                      '#title' => t('I will not upload a design. My designer will do it for me.'),
                      '#default_value' => isset($item->emailDesigner),
                      );
                     */


                    $checkableItems[] = $item->id;
                }
            }
        }
        /*
          if (count($checkableItems) > 0) {
          $visible = array();
          foreach ($checkableItems as $item) {
          $visible[] = array(
          'input[name="cart[items][' . $item . '][designer][check]"]' => array('checked' => TRUE)
          );
          }

          $form['cart']['designer'] = array(
          '#type' => 'container',
          '#states' => array(
          'visible' => $visible
          ),
          );
          $form['cart']['designer']['email'] = array(
          '#type' => 'textfield',
          '#title' => t('Email address designer'),
          '#required' => FALSE,
          '#states' => array(
          'required' => $visible
          ),
          '#default_value' => $emailDesigner,
          );
          $form['cart']['designer']['warning'] = array(
          '#type' => 'item',
          '#markup' => t('Attention! If you don`t upload your files now, we cannot guarantee the estimated delivery date. You will be informed when your designer uploads the file.'),
          );
          }
         * 
         */
    }
    $form['actions'] = array('#type' => 'actions');

    $form['actions']['submit'] = array(
        '#type' => 'submit',
        '#value' => t('Payment'),
        '#attributes' => array('class' => array('payment')),
    );


    $form_state['storage']['cart'] = $cart;
    $form['#id'] = 'pccheckout-upload-form';
    $form['#tree'] = TRUE;
    return $form;
}

function pccheckout_upload_form_validate($form, &$form_state) {
    $cart = $form_state['storage']['cart'];
    $allFilesUploaded = TRUE;

    foreach ($cart->productItems as $item) {
        if (!count($item->files) && !$form_state['values']['cart']['items'][$item->id]['designer']['check']) {
            $allFilesUploaded = FALSE;
        }
    }

    if (!$allFilesUploaded) {
        form_set_error('cart', t('Please upload a file for all your items'));
    }
}

function pccheckout_upload_form_submit($form, &$form_state) {
    drupal_goto('checkout/payment');
}

function CalculateCostamount($amount,$rate,$cost) {
      return (($amount * ($rate)) + $cost);
    }

function pccheckout_payment_form($form, &$form_state) {
    _pccustomers_ensureloggedin();
    $customer = \printconnect\Customers\Factory::Current();
    $cart = \printconnect\Carts\Factory::Current(TRUE);
    if(!isset($cart->billingAccount) or empty($cart->billingAccount)){
    drupal_goto('checkout/invoiceanddelivery');
    drupal_set_message(t('Please check your order because no invoice address related with it'), 'error');
    }    
    $paymentMethods = \printconnect\PaymentMethods\Factory::GetAll();
    $form['payment']['hidden'] = array(
        '#prefix' => '<div id="hiddenPricesPayment">',
        '#suffix' => '</div>',
    );

    $subTotalWithoutPayment = $cart->subTotalAmountWithoutPayment;
    
    foreach ($paymentMethods as $paymentMethod) {

    $form_state['storage']['paymentmethods'][$paymentMethod->id] = $paymentMethod;
    $cost = CalculateCostamount($subTotalWithoutPayment,$paymentMethod->rate,$paymentMethod->cost);
    $form['payment']['hidden'][$paymentMethod->id] = array(
        '#markup'=>'<input type="hidden" class="paymentMethod_'.$paymentMethod->id.'" PaymentName="'.$paymentMethod->paymentMethod->tag.'" value="'.round($cost, 2).'" descriptionTag="'.$paymentMethod->paymentMethod->descriptionTag.'">',
     );
    }

 $form['payment']['method'] = array(
        '#type' => 'fieldset',
        '#attributes' => array('class' => array('paymentmethodefond')),
        '#title' => t('Choose your payment method'),
    );

    $form['payment']['method']['table'] = array(
        '#title' => t('Select payment method'),
        '#type' => 'tableselect',
        '#multiple' => FALSE,
        '#header' => array( 'name' => '', 'cost' => ''),
        '#options' => $methods,
        '#required' => FALSE,
        '#attributes' => array('class' => array('grid', 'clearfix', 'rows-' . count($methods), 'payment-methods-table')),
        '#default_value' => $cart->payment_method,
    );
    $form['payment']['method']['text'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('imgpayment')),
        'content' => array(
            '#markup' => '',
        ),
    );
  if ($cart->totalAmount <= 0 || (isset($form_state['values']['payment']['credit']) &&
     $form_state['values']['payment']['credit']['use'] == 'yes')) {
        hide($form['payment']['method']);
    }

    $form['overview'] = _pccheckout_payment_form_build_overview($cart);
    $form['overview']['#weight'] = 100;

    $form['agree'] = array(
        '#type' => 'checkbox',
        '#title' => t('I agree with the !termsandconditionslink', array('!termsandconditionslink' => theme('generalconditionslink'))),
        '#required' => TRUE,
        '#weight' => 150,
    );

    $form['actions'] = array(
        '#type' => 'actions',
        '#attributes' => array('class' => array('actions')),
        '#weight' => 200,
    );

    $form['actions']['price'] = array(
        '#id' => 'price',
        '#title' => t('Total excl. Vat'),
        '#theme' => 'price',
        '#value' => $cart->totalAmount,
        '#attributes' => array('id' => 'price'),
    );

    $form['actions']['submit'] = array(
        '#type' => 'submit',
        '#value' => t('Pay now'),
        '#attributes' => array('class' => array('pay-now')),
    );

    $form['#id'] = 'pccheckout-payment-form';
    $form['#tree'] = TRUE;

    $form_state['storage']['cart'] = $cart;
    $form_state['storage']['customer'] = $customer;


    pccheckout_payment_form_build_methods($form, $form_state);

    $current = $form_state['storage']['paymentmethods'][$cart->payment_method];

    $form['payment']['method']['text']['content']['#markup'] = '<div class="textpayment">'.$current->paymentMethod->descriptionTag.'</div>';

    return $form;
}

function _pccheckout_payment_form_build_overview($cart) {
    
    $elementRow =array(); 
    
    $discounts = FALSE;
    if ($cart && $cart->isFilled) {
        $rows = array();
        foreach ($cart->productItems as $item) {
            $itemValue = $item->price;
            $configs = $item->configuration->config;
            $primaryItem = $configs[0];

            if (count($item->options) > 0) {
                foreach ($item->options as $option) {
                    $itemValue += $option->price;
                }
            }
        $elementRow[]= $itemValue;
            if($itemValue < $item->originPrice) {
                $rows[] = array(
                    'data' => array(
                        $item->quantity . ' ' . $item->configuration->name . ' - ' . $primaryItem->name,
                        theme('price', array('value' => $itemValue)) . '<del class="payment-origin-price">&euro; '.$item->originPrice.'</del>',
                    ),
                    'class' => array('item'),
                );
         
            }else {
                $rows[] = array(
                        'data' => array(
                            $item->quantity . ' ' . $item->configuration->name . ' - ' . $primaryItem->name,
                            theme('price', array('value' => $itemValue)),
                        ),
                        'class' => array('item'),
                );
            }
        }

	$cartItemsFull = printconnect\Carts\Factory::GetItems($cart);
        foreach ($cartItemsFull as $cartItem) {
            if ($cartItem->parentId != null) {
                $rows[] = array(
                    'data' => array(
                        $cartItem->description,
                        theme('price', array('value' => $cartItem->price)),
                    ),
                    'class' => array('orderItemsAdditional'),
                );
                $elementRow[]= $cartItem->price;
            }
        }

        if ($cart->orderItemsAdditional) {
            foreach ($cart->orderItemsAdditional as $item) {
                $rows[] = array(
                    'data' => array(
                        $item->description,
                        theme('price', array('value' => $item->price)),
                    ),
                    'class' => array('orderItemsAdditional'),
                );
            }
                  $elementRow[]= $item->price;
        }

        if ($cart->discountItems) {
            foreach ($cart->discountItems as $discount) {
                $rows[] = array(
                    'data' => array(
                        $discount->productName,
                        theme('price', array('value' => $discount->price)),
                    ),
                    'class' => array('discount'),
                );
            }
            $elementRow[]= $discount->price;
        }
        foreach ($cart->orderItems as $item) {
            $configs = $item->configuration->config;
            $primaryItem = $configs[0];
            if ($item->fileCheck) {                 
                $rows[] = array(
                    'data' => array(
                      t('Control professional').' '.$item->quantity . ' ' . t('pcs.') . ' ' . $item->configuration->name . ' - ' . $primaryItem->name,
                        theme('price', array('value' => $item->fileCheck->price, 'free' => TRUE)),
                    ),
                );
            }
               $elementRow[]= $item->fileCheck->price;
        }
        if(!$cart->orderItemShipping->shippingTypeResellerShop){
        $type = \printconnect\Shipping\Types\Factory::Get($_SESSION['shippingtypeID']);
        }else{
        $type = \printconnect\Shipping\Types\Factory::Get($cart->orderItemShipping->shippingTypeResellerShop);
        }
 
	\printconnect\Shipping\Types\Factory::LoadType($type);

   
        $rows[] = array(
            'data' => array(
                '<strong>'. $type->shippingType->tag . '</strong>',
                theme('price', array('value' => $cart->orderItemShipping->price ? $cart->orderItemShipping->price : $type->price , 'free' => TRUE)),
            ),
           
        );
       
        $elementRow[] = $type->price;
      
        if (count($cart->orderItemsPayment)) {
            foreach ($cart->orderItemsPayment as $payment) {
                $rows[] = array(
                    'data' => array(
                        '<span id="orderItemsPayment"><strong>' . $payment->description . '</strong><span>',
                        theme('price', array('value' => $payment->price, 'free' => TRUE)),
                    ),
                );
            }
        }

        if (count($cart->orderItemFileCheck)) {

            $rows[] = array(
                'data' => array(
                    '<strong>' . t('File check') . '</strong>',
                    theme('price', array('value' => $cart->orderItemFileCheck->convertedPrice, 'free' => TRUE)),
                ),
            );
            
                    
        $elementRow[] =  $cart->orderItemFileCheck->convertedPrice;
        }
        if ($_SESSION['shop_vat'] != 0) {
            $rows[] = array(
                'data' => array(
                    t('Total excl. Vat'),
                    theme('price', array('value' => $cart->subTotalAmount)),
                ),
                'class' => array('total-excl-vat'),
            );
        
        }


        $build = array(
            '#type' => 'fieldset',
            '#attributes' => array('class' => array('overview')),
            '#title' => t('Order overview'),
        );

        
         $build['CalculePrice'] = array(
            '#prefix' => '<div id="CalculePrice">',
            '#suffix' => '</div>',
        );
        foreach ($elementRow as $key => $value) {
          $build['CalculePrice']['hidden'][$key] = array(
            '#markup'=>'<input type="hidden"  value="'.round($value, 2).'">',
         );  
       }
         
        $build['table'] = array(
            '#theme' => 'table',
            '#header' => array(
                t('Description'),
                t('Price'),
            ),
            '#rows' => $rows,
        );
        $build['#weight'] = 100;
    }

    return $build;
}

function pccheckout_payment_form_callback($form, &$form_state) {
    $cart = $form_state['storage']['cart'];
    $customer = $form_state['storage']['customer'];
    if (isset($form_state['values']['payment']['method']['table'])) {
        $cart->payment_method = $form_state['values']['payment']['method']['table'];
    } else {
        $cart->payment_method = 0;
    }
 $cart = \printconnect\Carts\Factory::Current(FALSE);

  if ($cart->subTotalAmount > 0) {
    $paymentMethods = \printconnect\PaymentMethods\Factory::GetAll();
    $subTotalWithoutPayment = $cart->totalAmountWithoutPayment;
    foreach ($paymentMethods as $value) {
      $cost = $value->CalculateCost($subTotalWithoutPayment);
      $form['payment']['method']['#options'][$value->id]['cost'] = theme('price', array('value' => $cost));
    }
    $form['method']['#required'] = TRUE;
    show($form['payment']['method']);
  } else{
    $form['method']['#required'] = FALSE;
    hide($form['payment']['method']);
  }

    $current = $form_state['storage']['paymentmethods'][$cart->payment_method];
    $form['payment']['method']['text']['content']['#markup'] = $current->paymentMethod->descriptionTag;

    $form['overview'] = _pccheckout_payment_form_build_overview($cart);
    $form['overview']['#weight'] = 100;
    $form['actions']['price']['#value'] = $cart->totalAmount;

    $form_state['storage']['cart'] = $cart;
    pccheckout_payment_form_build_methods($form, $form_state);
    return $form;
}

function pccheckout_payment_form_validate($form, &$form_state) {
    $cart = $form_state['storage']['cart'];    
    
    //loubna: j'ai ajouté ce code pour corriger le bug BUGS-3987
    if( empty($cart->billingAccount) ){
        $cartcurrent = \printconnect\Carts\Factory::Current(FALSE);        
        if ( empty($cartcurrent->billingAccount) ){
            $cartcurrent->billingAccount = $_SESSION['billingAccountId'];
            \printconnect\Carts\Factory::Save($cartcurrent);
        }    
    }
    
    if(!isset($cart->pickuppoint)){
        if( empty($cart->shipping_address) ){
            $cartcurrent = \printconnect\Carts\Factory::Current(FALSE);
            if ( empty($cartcurrent->shipping_address)) { 
                $cartcurrent->shipping_address = $_SESSION['shippingAddress'];
                $cartcurrent->pickuppoint = FALSE;
                \printconnect\Carts\Factory::Save($cartcurrent);
            }
        }
    }
    //fin code
   
    $totalAmount = $cart->totalAmount;
    if (isset($form_state['values']['payment']['credit']['use'])
            && $form_state['values']['payment']['credit']['use'] == 'yes'
    ) {
        $customer = CustomersFactory::Current();
        CustomersFactory::LoadCustomer($customer);
        $account = \printconnect\Customers\Credit\Factory::Get($customer, $customer->billingAccount->id, FALSE);
        //$storeCredit = $form_state['values']['payment']['credit']['amount'];
        $storeCredit = $account->credits;
        $totalAmount -= $storeCredit;
    }

    if ($totalAmount > 0 && 
        !$form_state['values']['payment']['method']['table'] &&
        $form_state['values']['payment']['credit']['use'] != 'yes') {
        form_set_error('', t('Please select a payment method'));
    }
}

function pccheckout_payment_form_submit($form, &$form_state) {
    $cart = $form_state['storage']['cart'];

    $customer = $form_state['storage']['customer'];
    $id = $cart->id;

    if ($cart->totalAmount <= 0) {
        if (isset($form_state['values']['credit']['use']) && $form_state['values']['credit']['use']) {
            \printconnect\Carts\Factory::Process($cart, 'credit');
        } else {
            \printconnect\Carts\Factory::Process($cart, 'invoice');
        }
        drupal_goto('myprintconnect/orders/' . $id . '/confirmation');
        drupal_exit();
    }

    if (isset($form_state['values']['payment']['credit']['use']) && 
            $form_state['values']['payment']['credit']['use'] == 'yes') {
        $customer = CustomersFactory::Current();
        CustomersFactory::LoadCustomer($customer);
        $account =\printconnect\Customers\Credit\Factory::Get($customer,$customer->billingAccount->id , FALSE);
        $cart->storeCredit = $account->credits;
        $cart->payment_method = 0;
        
        try {
            $mycart = \printconnect\Customers\Credit\Factory::Redeem2(CustomersFactory::Current(), $cart->id);
            $cart->totalAmount = $mycart->totalAmount;
            $cart->subTotalAmount = $mycart->subTotalAmount;
            $cart->vatAmount = $mycart->vatAmount;
            $cart->codAmount = $mycart->codAmount;
            $cart->orderStatus = $mycart->orderStatus;
            $cart->storeCredit = 0;
            \printconnect\Carts\Factory::Save($cart);
        } catch (\printconnect\Dal\Exception $ex) {
            form_set_error('Erreur Cart !');
        }
      if ($cart->totalAmount == 0) {
            drupal_goto('myprintconnect/orders/' . $id . '/confirmation');
            drupal_exit();
        }else {
            drupal_goto('checkout/payment');
            drupal_exit();
        }
    } else {
        $cart->storeCredit = 0;
    }
    if (isset($form_state['values']['payment']['method'])) {
        $paymentMethod = \printconnect\PaymentMethods\Factory::Get($form_state['values']['payment']['method']['table']);
        $cart->payment_method = $form_state['values']['payment']['method']['table'];
    } else {
        $cart->payment_method = 0;
    }
    \printconnect\Carts\Factory::Save($cart);
    switch (strtolower($paymentMethod->paymentMethod->internalName)) {
        case 'cod':
            \printconnect\Carts\Factory::Process($cart, 'cod');
            drupal_goto('myprintconnect/orders/' . $id . '/confirmation');
            break;
        case 'invoice' :
            \printconnect\Carts\Factory::Process($cart, 'invoice');
            drupal_goto('myprintconnect/orders/' . $id . '/confirmation');
            break;
        case 'transfer' :
            \printconnect\Carts\Factory::Process($cart, 'transfer');
            drupal_goto('myprintconnect/orders/' . $id . '/confirmation');
            break;
        case 'cheque' :
            \printconnect\Carts\Factory::Process($cart, 'cheque');
            drupal_goto('myprintconnect/orders/' . $id . '/confirmation');
            break;
        default:
            $paymentgateway = 'pcpayments';
            if (function_exists(($paymentgateway . '_processpayment'))) {

                $url = call_user_func(
                        $paymentgateway . '_processpayment', $cart->payment_method, $customer->name, $cart->id, $cart->totalAmount, array(
                    'accept' => 'myprintconnect/orders/' . $cart->id . '/confirmation',
                    'cancel' => 'checkout/payment',
                        )
                );

                $_SESSION['agree'][$cart->id] = TRUE;
                drupal_goto($url);
            } else {
                throw new Exception(t('Not implemented.'));
                form_set_error('method', t('Not implemented.'));
            }
            break;
    }
}

function updateTvaCart(\printconnect\Object $cart, $tva) {

    foreach ($cart->orderItems as $orderItem) {
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

function AttacheBillingAccount($cart,$billingAccount, &$form_state ) {
    $cart->billingAccount = $billingAccount;
    Factory::saveInCache($cart, array(
        'billingAccount' => $cart->billingAccount,
    ));
    $billingAccount = new \printconnect\Object();
    $billingAccount->id = $cart->billingAccount;
    $billingAccount->cart = $cart->id;
    printconnect\Customers\BillingAccounts\Factory::Save($billingAccount);
    $form_state['storage']['cart'] = $cart;
    
}
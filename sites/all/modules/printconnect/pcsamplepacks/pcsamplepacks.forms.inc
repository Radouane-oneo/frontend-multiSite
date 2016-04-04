<?php

use printconnect\SamplePacks\Factory;
use printconnect\Customers;
use printconnect\Customers\Addresses;
use printconnect\Drupal\Functions;
use printconnect\Drupal\Forms;

function pcsamplepacks_request_form($form, $form_state) {

    $lng = request_path();
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

    if($lng == "befr/samplepack" || $lng == "lufr/samplepack" || $lng == "frfr/samplepack" ){
        $img = "http://d4e7wxbvl20c1.cloudfront.net/images.flyer.eu/flippage/bann_fr.png";   
    }else if($lng == "nlnl/samplepack"){
          $img = "http://d4e7wxbvl20c1.cloudfront.net/images.flyer.eu/flippage/nlnl_banner_SampleFlip_request_OK.jpg";
    }else{
         $img = "http://d4e7wxbvl20c1.cloudfront.net/images.flyer.eu/flippage/bann_nl.png";
    }

  $form['description'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('samplepacks')),
      '#suffix' => '<div id="graydiv">',
  );


  $form['description']['image'] = array(
      '#markup' => '<img src="'.$img.'" style="width: 680px; margin-left: -10px;  margin-top: -18px;" alt="flyer" title="flyer" />', 
  );
 $form['description']['contspan'] = array(
      '#type' => 'container',
      '#id' => 'contspan',
  );
 
 $form['description']['contspan']['p1'] = array(
    '#prefix' => '<p class="title">',
    '#suffix' => '</p>',
    '#markup' => t('Free Sample Flips are ready at the Flyer Store in your area for you! All the papers that we offer are here. So you can see and feel what is on your printed paper created. If you have any questions, free advice from a specialist than happy to help our Flyer Store you further.'),
   );

 $form['description']['contspan']['p2'] = array(
    '#prefix' => '<p class="title">',
    '#suffix' => '</p>',
    '#markup' => t('Come in and get through the Flyer Stores Free paper samples with a discount code 5% on your first order. Many Flyer Stores are also open on Saturday. Easier and faster can not.'),
   );
 $form['description']['contspan']['p3'] = array(
    '#prefix' => '<p class="title">',
    '#suffix' => '</p>',
    '#markup' => t('Find your nearest Flyer Store in your area:'),
   );
   
  $form['description']['contspan']['link'] = array(
    '#type' => 'link',
    '#prefix'=>'<p class="ctn-searchprocess">',
    '#suffix'=>'</p>',
    '#title' => t('Zoek in je buurt'),
    '#href' => 'mystores',
    '#id' => 'searchprocess',
    '#attributes' => array('class' => array('searchprocess', 'button', 'request', 'ui-button', 'ui-widget', 'ui-state-default', 'ui-corner-all', 'ui-button-text-only'),),
  );

 $form['formtitle'] =array(
      '#markup' => '<p class="title">' . t('If you have to visit one of our Stores Flyer, no possibility you can also apply for the Sample Flip through the application form below:') . '</p>',
    );
 
  $defaultAddress = FALSE;
  if ($customer) {
    foreach (Addresses\Factory::GetAddresses($customer) as $address) {
        if ($address->defaultShipping) {
          $defaultAddress = $address;
        }
    }
  }
  
    $object = \printconnect\SamplePacks\Factory::GetAll();
    $needSF = \printconnect\SamplePacks\Factory::LoadSampleFlip($object);

    foreach($needSF as $sampleFlip ){ 
        $needSFs[$sampleFlip->id] = $sampleFlip->response;  
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

    $form['name'] = array(
        '#type' => 'textfield',
        '#title' => t('Name'),
        '#default_value' => $defaultAddress ? $customer->lastName : '',
        '#required' => TRUE,
    );
    $form['firstName'] = array(
        '#type' => 'textfield',
        '#title' => t('First Name'),
        '#default_value' => $defaultAddress ? $customer->firstName : '',
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
        '#title' => t('Street samplepacks'),
        '#default_value' => $defaultAddress ? $defaultAddress->street : '',
        '#required' => TRUE,
    );
     $form['houseNumberBus'] = array(
        '#type' => 'textfield',
        '#title' => t('House number & bus'),
        '#required' => TRUE,
    );
    $form['postalCodeS'] = array(
        '#type' => 'textfield',
        '#title' => t('postalCodeS'),
        '#default_value' => $defaultAddress ? $defaultAddress->postalCode : '',
        '#required' => TRUE,
    );
    $form['city'] = array(
        '#type' => 'textfield',
        '#title' => t('City'),
        '#default_value' => $defaultAddress ? $defaultAddress->city : '',
        '#required' => TRUE,
    );
    $form['phone'] = array(
      '#type' => 'textfield',
      '#title' => t('Telephone number'),
      '#default_value' => $defaultAddress ? $defaultAddress->phone : '',
      '#required' => TRUE,
    );
    $form['email'] = array(
      '#type' => 'textfield',
      '#title' => t('Email adress'),
      '#default_value' => $email ? $email : '' ,
      '#required' => TRUE,
    );
    $form['country'] = array(
        '#type' => 'select',
        '#title' => t('Country'),
        '#options' => $countries,
        '#default_value' => $defaultAddress ? $defaultAddress->country : $shopConfig->defaultCountry,
        '#required' => TRUE,
    );
    if ($customer) {
        $form['isCustomer'] = array(
          '#type' => 'hidden',
          '#value' => 1,
        );      
    }else{   
        $form['isCustomer'] = array(
            '#type' => 'radios',
            '#title' => t('Are you already a customer?'), 
            '#options' => array(0 => t('Nooo'),1 => t('Yes')),     
            '#default_value' => 0,
            '#required' => TRUE,
        );
    }
    if($needSFs){
        $form['response'] = array(
          '#type' => 'radios',
       // '#type' => 'checkboxes',
          '#title' => t('Why do you need a sample flip?'),
          '#options' => $needSFs,
          '#required'=>TRUE,
        );
    }
  $form['actions'] = array(
      '#type' => 'actions',
  );

  $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Request'),
      '#attributes' => array('class' => array('button')),
      '#suffix' => '</div>'
  );
   $form['lastcontxt'] = array(
      '#markup' => '<div id="lastcontxt"><span class="form-required">*</span><span>'.t('Verplichte velden').'</span></div>',
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
    $form['postalCodeS']['#value'] = '';
    $form['city']['#value'] = '';
    $form['country']['#value'] = '';
    $form['phone']['#value'] = '';
  } else {
    $address = \printconnect\Customers\Addresses\Factory::Get($addressId);

    $form['name']['#value'] = $address->name;
    $form['company']['#value'] = $address->company;
    $form['street']['#value'] = $address->street;
    $form['postalCodeS']['#value'] = $address->postalCode;
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
    if (isset($language->id)) {
        $samplePack->language = $language->id;
    }
    $responses = array();
    $responses[] = $form_state['values']['response'];
    $samplePack->response = array_values($responses);

    Factory::Save($samplePack);
    
    $_SESSION['samplePackId'] = $samplePack->id;
    $_SESSION['samplepack'] = serialize($samplePack);
    drupal_set_message(t('Sample pack requested'));
    drupal_goto('samplepack/requested');

}
function pcsamplepacks_request_form_validate($form, $form_state) {

    if(!empty($form_state['values']['email']) && !valid_email_address($form_state['values']['email']) ){
        form_set_error('email',t('Please enter a valid mail.'));
        return false;
    }
    if(!empty($form_state['values']['phone']) && !is_numeric($form_state['values']['phone'])){
        form_set_error('phone',t('Please enter your Phone Number as Number value.'));
        return false;
    }
    $country=$form_state['values']['country'];
    $postalCode=$form_state['values']['postalCodeS'];
    $isoList = array(
                21 => "BE",
                73  => "FR",
                150 => "NL",
                124 => "LU"
              );
    $isoLengths = array(
                21 => 4,
                73 => 5,
                150 => 7,
                124 => 4
              );

    if(array_key_exists($country,$isoLengths)){
            if($isoLengths[$country]!= strlen($postalCode) && $country!=150){
                $message="Le champ Code postal doit contenir ".$isoLengths[$country]." chiffres";
                form_set_error('postalCodeS', t($message));
                return false;
            }
            if($country!=150 && !ctype_digit($postalCode)){

                form_set_error('postalCodeS', t('Le champ Code postal doit être numérique.'));
                return false;
            }
            if($country==150 && strlen($postalCode) <= 4){
                form_set_error('postalCodeS', t('Le champ Code postal est trop court.'));
                return false;
            }

    }

/*    if(!empty($form_state['values']['postalCode']) && !is_numeric($form_state['values']['postalCode'])){
        form_set_error('postalCode', t('Le champ Code postal doit être numérique.'));
        return false;
    }
    if(is_numeric($form_state['values']['postalCode']) && strlen($form_state['values']['postalCode'])<4){
        form_set_error('postalCode', t('Le champ Code postal doit être supérieur à 3 chiffres.'));
        return false;
    } */
    if(strlen($form_state['values']['city'])<2){
        form_set_error('city', t('Le champ ville est trop court.'));
        return false;  
    }
      
 
    
}
function pcsamplepacks_requested_form($form, $form_state) {
    $lng = request_path();
    $samplePack = NULL;
    $place = FALSE;
    if (isset($_SESSION['samplepack'])) {
       $samplePack = unserialize($_SESSION['samplepack']);
    }else{
          drupal_goto('samplepack');            
    }

    if (isset($samplePack->country) && $samplePack->country) {
      $country = \printconnect\Countries\Factory::Get($samplePack->country);
      $iso = $country->iso;
      if (isset($iso)) {
        $place = $country->iso . ' - ';
      }
    }
    
    if($lng == "befr/samplepack" || $lng == "lufr/samplepack" || $lng == "frfr/samplepack" ){
        $img = "http://d4e7wxbvl20c1.cloudfront.net/images.flyer.eu/flippage/bann_fr.png";   
    }else if($lng == "nlnl/samplepack"){
          $img = "http://d4e7wxbvl20c1.cloudfront.net/images.flyer.eu/flippage/nlnl_banner_SampleFlip_request_OK.jpg";
    }else{
         $img = "http://d4e7wxbvl20c1.cloudfront.net/images.flyer.eu/flippage/bann_nl.png";
    }
    
  $form['description'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('samplepacks')),
  );

  $form['description']['image'] = array(
      '#markup' => '<img src="'.$img.'" style="width: 680px; margin-left: -10px;  margin-top: -18px;" alt="flyer" title="flyer" />', 
  );
 $form['description']['contspan'] = array(
      '#type' => 'container',
      '#id' => 'contspan',
  );
 
 $form['description']['contspan']['thanks'] = array(
      '#prefix' => '<span style="margin-top: 10px;margin-bottom: 20px;">',
      '#suffix' => '</span>',
      '#markup' => t('Thanks for your request. We will send your sampleflip as soon as possible to the given address.'),
     );
  $form['description']['contspan']['title'] = array(
      '#prefix' => '<span style="font-size:15px;margin-bottom: 30px;">',
      '#suffix' => '</span>',
      '#markup' => t('ADRES'),
     );
   $form['description']['contspan']['street'] = array(
      '#markup' => '<span>'.$samplePack->name.'</span> <span>'.$samplePack->street.'</span>',
     );
   
    $form['description']['contspan']['ville'] = array(
      '#prefix' => '<span style="margin-bottom: 30px;">',
      '#suffix' => '</span>',
      '#markup' =>  $place.$samplePack->postalCode.' '.$samplePack->city,
     );
 $form['description']['contspan']['helpmsg'] = array(
      '#markup' => '<span>'.t('Do you have any questions about paper, finishes or our product range, please feel free to visit at a Flyer Store in your neighborhood. They love to help you!
   ').'</span>',
     );
   
  $form['description']['contspan']['link'] = array(
    '#type' => 'link',
    '#title' => t('FlyerStores in jouw buurt'),
    '#prefix'=>'<p class="ctn-searchprocess">',
    '#suffix'=>'</p>',
    '#href' => 'mystores',
    '#id' => 'searchprocess',
    '#attributes' => array('class' => array('button', 'request', 'ui-button', 'ui-widget', 'ui-state-default', 'ui-corner-all', 'ui-button-text-only'),),
  );

  return $form; 

}

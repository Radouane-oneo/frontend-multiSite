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

  $classSF = "";
   if($lng == "befr/samplepack" || $lng == "lufr/samplepack" || $lng == "frfr/samplepack" ){
        $img = "http://d4e7wxbvl20c1.cloudfront.net/images.flyer.eu/flippage/bann_fr.png";   
    }else if($lng == "nlnl/samplepack"){
          $img = "http://d4e7wxbvl20c1.cloudfront.net/images.flyer.eu/flippage/nlnl_banner_SampleFlip_request_OK.jpg";
          $classSF ="sfimgnlnl";
    }else{
         $img = "http://d4e7wxbvl20c1.cloudfront.net/images.flyer.eu/flippage/bann_fr.png";
    }
  $form['description'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('samplepacks')),
      '#suffix' => '<div id="graydiv">',
  );


  $form['description']['image'] = array(
      '#markup' => '<img src="'.$img.'" style="width: 680px; margin-left: -10px;  margin-top: -24px;" alt="flyer" title="flyer" />', 
  );
 $form['description']['contspan'] = array(
      '#type' => 'container',
      '#id' => 'contspan',
  );
 
 $form['description']['contspan']['p1'] = array(
    '#prefix' => '<p class="title">',
    '#suffix' => '</p>',
    '#markup' => t('Des SampleFlips gratuits sont à votre disposition dans le FlyerStore près de chez vous ! Vous y trouverez tous les type de papier que nous offrons. Vous pouvez ainsi sentir le papier sur lequel vos impressions seront tirées. Si vous avez d’autres questions ou besoin de l’avis d’un spécialiste, l’équipe de notre FlyerStore se fera un plaisir de vous aider.'),
   );

 $form['description']['contspan']['p2'] = array(
    '#prefix' => '<p class="title">',
    '#suffix' => '</p>',
    '#markup' => t('Entrez dans l’un des FlyerStores et recevez vos échantillons gratuits ainsi qu’un bon de réduction de 5% sur votre première commande. Un grand nombre des FlyerStore sont aussi ouverts le samedi. On ne peut pas faire plus simple et plus rapide que ça.'),
   );
 $form['description']['contspan']['p3'] = array(
    '#prefix' => '<p class="title">',
    '#suffix' => '</p>',
    '#markup' => t('Trouvez le FlyerStore près de chez vous:'),
   );
   
  $form['description']['contspan']['link'] = array(
    '#type' => 'link',
    '#prefix'=>'<p class="ctn-searchprocess">',
    '#suffix'=>'</p>',
    '#title' => t('Trouvez un FlyerStore'),
    '#href' => 'mystores',
    '#id' => 'searchprocess',
    '#attributes' => array('class' => array($classSF, 'searchprocess', 'button', 'request', 'ui-button', 'ui-widget', 'ui-state-default', 'ui-corner-all', 'ui-button-text-only'),),
  );

 $form['formtitle'] =array(
      '#markup' => '<p class="title">' . t('Si vous n’êtes pas en mesure de vous rendre dans l’un de nos FlyerStores, il est également possible de commander un SampleFlip via le formulaire ci-dessous.') . '</p>',
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
        '#title' => t('Nom'),
        '#default_value' => $defaultAddress ? $customer->lastName : '',
        '#required' => TRUE,
    );
    $form['firstName'] = array(
        '#type' => 'textfield',
        '#title' => t('Prénom'),
        '#default_value' => $defaultAddress ? $customer->firstName : '',
        '#required' => TRUE,
    );

    $form['company'] = array(
        '#type' => 'textfield',
        '#title' => t('Société'),
        '#default_value' => $defaultAddress ? $defaultAddress->company : '',
        '#required' => FALSE,
    );
    $form['street'] = array(
        '#type' => 'textfield',
        '#title' => t('Rue'),
        '#default_value' => $defaultAddress ? $defaultAddress->street : '',
        '#required' => TRUE,
    );
     $form['houseNumberBus'] = array(
        '#type' => 'textfield',
        '#title' => t('Numéro et boîte'),
        '#required' => TRUE,
    );
    $form['postalCode'] = array(
        '#type' => 'textfield',
        '#title' => t('Code Postal'),
        '#default_value' => $defaultAddress ? $defaultAddress->postalCode : '',
        '#required' => TRUE,
    );
    $form['city'] = array(
        '#type' => 'textfield',
        '#title' => t('Localité'),
        '#default_value' => $defaultAddress ? $defaultAddress->city : '',
        '#required' => TRUE,
    );
    $form['phone'] = array(
      '#type' => 'textfield',
      '#title' => t('Numéro téléphone'),
      '#default_value' => $defaultAddress ? $defaultAddress->phone : '',
      '#required' => TRUE,
    );
    $form['email'] = array(
      '#type' => 'textfield',
      '#title' => t('Adresse e-mail'),
      '#default_value' => $email ? $email : '' ,
      '#required' => TRUE,
    );
    $form['country'] = array(
        '#type' => 'select',
        '#title' => t('Pays'),
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
            '#title' => t('Etes-vous déjà client chez Flyer.be ?'), 
            '#options' => array(0 => t('Non'),1 => t('Oui')),     
            '#default_value' => 0,
            '#required' => TRUE,
        );
    }
    if($needSFs){
        $form['response'] = array(
          '#type' => 'radios',
       // '#type' => 'checkboxes',
          '#title' => t('Pourquoi avez-vous besoin d’un SampleFlip ?'),
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
    if (isset($language->id)) {
        $samplePack->language = $language->id;
    }
    $responses = array();
    $responses[] = $form_state['values']['response'];
    $samplePack->response = array_values($responses);

//    print '<pre>';
//    var_dump($samplePack->response);        
//    print '</pre>';
//    die();

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
    if($lng == "befr/samplepack/requested" || $lng == "lufr/samplepack/requested" || $lng == "frfr/samplepack/requested" ){
        $img = "http://d4e7wxbvl20c1.cloudfront.net/images.flyer.eu/flippage/bann_fr_2.png";   
        $classSF ="sfimgFR";
      }else if($lng == "nlnl/samplepack/requested"){
        $img = "http://d4e7wxbvl20c1.cloudfront.net/images.flyer.eu/flippage/nlnl_banner_SampleFlip_thx_OK.jpg";
        $classSF ="sfimgnlnl";
    }else{ 
         $img = "http://d4e7wxbvl20c1.cloudfront.net/images.flyer.eu/flippage/bann_fr_2.png";
         $classSF ="sfimgFR";
    }
  $form['description'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('samplepacks')),
  );

  $form['description']['image'] = array(
      '#markup' => '<img src="'.$img.'" style="width: 680px; margin-left: -10px;  margin-top: -24px;" alt="flyer" title="flyer" />', 
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
      '#markup' => t('Adresse :'),
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
      '#markup' => '<span>'.t('Besoin d’informations supplémentaires sur les différents types de papiers, les finitions ou notre gamme de produits, n’hésitez pas à rendre visite à votre FlyerStore le plus proche. Ils sont à votre disposition.
   ').'</span>',
     );
   
  $form['description']['contspan']['link'] = array(
    '#type' => 'link',
    '#title' => t('Tous les FlyerStores'),
    '#prefix'=>'<p class="ctn-searchprocess">',
    '#suffix'=>'</p>',
    '#href' => 'mystores',
    '#id' => 'searchprocess',
    '#attributes' => array('class' => array($classSF,'button', 'request', 'ui-button', 'ui-widget', 'ui-state-default', 'ui-corner-all', 'ui-button-text-only'),),
  );

  return $form; 

}

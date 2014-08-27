<?php

function pccontact_email_form($form, &$form_state) {
  $form['actions'] = array(
      '#type' => 'actions',
  );

  $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Send'),
  );
  $form_state['cache'] = TRUE;
  return $form;
}

function pccontact_email_form_submit($form, &$form_state) {
  drupal_mail('pccontact', 'email', variable_get('pccontact_email', 'info@printconcept.com'));
}

function pccontact_popup_form($form, &$form_state, $key = 'popup') {
    

  //$emails = array('info@Flyer.fr', 'info@Flyer.lu');
    $form['container'] = array(
        "#prefix"=>'<div class="popin_overlay">',
        "#suffix"=>'</div>',
    );
   $form['container']['header'] = array(
        '#markup' => '<div class="head"><img src ="'.base_path().drupal_get_path('module', 'pccontact') . '/img/logo.png"><span class="close"></span></div>',
    );
    $form['container']['popup'] = array(
        "#prefix"=>'<fieldset>',
        "#suffix"=>'</fieldset>',
        );
    
  
    $form['container']['popup']['description'] = array(
        '#markup' =>'<div id="popupContent"><h3>Je souhaite être rappelé(e)</h3>
                      <p>Merci de remplir le formulaire suivant afin qu\'un opérateur <br /> 
                      FLYER puisse prendre contact avec vous par téléphone.</p>',
    ); 
   

    $form['container']['popup']['nom'] = array(
        '#type' => 'textfield',
        '#required' => TRUE,
        '#title' => t('Nom'),
        '#attributes' => array('data-nameError' => t('name is required')),
        '#prefix' => '<div class="global-error edit-nom">',
        '#suffix' => '<span class="required">'.t('name is required').'</span></div>',
    );
      $form['container']['popup']['prenom'] = array(
        '#type' => 'textfield',
        '#required' => TRUE,
        '#title' => t('Prénom'),
        '#attributes' => array('data-nameError' => t('name is required')),
        '#prefix' => '<div class="global-error edit-prenom">',
        '#suffix' => '<span class="required">'.t('last name is required').'</span></div>',
    );
    $form['container']['popup']['telephone'] = array(
        '#type' => 'textfield',
        '#required' => TRUE,
        '#title' => t('Téléphone'),
        '#attributes' => array('data-phoneError' => t('phone is required')),
        '#prefix' => '<div class="global-error edit-telephone">',
        '#suffix' => '<span class="required">'.t('phone is required').'</span></div>',
    );
    $form['container']['popup']['email'] = array(
        '#type' => 'textfield',
        '#required' => TRUE,
        '#title' => t('Adresse email'),
        '#attributes' => array('data-mailError' => t('email is required')),
        '#prefix' => '<div class="global-error edit-email">',
        '#suffix' => '<span class="required">'.t('email is required').'</span></div>',
    );
  
    $form['container']['popup']['error'] = array(
      '#markup' =>'<p class="required-msg">Les champs avec un astérisque (<span class="required">*</span>) sont à remplir obligatoirement.</p></div>',
    );  
    
$form['container']['actions'] = array(
      '#type' => 'actions',
  );

  $form['container']['actions']['submit'] = array(
      '#prefix' => '<div class="submit">',
      '#type' => 'submit',
      '#value' => t('ENVOYER'),
      '#id'=>'submit',
      "#suffix"=>'</div>'
  );
 

  $form['container']['popup']['messageSent']  =array(
        '#markup' => '<div id="messageSent"><h3>VOTRE DEMANDE A BIEN ÉTÉ PRISE EN COMPTE !</h3><p>Un conseiller vous répondra dans les plus brefs délais.
Nous vous remercions de votre confiance.</p><p class="orange">
Vous avez reçu un email de confirmation</p></div>'
  );

  $form['#id'] = 'pccontact_popup_form';
  $form['#attributes'] = array('data-globalError' => t('fields are required'));
  return $form;
}
function pccontact_popup_form_validate($form, &$form_state) {
  if (!valid_email_address($form_state['values']['email'])) {
    form_set_error('email', t('E-mail address is not valid'));
  }
}

// general form 

function pccontact_general_form($form, &$form_state, $key = 'general') {
  $customer = \printconnect\Customers\Factory::Current();
  global $language;
  $path=base_path()."sites/all/themes/printconnect/flyer/css/images/translogo/$language->prefix.png";
  if($form_state['build_info']['args'][0] == 'stores') {
      $match=split('//',theme_get_setting('logo_path'));
      $imageName=str_replace("logo", "logo_inversed", $match[1]);
      $path='/sites/default/files/'.$imageName;
  }

  $emails = array(
      'benl' => 'info@flyer.be',
      'befr' => 'info@flyer.be',
      'nlnl' => 'info@Flyer.nl',
      'frfr' => 'info@Flyer.fr',
      'lufr' => 'info@Flyer.lu'
  );
  
  $phones = array(
      'benl' => '070 222 309',
      'befr' => '070 222 309',
      'nlnl' => '+32 50 79 97 70',
      'frfr' => '03 20 38 24 53',
      'lufr' => '27 86 01 39'
  );
  
  $form['container']['image'] = array(
      '#markup' => '<p id="shopIco" >
          <img style="width: 105px;height: 82px;padding-top: 48px;" src ="'.$path.'"></p>',
  );
  
  $form['container']['title'] = array(
      '#prefix' => '<div id ="infoContainer">',
      '#markup' => '<p id="titleContact">
          <strong> '.t('HEB JE EEN VRAAG').' ?</strong>
          </p><strong id ="sub1"> '.t('Zinnetje over customer service').'</strong>',
  );
  
  $form['container']['imageCallIcon'] = array(
      '#markup' => 
      '<p id ="imgsContacts">
          <img src ="'.base_path().'sites/all/themes/printconnect/flyer/css/images/call-contact.png">
              <strong class="phones"> '.$phones[$language->prefix].'</strong>
          <img src ="'.base_path().'sites/all/themes/printconnect/flyer/css/images/msg-contact.png">
              <strong class="mails"> '.$emails[$language->prefix].'</strong>
       </p>',
       '#suffix' => '</div>'
    
  );
  
  $form['container']['callBack'] = array(
       '#prefix' => '<div id ="fieldContainer">',
      '#markup' => '<p id="callBackContact">
          <strong> '.t('TERUGBELLEN').'</strong>
          </p><strong id= "sub2"> '.t('Zinnetje over terug').'</strong>',
  );
  
  $form['name'] = array(
      '#type' => 'textfield',
      '#required' => TRUE,
      '#title' => t('Name'),
      '#default_value' => $customer ? $customer->name : '',
      '#attributes' => array('data-nameError' => t('name is required'))
  );
  $form['phone'] = array(
      '#type' => 'textfield',
      '#required' => TRUE,
      '#title' => t('Phone'),
      '#default_value' => $customer ? $customer->phone : '',
      '#attributes' => array('data-phoneError' => t('phone is required'))
  );
  $form['email'] = array(
      '#type' => 'textfield',
      '#required' => TRUE,
      '#title' => t('Email'),
      '#default_value' => $customer ? $customer->email : '',
      '#attributes' => array('data-mailError' => t('email is required'))
  );
  $form['comment'] = array(
      '#type' => 'textarea',
      '#required' => TRUE,
      '#title' => t('Remarks'),
      '#attributes' => array('data-commentError' => t('comment is required')),
      '#suffix' => '</div>',
  );

  $form['actions'] = array(
      '#type' => 'actions',
  );

  $form['actions']['submit'] = array(
      '#prefix' => '<span id ="spanBack"></span>',
      '#type' => 'submit',
      '#value' => t('Send'),
  );
//  $form_state['cache'] = TRUE;
  $form['#id'] = 'pccontact_general_form';
  $form['#attributes'] = array('data-globalError' => t('fields are required'));
  return $form;
}

function pccontact_general_form_submit($form, &$form_state) {
  if (isset($form_state['build_info']['args'][0])) {
    $key = $form_state['build_info']['args'][0];
  } else {
    $key = 'general';
  }
  
 global $language;
 $send = TRUE;

   switch ($language->prefix) {
        case 'benl':
            $result = drupal_mail('pccontact', $key, 
                    variable_get('pccontact_email', 'info@flyer.be'),
                    '', $form_state['values'],
                    NULL, $send);
            break;
        case 'befr':
            $result = drupal_mail('pccontact', $key,
                    variable_get('pccontact_email', 'info@flyer.be'),
                    '', $form_state['values'], NULL, $send);
            break;
        case 'nlnl':
            $result = drupal_mail('pccontact', $key,
                    variable_get('pccontact_email', 'info@flyer.nl'),
                    '', $form_state['values'], NULL, $send);
            break;
        case 'frfr':
            $result = drupal_mail('pccontact', $key,
                    variable_get('pccontact_email', 'info@flyer.fr'),
                    '', $form_state['values'], NULL, $send);
            break;
        case 'lufr':
            $result = drupal_mail('pccontact', $key,
                    variable_get('pccontact_email', 'info@flyer.lu'),
                    '', $form_state['values'], NULL, $send);
            break;
    }
    
    $sendMeail = FALSE;
    if ($result['result'] == TRUE) {
        $sendMeail = TRUE;
        drupal_set_message(t('Your message has been sent.'));
    } else {
        drupal_set_message(t('Your message has  not been sent'), 'error');
    }
}



function pccontact_stors_form($form, &$form_state) {
  $customer = \printconnect\Customers\Factory::Current();

  $form['name'] = array(
      '#type' => 'textfield',
      '#required' => TRUE,
      '#default_value' => $customer ? $customer->name : '',
      '#attributes' => array(
          'data-nameError' => t('name is required'),
          'placeholder' =>t('Name*'))
  );
  $form['phone'] = array(
      '#type' => 'textfield',
      '#required' => TRUE,
      '#default_value' => $customer ? $customer->phone : '',
      '#attributes' => array(
          'data-phoneError' => t('phone is required'),
          'placeholder' =>t('Phone*'))
  );
  $form['email'] = array(
      '#type' => 'textfield',
      '#required' => TRUE,
      '#default_value' => $customer ? $customer->email : '',
      '#attributes' => array(
          'data-mailError' => t('email is required'),
          'placeholder' => t('Email*'))
  );
  $form['socity'] = array(
      '#type' => 'textfield',
      '#required' => TRUE,
      '#attributes' => array(
          'data-socityError' => t('socity is required'),
          'placeholder' => t('socity*'))
  );
  $form['activity'] = array(
      '#type' => 'textfield',
      '#required' => TRUE,
      '#attributes' => array(
          'data-activityError' => t('activity is required'),
          'placeholder' => t('activity*'))
  );
  $form['vatnumber'] = array(
      '#type' => 'textfield',
      '#required' => TRUE,
      '#attributes' => array(
          'data-vatnumberError' => t('vatnumber is required'),
          'placeholder' => t('vatnumber*'))
  );
  $form['comment'] = array(
        '#type' => 'textarea',
        '#required' => TRUE,
        '#cols' => 100,
        '#rows' => 3,
        '#resizable' => FALSE,
        '#attributes' => array(
          'data-commentError' => t('comment is required'),
          'placeholder' => t('Remarks*')
      ),
      '#suffix' => '</div>',
      '#resizable' => false,
  );

  $form['actions'] = array(
      '#type' => 'actions',
  );

  $form['actions']['submit'] = array(
      '#prefix' => '<span id ="spanBack"></span>',
      '#type' => 'submit',
      '#value' => t('Send'),
  );
  $form['#id'] = 'pccontact_stors_form';
  $form['#attributes'] = array('data-globalError' => t('this fields are required'));
  return $form;
}

function pccontact_stors_form_submit($form, &$form_state) {
    global $language;
    $send = TRUE;
    $result = drupal_mail('pccontact',
            'stores',
            variable_get('pccontact_stores', 'bik8yg@gmail.com, laurent.bernard@flyer.be'),
            language_default(),
            $form_state['values'],
            NULL,
            $send);

    $sendMeail = FALSE;
    if ($result['result'] == TRUE) {
        $sendMeail = TRUE;
        drupal_set_message(t('Your message has been sent.'));
    } else {
        drupal_set_message(t('Your message has  not been sent'), 'error');
    }
}
function pccontact_stors_form_mail_send_admin($form,$form_state){
    global $language;
    $send = TRUE;
    $result = drupal_mail('pccontact', 
            'stores',
            variable_get('pccontact_email', 'bik8yg@gmail.com, laurent.bernard@flyer.be'),
            language_default(),
            $form_state['values'],
            NULL,
            $send);

    $sendMeail = FALSE;
    if ($result['result'] == TRUE) {
        $sendMeail = TRUE;
        drupal_set_message(t('Your message has been sent.'));
    } else {
        drupal_set_message(t('Your message has  not been sent'), 'error');
    }
}

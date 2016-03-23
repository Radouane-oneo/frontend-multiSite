<?php

function pccobranding_login_form($form, &$form_state) {
  global $copartnerLoggedIn;

  if ($copartnerLoggedIn) {
    $form['actions']['submit'] = array(
        '#type' => 'submit',
        '#value' => t('Log out'),
        '#submit' => array('pccobranding_login_form_logout'),
        '#validate' => array(),
    );
  } else {

    $form['login'] = array(
        '#type' => 'fieldset',
        '#title' => t('Log in'),
    );

    $form['login']['intro'] = array(
        '#markup' => t('Provide the password to proceed'),
    );

    $form['login']['password'] = array(
        '#type' => 'password',
        '#title' => t('Password'),
        '#size' => 20,
    );

    $form['login']['actions']['submit'] = array(
        '#type' => 'submit',
        '#value' => t('Log in'),
    );
  }

  return $form;
}

function pccobranding_login_form_validate($form, &$form_state) {
  $shop = \printconnect\Shop\Configuration\Factory::Current();
  $pwd = $shop->password;  
  if ($form_state['values']['password'] != $pwd) {
    form_set_error('password', t('Invalid password'));
  }
}

function pccobranding_login_form_submit($form, &$form_state) {
  global $copartner;

  $_SESSION['cobranding'][$copartner]['loggedin'] = TRUE;
  if (isset($_GET['r'])) {
    $form_state['redirect'] = $_GET['r'];
  } else {
    $form_state['redirect'] = '<front>';
  }
}

function pccobranding_login_form_logout($form, $form_state) {
  unset($_SESSION['cobranding']);
  if (isset($_GET['r'])) {
    $form_state['redirect'] = $_GET['r'];
  } else {
    $form_state['redirect'] = '<front>';
  }
  drupal_goto('<front>');
}
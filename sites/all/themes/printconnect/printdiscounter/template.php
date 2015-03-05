<?php

function printconnect_process_html(&$variables) {
  // Hook into color.module.
  if (module_exists('color')) {
    _color_html_alter($variables);
  }
}

function printconnect_process_page(&$variables) {
  // Hook into color.module.
  if (module_exists('color')) {
    _color_page_alter($variables);
  }
}

function printdiscounter_form_pccheckout_shipping_form_alter(&$form, &$form_state) {
  $form['shipping']['invoice']['address']['postalCode']['#title'] = t('PC and city');
  $form['shipping']['invoice']['address']['city']['#title_display'] = 'invisible';
  $form['shipping']['delivery']['postalCode']['#title'] = t('PC and city');
  $form['shipping']['delivery']['city']['#title_display'] = 'invisible';
}

function printdiscounter_form_pccheckout_personal_form_alter(&$form, &$form_state) {
  $form['address']['postalCode']['#title'] = t('PC and city');
  $form['address']['city']['#title_display'] = 'invisible';
}

function printdiscounter_form_pccustomers_address_form_alter(&$form, &$form_state) {
  $form['postalCode']['#title'] = t('PC and city');
  $form['city']['#title_display'] = 'invisible';
}

function printdiscounter_form_pccustomers_newaddress_form_alter(&$form, &$form_state) {
  $form['postalCode']['#title'] = t('PC and city');
  $form['city']['#title_display'] = 'invisible';
}

function printdiscounter_form_pcsamplepacks_request_form_alter(&$form, &$form_state) {
  $form['request']['postalCode']['#title'] = t('PC and city');
  $form['request']['city']['#title_display'] = 'invisible';
}

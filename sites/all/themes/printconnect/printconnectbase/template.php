<?php

function printconnectbase_preprocess_page(&$vars) {
  drupal_add_library('system', 'ui.button');
}

//function printconnectbase_process_html(&$variables) {
//  // Hook into color.module.
//  if (module_exists('color')) {
//    _color_html_alter($variables);
//  }
//}
//
//

function printconnectbase_process_page(&$variables) {
// Hook into color.module.
//  if (module_exists('color')) {
//    _color_page_alter($variables);
//  }
  $variables['hide_site_name'] = theme_get_setting('toggle_name') ? FALSE : TRUE;
  $variables['hide_site_slogan'] = theme_get_setting('toggle_slogan') ? FALSE : TRUE;
}

function printconnectbase_breadcrumb($vars) {
  $breadcrumb = $vars['breadcrumb'];
  if (!empty($breadcrumb)) {
    $breadcrumb[] = drupal_get_title();
    return '<div class="breadcrumb">' . implode(' > ', $breadcrumb) . '</div>';
  }
}

function printconnectbase_preprocess_block(&$vars) {
  if (isset($vars['block']) && variable_get('pc_flow', '') == 'whitelabel') {
    if ($vars['block']->module == 'locale' && $vars['block']->delta == 'language') {
//    $value = theme_get_setting('locale_language_dropdown');
//     if ($value) {
      $vars['classes_array'][] = 'dropdown';
    }

// }
  }
}

function printconnectbase_preprocess_region(&$vars) {
  if ($vars['region'] == 'dropdown') {
    $vars['classes_array'][] = 'clearfix';
  }
}

function printconnectbase_form_system_theme_settings_alter(&$form, $form_state) {
//if (isset($form_state['build_info']['args'][0]) && ($theme = $form_state['build_info']['args'][0])) {
  /*  $form['printconnect'] = array(
    '#type' => 'fieldset',
    '#title' => 'PrintConnect',
    '#description' => t('Additional settings'),
    );
    $form['printconnect']['locale_language_dropdown'] = array(
    '#title' => t('Language dropdown'),
    '#description' => t('Show the language selection in a dropdown'),
    '#type' => 'checkbox',
    '#default_value' => theme_get_setting('locale_language_dropdown'),
    );

    $form['printconnect']['pc_css'] = array(
    '#title' => t('Additional css'),
    '#type' => 'textarea',
    '#description' => t('Additional css that will be applied to this theme'),
    '#default_value' => theme_get_setting('pc_css'),
    ); */
//}
}

function printconnectbase_form_element(&$variables) {
  unset($variables['element']['#description']);
  return theme_form_element($variables);
}

function printconnectbase_textfield(&$variables) {
  $element = $variables['element'];
  if (!empty($element['#description'])) {
    $element['#attributes']['placeholder'] = $element['#description'];
    $element['#attributes']['title'] = $element['#description'];
    unset($element['#description']);
  }
  $variables['element'] = $element;
  return theme_textfield($variables);
}

function printconnectbase_password(&$variables) {
  $element = $variables['element'];
  if (!empty($element['#description'])) {
    $element['#attributes']['placeholder'] = $element['#description'];
    $element['#attributes']['title'] = $element['#description'];
    unset($element['#description']);
  }
  $variables['element'] = $element;
  return theme_password($variables);
}

function printconnectbase_form_pccustomers_address_form_alter(&$form, &$form_state) {
  $form['postalCode']['#attributes']['class'][] = 'postalCode';
  $form['city']['#attributes']['class'][] = 'city';
  $form['postalCode']['#title'] = t('PC and city');
  $form['city']['#title_display'] = 'invisible';
}

function printconnectbase_form_pccustomers_newaddress_form_alter(&$form, &$form_state) {
  $form['postalCode']['#attributes']['class'][] = 'postalCode';
  $form['city']['#attributes']['class'][] = 'city';
  $form['postalCode']['#title'] = t('PC and city');
  $form['city']['#title_display'] = 'invisible';
}

function printconnectbase_form_pccheckout_shipping_form_alter(&$form, &$form_state) {
  $form['shipping']['invoice']['address']['postalCode']['#title'] = t('PC and city');
  $form['shipping']['invoice']['address']['postalCode']['#attributes']['class'][] = 'postalCode';
  $form['shipping']['invoice']['address']['city']['#title_display'] = 'invisible';
  $form['shipping']['invoice']['address']['city']['#attributes']['class'][] = 'city';
  $form['shipping']['delivery']['postalCode']['#title'] = t('PC and city');
  $form['shipping']['delivery']['postalCode']['#attributes']['class'][] = 'postalCode';
  $form['shipping']['delivery']['city']['#title_display'] = 'invisible';
  $form['shipping']['delivery']['city']['#attributes']['class'][] = 'city';
}

function printconnectbase_form_pccheckout_personal_form_alter(&$form, &$form_state) {
  $form['address']['postalCode']['#attributes']['class'][] = 'postalCode';
  $form['addres']['city']['#attributes']['class'][] = 'city';
  $form['address']['postalCode']['#title'] = t('PC and city');
  $form['address']['city']['#title_display'] = 'invisible';
}

function printconnectbase_form_pcsamplepacks_request_form_alter(&$form, &$form_state) {
  $form['postalCode']['#attributes']['class'][] = 'postalCode';
  $form['city']['#attributes']['class'][] = 'city';
  $form['postalCode']['#title'] = t('PC and city');
  $form['city']['#title_display'] = 'invisible';
}

function printconnectbase_form_pccart_cart_form2_alter(&$form, $form_state, $form_id) {
  if (variable_get('pc_flow', '') == 'printconcept') {
    if (isset($form['actions'])) {
      $form['actionscopy'] = $form['actions'];
      $form['actionscopy']['#weight'] = -100;
    }
  }
}
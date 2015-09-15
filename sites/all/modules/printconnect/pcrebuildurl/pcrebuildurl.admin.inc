<?php
function pcrebuildurl_rebuild_url_form($form, &$form_state) {
  $form['#submit'][] = 'pcrebuildurl_rebuild_url_form_submit';
  $form['actions']['#type'] = 'actions';
  $form['actions']['submit'] = array('#type' => 'submit', '#value' => t('Rebuild url'));
  
  if (!empty($_POST) && form_get_errors()) {
    drupal_set_message(t('The settings have not been saved because of the errors.'), 'error');
  }
  $form['#submit'][] = 'system_settings_form_submit';
  
  if (!isset($form['#theme'])) {
    $form['#theme'] = 'system_settings_form';
  }
  return $form;
}

function pcrebuildurl_rebuild_url_form_submit($form, &$form_state) { 
    
$module ='redirect';
module_disable(array($module));
module_enable(array($module));

define('DRUPAL_ROOT', getcwd());
include_once('../../../../includes/bootstrap.inc');

drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);
pcrebuildurl_drupal_flush_url();
}

function pcrebuildurl_drupal_flush_url() {
  registry_rebuild();
  system_rebuild_theme_data();
  drupal_theme_rebuild();
  entity_info_cache_clear();
  node_types_rebuild();
  menu_rebuild();
  $core = array('cache', 'cache_path', 'cache_filter', 'cache_bootstrap', 'cache_page');
  $cache_tables = array_merge(module_invoke_all('flush_caches'), $core);
  foreach ($cache_tables as $table) {
    cache_clear_all('*', $table, TRUE);
  }
  _system_update_bootstrap_status();
}
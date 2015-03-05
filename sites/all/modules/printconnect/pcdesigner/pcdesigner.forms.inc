<?php

function pcdesigner_upload_form($form, &$form_state, $id) {
  try {
    $upload = \printconnect\Designer\Upload\Factory::Get($id, FALSE);

    $upload->EnsureLoaded();
  } catch (\Exception $ex) {
    drupal_not_found();
    exit;
  }
  
  if (!$upload){
    drupal_not_found();
    exit;
  }

  $form['item'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('item')),
  );

  $form['item']['title'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('title')),
  );

  $form['item']['title']['text'] = array(
      '#type' => 'item',
      '#title' => t('Configuration'),
      '#markup' => $upload->productName,
  );


//  $pricegroup = \printconnect\Products\PriceGroups\Factory::Get($upload->productPriceGroupId);
//  $pricegroup->EnsureLoaded();
//  $productId = $pricegroup->product;
  //$configuration = \printconnect\Products\Configurations\Factory::GetByPriceGroup($upload->productPriceGroupId);
  //$configuration->EnsureLoaded();

  /*
    $items = array();
    foreach ($configuration->items as $item) {
    $items[] = $item->toolboxItem->id;
    }
   */
  $productId = FALSE;
  $items = array();
  foreach ($upload->config as $config) {
    $items[] = $config->toolboxItem->id;
    $productId = $config->product;
  }

  $options = array();
  /*  foreach ($upload->options as $option) {
    $options[] = $option->option;
    }
   */

  $form['item']['upload'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('upload')),
  );

  if (count($upload->files)) {
    foreach ($upload->files as $file) {

      $key = $file->id;
      $jobId = $file->designToolJobId;

      $form['item']['upload']['files'][$file->id]['link'] = array(
          '#theme' => 'designtoollink',
          '#title' => '', // $product->name . ' ' . $firstConfig->name,
          '#content' => theme('pcfilesthumb', array('file' => $file->thumbnail, 'cache' => FALSE)),
          '#html' => TRUE,
          '#params' => array(
              'id' => $id,
          ),
          '#callback' => 'upload-design/callback/',
          '#versioning' => FALSE,
          '#jobId' => $jobId,
          '#attributes' => array('class' => array('designtool', 'iframe', 'display-block')),
      );


      $form['item']['upload']['files'][$file->id]['preview'] = array(
          '#prefix' => '<div>',
          '#suffix' => '</div>',
          '#markup' => l(t('Download preview'), pcdesigntool_preview_url($jobId), array('attributes' => array('target' => 'blank', 'class' => array('clearfix')))),
      );
    }
  } else {

    $templates = \printconnect\Products\Templates\Factory::GetTemplates($productId, $items);

    if (count($templates->items)) {
      $template = $templates->items[0];

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

      $form['item']['upload']['link'] = array(
          '#theme' => 'designtoollink',
          '#templateId' => $template->id,
          '#title' => t('Upload'),
          '#content' => drupal_render($uploadBox),
          '#html' => true,
          '#params' => array(
              'id' => $id,
          ),
          '#callback' => 'upload-design/callback/',
          '#versioning' => FALSE,
          '#attributes' => array('class' => array('upload', 'designtool', 'iframe')),
      );

      $form['item']['upload']['proflink'] = array(
          '#theme' => 'designtoolproflink',
          '#templateId' => $template->id,
          '#title' => t('Upload'),
          '#params' => array(
              'id' => $id,
          ),
          '#callback' => 'upload-design/callback/',
          '#attributes' => array('class' => array('proupload', 'designtool', 'iframe')),
      );
    }
  }
  $templates = \printconnect\Products\Templates\Factory::GetTemplates($productId, $items);
  $templates->EnsureLoaded();

  if (count($templates->items)) {
    $template = $templates->items[0];

    $templates = array();
    $file = FALSE;
    $templateImages = $template->templateImages;

    if ($templateImages) {
      foreach ($templateImages as $templateImage) {
        if ($templateImage->type == 'template' && $templateImage->language == $language->code) {
          $file = $templateImage->file;
          $templates[] = $file;
        }
      }
    }


    if ($template) {

      $form['templates'] = array(
          '#id' => 'templates',
          '#type' => 'fieldset',
          '#title' => t('Design documents'),
          '#attributes' => array('class' => array('templates')),
      );


//        $form['templates']['debug'][] = array('#markup' => print_r($templateImages, true));
//        $form['templates']['debug'][] = array('#markup' => print_r($language, true));
//        
//        $form['templates']['header'] = array( 
////'#type' => '',
//            '#markup' => t('Design documents'),
//            '#prefix' => '<h2>',
//            '#suffix' => '</h2>',
//        );

      $form['templates']['text'] = array(
          '#type' => 'container',
          '#attributes' => array('class' => array('text')),
          'content' => array(
              '#markup' => t('Finalizing your design? Take into account these requirements:'),
          ),
      );


      switch (true) {
        case $template->thumbnail && $file:
          $form['templates']['image'] = array(
              '#type' => 'container',
              '#attributes' => array(
                  'class' => array('image'),
              ),
              'content' => array(
                  '#theme' => 'pcfilesdownloadlink',
                  '#file' => $file,
                  '#content' => array(
                      '#theme' => 'pcfilesimage',
                      '#file' => $template->thumbnail,
                  ),
              ),
          );
          break;
        case (!$template->thumbnail && $file):
          $templateitems[] = theme('pcfilesdownloadlink', array('file' => $file));
          $form['templates']['image']['items']['#markup'] = theme('item_list', array('items' => $templateitems));

          break;
        case $template->thumbnail && !$file:
          $form['templates']['image'] = array(
              '#type' => 'container',
              '#attributes' => array(
                  'class' => array('image'),
              ),
              'content' => array(
                  '#theme' => 'pcfilesimage',
                  '#file' => $template->thumbnail,
              ),
          );
          break;
      }


      $form['templates']['desciption'] = array(
          '#type' => 'container',
          '#attributes' => array('class' => array('description')),
      );

      $form['templates']['desciption']['name'] = array(
          '#type' => 'container',
          '#attributes' => array('class' => array('name')),
          'content' => array(
              '#markup' => t('Size') . ' : ' . $template->size,
          ),
          '#title' => t('Size'),
      );

      $form['templates']['desciption']['size'] = array(
          '#type' => 'item',
          '#markup' => $template->size,
          '#title' => t('Size') . ' : ',
      );
      $form['templates']['desciption']['bleed'] = array(
          '#type' => 'item',
          '#markup' => $template->bleed,
          '#title' => t('Bleed') . ' : ',
      );

      $form['templates']['desciption']['color'] = array(
          '#type' => 'item',
          '#markup' => $template->colorMode,
          '#title' => t('Color') . ' : ',
      );

      $form['templates']['desciption']['resolution'] = array(
          '#type' => 'item',
          '#markup' => $template->resolution,
          '#title' => t('Resolution') . ' : ',
      );
    }
  }

  $form['actions'] = array(
      '#type' => 'actions',
      '#attributes' => array('class' => array('clearfix')),
  );

  $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Ready'),
  );

  $form_state['storage']['upload'] = $upload;

  $form_state['cache'] = TRUE;
  return $form;
}

function pcdesigner_upload_form_submit($form, &$form_state) {
  \printconnect\Designer\Upload\Factory::Confirm($form_state['storage']['upload']);
  drupal_goto('<front>');
}
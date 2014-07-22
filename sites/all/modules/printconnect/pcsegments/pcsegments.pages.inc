<?php

function pcsegments_segments() {

  drupal_add_js(array('pcsegments' => array('selected' => 1)), 'setting');

  $build = array();
  $items = array();

  $segments = \printconnect\Segments\Factory::GetAll();
  foreach ($segments as $segment) {
    if ($segment->tag == '') {
      $item = array(
          'link' => array(
              '#prefix' => '<h2>',
              '#suffix' => '</h2>',
              '#markup' => l($segment->name->name, 'segments/' . $segment->id),
          ),
          'description' => array(
              '#prefix' => '<p>',
              '#suffix' => '</p>',
              '#markup' => $segment->name->longDescription,
          ),
      );
      $items[] = drupal_render($item);
    }
  }

  $build['items'] = array(
      '#theme' => 'item_list',
      '#items' => $items,
  );

  return $build;
}

function pcsegments_segment($id) {
  drupal_add_js(array('pcsegments' => array('selected' => 1)), 'setting');
  $segment = \printconnect\Segments\Factory::Get($id);
  $build = array();
  try {
    $segment->EnsureLoaded();
  } catch (\Exception $ex) {
    drupal_not_found();
    exit;
  }
$build['text'] = array(
    '#prefix' => '<p>',
    '#suffix' => '</p>',
    '#markup' => $segment->name->longDescription,
);

  $templates = array();

  $i = 0;
  if ($segment->templates && count($segment->templates)) {
    foreach ($segment->templates as $template) {
      if ($template->active) {

        $item = array();
        if (isset($template->thumbnail) && isset($template->thumbnail->file)) {
          $item['image'] = array(
              '#theme' => 'pcfilesthumb',
              '#file' => $template->thumbnail->file,
          );
        }/*
          $item['text'] = array(
          '#markup' => $template->name,
          ); */
        $templates[] = array(
            'data' => l(drupal_render($item), 'templates/' . $template->id, array('html' => TRUE)),
        );
        if (++$i >= 8) {
          break;
        }
      }
    }
    $build['templates'] = array(
        '#type' => 'fieldset',
        '#title' => t('Start from template'),
    );

    $build['templates']['items'] = array(
        '#theme' => 'item_list',
        '#items' => $templates,
        '#attributes' => array('class' => array('clearfix')),
    );
    $build['templates']['all'] = array(
        '#markup' => l(t('All templates for this segment'), 'templates', array('query' => array('segments' => $segment->id))),
    );
  }

  if ($segment->products && count($segment->products)) {
    $products = array();
    $i = 0;
    foreach ($segment->products as $product) {
      $item = array(
          'image' => array(
              '#theme' => 'image',
              '#path' => printconnect_getimage('products', $product->id),
          ),
          'name' => array(
              '#markup' => $product->name->name,
          ),
      );
      $products[] = array(
          'data' => l(drupal_render($item), 'products/' . $product->id, array('html' => true)),
      );
      if (++$i >= 8) {
        break;
      }
    }
    $build['products'] = array(
        '#type' => 'fieldset',
        '#title' => t('Choose a product'),
    );
    $build['products']['items'] = array(
        '#theme' => 'item_list',
        '#items' => $products,
        '#attributes' => array('class' => array('clearfix')),
    );
    $build['products']['all'] = array(
        '#markup' => l(t('All products'), 'products'),
    );
  }
  return $build;
}

function pcsegments_segment_products($id) {
  drupal_add_js(array('pcsegments' => array('selected' => 1)), 'setting');
  $segment = \printconnect\Segments\Factory::Get($id);
  $build = array();

  $build['text'] = array(
      '#prefix' => '<p>',
      '#suffix' => '</p>',
      '#markup' => $segment->name->longDescription,
  );

  $build['products'] = array(
      '#type' => 'fieldset',
      '#title' => t('Choose a product'),
  );

  foreach ($segment->products as $product) {
    $item = array(
        'image' => array(
            '#theme' => 'image',
            '#path' => printconnect_getimage('products', $product->id),
        ),
        'name' => array(
            '#markup' => $product->name->name,
        ),
    );
    $products[] = array(
        'data' => l(drupal_render($item), 'products/' . $product->id, array('html' => true)),
    );
  }

  $build['products']['items'] = array(
      '#theme' => 'item_list',
      '#items' => $products,
  );

  return $build;
}

function pcsegments_segment_templates($id) {
  drupal_add_js(array('pcsegments' => array('selected' => 1)), 'setting');
  $segment = \printconnect\Segments\Factory::Get($id);
  $build = array();

  $build['text'] = array(
      '#prefix' => '<p>',
      '#suffix' => '</p>',
      '#markup' => $segment->name->longDescription,
  );

  $build['templates'] = array(
      '#type' => 'fieldset',
      '#title' => t('Start from template'),
  );
  if ($segment->templates && count($segment->templates)) {
    foreach ($segment->templates as $template) {
      if ($template->active) {
        if (isset($template->thumbnail) && isset($template->thumbnail->file)) {
          $item['image'] = array(
              '#theme' => 'pcfilesthumb',
              '#file' => $template->thumbnail->file,
          );
        }
        $item['text'] = array(
            '#markup' => $template->name,
        );
        $templates[] = array(
            'data' => l(drupal_render($item), 'templates/' . $template->id, array('html' => TRUE)),
        );
      }
    }

    $build['templates']['items'] = array(
        '#theme' => 'item_list',
        '#items' => $templates,
    );
  }
  return $build;
}

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
  $segment = \printconnect\Segments\Factory::Get($id);
  $build = array();
  try {
    $segment->EnsureLoaded();
  } catch (\Exception $ex) {
    drupal_not_found();
    exit;
  }
  $banner = variable_get('pc_images') . '/productpage_banners/prod-banner.png';
    $form['banner'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('banner')),
    );

    $form['banner']['image'] = array(
        '#theme' => 'image',
        '#path' => $banner,
 );
    
$build['text'] = array(
    '#prefix' => '<p>',
    '#suffix' => '</p>',
    '#markup' => $segment->name->longDescription,
);

  if ($segment->products && count($segment->products)) {
    $products = array();
    $i = 0;
    foreach ($segment->products as $product) {
      $item = array(
            'image' => array(
              '#theme' => 'image',
              '#path' => printconnect_getimage('products', $product->id),
              '#attributes' => array('width' =>'194', 'height' => '187'),
              '#prefix' => '<div class="blocprd"><a href="products/' . $product->id.'">',
            ),
          
            'name' => array(
                '#markup' => $product->name->name,
                '#prefix' => '<h2>',
                '#suffix' => '</h2></a></div>',
            ),
          
            'price'=> array(
            '#markup' => '<div class="from"><span class="txt">' . t('from_price') . '</span> ' . theme('price', array('value' => $product->sellPrice)) . '</div>',
            ),
          
            'text' => array(
             '#prefix' => '<a class="order btn-cmd" href="products/' . $product->id.'"><span class="flesh"></span>',
            '#markup' => t('Order now'),
            '#suffix' => '</a>',
            ),
      );
      
      $products[] = array(
          'data' => drupal_render($item),
      );
   
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

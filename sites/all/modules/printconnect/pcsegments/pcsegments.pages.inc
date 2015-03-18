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
              '#prefix' => '<div class="blocprd"><a href="'.$GLOBALS['base_url'].'/products/' . $product->id.'">',
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
             '#prefix' => '<a class="order btn-cmd" href="'.$GLOBALS['base_url'].'/products/' . $product->id.'"><span class="flesh"></span>',
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
        '#attributes' => array('class' => array('clearfix', 'list-segment')),
    );
    /*$build['products']['all'] = array(
        '#markup' => l(t('All products'), 'products'),
    );*/
  }
  
  $build['content'] = array(
              '#prefix' => '<p class ="contenttemplates">',
              '#suffix' => '</p>',
          );

  $i = 0;
  if ($segment->templates && count($segment->templates)) {
                foreach ($segment->templates as $template) {
                  if ($template->active) {
                    $item = array();
                    if (isset($template->thumbnail) && isset($template->thumbnail->file)) {
                    $templatesItems[] = array( 
                        "id" => $template->id,
                        "thumbnail" => $template->thumbnail->file,
                        "name" =>$template->name ,
                        "productsname" =>$template->name
                        );
                    if (++$i >= 3) {
                      break;
                    }
                    }
                  }
                }
               
                $build['content']['nosmodel']= array('#markup' => "<div class='block-pctemplates'><div class='nosmodel'><span>Personnalisez un modèle</span><a href='".base_path()."créations-en-ligne'>Tous nos modèles GRATUITS</a></div>");
                $build['content']['startul']= array('#markup' => "<div id='SliderCreaHomePage'><ul>");
                $i=0; 
                $blockrow=0;
                foreach($templatesItems as $valueItems ) {
                    $blockrow=$blockrow+1;
                $build['content']['contentitem1'.$i]= array('#markup' => "<li class='block-pctemplates-row-". $blockrow ."'><div class='blocprd'>"); 
                $build['content']['contentlink1'.$i] = array('#markup' =>'<a id="top10Template_'.$i.'" href="'.$GLOBALS['base_url'].'/templates/' . $valueItems["id"] . '">'); 
                $build['content']['thumb'.$i] = array('#markup' => theme('pcfilesthumb', array('file' => $valueItems["thumbnail"], 'alt' => array('#markup'=>$valueItems->name),'attributes' => array('width' => '194', 'height' => '194'),))); 
                $build['content']['name'.$i] = array('#markup' => "<h2>". $valueItems["productsname"] ."</h2></a></div>",); 
                $build['content']['productName'.$i] = array('#markup' =>'<div class="from"><span class="txt">'.$valueItems["name"].'</span></div>');
                $build['content']['link'.$i] = array('#markup' =>'<a class="btn-cmd" href="'.$GLOBALS['base_url'].'/templates/'.$valueItems["id"].'"><span class="flesh"></span>Utiliser ce modèle</a>');
                $build['content']['contentitem2'.$i]= array('#markup' => "</li>"); $i++; } 
                $build['content']['endul']= array('#markup' => "</ul></div></div>");
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

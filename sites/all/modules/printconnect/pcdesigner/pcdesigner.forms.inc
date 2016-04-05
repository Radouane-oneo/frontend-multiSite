<?php
use \printconnect\Products;
use printconnect\Customers\Factory as CustomersFactory;
function pcdesigner_upload_form($form, &$form_state, $id) {
  try {
    $upload = \printconnect\Designer\Upload\Factory::Get($id, FALSE);
    \printconnect\Designer\Upload\Factory::LoadUpload($upload);
    $id  = ($upload->id) ? $upload->id : $id;
  } catch (\Exception $ex) {
    drupal_not_found();
    exit;
  }
  if (!$upload){
    drupal_not_found();
    exit;
  }  
  $productId = FALSE;
  $items = array();
   $options = array();
    foreach ($upload->options as $option) {
            $options[] = $option->option;
    }
  foreach ($upload->config as $config) {
    $items[] = $config->toolboxItem->id;
    $productId = $config->product;
  }
    $configs = $upload->config;
    $firstConfig = array_shift($configs);
    $product = Products\Factory::Get($productId);
    if ($upload->customWidth != 0 && $upload->customHeight != 0){
        $title = $product->name . ' ' . $upload->customWidth.' X '. $upload->customHeight. ' mm';
        $titleProduct = $upload->quantity . ' ' . t('pcs.') . ' ' . $product->name . ' ' . $upload->customWidth.' X '. $upload->customHeight. ' mm';
        
    }else
    {
        $titleProduct = $upload->quantity . ' ' . t('pcs.') . ' ' . $product->name . ' ' . $firstConfig->toolboxItem->name;
        $title = $product->name . ' ' . $firstConfig->toolboxItem->name;
    }
    $list = array();
    foreach($configs as $config) {
        $list[] = '<label>' . $config->toolboxItem->groupName . ':</label>  ' . $config->toolboxItem->name;
    }
    $form['header'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('headerDesigner')),
    );

    $form['header']['description'] = array(
        '#markup' => '<div class="messageUploadDesigner messages status">'.t("Thank you, the file has been successfully uploaded").'</div><div class="descriptionDesigner">'.t('Dear').'<br>'.t('custmer').'  '.$upload->customerName.'  '.t('told you would upload files for his order. Intro to upload by a designer.').'</div>'
    );
    $templates = Products\Templates\Factory::GetTemplates($productId, $items);                        
    $template = $templates->items[0];
    if ($upload->customWidth != 0 && $upload->customHeight != 0){
        $nrOfPages = count($template->templatePages);
        $custom = 'width:'.$upload->customWidth.'!height:'.$upload->customHeight.'!nrOfPages:'.$nrOfPages;
    }
    else{
        $custom = false;
    }
    $ProdactHasTemplates = ProdactHasTemplates($template->id, $upload->id);
    if($ProdactHasTemplates){
        $modelform = array(
                '#theme' => 'designtoolModele',
                '#templateId' => $template->id,
                '#title' => $title,
                '#html' => true,
                '#content' => t("1000+ modèles gratuits en ligne"),
                '#oi' => array(
                        'priceGroupId' => $upload->productPriceGroupId,
                        'quantity' => $upload->quantity,
                        'options' => $options,
                ),
                '#params' => array(
                        'id' => $item->id,
                        'cartid' => $cart->id,
                        'shop_apikey' => variable_get('pc_apikey'),
                        'insertModel' => '1',
                        'hasModel' => ($ProdactHasTemplates) ? 1 : 0
                ),
                '#callback' => 'cart/callback/',
                '#versioning' => TRUE,
                '#attributes' => array('class' => array()),
            );
        $li_model = '<li>' . t('Adaptez un de nos ') . drupal_render($modelform) . '</li>';
        $model_list_index=5;
    }
    else {
        $li_model = '';
        $model_list_index=4;
    }
   
  if (count($upload->files)) {  
   $form['item']['upload'] = array(
        '#type' => 'fieldset',
        '#title' => t('Product Config'),
        '#attributes' => array('class' => array('templates','templates_withfile')),
    );
    foreach ($upload->files as $file) {
      $key = $file->id;
      $jobId = $file->designToolJobId;
      
      $form['item']['upload']['files'][$file->id]['link'] = array(
          '#prefix'=>'<div class="productDetailFile">',
          '#theme' => 'designtoollink',
          '#content' => theme('pcfilesthumb', array('file' => $file->thumbnail, 'cache' => FALSE)),
          '#html' => TRUE,
          '#params' => array(
              'id' => $upload->id,
          ),
          '#callback' => 'upload-design/callback/',
          '#versioning' => FALSE,
          '#jobId' => $jobId,
          '#attributes' => array('class' => array( 'iframe', 'display-block')),
      );
      
      $arrayIdStatus = array(7, 8, 9, 15, 23);
      if (in_array($upload->orderItemStatus , $arrayIdStatus)){
            $form['item']['upload']['files'][$file->id]['remove'] = array(
                    '#prefix' => '<div class="removefile">',
                    '#suffix' => '</div>',
                    '#type' => 'submit',
                    '#value' => '',
                    '#name' => 'delete_item_' . $upload->id,
                    '#has_garbage_value' => FALSE,
                    '#attributes' => array('class' => array('delete_item','deletedesign'), 'itemFileId' => $upload->id),
            );
      }
      $form['item']['upload']['files'][$file->id]['preview'] = array(
        
          '#suffix'=>'</div>',
          '#markup' => l(t('Download preview'), pcdesigntool_preview_url($jobId), array('attributes' => array('target' => 'blank', 'class' => array('clearfix','linkDownloadpreview')))),
      );
    }
    $form['item']['upload']['files'][$file->id]['productDetail'] = array(
            '#prefix'=>'<div class="productDetailWithFile">',
            '#suffix'=>'</div>',
             'product' => array(
                 '#type' => 'item',              
                 '#markup' => '<h2 class="productName">' .$titleProduct . '</h2>',
             ),
             'items' => array(
                 '#attributes' => array('class' => array('itemsdesign')),
                 '#theme' => 'item_list',
                 '#items' => $list,
             )
           );
     $form['item']['upload']['files'][$file->id]['blocOrange'] = array(
          '#markup' => '<div id="designerMessage">'
         . '<div class="linesUploadDesign"><p>'.t('line1designer').'</p><p>'.t('line2designer').'</p></div>'
        // . '<p class="messageUploadDesigner">'.t("Thank you, the file has been successfully uploaded").'</p>'
         . '</div>',
          );
      $form['item']['upload']['files'][$file->id]['jobIdDesigerHidden'] = array(
          '#markup' => '<input type="hidden" value="'.$upload->id.'" id="jobIdDesiger">' );
        
      $form['item']['upload']['files'][$file->id]['actions'] = array(
      '#type' => 'actions',
      '#attributes' => array('class' => array('clearfix','blocSubmit')),
  );
    $arrayIdStatusConfirm = array(7, 8, 9, 15);  
     if (in_array($upload->orderItemStatus , $arrayIdStatusConfirm)){
         $form['item']['upload']['files'][$file->id]['actions']['submit'] = array(
            '#type' => 'submit',
            '#value' => t('confirm file'),
            '#id' => 'changeStatusUpprove'
        );
     }
     else{
         $form['item']['upload']['files'][$file->id]['actions']['submit'] = array(
          '#markup' => '<div class="cadreGris"></div>',
      );
     }
   
  } else {
      $form['item']['upload'] = array(
          '#type' => 'fieldset',
          '#title' => t('Product Config'),
          '#attributes' => array('class' => array('templates','templates_product')),
      );
       $form['item']['upload']['productDetail'] = array(
       '#prefix'=>'<div class="productDetail clear">',
       '#suffix'=>'</div>',
        'product' => array(
            '#type' => 'item',              
            '#markup' => '<h2 class="productName">' .$titleProduct . '</h2>',
        ),
        'items' => array(
            '#attributes' => array('class' => array('itemsdesign')),
            '#theme' => 'item_list',
            '#items' => $list,
        )
      );
     
    $templates = \printconnect\Products\Templates\Factory::GetTemplates($productId, $items);
    if (count($templates->items)) {
        $template = $templates->items[0];    
        if($upload->hasProUpload){
            $form['item']['upload']['designtool'] = array(
                '#theme' => 'designtoollinkBtt',
                '#templateId' => $template->id,
                '#prefix' =>  '<div class="poll-form poll-form1 first poll-form-tmp">' .
                                                  '<div class="title-image design-tool"></div>' .
                                                  '<div class="option-title">DESIGNTOOL</div>' .
                                                  '<p class="txto">'.t('Pour tous les clients (recommandé)').'</p>' .
                                                  '<ul class="options-file-impression indice-'. $model_list_index .'">
                                                      <li>'. t('Téléchargez votre fichier dans notre designtool') .'</li>
                                                      <li>'. t('Recevez un aperçu de vos impressions') .'</li>
                                                      <li>'. t('Faites votre conception gratuitement en ligne') .'</li>
                                                      '.$li_model.'
                                                      <li>'. t('Contrôle du fichier optionnel (€ 4,99 hors TVA)') .'</li>
                                                  </ul>',
                '#suffix' => '</div> ',
                '#content'=> array('#markup' => '<span class="buttonlayout btnupfile"><span class="txtgras">'.t("COMMENCER").'</span>',),
                '#params' => array(
                    'id' => $upload->id,
                    'cartid' => $upload->order,
                ),
                '#callback' => 'upload-design/callback/',
                '#versioning' => FALSE, 
                '#attributes' => array('class' => array('upload', 'designtool', 'iframe'))
            );

            $form['item']['upload']['proflink'] = array(
               '#prefix' => '<div class="poll-form poll-form2 poll-form-tmp">' .
                      '<div class="title-image pro-upload"></div>' .
                      '<div class="option-title">PRO UPLOAD</div>' .
                      '<p class="txto">'.t('Pour les graphistes professionnels').'</p>' .
                      '<ul class="options-file-impression indice-'. $model_list_index .'" data-id="'. $item->id .'" data-link="/'.$language->prefix.'/products/'.$product->id.'">
                          <li>'. t('Téléchargez immédiatement votre fichier bon à tirer') .'</li>
                          <li>'. t('Fichiers de max. 200 MB') .'</li>
                          <li>'. t('Respectez les <a href="#" class="technic-details model-form">détails techniques</a> ou <a href="/node/102" id="predef-params" class="model-form" target="_blank">paramètres prédéfinis</a>') .'</li>
                          <li>'. t('Contrôle du fichier optionnel (€ 4,99 hors TVA)') .'</li>
                      </ul>',
              '#suffix' => '</div> ',
              '#theme' => 'designtoolproflink',
              '#content'=> array('#markup' => '<span class="text buttondesigntool btnupfile"><span class="txtgras">'.t('COMMENCER').'</span>',),
              '#templateId' => $template->id,
              '#custom' => $custom,
              '#title' => $title,
              '#callback' => 'upload-design/callback/',
              '#params' => array(
                  'id' => $upload->id,
                  'cartid' => $upload->order,
              ), 
              '#html' => true,
              '#attributes' => array('class' => array( 'iframe')),
            );
     }else{
         $form['item']['upload']['designtool'] = array(
          '#theme' => 'designtoollinkBtt',
          '#templateId' => $template->id,
          '#prefix' =>  '<div class="poll-form poll-form1 first designToolOnly poll-form-tmp">' .
                                            '<div class="title-image design-tool"></div>' .
                                            '<div class="option-title">DESIGNTOOL</div>' .
                                            '<p class="txto">'.t('Pour tous les clients (recommandé)').'</p>' .
                                            '<ul class="options-file-impression indice-'. $model_list_index .'">
                                                <li>'. t('Téléchargez votre fichier dans notre designtool') .'</li>
                                                <li>'. t('Recevez un aperçu de vos impressions') .'</li>
                                                <li>'. t('Faites votre conception gratuitement en ligne') .'</li>
                                                '.$li_model.'
                                                <li>'. t('Contrôle du fichier optionnel (€ 4,99 hors TVA)') .'</li>
                                            </ul>',
                    '#suffix' => '</div> ',
                    '#content'=> array('#markup' => '<span class="buttonlayout btnupfile"><span class="txtgras">'.t("COMMENCER").'</span>',),
          '#params' => array(
              'id' => $upload->id,
              'cartid' => $upload->order,
          ),
          '#callback' => 'upload-design/callback/',
          '#versioning' => FALSE,
          '#custom' => $custom,
          '#title' => $title,
          '#html' => true,
          '#attributes' => array('class' => array('upload', 'designtool', 'iframe'))
      );
     }
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
          '#attributes' => array('class' => array('templates','templates_detail_technique')),
      );
    $form['templates']['text'] = array(
            '#type' => 'container',
            '#attributes' => array('class' => array('text','txt_detail')),
            'content' => array(
                '#markup' => t('Finalizing your design? Take into account these requirements:') . 
                '<p>'.l(t('Link text'), t('linkToConftemplate'), array('attributes' => array('target' =>'_blank'))).'</p>',
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
        preg_match_all('!\d+!', $template->size, $size);
        preg_match_all('!\d+!', $template->bleed, $bleed);
        $v1 = $bleed[0][0] * 2 + $size[0][0] ;
        $v2 = $bleed[0][0] * 2 + $size[0][1] ;
        
        $form['templates']['desciption']['name'] = array(
            '#attributes' => array('class' => array('name')),
            'content' => array(
                '#markup' => '<div class="titleProduct">'. t('Format à fourni') . ' : ' . $v1 ." x ".$v2 ." mm</div>",
            ),
        );
        $form['templates']['desciption']['brut'] = array(
            '#type' => 'item',
            '#markup' =>'<span style=" margin-right: 24px; ">'. t('brut') .' :</span><span class="infobul"><span class="datainfobul">'.t('infobrut').'</span></span>' .'<span class="datatemplate">'. $v1 ." x ".$v2 ." mm" .'</span>',
        );
        $form['templates']['desciption']['size'] = array(
            '#type' => 'item',
            '#markup' => '<span style=" margin-right: 24px; ">'. t('size') .' :</span><span class="infobul"><span class="datainfobul">'.t('infosize'). '</span></span>' .'<span class="datatemplate">'. $template->size .'</span>',
        );
        $form['templates']['desciption']['bleed'] = array(
            '#type' => 'item',
            '#markup' => '<span style=" margin-right: 24px; ">'. t('Bleed') . ' : </span><span class="infobul"><span class="datainfobul">'.t('infobleed'). '</span></span>' . '<span class="datatemplate">'.$template->bleed . '</span>',
        );
        $form['templates']['desciption']['color'] = array(
            '#type' => 'item',
            '#markup' => '<span style=" margin-right: 24px; ">'. t('Color') . ' :</span><span class="infobul"><span class="datainfobul">'.t('infocolor'). '</span></span>' . '<span class="datatemplate">'. $template->colorMode .'</span>',
        );
        $form['templates']['desciption']['resolution'] = array(
            '#type' => 'item',
            '#markup' => '<span style=" margin-right: 24px; ">'. t('Resolution') . ' :</span><span class="infobul"><span class="datainfobul">'.t('inforesolution'). '</span></span>' . '<span class="datatemplate">'. $template->resolution .'</span>',
        ); 
        global $language;
        $linkTemplate = '/'.$language->prefix.'/file/template_'.$template->id.'__'.$language->id.'.zip';
        $form['templates']['desciption']['linkToDownload'] = array(
            '#type' => 'item',
            '#markup'=> "<a class='linkToDownload' href='$linkTemplate'>".t('Download all design document')."</a>",
        );
      
//       $text = t("info for ".$productId);
//        $visible = "info for ".$productId;
//            if($text != $visible){
//                 $form['templates']['infotemplates'] = array(
//                         '#type' => 'container',
//                         '#attributes' => array('class' => array('infotemplates')),
//                 );
//
//                 $form['templates']['infotemplates']['resolution'] = array(
//                     '#type' => 'item',
//                     '#id'=> 'resolution',
//                     '#markup' => '<b style="color:#f60;">'.t('our tip').':</b> '. $text,
//
//                 );
//            }
          
    }
  }


  $form_state['storage']['upload'] = $upload;

  $form_state['cache'] = TRUE;
  return $form;
}

function pcdesigner_upload_form_submit($form, &$form_state) {//die('iiiii');
//  \printconnect\Designer\Upload\Factory::Confirm($form_state['storage']['upload']);
//  drupal_goto('<front>');
    return $form;
}
function ProdactHasTemplates($templateId, $item) {
    $apikey = variable_get('pc_apikey');
    $url = variable_get('pc_url');
  $url .= "design-template/check/1/templateId/$templateId/orderitemId/$item?apikey=$apikey&language=10";
    $response = file_get_contents($url);
    $response = json_decode($response, 1);
    if (isset($response['count']) && $response['count'] > 0) {
        return true;
    }
    return false;
}

<?php
use printconnect\Carts\Factory;
use printconnect\Shipping;
use \printconnect\Products;
use printconnect\Carts\Discounts;

function getFotolia($jobId) {
    $url = variable_get('pc_designtoolurl');
    $url .= '/rest/get-fotolia-images/j/' . $jobId;
    $responsecontents = file_get_contents($url);
    $response = json_decode($responsecontents, 1);
    if (isset($response['data']['Fotolia'])) {
        return $response['data']['Fotolia'];
    } else {
        return array();
    }
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
function getPreflight($jobId) {
    $url = variable_get('pc_designtoolurl');
    $url .= '/rest/getpreflightinfo?j=' . $jobId;
    $responsecontents = file_get_contents($url);
    $response = json_decode($responsecontents, 1);
    return $response;
}
function quickupload($jobId) {
    $url = variable_get('pc_designtoolurl');
    $url .= '/rest/getpreflightinfo?j=' . $jobId;
    $responsecontents = file_get_contents($url);
    $response = json_decode($responsecontents, 1);
    return $response;
}
function getArrayConfig($configs, $itemrequested) {
    if (isset($configs)) {
        foreach ($configs as $config) {
            $resolt[] = $config->$itemrequested;
        }
    }
    return $resolt;
}
function pccart_cart_form2($form, &$form_state) {    
    //drupal_add_js(array('pccart' => array('testvar' => "sqdfqsdfsdqfdqs",'ley' => "yeysy",)), array('type' => 'setting'));
    global $language;
    $cart = Factory::Current();
    $form_state['storage']['cart'] = $cart;
    $endarray = $cart != null ? end($cart->orderItems) : null;
    $jobs = $cart != null ? $cart->orderItems : array();
    if (null != $cart) {
        for ($i = count($cart->orderItems); $i > 0; $i--) {
            $job = $jobs[$i];
            if ($job->price > 0) {
                $endarray = $job;
            }
        }
    }

    if ($cart && 1 == $cart->supplementProduct && 43 == $endarray->price && 0 < $endarray->price) {
        $endarray = printconnect\Carts\Factory::GetItem($cart, $endarray->id);
        $endarray = printconnect\Carts\Factory::LoadItem($endarray);
        $endarray->pPrice = 10;
        printconnect\Carts\Factory::SaveItem($endarray);
    }

    $fotoliaPrice = 0;
    $preflightPrice = 0;
    if ($cart->preflightPrice) {
        $preflightPrice = $cart->preflightPrice;
    }
    $fotolia = array();
    $preflight = array();
    $preflightPrice = str_replace('.', ',', $preflightPrice);
    $jobsProupload = array();
    foreach ($cart->fotoliaItems as $fotoliaItem) {
        $fotoliaPrice = str_replace('.', ',', number_format($fotoliaItem->price));
        $fotolia[$fotoliaItem->parentId][$fotoliaItem->fotoliaId]['content'] = '<span>' . t('Image') . '&nbsp;"' . $fotoliaItem->fotoliaId . '"</span>';
        $fotolia[$fotoliaItem->parentId][$fotoliaItem->fotoliaId]['price'] = $fotoliaPrice;
    }

    foreach ($cart->preflightItems as $preflightItem) {
        $preflight[$preflightItem->parentId][] = $preflightItem->price;
    }

    if (!$cart || !$cart->isFilled) {
        $items = array();
        $emailDesigner = FALSE;
        
        $form['empty'] = array(
            '#type' => 'container',
            '#attributes' => array('class' => array('box')),
        );
        $form['empty']['text'][1] = array(
            '#type' => 'item',
            '#markup' => t('There are no products in your cart'),
        );

        $form['empty']['text'][2] = array(
            '#type' => 'item',
            '#markup' => l(t('Click here to continue shopping'), 'products'),
        );

        $form['products'] = array(
            '#type' => 'fieldset',
            '#title' => t('Top products'),
            '#attributes' => array('class' => array('products')),
        );

        $products = \printconnect\Products\Factory::GetTop();

        foreach ($products as $product) {
            $build = array();
            $build['image'] = array(
                '#theme' => 'image',
                '#path' => printconnect_getimage('products', $product->id),
                '#weight' => 10,
                '#prefix' => '<div class="blocprd"><a href="products/' . $product->id . '">',
            );
            $build['name'] = array(
                '#markup' => $product->name,
                '#prefix' => '<h2>',
                '#suffix' => '</h2></a></div>',
                '#weight' => 20,
            );
            $build['from'] = array(
                '#type' => 'container',
                '#attributes' => array('class' => array('from')),
                '#weight' => 40,
            );
            $build['from']['text'] = array(
                '#markup' => '<span class="txt">' . t('from_price') . '</span> ' . theme('price', array('value' => $product->sellPrice)),
            );
            $build['order'] = array(
                '#prefix' => '<a class="order btn-cmd" href="products/' . $product->id . '"><span class="flesh"></span>',
                '#suffix' => '</a>',
                '#weight' => 50,
            );
            $build['order']['text'] = array(
                '#markup' => t('Order now'),
            );
            $items[] = drupal_render($build);

            if (count($items) >= 6) {
                break;
            }
        }
        $form['products']['list'] = array(
            '#theme' => 'item_list',
            '#items' => $items,
        );
    } else {
        $form['cart'] = array(
            '#type' => 'container',
            '#title' => t('Shopping cart'),
            '#attributes' => array('class' => array('cart', 'clearfix')),
        );

        if ('printconcept' == variable_get('pc_flow', '')) {
            $form['cart']['#type'] = 'fieldset';
        }

        $form['cart']['items'] = array(
            '#type' => 'fieldset',
            '#attributes' => array('class' => array('items cartItemsContainer')),
            '#weight' => 0,
        );

        $checkableItems = array();
        $offerId = $cart->offer;
        $form['cart']['previousVat'] = array(
            '#markup' => '<div style="display:none;" id ="oldVat">' . $_SESSION['shop_vat'] . '</div>',
        );

        $listProductId = null;
        $totalPrice = null;
        $ProdactHasTemplates = false;
        $form['cart']['items']['hidden'] = array(
            '#prefix' => '<div id="hiddenPrices">',
            '#suffix' => '</div>',
        );
	foreach($cart->fotoliaItems as $fotoliaItem) {
	    $form['cart']['items']['hidden']['fotolia'][$fotoliaItem->parentId][$fotoliaItem->id] = array(
                '#type' => 'hidden', '#value' => $fotoliaItem->price,
		'#attributes' => array('class' => array('item-'.$fotoliaItem->parentId))
            );
	}
        foreach ($cart->productItems as $item) {
	    $productOptionsPrice = 0;
	    if (count($item->options) > 0) {
	        foreach($item->options as $option) {
		    $productOptionsPrice += $option->convertedPrice;
		}
	    }
	    $itemPrice = $item->price != null ? $item->price : $item->originPrice;
            $form['cart']['items']['hidden'][$item->id] = array(
                '#type' => 'hidden', '#value' => ($itemPrice+$productOptionsPrice)
            );

	    if ($item->fileCheck != null) {
		$form['cart']['items']['hidden']['filcheck'][$item->id] = array(
                    '#type' => 'hidden', '#value' => $item->fileCheck->price,
		    '#attributes' => array('class' => array('item-'.$item->id, 'clearfix', 'itemfile-'.$item->id))
                );
	    }
            if (isset($item->emailDesigner)) {
                $emailDesigner = $item->emailDesigner;
            }

            $weight = 100;
            $itemValue = $item->price;
            $configs = $item->configuration->config;

            $list = array();
            
            foreach ($configs as $config) {
                $items[] = $config->toolboxItemId;
            }
            $optionsDt = array();
            foreach ($item->options as $option) {
                $optionsDt[] = $option->option;
            }
            $firstConfig = array_shift($configs);

            foreach($configs as $config) {
                $list[] = '<label>' . $config->groupName . ':</label>  ' . $config->name;
            }

            if (count($item->options) > 0) {
                foreach ($item->options as $option) {
                    $itemValue += $option->price;
                    $list[] = $option->optionName;
                }
            }

            $product = Products\Factory::Get($item->configuration->productId);

            $templates = Products\Templates\Factory::GetTemplates($item->configuration->productId, $items);
            $template = $templates->items[0];
            $ProdactHasTemplates = ProdactHasTemplates($template->id, $item->id);
	    $fileExist = false;
            if (count($item->files)) {
		$form['cart']['items'][$item->id]['files'] = array(
                    '#type' => 'container',
                    '#attributes' => array('class' => array('item job', 'clearfix')),
                    '#weight' => $weight,
                );
                foreach ($item->files as $file) {
                    $form['cart']['items'][$item->id]['files']['file'] = array(
                        '#type' => 'container',
                        '#attributes' => array('class' => array('image')),
                    );

                    $key = $file->id;
                    $jobId = $file->designToolJobId;

                    $savedDesignId = NULL;

                    if (isset($_SESSION['savedDesigns'][$item->id])) {
                        $savedDesignId = $_SESSION['savedDesigns'][$item->id];
                    }
                    $form['cart']['items'][$item->id]['files']['file']['link'] = array(
                        '#weight' => 200,
                        '#theme' => 'designtoollink',
                        '#title' => $product->name . ' ' . $firstConfig->name,
                        '#content' => theme('pcfilesthumb', array('file' => $file->thumbnail, 'cache' => FALSE)),
                        '#html' => TRUE,
                        '#oi' => array(
                            'priceGroupId' => $item->productPriceGroupId,
                            'quantity' => $item->quantity,
                            'options' => $optionsDt,
                            'hasModel' => ($ProdactHasTemplates) ? 1 : 0
                        ),
                        '#params' => array(
                            'id' => $item->id,
                            'cartid' => $cart->id,
                            'hasModel' => ($ProdactHasTemplates) ? 1 : 0
                        ),
                        '#callback' => 'cart/callback/',
                        '#versioning' => TRUE,
                        '#jobId' => $jobId,
                        '#savedDesignId' => $savedDesignId,
                        '#attributes' => array('class' => array('designtool', 'iframe', 'display-block')),
                    );

                    $form['cart']['items'][$item->id]['files']['description'] = array(
                        '#prefix' => '<div class="preview1">',
                        '#suffix' => '</div>',
                        '#type' => 'container',
                        '#attributes' => array('class' => array('description')),
                    );
                    $weight--;
                    $form['cart']['items'][$item->id]['files']['description']['title'] = array(
                        '#prefix' => '<h3>',
                        '#suffix' => '</h3>',
                        '#markup' => $item->quantity . ' ' . t('pcs.') . ' ' . $product->name . ' ' . $firstConfig->name,
                    );

                    if ($itemValue < $item->originPrice) {
                        $promoPrice = '<del>&euro; ' . $item->originPrice . '</del>';
                        $form['cart']['items'][$item->id]['files']['description']['promoPrice'] = array(
                            '#prefix' => '<div class="origin-price">',
                            '#suffix' => '</div>',
                            '#markup' => $promoPrice,
                        );
                    }
                    $form['cart']['items'][$item->id]['files']['description']['price'] = array(
                        '#theme' => 'price',
                        '#value' => $itemValue,
                    );

                    $form['cart']['items'][$item->id]['files']['description']['list'] = array(
                        '#theme' => 'item_list',
                        '#items' => $list,
                    );  
                    $form['cart']['items'][$item->id]['files']['description']['refJob'] = array(
                        '#type' => 'textfield',
                        '#title' => t('Give a reference to this product'),
                        '#maxlength' => 25,
                        '#size' => 20,
                        '#default_value' => $item ? $item->refJob : '',
                        '#attributes' => array('class' => array('hint', 'form-text', 'refjobTxt'), 'orderItem' => $item->id),
                        '#prefix' => '<div class="refJob-code">',
                        '#suffix' => '</div>'
                    );
                    $totalPrice += $item->originPrice;
                    $listProductId .= $item->configuration->productId . ',';
                    
                    $form['cart']['items'][$item->id]['files']['preview'] = array(
                        '#prefix' => '<div class="btns-box"><div class="preview">',
                        '#suffix' => '</div>',
                        '#markup' => l(t('Prévisualiser'), pcdesigntool_preview_url($jobId), array('attributes' => array('target' => 'blank', 'class' => array('previewlink')))),
                    );


                    $myfiles = $item->files[0];
                    $themequickupload = 'designtoollink';
                    if ($myfiles->viaProUpload == 1) {
                        $themequickupload = 'designtoolproflink';
                    }

                    $form['cart']['items'][$item->id]['files']['proflink'] = array(
                        '#prefix' => '<div class="preview">',
                        '#suffix' => '</div>',
                        '#theme' => $themequickupload,
                        '#templateId' => $template->id,
                        '#title' => $product->name . ' ' . $firstConfig->name,
                        '#params' => array(
                            'id' => $item->id,
                            'vs' => 1,
                            'shop_apikey' => variable_get('pc_apikey'),
                            'cartid' => $cart->id,
                            'j' => $myfiles->designToolJobId,
                            'currencyPreflight' => '€',
                            'pricePreflight' => $preflightPrice,
                        ),
                        '#attributes' => array('class' => array('designtool', 'iframe', 'reupload')),
                    );

                    $form['cart']['items'][$item->id]['files']['remove'] = array(
                        '#prefix' => '<div class="preview">',
                        '#suffix' => '</div></div>',
                        '#type' => 'submit',
                        '#value' => t('Delete'),
                        '#name' => 'delete_item_' . $item->id,
                        '#has_garbage_value' => FALSE,
                        '#attributes' => array('class' => array('delete_item', 'deletedesign'), 'itemFileId' => $item->id),
                    );

                    // Controle professionnelle files
                    if ($item->fileCheck) {
                        $form['cart']['items'][$item->id]['files']['control'] = array(
                            '#type' => 'container',
                            '#attributes' => array('class' => array('control-block')),
                        );
                        $form['cart']['items'][$item->id]['files']['control']['text'] = array(
                            '#prefix' => '<div class="text">',
                            '#suffix' => '</div>',
                            '#markup' => '<h3>' . t('Control professional') . ' ' . $item->quantity . ' ' . t('pcs.') . ' ' . $product->name . ' ' . $firstConfig->name . '</h3><span class="price"><span class="value">&nbsp;<span class="whole">4</span><span class="decimalpoint">,</span><span class="decimals">99</span><span class="currency">€</span></span></span>',
                        );


                        $form['cart']['items'][$item->id]['files']['control']['control_prof'] = array(
                            '#type' => 'link',
                            '#title' => '',
                            '#attributes' => array('class' => array('removecontrol', 'noreplace'), 'rel' => $item->id),
                            '#href' => '#'
                        );
                    }
                }
		$fileExist = true;
            }
		$classToAdd = ($fileExist) ? 'hideContainer' : '';
	        $form['cart']['items'][$item->id]['ready'] = array(
                    '#type' => 'container',
                    '#attributes' => array('class' => array('item-hide-'.$item->id.' item job '.$classToAdd, 'clearfix')),
                    '#weight' => $weight,
                );
                $form['cart']['items'][$item->id]['ready']['description'] = array(
                    '#prefix' => '<div class="preview2">',
                    '#suffix' => '</div>',
                    '#type' => 'container',
                    '#attributes' => array('class' => array('description')),
                );

                $form['cart']['items'][$item->id]['ready']['description']['title'] = array(
                    '#prefix' => '<h3>',
                    '#suffix' => '</h3>',
                    '#markup' => $item->quantity . ' ' . t('pcs.') . ' ' . $product->name . ' ' . $firstConfig->name,
                );

                if ($itemValue < $item->originPrice) {
                    $promoPrice = '<del>&euro; ' . $item->originPrice . '</del>';
                    $form['cart']['items'][$item->id]['ready']['description']['promoPrice'] = array(
                        '#prefix' => '<div class="origin-price">',
                        '#suffix' => '</div>',
                        '#markup' => $promoPrice,
                    );
                }
                $form['cart']['items'][$item->id]['ready']['description']['price'] = array(
                    '#theme' => 'price',
                    '#value' => $itemValue,
                );

                $form['cart']['items'][$item->id]['ready']['description']['list'] = array(
                    '#theme' => 'item_list',
                    '#items' => $list,
                );

                $totalPrice += $item->originPrice;
                $listProductId .= $item->configuration->productId . ',';

                if (count($templates->items)) {
                    $_SESSION['cart']['items'][$item->id]['ready']['template'] = $template->id;
                    if ($ProdactHasTemplates) {
                        $form['cart']['items'][$item->id]['ready']['product-container'] = array(
                            '#prefix' => '<div class="prodactTemplates">',
                            '#suffix' => '</div>',
                        );
                    } else {
                        $form['cart']['items'][$item->id]['ready']['product-container'] = array(
                            '#prefix' => '<div class="prodactTemplates"><div class="prodactHasTemplates">',
                            '#suffix' => '</div></div>',

                        );
                    }

                    $form['cart']['items'][$item->id]['ready']['product-container']['product-items'] = array(
                        '#markup' => '<h2 class="title-chose">' . t('choisissez une optios de mise-en-page') . '</h2>',
                    );


                    $form['cart']['items'][$item->id]['ready']['product-container']['proflink'] = array(
                        '#prefix' => '<div class="poll-form first">',
                        '#suffix' => '<p class="txto">' . t('télécharger vos fichiers') . '</p></div> ',
                        '#content' => array('#markup' => '<div class="text">' . t("j'ai déjà mon lay-out") . '</div>',),
                        '#theme' => 'designtoolproflink',
                        '#templateId' => $template->id,
                        '#title' => $product->name . ' ' . $firstConfig->name,
                        '#params' => array(
                            'id' => $item->id,
                            'cartid' => $cart->id,
                            'currencyPreflight' => '€',
                            'pricePreflight' => $preflightPrice,
                            'hasModel' => ($ProdactHasTemplates) ? 1 : 0
                        ),
                        '#attributes' => array('class' => array('designtool', 'iframe')),
                    );

                    $form['cart']['items'][$item->id]['ready']['product-container']['upload']['link'] = array(
                        '#prefix' => '<div class="poll-form ">',
                        '#suffix' => '<p class="txto">' . t('utilisez le designtool') . '</p></div> ',
                        '#theme' => 'designtoollink',
                        '#content' => array('#markup' => '<div class="text">' . t('je crée en ligne') . '</div>',),
                        '#templateId' => $template->id,
                        '#title' => $product->name . ' ' . $firstConfig->name,
                        '#html' => true,
                        '#oi' => array(
                            'priceGroupId' => $item->productPriceGroupId,
                            'quantity' => $item->quantity,
                            'options' => $optionsDt,
                            'hasModel' => ($ProdactHasTemplates) ? 1 : 0
                        ),
                        '#params' => array(
                            'id' => $item->id,
                            'cartid' => $cart->id,
                            'shop_apikey' => variable_get('pc_apikey'),
                            'hasModel' => ($ProdactHasTemplates) ? 1 : 0
                        ),
                        '#callback' => 'cart/callback/',
                        '#versioning' => TRUE,
                        '#attributes' => array('class' => array('upload', 'designtool', 'iframe')),
                    );
                    if ($ProdactHasTemplates) {
                        $form['cart']['items'][$item->id]['ready']['product-container']['modele'] = array(
                            '#prefix' => '<div class="poll-form">',
                            '#suffix' => '<p class="txto">' . t('choisissez parmis 6000 créas') . '</p></div>',
                            '#theme' => 'designtoolModele',
                            '#content' => array('#markup' => '<div class="text">' . t("j'utilise un modèle") . '</div>',),
                            '#templateId' => $template->id,
                            '#title' => $product->name . ' ' . $firstConfig->name,
                            '#html' => true,
                            '#oi' => array(
                                'priceGroupId' => $item->productPriceGroupId,
                                'quantity' => $item->quantity,
                                'options' => $optionsDt,
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
                            '#attributes' => array('class' => array('upload', 'designtool', 'iframe')),
                        );
                    }

                    $checkableItems[] = $item->id;
            }
            if (null == $offerId) {
                $form['cart']['items'][$item->id]['files']['description']['actions'] = array(
                    '#type' => 'container',
                    '#attributes' => array('class' => array('clearfix')),
                );

                $form['cart']['items'][$item->id]['files']['description']['actions']['remove'] = array(
                    '#markup' => '<span class="removecart"></span>',
                    '#prefix' => '<div class="items_actions"><div class="itemID" style=" display: none">' . $item->id . '</div>',
                    '#suffix' => '</div>',
                );

		$form['cart']['items'][$item->id]['ready']['description']['actions'] = array(
                    '#type' => 'container',
                    '#attributes' => array('class' => array('clearfix')),
                );

                $form['cart']['items'][$item->id]['ready']['description']['actions']['remove'] = array(
                    '#markup' => '<span class="removecart"></span>',
                    '#prefix' => '<div class="items_actions"><div class="itemID" style=" display: none">' . $item->id . '</div>',
                    '#suffix' => '</div>',
                );
            }
        }
        if (!empty($fotolia)) {
            $form['cart']['fotolias'] = array(
                '#type' => 'fieldset',
                '#attributes' => array('class' => array('file-check', 'clearfix')),
                '#title' => t('FOTOLIA'),
                '#weight' => 70,
            );

            foreach ($fotolia as $parentId => $fotoliaItem) {
                foreach ($fotoliaItem as $fKey => $fItem) {
                    $form['cart']['fotolias']['items'][$fKey]['fotolia'] = array(
                        'description' => array(
                            '#prefix' => '<div style="clear: both;"><div class="fotolia-items fotolia-items-'.$parentId.'">',
                            '#suffix' => '</div>',
                            '#markup' => $fItem['content'],
                        ),
                        'price' => array(
                            '#theme' => 'price',
                            '#value' => intval($fItem['price']),
                            '#attributes' => array('class' => array('pricepreflight')),
                            '#suffix' => '</div>',
                        ),
                    );
                }
            }
        }
        $orderItemsAdditional = $cart->orderItemsAdditional;
        if (count($orderItemsAdditional)) {
            $addcontainer = true;
            foreach ($orderItemsAdditional as $item) {
                if ($item->description == 'Preflight') {
                    $addcontainer = false;
                }
            }
            if ($addcontainer) {
                $form['cart']['additionalItems'] = array(
                    '#type' => 'container',
                    '#attributes' => array('class' => array('additionalItems')),
                );
            }
            foreach ($orderItemsAdditional as $item) {
                if ($item->description != 'Preflight') {
                    $form['cart']['additionalItems'][$item->id]['items'][$item->id] = array(
                        'description' => array(
                            '#prefix' => '<span>',
                            '#suffix' => '</span>',
                            '#markup' => $item->description
                        ),
                        'price' => array(
                            '#theme' => 'price',
                            '#value' => $item->price,
                        ),
                    );
                }
            }
        }
        /* Discount */
        $form['cart']['js'] = array(
            '#weight' => 50,
            '#title' => t('Discounts'),
            '#prefix' => '<div class ="lodediscounts">',
            '#suffix' => '</div>',
        );
        unset($_SESSION['discountId']);
        foreach($cart->discountItems as $item){
            $form['cart']['items']['hidden'][$item->discountId] = array(
                '#type' => 'hidden', 
                '#value' => $item->price,
                '#attributes' => array(
                    'id' => 'discount-hidden-' . strtolower($item->discountId),
                    'class' => 'hidden-discount',
                    'discount-code' => $item->discountId,
                )
            );
            $form['cart']['discounts'][$item->discountId] = array(
                '#type' => 'container',
            );

            $form['cart']['discounts'][$item->discountId]['prefix'] = array(
                '#type' => 'container',
                '#attributes' => array('class' => array('prefix')),
                'content' => array(
                    '#markup' => t('Promo'),
                )
            );

            $form['cart']['discounts'][$item->discountId]['description'] = array(
                '#type' => 'container',
                '#attributes' => array('class' => array('description')),
            );
            unset($_SESSION['discountId']);
            foreach($cart->discountItems as $item){
                $form['cart']['items']['hidden'][$item->discountId] = array(
                    '#type' => 'hidden', '#value' => $item->price,
                );
                $form['cart']['discounts'][$item->discountId] = array(
                    '#type' => 'container',
                );

                $form['cart']['discounts'][$item->discountId]['prefix'] = array(
                    '#type' => 'container',
                    'content' => array('#markup' => t('You are using') . ': <span id="discountCodeVal">' . $item->discountId . '</span>'),
                    'description' => array(
                    '#type' => 'container',
                    '#attributes' => array('class' => array('description')),
                    ));

                $form['cart']['discounts'][$item->discountId]['description']['items'] = array(
                    'price' => array(
                        '#theme' => 'price',
                        '#value' => $item->price,
                        '#attributes' => array('class' => array('styleprice')),
                    ),
                    'code' => array(
                        '#type' => 'container',
                        'content' => array('#markup' => t('You are using') . ': ' . $item->discountId),

                    ),
                    'description' => array(
                        '#type' => 'container',
                        'content' => array('#markup' => $item->productName),
                    ),
                );
                $_SESSION['discountId'][] = $item->discountId;
            }
        }
        /* end discount */

        $options = array();
        $types = Shipping\Types\Factory::GetAll();

        $enabledTypes = array();

        $form['cart']['discount'] = array(
            '#type' => 'fieldset',
            '#title' => t('Discount'),
            '#attributes' => array('class' => array('discount')),
            '#weight' => 10,
        );

        $form['cart']['discount']['text'] = array(
            '#type' => 'item',
            '#markup' => t('Heb je een promocode, voucher of cadeaubon gekregen? Vul hem dan hier in!'),
        );

        $form['cart']['discount']['code'] = array(
            '#type' => 'textfield',
            '#size' => 10,
            '#attributes' => array('class' => array('hint', 'form-item-discount-code')),
        );

        $form['cart']['discount']['add'] = array(
            '#type' => 'button',
            '#name' => 'add_discount',
            '#value' => t('Apply'),
            '#attributes' => array('class' => array('large', 'add-discount', 'ok', 'button')),
        );
        $form['cart']['new'] = array(
        '#type' => 'hidden',
        '#prefix' => '<div id="discount_submit_div">',
        '#suffix' => '</div>',
          );
        $form['cart']['shipping'] = array(
            '#type' => 'fieldset',
            '#title' => t('Shipment'),
            '#attributes' => array('class' => array('shipping', 'clearfix')),
            '#weight' => 80,
        );

        $form_state['storage']['shipping']['types'] = $types;
       
        foreach ($types as $type) {
            if ($type->shippingType->deliveryType != 'deliveryTypePostal' && ($type->shippingType->deliveryType != 'deliveryTypePickup' || variable_get('pcpickuppoints_enabled', true) )) {
                $enabledTypes[] = $type;
            }
        }
        foreach ($enabledTypes as $type) {
            $label = $type->shippingType->tag;
            if ($type->price > 0) {
                $label .= '(' . t('!value exc. VAT', array('!value' => theme('price', array('value' => $type->price, 'free' => TRUE)))) . ' / ' . t('!value inc. VAT', array('!value' => theme('price', array('value' => $type->price * (1 + $_SESSION['shop_vat']), 'free' => TRUE)))) . ') *';
            }        
            $options[$type->id] = array(
                'label' => '<span >' . $label . '</span>',
                'delivery' => $type->estimatedDeliveryTime,
            );
            $options[$type->id]['price'] = theme('price', array('value' => $type->price, 'free' => TRUE));
        }
        $shop = printconnect\Shop\Configuration\Factory::Current();

      

        if (58 != $shop->id) {
            $options[84]['label'] = "<span>" . t('Livraison 48H') . "</span>"; // set Livraison 48H for cobradad.
        }
        $_SESSION['defaultindex'] = isset($_SESSION['defaultindex']) ? $_SESSION['defaultindex'] : 86;

        $cart->shipping_type = $_SESSION['defaultindex'];

        $form['cart']['shipping']['type'] = array(
            '#type' => 'tableselect',
            '#multiple' => FALSE,
            '#options' => $options,
            '#header' => array('label' => ''),
            '#default_value' => $_SESSION['defaultindex'],
            '#sticky' => FALSE,
            '#attributes' => array('class' => array('grid targetPrice')),
            '#weight' => -50,
        );

        if ('flyer' == variable_get('pc_flow', '')) {
            $form['cart']['shipping']['type']['#header']['price'] = '';
        }

        $form['cart']['reference'] = array(
            '#type' => 'fieldset',
            '#title' => t('Reference'),
            '#attributes' => array('class' => array('discount', 'ref')),
            '#weight' => 90,
        );

        $form['cart']['reference']['text'] = array(
            '#type' => 'item',
            '#markup' => t('Need a reference on your invoice?'),
        );
        $form['cart']['reference']['input'] = array(
            '#type' => 'textfield',
            '#default_value' => $cart ? $cart->customer_reference : '',
            '#size' => 30,
	    '#attributes' => array('class' => array('refCustomer'), 'cart' => $cart->id),
        );

        $form['cart']['priceblock'] = array(
            '#theme' => 'priceblock',
            '#id' => 'priceblock',
            '#prefix' => '<div id="priceblock-wrapper">',
            '#suffix' => '</div>',
            '#subtotal' => $cart->subTotalAmount,
            '#vatAmount' => $cart->vatAmount,
            '#weight' => 100,
        );

        
        $form['actions'] = array(
            '#type' => 'container',
            '#attributes' => array('class' => array('actions', 'form-actions', 'clearfix')),
        );

   
      
        $form['actions']['price'] = array(
            '#id' => 'price',
            '#theme' => 'price',
            '#value' => $cart->totalAmount,
            '#attributes' => array('id' => 'price'),
            '#title' => t('Total incl. VAT'),
        );

        $form['link'] = array(
            '#markup' => l(t('Continue shopping'), 'products', array('attributes' => array('class' => array('continue')))),
        );

        if ($cart && $cart->isFilled) {
            $form['actions']['checkout'] = array(
                '#prefix' => '<div class="button-wrapper">',
                '#suffix' => '</div>',
                '#type' => 'submit',
                '#value' => t('Secure payment'),
                '#weight' => 100,
                '#validate' => array('pccart_cart_form2_validate'),
                '#submit' => array('pccart_cart_form2_submit'),
                '#attributes' => array('class' => array('action', 'large', 'payment', 'button')),
            );
        }

        global $user;
        if ($user->uid){
            $params = new stdClass();
            if ($cart->discountItems){
                foreach ($cart->discountItems as $item) {
                    $params->codes[] = $item->discountId;
                }
            }

            foreach ($cart->productItems as $item) {
                $object = new stdClass();
                $object->productPriceGroupId = $item->productPriceGroupId;
                $object->quantity = $item->quantity;
                $object->vat = $item->vat;
                $params->items[] = $object;

            }

            $url = url('cart/add/' . json_encode($params), array('absolute' => TRUE));
            $form['linkcart'] = array(
                '#type' => 'item',
                '#title' => t('Directlink '),
                '#markup' => l($url, $url),
            );
        }

        $form['isFilled'] = array('#value' => $cart->isFilled);

        $form['trackingVenteCart'] = array('#markup' => '<script type="text/javascript" src="http://img.metaffiliation.com/u/15/p44459.js?zone=panier&montant=' . $totalPrice . '&listeids=' . $listProductId . '"></script>',);

        $form['link'] = array(
            '#type' => 'item',
            '#markup' => '<div class="rteright"><a href="nos-produits">Continuer vos achats</a></div>',
        );
    }

    $form_state['storage']['cart'] = $cart;
    $form_state['cache'] = FALSE;
    $form['#cache'] = FALSE;
    $form['#tree'] = TRUE;
    $form['#id'] = 'pccart-cart-form';
   /* Start bloc TOP produits */

    $form['products'] = array(
        '#type' => 'fieldset',
        '#title' => t('Top products'),
        '#attributes' => array('class' => array('products')),
    );

    $items = array();
    $products = \printconnect\Products\Factory::GetTop();
    foreach ($products as $product) {
        $build = array();
        $build['image'] = array(
            '#theme' => 'image',
            '#path' => printconnect_getimage('products', $product->id),
            '#attributes' => array('width' => '194', 'height' => '187'),
            '#weight' => 10,
            '#prefix' => '<div class="blocprd"><a href="products/' . $product->id . '">',
        );
        $build['name'] = array(
            '#markup' => $product->name,
            '#prefix' => '<h2>',
            '#suffix' => '</h2></a></div>',
            '#weight' => 20,
        );

        $build['from'] = array(
            '#type' => 'container',
            '#attributes' => array('class' => array('from')),
            '#weight' => 40,
        );
        $build['from']['text'] = array(
            '#markup' => '<span class="txt">' . t('from_price') . '</span> ' . theme('price', array('value' => $product->sellPrice)),
        );
        $build['order'] = array(
            '#prefix' => '<a class="order btn-cmd" href="products/' . $product->id . '"><span class="flesh"></span>',
            '#suffix' => '</a>',
            '#weight' => 50,
        );
        $build['order']['text'] = array(
            '#markup' => t('Order now'),
        );
        $items[] = drupal_render($build);

        if (count($items) >= 6) {
            break;
        }
    }

    $form['products']['list'] = array(
        '#theme' => 'item_list',
        '#items' => $items,
    );
    /* END bloc TOP produits */
    
    /* Control order have Designer */
    
//    $validate = $form['actions']['checkout']['#validate'];
//    array_unshift($validate, 'pcdesigner_form_validate');
//    $form['actions']['checkout']['#validate'] = $validate;

    $submit = $form['actions']['checkout']['#submit'];
    array_unshift($submit, 'pcdesigner_form_submit');
    $form['actions']['checkout']['#submit'] = $submit;
    return $form;
}

function pccart_cart_form2_delete_creat_submit($form, &$form_state) {
    $id = $form_state['triggering_element']['#parents'][2];
    try {
        Factory::DeleteItemFile($id);
    } catch (\printconnect\Rest\Exceptions\Exception $ex) {
        
    }
}
function pccart_cart_form2_delete_discount_submit($form, &$form_state) {
    $cart = Factory::Current();
    $discountId = $form_state['triggering_element']['#parents'][2];
    Discounts\Factory::Delete($cart->id, $discountId);
}

function pccart_cart_form2_validate($form, &$form_state){

    $cart = Factory::Current();
    if (!$cart) {
        form_set_error('', t('No cart or empty'));
    }
   unset($form_state['values']['cart']['items']['hidden']);
   foreach ($cart->productItems as $item) {
        if (!$form_state['values']['cart']['items'][$item->id]["ready"]['designer']['check']) {
            if (!count($item->files)) {
                form_set_error('', t('Please upload a file for all your items'));
            }
        }
    }

    $form_state['storage']['cart'] =  $cart; 
}

function pccart_cart_form2_submit($form, &$form_state){
     $_SESSION['shippingtypeID'] = $form_state['values']['cart']['shipping']['type'];
     drupal_goto('checkout'); 
}

<?php

use printconnect\Carts\Factory;
use printconnect\Shipping;
use printconnect\Drupal\Forms;
use printconnect\Drupal\Functions;
use printconnect\Products\Options;
use printconnect\Products\Configurations;
use \printconnect\Products\Toolbox;
use \printconnect\Products\PriceGroups;
use \printconnect\Products\Pricing;
use \printconnect\Products;
use printconnect\Customers\Factory as CustomersFactory;
use printconnect\Carts\Discounts;

function pccart_cart_form2($form, &$form_state) {
    global $language;
    $cart = Factory::Current(FALSE);
    $endarray = end($cart->orderItems);

    if($cart->supplementProduct == 1 || $endarray->price == 43){
        $endarray = printconnect\Carts\Factory::GetItem($cart, $endarray->id);
        $endarray = printconnect\Carts\Factory::LoadItem($endarray);
        $endarray->price = 10;
        printconnect\Carts\Factory::SaveItem($endarray);   
    }

    $cart = Factory::Current(FALSE);
    $discounts = FALSE;
    $items = array();
    $emailDesigner = FALSE;

    if (!$cart || !$cart->isFilled) {
 
        
        
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

        $items = array();
        $products = \printconnect\Products\Factory::GetTop();

        foreach ($products as $product) {
            $build = array();

            $build['image'] = array(
                '#theme' => 'image',
                '#path' => printconnect_getimage('products', $product->id),
            );
            $build['name'] = array(
                '#type' => 'container',
                '#attributes' => array('class' => array('text')),
                'content' => array(
                    '#markup' => $product->name,
                ),
            );

            $items[] = array(
                'data' => l(drupal_render($build), 'products/' . $product->id, array('html' => true, 'title' => $product->name)),
            );

            if (count($items) >= 6) {
                break;
            }
        }

        $form['products']['list'] = array(
            '#theme' => 'item_list',
            '#items' => $items,
        );
    } else {
        
       $form['popup_overlay'] = array(
            '#prefix' => '<div id="popup_overlay" class="popin_overlay"><div id="lean_info"><div class="headpopin"><span class="closeme"></span>
			<span>Profitez de notre offre exclusive !</span></div>',
             '#suffix' => '</div><div id="lean_overlay"></div></div>',
        );
         $form['popup_overlay']['cont'] = array(
'#prefix' => '<div class="containerbg">',
             '#suffix' => '</div>',
        );
         
         
        $form['popup_overlay']['cont']['info'] = array(
            '#type' => 'item',
            '#markup' => '<p><span class="icone"></span>
 	    <strong>Rajoutez</strong> <span class="priceing">10 €</span> à votre commande
		et recevez <span class="priceing">250 </span><strong>cartes de visite.</strong>
		La créa vous est offerte*</p>',
        );
        
        $form['popup_overlay']['cont']['ok'] = array(
            '#type' => 'submit',
            '#submit' => array('pccart_cart_form2_popup_overlay_ok_submit'),
            '#value' => t('ok'),
            
        );
        $form['popup_overlay']['cont']['no'] = array(
            '#type' => 'submit',
            '#value' => t('no'),
            '#submit' => array('pccart_cart_form2_submit'),
            '#attributes' => array('class' => array('cancel')),
        );
       $form['popup_overlay']['cont']['test'] = array('#markup' => ' <ul>
 		<li class="coloriz">*Validité de l’offre</li>
		<li>• Offre valable du 1er au 07 Septembre 2014.</li>
		<li>* Carte de visite premium - papier 400 g maco mat</li>
		<li>* Créa gratuite disponible dans la rubrique “Nos modèles”.</li>
	</ul>', );

        
        $form['cart'] = array(
            '#type' => 'container',
            '#title' => t('Shopping cart'),
            '#attributes' => array('class' => array('cart', 'clearfix')),
        );

        if (variable_get('pc_flow', '') == 'printconcept') {
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
            '#markup' =>'<div style="display:none;" id ="oldVat">'.$_SESSION['shop_vat'].'</div>',
        );
       
        foreach ($cart->productItems as $item) {

            
            if (isset($item->emailDesigner)) {
                $emailDesigner = $item->emailDesigner;
            }
            $weight = 100;
            $itemValue = $item->price;
            $configs = $item->configuration->config;

            $list = array();
            $items = array();
            foreach ($configs as $config) {
                $items[] = $config->toolboxItemId;
            }
            $options = array();
            foreach ($item->options as $option) {
                $options[] = $option->option;
            }

            $firstConfig = array_shift($configs);

            foreach ($configs as $config) {
                $list[] = '<label>' . $config->groupName . ':</label>  ' . $config->name;
            }

            if (count($item->options) > 0) {
                $children = array();
                foreach ($item->options as $option) {
                    $itemValue += $option->price;
                    $list[] = $option->optionName;
                }
            }

            $product = Products\Factory::Get($item->configuration->productId);

            $form['cart']['items'][$item->id] = array(
                '#type' => 'container',
                '#attributes' => array('class' => array('item', 'clearfix')),
                '#weight' => $weight,
            );

            $weight--;

            $form['cart']['items'][$item->id]['description'] = array(
                '#type' => 'container',
                '#attributes' => array('class' => array('description')),
            );

            $form['cart']['items'][$item->id]['description']['title'] = array(
                '#prefix' => '<h3>',
                '#suffix' => '</h3>',
                '#markup' => $item->quantity . ' ' . t('pcs.') . ' ' . $product->name . ' ' . $firstConfig->name,
                );

            if($itemValue < $item->originPrice){
                $promoPrice = '<del>&euro; '.$item->originPrice.'</del>';
                $form['cart']['items'][$item->id]['description']['promoPrice'] = array(
                '#prefix' => '<div class="origin-price">',
                '#suffix' => '</div>',
                '#markup' => $promoPrice,
                );
            }
            $form['cart']['items'][$item->id]['description']['price'] = array(
                '#theme' => 'price',
                '#value' => $itemValue,
            );

            $form['cart']['items'][$item->id]['description']['list'] = array(
                '#theme' => 'item_list',
                '#items' => $list,
            );

            $shop = \printconnect\Shop\Configuration\Factory::Current();
            \printconnect\Shop\Configuration\Factory::LoadConfiguration($shop);
            
            /* Code for  6% TVA */
           /* if ($shop->id == 35) {

                $form['cart']['items'][$item->id]['description']['tva'] = array(
                  '#type' => 'container',
                  '#attributes' => array('class' => array('tva', 'clearfix')),
                  );

                
                $form['cart']['items'][$item->id]['description']['tva']['case'] = array(
                  '#type' => 'checkbox',
                  '#title' => t('TVA Exception 6%'), 
                  '#attributes' => array('class' => array('tvaCase'), 'data-element' => $item->id),
                );
                
                if ((float)$item->vat == 0.06) {
                    $form['cart']['items'][$item->id]['description']['tva']['case']['#default_value'] = TRUE;
                }
                

                $form['cart']['items'][$item->id]['description']['tva']['block'] = array(             
                  '#markup' =>'<div class="block"></div>',
                  '#attributes' => array('class' => array('tvablock', 'clearfix')),
                );

            }*/
            if (count($item->files)) {
                foreach ($item->files as $file) {
                    $form['cart']['items'][$item->id]['file'] = array(
                        '#type' => 'container',
                        '#attributes' => array('class' => array('image')),
                    );

                    $key = $file->id;
                    $jobId = $file->designToolJobId;

                    $savedDesignId = NULL;

                    if (isset($_SESSION['savedDesigns'][$item->id])) {
                        $savedDesignId = $_SESSION['savedDesigns'][$item->id];
                    }

                    $form['cart']['items'][$item->id]['file']['link'] = array(
                        '#theme' => 'designtoollink',
                        '#title' => $product->name . ' ' . $firstConfig->name,
                        '#content' => theme('pcfilesthumb', array('file' => $file->thumbnail, 'cache' => FALSE)),
                        '#html' => TRUE,
                        '#oi' => array(
                            'priceGroupId' => $item->productPriceGroupId,
                            'quantity' => $item->quantity,
                            'options' => $options,
                        ),
                        '#params' => array(
                            'id' => $item->id,
                            'cartid' => $cart->id,
                        ),
                        '#callback' => 'cart/callback/',
                        '#versioning' => TRUE,
                        '#jobId' => $jobId,
                        '#params' => array(
                            'id' => $item->id,
                            'cartid' => $cart->id,
                        ),
                        '#savedDesignId' => $savedDesignId,
                        '#attributes' => array('class' => array('designtool', 'iframe', 'display-block')),
                    );

                    $form['cart']['items'][$item->id]['file']['preview'] = array(
                        '#prefix' => '<div>',
                        '#suffix' => '</div>',
                        '#markup' => l(t('Download preview'), pcdesigntool_preview_url($jobId), array('attributes' => array('target' => 'blank', 'class' => array('clearfix')))),
                    );
                }
            } else {
                $templates = Products\Templates\Factory::GetTemplates($item->configuration->productId, $items);


                if (count($templates->items)) {
                    $template = $templates->items[0];

                    $_SESSION['cart']['items'][$item->id]['template'] = $template->id;

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

                    $form['cart']['items'][$item->id]['upload']['link'] = array(
                        '#theme' => 'designtoollink',
                        '#templateId' => $template->id,
                        '#title' => $product->name . ' ' . $firstConfig->name,
                        '#content' => drupal_render($uploadBox),
                        '#html' => true,
                        '#oi' => array(
                            'priceGroupId' => $item->productPriceGroupId,
                            'quantity' => $item->quantity,
                            'options' => $options,
                        ),
                        '#params' => array(
                            'id' => $item->id,
                            'cartid' => $cart->id,
                        ),
                        '#callback' => 'cart/callback/',
                        '#versioning' => TRUE,
                        '#attributes' => array('class' => array('upload', 'designtool', 'iframe')),
                    );

                    $form['cart']['items'][$item->id]['proflink'] = array(
                        '#theme' => 'designtoolproflink',
                        '#templateId' => $template->id,
                        '#title' => $product->name . ' ' . $firstConfig->name,
                        '#params' => array(
                            'id' => $item->id,
                            'cartid' => $cart->id,
                        ),
                        '#attributes' => array('class' => array('proupload', 'designtool', 'iframe')),
                    );

                    $checkableItems[] = $item->id;
                }
            }
            if ($offerId === null) {
                $form['cart']['items'][$item->id]['description']['actions'] = array(
                    '#type' => 'container',
                    '#attributes' => array('class' => array('clearfix')),
                );

                $form['cart']['items'][$item->id]['description']['actions']['remove'] = array(
                    '#type' => 'submit',
                    '#src' => drupal_get_path('module', 'pccart') . '/images/delete.png',
                    '#name' => 'delete_item_' . $item->id,
                    '#value' => t('Delete'),
                    '#attributes' => array('class' => array('remove', 'noreplace')),
                    '#validate' => array('pccart_cart_form2_delete_item_validate'),
                    '#submit' => array('pccart_cart_form2_delete_item_submit'),
                    '#has_garbage_value' => FALSE,
                );
                $form['cart']['items'][$item->id]['description']['actions']['imageEdit']= array(
                  '#type' =>'container'
                );
                $form['cart']['items'][$item->id]['description']['actions']['imageEdit']['editIcon'] = array(
                    '#markup' => '<span class="editIcon"></span>'
                );

                $form['cart']['items'][$item->id]['description']['actions']['imageEdit']['edit'] = array(
                    '#markup' => l(t('Edit this product'), 'products/' . $item->configuration->productId . '/' . implode(',', $items) . '/' . implode(',', $options) . '/' . $item->quantity . '/' . $item->id . '/', array('attributes' => array('class' => array('edit')))),
                    '#weight' => 100,
                );
          
            }
        }

        $orderItemsAdditional = $cart->orderItemsAdditional;
        if (count($orderItemsAdditional)) {
            $form['cart']['additionalItems'] = array(
                '#type' => 'container',
                '#attributes' => array('class' => array('additionalItems')),
            );

            foreach ($orderItemsAdditional as $item) {
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
/* Discount */ 
        $customer = printconnect\Customers\Factory::Current();
    
        if ($customer) {
              try {
                $billingAccounts = printconnect\Customers\BillingAccounts\Factory::GetBillingAccounts($customer, false);
                printconnect\Customers\BillingAccounts\Factory::LoadBillingAccounts($billingAccounts);
                $ba = null;
                foreach ($billingAccounts as $value) {
                    if ($value->isDefault == true) {
                        $ba = $value;
                    }
                }
                $ba = printconnect\Customers\BillingAccounts\Factory::Get($ba->id);
                printconnect\Customers\BillingAccounts\Factory::LoadBillingAccount($ba, FALSE);
                $cart = Factory::Current();
                if ($ba->discountCode != null) {
                    $discount = Discounts\Factory::Create($cart->id ,$ba->discountCode);
                    Discounts\Factory::Save($discount);
                    $cart = Factory::Refresh($cart);
                    $_SESSION['oldba'] = $ba->id ;
                    $_SESSION['discount_'.$ba->id.'_'.$cart->id] = $ba->discountCode;
                } 
        } catch(Exception $ex) {
            
        }
        if (count($cart->discountItems)) {
            $form['cart']['discounts'] = array(
                '#type' => 'fieldset',
                '#attributes' => array('class' => array('discounts', 'item')),
                '#weight' => 50,
                '#title' => t('Discounts'),
            );

            foreach ($cart->discountItems as $item) {
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

                $form['cart']['discounts'][$item->discountId]['description']['items']= array(
                    'price' => array(
                        '#theme' => 'price',
                        '#value' => $item->price,
                        '#attributes' => array('class' => array('styleprice')),
                    ),
                    'code' => array(
                        '#type' => 'container',
                        'content' => array('#markup' => t('You are using').': '.$item->discountId),
                    ),
                    'description' => array(
                        '#type' => 'container',
                        'content' => array('#markup' => $item->productName),
                    ),
                );
            }
        }
        }
/* end discount */   
           
 /* vatException */  
    
      $tvaBillingAccount = null;
    if ($customer) {
    $billingAccounts = printconnect\Customers\BillingAccounts\Factory::GetBillingAccounts($customer, false);
     printconnect\Customers\BillingAccounts\Factory::LoadBillingAccounts($billingAccounts);
     $DefaultbillingAccount = null;
      
     foreach ($billingAccounts as $valueAccoun) {

        if ($valueAccoun->isDefault == true) {
            $DefaultbillingAccount = $valueAccoun;
        }
     }
     $shop = printconnect\Shop\Configuration\Factory::Current();

     $tvaBillingAccount = printconnect\Customers\VatException\Factory::GetVatExceptions($DefaultbillingAccount->id ,FALSE);
     printconnect\Customers\VatException\Factory::LoadVatExceptions($tvaBillingAccount);
     
     
        if ($tvaBillingAccount && ($shop->defaultvat != $tvaBillingAccount->items[0]->percentage)) {
    //        $percentage = ($tvaBillingAccount->items[0]->percentage);
    //        updateTvaCart($cart, $percentage);
    //        $cart->billingAccount = $DefaultbillingAccount->id;
    //        Factory::Save($cart);
    //       \printconnect\Carts\Factory::Refresh($cart);
         
            }
            }
       
/* end vatException */        
        
        if (variable_get('pc_flow', '') == 'flyer') {
            $options = array(
                '0' => array(
                    t('My files are ok, I do not want an extra file check. My files can be printed as they are.'),
                    theme('price', array('value' => 0, 'free' => TRUE)),
                ),
                '1' => array(
                    t('I want an extra file check.'),
                    theme('price', array('value' => 4.99, 'free' => TRUE)),
                ),
            );

            $form['cart']['checks'] = array(
                '#type' => 'fieldset',
                '#attributes' => array('class' => array('file-check', 'clearfix')),
                '#title' => t('File checks'),
                '#weight' => 70,
            );

            $form['cart']['checks']['text'] = array(
                '#type' => 'item',
                '#markup' => t('About online file checks with the designtool.'),
            );

            $form['cart']['checks']['options'] = array(
                '#type' => 'tableselect',
                '#options' => $options,
                '#header' => array('', ''),
                '#multiple' => FALSE,
                '#default_value' => $cart->fileCheck,
                '#ajax' => array(
                    'callback' => 'pccart_cart_form_filecheck_callback',
                    'wrapper' => 'pccart-cart-form',
                    'method' => 'replace',
                    'effect' => 'fade',
                    'progress' => array(
                        'message' => NULL,
                        'type' => NULL,
                    ),
                ),
                '#attributes' => array('class' => array('targetPrice'))
            );
        }

        $options = array();
        $types = Shipping\Types\Factory::GetAll();

        $expectedShippingDate = strtotime(substr($cart->expectedShippingDate, 0, 10));
        $expectedDeliveryDate = strtotime(substr($cart->expectedDeliveryDate, 0, 10));
        $deadlineDate = strtotime($cart->deadlineDate);

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
            '#type' => 'submit',
            '#name' => 'add_discount',
            '#value' => t('Apply'),
            '#validate' => array('pccart_cart_form2_add_discount_validate'),
            '#submit' => array('pccart_cart_form2_add_discount_submit'),
            '#attributes' => array('class' => array('large', 'add-discount', 'ok', 'button')),
        );
        
        $form['cart']['shipping'] = array(
            '#type' => 'fieldset',
            '#title' => t('Shipment'),
            '#attributes' => array('class' => array('shipping', 'clearfix')),
            '#weight' => 80,
        );

        $form_state['storage']['shipping']['types'] = $types;
        if ($cart->onlyPostal) {
            foreach ($types as $type) {
                if ($type->shippingType->deliveryType == 'deliveryTypePostal') {
                    $form_state['storage']['shipping']['type'] = $type->id;

                    if ($cart->orderItemShipping->shippingTypeResellerShop != $type->id) {
                        $cart->shipping_type = $type->id;
                        Factory::Save($cart);
                        drupal_goto('cart');
                    }
                }
            }
        } else {
            foreach ($types as $type) {
                if ($type->shippingType->deliveryType != 'deliveryTypePostal' && ($type->shippingType->deliveryType != 'deliveryTypePickup' || variable_get('pcpickuppoints_enabled', true) )) {
                    $enabledTypes[] = $type;
                }
            }
        }

          if ($language->prefix == 'befr' || $language->prefix == 'benl') {
        $cart->orderItemShipping->shippingTypeResellerShop = 134;
     }
        
        foreach ($enabledTypes as $type) {
            if ($cart->socialcardsOnly) {
                $type->price = 0;
            }

            $label = $type->shippingType->tag;

            if ($type->price > 0) {
                $label .= ' (' . t('!value exc. VAT', array('!value' => theme('price', array('value' => $type->price, 'free' => TRUE)))) . ' / ' . t('!value inc. VAT', array('!value' => theme('price', array('value' => $type->price * (1 + $_SESSION['shop_vat']), 'free' => TRUE)))) . ') *';
            }
            $options[$type->id] = array(
                'label' => '<span>' . $label . '</span>',
                'delivery' => $type->estimatedDeliveryTime,
                'class' => 'hnaa',
            );

            if (variable_get('pc_flow', '') == 'flyer' && $cart->orderItemShipping->shippingTypeResellerShop == $type->id) {
                $options[$type->id]['price'] = theme('price', array('value' => $type->price, 'free' => TRUE));
            }
        }
    $shop = printconnect\Shop\Configuration\Factory::Current();
        $newoptions = array("134" => $options[134], "123" => $options[123], "204" => $options[204], "121" => $options[121], "122" => $options[122]);
        $_SESSION['defaultindex'] = 134;
        $resolt = array();
        if ($shop->id == 35) {
            $options = $newoptions;
            $_SESSION['defaultindex'] = $cart->orderItemShipping->shippingTypeResellerShop;
        } elseif ($shop->id == 23) {
            $_SESSION['defaultindex'] = 86;
        } elseif ($shop->id == 33) {
            $_SESSION['defaultindex'] = 168;
        } elseif ($shop->id == 34) {
            $_SESSION['defaultindex'] = 115;
        } elseif ($shop->id == 58) {
            $_SESSION['defaultindex'] = 159;
        } else {
            foreach ($options as $key => $value) {
                $resolt[] = $key;
            }
            $_SESSION['defaultindex'] = $resolt[0];
        }
        $form['cart']['shipping']['type'] = array(
            '#type' => 'tableselect',
            '#multiple' => FALSE,
            '#options' => $options,
            '#header' => array('label' => ''),
            '#default_value' => $_SESSION['defaultindex'],
            '#sticky' => FALSE,
            '#ajax' => array(
                'callback' => 'pccart_cart_form_shipping_type_callback',
                'wrapper' => 'pccart-cart-form',
                'method' => 'replace',
                'effect' => 'fade',
                'progress' => array(
                    'message' => NULL,
                    'type' => NULL,
                ),
            ),
            '#attributes' => array('class' => array('grid targetPrice')),
            '#weight' => -50,
        );

        if (variable_get('pc_flow', '') == 'flyer') {
            $form['cart']['shipping']['type']['#header']['price'] = '';
        }

        if ($deadlineDate && $expectedDeliveryDate) {
            $form['cart']['shipping']['footer'] = array(
                '#type' => 'container',
                '#attributes' => array('class' => array('footer', 'clearfix')),
                '#weight' => 100,
            );

            $form['cart']['shipping']['footer']['deadline'] = array(
                '#type' => 'container',
                '#attributes' => array('class' => array('deadline')),
            );

            $form['cart']['shipping']['footer']['deadline']['date'] = array(
                '#type' => 'item',
                '#title' => t('Order before 10:00'),
                '#markup' => format_date($deadlineDate, 'short'),
            );

            if (variable_get('pc_flow', '') == 'printconcept') {
                $form['cart']['shipping']['footer']['shipping'] = array(
                    '#type' => 'container',
                    '#attributes' => array('class' => array('shipping')),
                );

                $form['cart']['shipping']['footer']['shipping']['date'] = array(
                    '#type' => 'item',
                    '#title' => t('Expected shipping'),
                    '#markup' => format_date($expectedShippingDate, 'short'),
                );
            }

            $form['cart']['shipping']['footer']['delivery'] = array(
                '#type' => 'container',
                '#attributes' => array('class' => array('delivery')),
            );

            $form['cart']['shipping']['footer']['delivery']['date'] = array(
                '#type' => 'item',
                '#title' => t('Expected delivery'),
                '#markup' => format_date($expectedDeliveryDate, 'short'),
            );
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
        //champ reference
        $form['cart']['reference']['input'] = array(
        '#type' => 'textfield',
        '#default_value' => $cart ? $cart->customer_reference : '',
        '#size' => 30,
        );
        
     
        
        
       
        $form['cart']['priceblock'] = array(
            '#theme' => 'priceblock',
            '#id' => 'priceblock',
            '#subtotal' => $cart->convertedSubTotalAmount,
            '#vatAmount' => $cart->convertedVatAmount,
            '#weight' => 100,
        );

        $form['actions'] = array(
            '#type' => 'container',
            '#attributes' => array('class' => array('actions', 'form-actions', 'clearfix')),
        );

        if (variable_get('pc_flow', '') == 'printconcept') {
            $form['actions']['link'] = array(
                '#markup' => l(t('Continue shopping'), 'products', array('attributes' => array('class' => array('continue')))),
            );
        }

        if (variable_get('pc_flow', '') == 'flyer') {
            $form['actions']['price'] = array(
                '#id' => 'price',
                '#theme' => 'price',
                '#value' => $cart->totalAmount,
                '#attributes' => array('id' => 'price'),
                '#title' => t('Total incl. VAT'),
            );
        }

        if (variable_get('pc_flow', '') == 'flyer') {
            $form['link'] = array(
                '#markup' => l(t('Continue shopping'), 'products', array('attributes' => array('class' => array('continue')))),
            );
        }

        global $user;

        if ($user->uid) {
            $params = new stdClass();
            if ($cart->discountItems) {
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

            $form['link'] = array(
                '#type' => 'item',
                '#title' => t('Direct link'),
                '#markup' => l($url, $url),
            );
        }

        $form['isFilled'] = array('#value' => $cart->isFilled);
    }

    $form_state['storage']['cart'] = $cart;

    $form_state['cache'] = TRUE;
    $form['#cache'] = TRUE;
    $form['#tree'] = TRUE;
    $form['#id'] = 'pccart-cart-form';

    return $form;
}

function pccart_cart_form_shipping_type_callback(&$form, &$form_state) {
    $cart = $form_state['storage']['cart'];
    $cart->shipping_type = $form_state['values']['cart']['shipping']['type'];
    $cart = Factory::Save($cart);

    $form_state['storage']['cart'] = $cart;

    if (variable_get('pc_flow', '') == 'flyer') {
        foreach (element_children($form['cart']['shipping']['type']['#options']) as $key) {
            unset($form['cart']['shipping']['type']['#options'][$key]['price']);
        }
        $form['cart']['shipping']['type']['#options'][$cart->shipping_type]['price'] = theme('price', array('value' => $cart->orderItemShipping->convertedPrice, 'free' => TRUE));
    }

    $form['cart']['priceblock']['#subtotal'] = $cart->convertedSubTotalAmount;
    $form['cart']['priceblock']['#vatAmount'] = $cart->convertedVatAmount;
    $form['cart']['priceblock']['#total'] = $cart->convertedTotalAmount;
    $form['cart']['priceblock']['#weight'] = 100;

    $expectedDeliveryDate = strtotime(substr($cart->expectedDeliveryDate, 0, 10));
    $form['cart']['shipping']['footer']['delivery']['date']['#markup'] = format_date($expectedDeliveryDate, 'short');

    $form['cart']['shipping']['text']['price']['#value'] = $cart->orderItemShipping->convertedPrice;
    $form['cart']['shipping']['price']['#value'] = $cart->orderItemShipping->convertedPrice;

    $form['actions']['price']['#value'] = $cart->totalAmount;

    return $form;
}

function pccart_cart_form_designer_email_callback($form, &$form_state) {
    $cart = $form_state['storage']['cart'];
    foreach (element_children($form_state['values']['cart']['items']) as $key) {
        $item = Factory::GetItem($cart, $key);
        $item->EnsureLoaded();
        if ($form_state['values']['cart']['items'][$key]['designer']['check']) {
            $item->emailDesigner = $form_state['values']['cart']['designer']['email'];
        } else {
            $item->Remove('emailDesigner');
        }

        Factory::SaveItem($item);
    }

    return $form['cart']['designer'];
}

function pccart_cart_form2_delete_item_validate($form, $form_state) {
    // @todo needs to be implemented;
}

function pccart_cart_form2_delete_item_submit($form, &$form_state) {
    $cart = Factory::Current();
    $id = $form_state['triggering_element']['#parents'][2];
    $endarray = end($cart->orderItems);
  
  if($cart->supplementProduct == 1 || $endarray->price == 43){
        $cart->supplementProduct = 0;
        \printconnect\Carts\Factory::Save($cart);
   }
    try {
        Factory::DeleteItem($id, $cart);
    } catch (\printconnect\Rest\Exceptions\Exception $ex) {

    }
}

function pccart_cart_form2_add_discount_validate($form, &$form_state) {
    $customer = CustomersFactory::Current();
    if (!$customer){
    form_set_error('', t('Please log customer'));
    }
}

function pccart_cart_form2_add_discount_submit($form, &$form_state) {
    $cart = Factory::Current();
    $customer = CustomersFactory::Current();
    try {
        if ($customer) {
           $cart->customer = $customer->id;
           Factory::Save($cart);

         if ($form_state['storage']['giftvoucher']) {
            \printconnect\GiftVouchers\Factory::Redeem($customer, $form_state['values']['cart']['discount']['code']);
            drupal_set_message(t('Your voucher code has been converted to store credit... You may use this credit while checking out your order.'));
        } else {
            $discount = Discounts\Factory::Create($cart->id, $form_state['values']['cart']['discount']['code']);
            Discounts\Factory::Save($discount);
             drupal_set_message(t('Your discount code has been converted checkout your order.'));
        }
        $cart = Factory::Refresh($cart);
        }
    } catch (\printconnect\Rest\Exceptions\Exception $ex) {
        drupal_set_message(t($ex->errors[0]), 'error');
        $form_state['storage']['message'] = t($ex->errors[0]);

    }
}

function pccart_cart_form2_delete_discount_validate($form, $form_state) {
// @todo needs to be implemented;
}

function pccart_cart_form2_delete_discount_submit($form, &$form_state) {
    $cart = Factory::Current();
    $discountId = $form_state['triggering_element']['#parents'][2];
    Discounts\Factory::Delete($cart->id, $discountId);
}

function pccart_cart_form2_validate($form, &$form_state) {
    $cart = $form_state['storage']['cart'];
    if (!$cart || !$cart->isFilled) {
        form_set_error('', t('No cart or empty'));
    }

    switch (variable_get('pc_flow', 'flyer')) {
        case 'printconcept':
            break;
        case 'whitelabel';
            foreach ($cart->productItems as $item) {
                if (!count($item->files)) {
                    form_set_error('', t('Please upload a file for all your items'));
                }
            }
            break;
        default:
            break;
    }
}
function pccart_cart_form2_popup_overlay_ok_submit($form, &$form_state) {
    $cart = Factory::Current(FALSE);
    if($cart->supplementProduct == 0){
     $cart->supplementProduct = 1;
    \printconnect\Carts\Factory::Save($cart);
    drupal_goto($GLOBALS['base_url'].'/cart/add/%7B%22items%22%3A%5B%7B%22productPriceGroupId%22%3A8476%2C%22quantity%22%3A250%2C%22vat%22%3A%220.2100%22%7D%5D%7D');
  
    }
}

function pccart_cart_form2_submit($form, &$form_state) {
    global $conf;
    $cart = $form_state['storage']['cart'];
    
    foreach($form_state['values']['cart']['items'] as $key => $item) {
      $tgVat = $_SESSION['shop_vat'];
      if ($item['description']['tva']['case'] == 1) {
          $tgVat = 0.06;
      } 
      foreach ($cart->orderItems as $orderItem) {
        if ($orderItem->id == $key) {
            $orderItem->vat = $tgVat;
            $orderItemTrg = printconnect\Carts\Factory::GetItem($cart, $orderItem->id);
            printconnect\Carts\Factory::LoadItem($orderItemTrg);
            $orderItemTrg->vatCustom = $tgVat;
            printconnect\Carts\Factory::SaveItem($orderItemTrg);
        }
      }
    }
  $form_state['storage']['cart'] = $cart;
    if (isset($form_state['values']['cart']['checks']['options']) && $form_state['values']['cart']['checks']['options'] == 1) {
        $cart->fileCheck = true;
    } else {
        $cart->fileCheck = false;
        $cart->Remove('fileCheck');
    }

    if ($cart->onlyPostal) {
    } else {
        $shippingTypePrinter = null;
        $types = $form_state['storage']['shipping']['types'];
        foreach ($types as $type) {
            if ($type->id == $form_state['values']['cart']['shipping']['type']) {
                $shippingType = $type->shippingType->type;
            }
            if ($type->shippingType->type == 'shippingTypePrinter') {
                $shippingTypePrinter = $type;
            }
        }

        switch ($shippingType) {
            case 'shippingTypeBpostPickupPoint':
                if (isset($form_state['values']['pcbpost']['id']) && !empty($form_state['values']['pcbpost']['id']) && $form_state['values']['pcbpost']['id'] > 100000) {
                    $poi = \printconnect\bPost\Factory::Get($form_state['values']['pcbpost']['id']);
                    $poi->EnsureLoaded();
                    $cart->pickuppoint = $poi->cartObject;
                } else {
                    $cart->pickuppoint = FALSE;
                }
                break;
            case 'shippingTypeMondialRelay':
                if (isset($form_state['values']['cart']['shipping']['pup']['id']) && !empty($form_state['values']['cart']['shipping']['pup']['id']) && $form_state['values']['cart']['shipping']['pup']['id'] < 100000) {
                    $pickuppoint = PickupPoints\Factory::Get($form_state['values']['cart']['shipping']['pup']['id'], $form_state['values']['cart']['shipping']['pup']['countryCode']);
                    $pickuppoint->EnsureLoaded();
                    $cart->pickuppoint = $pickuppoint;
                } else {
                    $cart->pickuppoint = FALSE;
                }
                break;
            case 'shippingTypeStore':
                if (isset($form_state['values']['pcflyerstores']['id']) && !empty($form_state['values']['pcflyerstores']['id'])) {
                    $poi = \printconnect\Stores\Factory::Get($form_state['values']['pcflyerstores']['id']);
                    if ($form_state['values']['pcflyerstores']['id'] == $conf['default_printing_office']
                        && $shippingTypePrinter !== null
                    ) {
                        $form_state['values']['cart']['shipping']['type'] = $shippingTypePrinter->id;
                    }
                    $poi->EnsureLoaded();
                    $cart->pickuppoint = $poi->cartObject;
                } else {
                    $cart->pickuppoint = FALSE;
                }
                break;
            case 'shippingTypePrinter':
                $poi = \printconnect\Stores\Factory::Get($conf['default_printing_office']);
                $poi->EnsureLoaded();
                $cart->pickuppoint = $poi->cartObject;
                break;
            default:
                $cart->pickuppoint = FALSE;
                break;
        }
    }
    $cart->shipping_type = $form_state['values']['cart']['shipping']['type'];

    $referenceValue = $form_state['values']['cart']['reference']['input']; 
    $cart->customer_reference = $referenceValue;
    \printconnect\Carts\Factory::Save($cart);
    \printconnect\Carts\Factory::Refresh($cart);
    //Factory::Save($cart);
}

function pccart_cart_form_filecheck_callback($form, &$form_state) {
    $cart = $form_state['storage']['cart'];

    if ($form_state['values']['cart']['checks']['options'] == 1) {
        $cart->fileCheck = true;
    } else {
        $cart->fileCheck = false;
        $cart->Remove('fileCheck');
    }

    $cart = Factory::Save($cart);

    $form_state['storage']['cart'] = $cart;

    $form['cart']['priceblock']['#subtotal'] = $cart->convertedSubTotalAmount;
    $form['cart']['priceblock']['#vatAmount'] = $cart->convertedVatAmount;

    $form['actions']['price']['#value'] = $cart->totalAmount;

    foreach ($cart->discountItems as $item) {
        $form['cart']['discounts'][$item->discountId]['description']['items']['itemid']['price']['#value'] = $item->price;
    }

    return $form;
}

function updateTvaCart(\printconnect\Object $cart, $tva) {
    foreach($cart->orderItems as $orderItem){
        $orderItem->vat = $tva;
        $orderItem->priceIncVAT = $orderItem->price * (1 + $tva);
    }
    $cart->orderItemShipping->vat = (string) $tva;
    $cart->vat = $tva;
    $cart->convertedVatAmount = $cart->convertedSubTotalAmount * $tva;
    $cart->vatAmount = $cart->convertedVatAmount;
    $cart->convertedTotalAmount = $cart->convertedSubTotalAmount * (1 + $tva);
    $cart->totalAmount = $cart->convertedTotalAmount;
    $cart->codAmount = $cart->totalAmount;
    $cart->convertedCodAmount = $cart->convertedTotalAmount;
}

function updateCartIetmvat ($form, &$form_state, $itemId, $status) 
{
    $cart = printconnect\Carts\Factory::Current();
    $cartItem = printconnect\Carts\Factory::GetItem($cart, $itemId);
    printconnect\Carts\Factory::LoadItem($cartItem);
    if ($status == 1) {
        $cartItem->vatCustom = 0.06;
    } else {
        $cartItem->vatCustom = $_SESSION['shop_vat'];
    }
    printconnect\Carts\Factory::SaveItem($cartItem);
}

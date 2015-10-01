<?php

namespace printconnect\Carts {

  use printconnect\Dal;
use printconnect\Customers;

class Factory {

    public static function GetCartJson()
    {
        if (isset($_SESSION['cartid'])) {
            return Dal::SendRequest('new-cart/id/'. $_SESSION['cartid']);
        }else {
            return NULL;
        }
    }

    public static function DeleteItem($id) 
    {
        $cartId = isset($_SESSION['cartid']) ? $_SESSION['cartid'] : NULL;
        $response = Dal::SendRequest(sprintf('cart-item/id/%d/cart/%d', $id, $cartId), 'DELETE');

        if($response->code == 200) {
            self::UpdateCartCount(FALSE);
        }

        return $response;
    }

    public static function DeleteDesign($id) 
    {
        return Dal::SendRequest(sprintf('order-item-file/orderItemId/%d', $id), 'DELETE');
    }

    public static function SaveRefJob($id, $refJob)
    {
        return Dal::SendRequest('supplement-parameter', 'POST', array(
            'id' => $id,
            'refJob' => $refJob
        ));
    }

    public static function SaveEmailDesigner($id, $email)
    {
        return Dal::SendRequest('supplement-parameter', 'POST', array(
            'id' => $id,
            'emailDesigner' => $email
        ));
    }
    
    public static function SaveRefOrder($id, $orderRef)
    {
        return Dal::SendRequest('supplement-parameter', 'POST', array(
            'id' => $id,
            'customer_reference' => $orderRef
        ));
    }    

    public static function ApplyDiscount($code)
    {
        $cartId = isset($_SESSION['cartid']) ? $_SESSION['cartid'] : NULL;

        return Dal::SendRequest('order-discount-code', 'POST', array(
            'order' => $cartId,
            'code' => $code
        ));
    }

    public static function RemoveDiscount($code)
    {
        $cartId = isset($_SESSION['cartid']) ? $_SESSION['cartid'] : NULL;

        return Dal::SendRequest('order-discount-code', 'DELETE', array(
            'order' => $cartId,
            'code' => $code
        ));
    }

    public static function RemoveFileCheck($itemId)
    {
        return Dal::SendRequest('supplement-parameter', 'POST', array(
            'fileCheck' => 'remove',
            'id' => $itemId
        ));
    }

    public static function SetPickupPoint($pickuppoint)
    {
        $cartId = isset($_SESSION['cartid']) ? $_SESSION['cartid'] : NULL;
        return Dal::SendRequest('pickuppointdetail', 'PUT', array(
            'id' => $cartId,
            'pickuppoint' => $pickuppoint->GetProperties()
        ));
    }

    public static function GetCartCount()
    {
        if(!isset($_SESSION['cartCount'])) {
            $response = self::GetCartJson();
            $cart = json_decode($response->data);
        
            $number = count($cart->orderItems);

            $_SESSION['cartCount'] = $number;
        }else {
            $number = $_SESSION['cartCount'];
        }

        return $number;
    }

    public static function UpdateCartCount($append = TRUE) 
    {
        $count = self::GetCartCount();

        if($append) {
            $count++;
        }else {
            $count--;
        }

        $_SESSION['cartCount'] = $count;
    }

    public static function saveInCache($object, $data) 
    {
        if (!empty($data)) {
            Dal::updateElement($object,
                'cart', 
                array('id' => $object->id), 
                $data
            );
        }
    }

    public static function Get($id, $cache = TRUE) {
      return new Cart(array('id' => $id), $cache);
    }

    public static function Refresh(Cart $object) {
      Dal::ClearCache($object);
      return self::Get($object->id);
    }

    public static function RefreshItem(Item $object) {
      return Dal::ClearCache($object);
    }

    public static function GetItems(Cart $cart) {
      return new Items(array(), array('cart' => $cart));
    }

    public static function LoadItems(Items $items) {
      if ($items->cart && $items->cart->id) {
        $id = $items->cart->id;
        Dal::LoadCollection($items, 'cart-item', array('cart' => $id), function ($value) {
          $item = new Item(get_object_vars($value));
          $item->loaded = true;
          return $item;
        });
        $items->Sort();
      }
    }

    public static function GetItemFromCart($cart, $id) {
      if ($cart) {
        foreach ($cart->orderItems as $item) {
          if ($item->id == $id) {
            return $item;
          }
        }
      }
      return FALSE;
      //return new Item(array('cart' => $cart->id, 'id' => $id));
    }

    public static function GetItem(Cart $cart, $id) {
      return new Item(array('cart' => $cart->id, 'id' => $id));
    }

    public static function LoadItem(Item $object) {
      Dal::Load($object, 'cart-item', array('id' => $object->id, 'cart' => $object->cart), FALSE);
      return $object;
    }

    public static function LoadCart(Cart $object) {
      if ($object->HasProperty('id')) {
        $id = $object->Get('id');
        if ($id) {
          Dal::Load($object, 'cart', array('id' => $id), $object->cache);
          if (isset($_SESSION['payment_method'])) {
            $object->payment_method = $_SESSION['payment_method'];
          }
          $object->customer_reference = $object->customerReference;
        }
      } elseif ($object->HasProperty('customerId')) {
        $customerId = $object->Get('customerId');
        if ($customerId) {
          Dal::Load($object, 'cart', array('customer' => $customerId), $object->cache);
        }
      }
    }

    public static function Logout($cart) {
      unset($_SESSION['cartid']);
      return TRUE;
      unset($_SESSION['shipping_address']);
      $cart->Remove('shipping_address');
      unset($_SESSION['billing_address']);
      $cart->Remove('billing_address');
      $cart->customer = 0;
      return Factory::Save($cart);
    }

    public static function CurrentOrCreate() {
      $current = self::Current(FALSE);
      if (!$current) {
        $current = Factory::Create();
        $customer = \printconnect\Customers\Factory::Current();
        if ($customer) {
          $current->customerId = $customerId;
          Factory::Save($current);
        }
      }
      return $current;
    }

    public static function Current($cache = TRUE) {
      static $current = FALSE;
      $current = &drupal_static(__FUNCTION__);
      if ($current && $cache) {
        return $current;
      }

      try {

        if (isset($_SESSION['cartid'])) {
          $current = self::Get($_SESSION['cartid'], $cache); // unserialize($_SESSION['customer']);

          $current->EnsureLoaded();
          //$current->shipping = $_SESSION['cartshipping'];
          // $current->pickuppoint = array('id' => '000923', 'country' => 'BE');
          /*
            if (isset($_SESSION['cart']['shipping']['pickupPointId'])) {
            $current->pickuppointId = $_SESSION['cart']['shipping']['pickupPointId'];
            $current->pickuppointCountry = $_SESSION['cart']['shipping']['pickupPointCountry'];
            } */
          if (isset($_SESSION['cart']['shipping']['pup'])) {
            $current->pickuppoint = unserialize($_SESSION['cart']['shipping']['pup']);
          }
          if (isset($_SESSION['shipping_address'])) {
            $current->shipping_address = $_SESSION['shipping_address'];
          }
          if (isset($_SESSION['billing_address'])) {
            $current->billing_address = $_SESSION['billing_address'];
          }
          if (isset($_SESSION['payment_method'])) {
            $current->payment_method = $_SESSION['payment_method'];
          }

          return $current;
        } else {
          return FALSE;
        }
        // }
      } catch (\printconnect\Dal\NotFoundException $ex) {
        self::Clear();
        return FALSE;
      }
    }

    public static function Clear() {
      unset($_SESSION['pup']);
      unset($_SESSION['shipping_address']);
      unset($_SESSION['billing_address']);
      unset($_SESSION['cartid']);
      unset($_SESSION['payment_method']);
    }
    
    public static function SaveStore($object){
        if ($object->pickuppoint) {
            $_SESSION['cart']['shipping']['pup'] = serialize($object->pickuppoint);
            unset($_SESSION['shipping_address']);
            $object->Remove('shipping_address');
            if (is_object($object->pickuppoint)) {
                $object->pickuppoint = $object->pickuppoint->GetProperties();
            }
	    Dal::updateElement($object, 'cart',
                array(
                    'id' => $object->id
                ),
                array(
		    'pickuppoint' => $object->pickuppoint,
		    'shipping_address' => null,
                )
            );  
      // $object->Remove('pickuppoint');
      } else {
	  Dal::updateElement($object, 'cart',
                array(
                    'id' => $object->id
                ),
                array(
                    'pickuppoint' => null,
                )
          );
          $object->Remove('pickuppoint');
          $_SESSION['shipping_address'] = $object->shipping_address;
          unset($_SESSION['cart']['shipping']['pup']);
      }
	$object = Dal::Save($object, 'pickuppointdetail', array('id' => $object->id));
        return $object;	
    }
 
    public static function Save($object) {
    $customer = Customers\Factory::Current();
    $ref = $object->customer_reference;
      if ($customer) {
        $object->customer = $customer->id;
      }

      $object->cart = $object->id;

      if ($object->pickuppoint) {
        $_SESSION['cart']['shipping']['pup'] = serialize($object->pickuppoint);
        unset($_SESSION['shipping_address']);
        $object->Remove('shipping_address');

        if (is_object($object->pickuppoint)) {
          $object->pickuppoint = $object->pickuppoint->GetProperties();
        }
      // $object->Remove('pickuppoint');
      } else {
          
        $object->Remove('pickuppoint');
        $_SESSION['shipping_address'] = $object->shipping_address;
        unset($_SESSION['cart']['shipping']['pup']);
      }
     
       
      if ($object->HasProperty('payment_method')) {
        $_SESSION['payment_method'] = $object->payment_method;
      } else {
        unset($_SESSION['payment_method']);
      }
      try {
        $_SESSION['cartid'] = $object->id;

        if (!isset($object->storeCredit)) {
          //drupal_set_message('set store credit from payments');
          $object->storeCredit = $object->storeCreditUsed;
        }
        $object->customer_reference = $ref;
        $object = Dal::Save($object, 'cart', array('id' => $object->id));
	return $object;
      } catch (\printconnect\Dal\NotFoundException $ex) {
        self::Clear();
        return FALSE;
      }
      //}
    }

    public static function SaveCustomData($cart) 
    {
	try {
	    Dal::Save($cart, 'supplement-parameter');
	} catch(Exception $ex) {
	    
	}
    }

    public static function Validate(Cart $object) {
      //if (!empty($object->id)) {
      Dal::Save($object, 'cart', array('cart' => $object->id), TRUE);
      //}
    }

    public static function Create() {
      $cart = new Cart(Dal::Create(New Cart, 'cart', array()));
      $cart->loaded = TRUE;

      $cart->items = new Items();

      if ($cart->id) {
        $_SESSION['cartid'] = $cart->id;
      }
      return $cart;
    }

    public static function Delete() {
      unset($_SESSION['cartid']);
      unset($_SESSION['shipping_address']);
      unset($_SESSION['payment_method']);
      unset($_SESSION['billing_address']);
    }
   
    public static function CreateItem($cart, $priceGroup, $quantity, $description, $relatedProducts, $options, $vat = FALSE, $widthCF, $heightCF, $cf) {
     
	$object = new Item();
      $object->cart = $cart->id;
      $object->productId = $cart->productId;
      $object->product_price_group = $priceGroup;
      $object->quantity = $quantity;
      $object->description = '';
      $object->related_products = $relatedProducts;
      $object->options = $options;
      $object->comments = ' ';
      $object->widthCF = $widthCF;
      $object->heightCF = $heightCF;
      $object->CF = $cf;
      if ($vat && $vat != $_SESSION['shop_vat']) {
        $object->vatCustom = $vat;
      }
      try {
        $object = Dal::Create($object, 'cart-item', array());
        $object->loaded = TRUE;
	$tmp = $cart->orderItems;
	$tmp[]= $object;
	$cart->orderItems = $tmp;
        $cart->subTotalAmount = $object->cartSubTotalAmount;
        $cart->vatAmount = $object->cartVatAmount;
        $cart->totalAmount = $object->cartTotalAmount;
	

	$cartAmounts = $object->cartAmount;
        Dal::updateElement($cart, 'cart', 
	    array(
	        'id' => $cart->id
	    ), 
	    array(
                'orderItems' => $cart->orderItems,
		'subTotalAmount' => $cartAmounts->subTotalAmount,
                'vatAmount' => $cartAmounts->vatAmount,
                'totalAmount' => $cartAmounts->totalAmount,
            )
	);
      } catch (\Exception $ex) {
      }

      self::UpdateCartCount(TRUE);
      return $object;
    }

    public static function SaveItem( Item $object, $widthCF, $heightCF, $cf ) {        
      //$object->cart_item = $object->id;
        
      $refJob = $object->refJob;
      $object->product_price_group = $object->productPriceGroupId;
      $object->description = '';
      $object->refJob = $refJob;
      $object->widthCF = $widthCF;
      $object->heightCF = $heightCF;
      $object->CF = $cf;
      //$object->cart = $object->order;
      $options = array();
      foreach ($object->options as $option) {
        if (is_object($option)) {
          $options[] = $option->option;
        } else {
          $options[] = $option;
        }
      }
      $object->options = $options;
      $item = Dal::Save($object, 'cart-item', array('id' => $object->id, 'cart' => $object->cart));
   //var_dump($item);die;
      $cart = self::Current();
      $orderItems =  $cart->orderItems;
      for($i=0; $i< count($orderItems); $i++) {
          if ($orderItems[$i]->id == $item->id) {
              $orderItems[$i] = $item;
              break;
          }
      }
      $cartAmounts = $item->cartAmount;
      Dal::updateElement($cart, 'cart',
            array(
                'id' => $cart->id
            ),
            array(
                'orderItems' => $orderItems,
                'subTotalAmount' => $cartAmounts->subTotalAmount,
                'vatAmount' => $cartAmounts->vatAmount,
                'totalAmount' => $cartAmounts->totalAmount,
      	        'fotoliaItems' => ($item->fotoliaItems != null) ?
          		    $item->fotoliaItems : null
                )
        );
	
      return $item;
    }

    public static function DeleteItemFile($id) {
      $cart = self::Current();
      $cartItems = $cart->orderItems;
      foreach($cartItems as $key => $job) {
          if ($job->id == $id) {
              $cartItems[$key]->files = array();
	      $cartItems[$key]->fileCheck = null;
              break;
          }
      }
      $fotolias = $cart->fotoliaItems;
      foreach($fotolias as $key => $fotolia) {
      	if ($fotolia->parentId = $id) {
      	    unset($fotolias[$key]);
      	}
      }
      $cart->fotoliaItems = $fotolias;
      $cart->orderItems = array_values($cartItems);
      Dal::updateElement($cart, 'cart',
        array('id' => $cart->id),
        array(
            'orderItems' => $cart->orderItems,
	    'fotoliaItems' => $fotolias
        )
      );
      return Dal::Delete('order-item-file', array('orderItemId' => $id));
    }

    public static function Process($cart, $type) {
      $cart->cart = $cart->id;
      $cart->type = $type;
      Dal::Create($cart, 'process-cart', array());
    }

    public static function GetLast($customerId) {
      return new Cart(array('customerId' => $customerId), FALSE);
    }
    
    public static function SaveFotolia($cartId, $parentId, $fotolia) {
        $object = new Item();
        
        $object->cartId = $cartId;
        $object->parentId = $parentId;
        $object->fotolia = $fotolia;
        
        return Dal::Create($object, 'fotolia', array());
    }
    
    public static function getFotoliaPrice($type) {
        $object = new Item();
        $object->type = $type;
        Dal::Load($object, 'fotolia', array('type' => $type), False); 
        return $object;
    }
    
    public static function deleteFotolias($order) {
        return Dal::Delete('fotolia', array('cart' => $order->id));
    }
   
    public static function deletePreflights($order) {
        return Dal::Delete('preflight', array('cart' => $order->id));
    }
 
    public static function SavePreflight($cartId, $orderItemId, $preflight) {
        $object = new \printconnect\Object();
        $object->cartId = $cartId;
        $object->orderItemId = $orderItemId;
        $object->preflight = $preflight;
        
        return Dal::Create($object, 'preflight', array());
    }
  }

} 

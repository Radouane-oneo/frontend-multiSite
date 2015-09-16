<?php

namespace printconnect\Customers\BillingAccounts;

use printconnect\Dal;
use printconnect\Customers\Customer;

class Factory {

 public static function Current() {
    static $current;
    if (empty($current)) {
      try {
        if (isset($_SESSION['billingAccountId'])) {
          $current = Factory::Get($_SESSION['billingAccountId']); // unserialize($_SESSION['customer']);
          $current->EnsureLoaded();
          return $current;
        };
      } catch (\printconnect\Dal\NotFoundException $ex) {
        $current = FALSE;
        return false;
      }
    } else {
      return $current;
    }
  }
  
  public static function Create() {
    return new BillingAccount();
  }

  public static function GetBillingAccounts(Customer $customer, $cache = TRUE) {
          return new BillingAccounts(array(), array('customer' => $customer), $cache);
  }

  public static function LoadBillingAccounts(BillingAccounts $object) {
    $customer = $object->Get('customer');
    if ($customer) {
      $id = $customer->Get('id');
      if ($id) {
        Dal::LoadCollection($object, 'billing-account', array('customer' => $id), function ($value) {
            $item = new BillingAccount(get_object_vars($value));
            $item->loaded = true;
            return $item;
        });
      }
    }
    return $object;
  }

  public static function ClearBillingAccountsCache(Customer $object) {
    Dal::ClearCache(self::GetBillingAccounts($object));
  }

  public static function Get($id) {
    return new BillingAccount(array('id' => $id));
  }

  public static function LoadBillingAccount(BillingAccount $object, $cache=TRUE) {
    $id = $object->Get('id');
    $cart = \printconnect\Carts\Factory::Current();
    
    if ($id) {
      Dal::Load($object, 'billing-account', array('id' => $id,'cart' => $cart->id), $cache);
    }
  }

    public static function LoadBillingAccountVat(BillingAccount $object, $cache=FALSE) {
    $vat = $object->Get('id');
    if ($vat) {
      Dal::Load($object, 'billing-account', array('vatNumber' => $vat), $cache);
    }

  }


    public static function BillingAccountVat(BillingAccount $object, $customer, $cart,  $cache=FALSE) {
        $vat = $object->Get('id');
        if ($vat) {
            Dal::Load($object, 'billing-account', array(
                'id' => $vat,
                'customer' => $customer,
                'cart' => $cart,
                'vatNumber' => '',
            ), $cache);
        }
return $object;
    }
   public static function Save(\printconnect\Object $object) {
    $id = $object->Get('id');
    $cart = \printconnect\Carts\Factory::Current();
    $object->cart = $cart->id;
    if ($id) {
      $customer = \printconnect\Customers\Factory::Current();
      $object->customer = $customer->id;
      Dal::Save($object, 'billing-account', array($id));
     
    } else {
      Dal::Save($object, 'billing-account', array());
    }
    $_SESSION['billingAccountId'] = $object->id;
    if(!$_SESSION['newaddress']){
        \printconnect\Carts\Factory::saveInCache($cart, array(
        'billingAccount' => $object->id,
	'shipping_address' => ($object->shippingAddressId) ? $object->shippingAddressId : null
    )); 
    }
   
  }
  
  public static function Validate(BillingAccount $object) {
    $id = $object->Get('id');
    if ($id) {
      Dal::Save($object, 'billing-account', array($id), TRUE);
    } else {
      Dal::Save($object, 'billing-account', array(), TRUE);
    }
    
  }

  public static function Delete($id) {
    if ($id) {
      Dal::Delete('billing-account', array($id));
    }
  }

}


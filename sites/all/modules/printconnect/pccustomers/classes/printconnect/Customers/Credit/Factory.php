<?php

namespace printconnect\Customers\Credit;

use printconnect\Dal;
use printconnect\Customers\Customer;

class Factory {

  public static function Get(Customer $customer, $billingAccountId, $cache = TRUE) {
    return new Account(array('customer' => $customer->id, 'billingAccount' => $billingAccountId), $cache);
  }

  public static function LoadAccount(Account $object) {
    Dal::Load($object, 'internal-credit', array('customer' => $object->customer, 'billingAccount' => $object->billingAccount), $object->cache);
  }

  public static function Redeem(Customer $customer, $code) {
    $object = new \printconnect\Object();
    $object->customer = $customer->id;
    $object->code = $code;
    Dal::Save($object, 'internal-credit', array());
  }

  public static function Redeem2(Customer $customer, $code) {
    $object = new \printconnect\Object();
    $object->customer = $customer->id;
    $object->order = $code;
    Dal::Create($object, 'internal-credit', array());
    
    return $object;
   
  }
}


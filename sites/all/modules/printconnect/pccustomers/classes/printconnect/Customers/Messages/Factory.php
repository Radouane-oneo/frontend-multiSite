<?php

namespace printconnect\Customers\Messages;

use printconnect\Dal;
use printconnect\Customers\Customer;

class Factory {

  public static function Get(Customer $customer, $cache = TRUE) {
    return new Messages(array(),array('customer' => $customer->id), $cache);
  }

  public static function LoadMessages(Messages $object) {
    //Dal::Load($object, 'customer-message', , $object->cache);
    Dal::LoadCollection($object, 'customer-message', array('id' => $object->customer), function ($value) {
                      return new Message($value);
                    }, $object->cache);
  }

}

 
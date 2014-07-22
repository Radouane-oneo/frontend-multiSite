<?php

namespace printconnect\Customers\Feedback {

  use printconnect\Dal;
use printconnect\Customers\Customer;
use printconnect\Orders\Order;

  class Factory {

    public static function Get(Customer $customer, $cache = TRUE) {
      return new Fedback(array('customer' => $customer->id), $cache);
    }

    public static function LoadFeedback(Feedback $object) {
      Dal::Load($object, 'customer-feedback', array('customer' => $object->customer), $object->cache);
    }

    public static function Create($customerId, $orderId = FALSE) {
      $object = new Feedback();
      $object->customerId = $customerId;
      if ($orderId) {
        $object->orderId = $orderId;
      }
      //$object->feedback = $feedback;
      $object->loaded = TRUE;
      return $object;
    }

    public static function Save(Feedback $object) {
      Dal::Save($object, 'customer-feedback', array());
    }
  }
}


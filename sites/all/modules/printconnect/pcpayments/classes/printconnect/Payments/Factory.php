<?php

namespace printconnect\Payments {

  use printconnect\Dal;

  class Factory {

    public static function Create($orderId, $amount, $type, $id) {

      return new Payment(array(
          'order' => $orderId,
          'amount' => $amount,
          'type' => $type,
          'ogoneId' => $id,
              )
      );
    }

    public static function Save(Payment $object) {
      Dal::Save($object, 'payment', array());
    }

  }

}
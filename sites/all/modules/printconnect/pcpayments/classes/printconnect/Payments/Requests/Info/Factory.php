<?php

namespace printconnect\Payments\Requests\Info {

  use printconnect\Dal;

  class Factory {

    public static function CreateCart($cartId, $paymentMethodId) {
      $info = new Info();
      Dal::Load($info, 'payment-request-info', array('cart' => $cartId, 'paymentMethod' => $paymentMethodId), FALSE);

      return $info;
    }

    public static function CreatePaymentRequest($paymentRequestId, $paymentMethodId) {
      $info = new Info();
      Dal::Load($info, 'payment-request-info', array('paymentRequest' => $paymentRequestId, 'paymentMethod' => $paymentMethodId), FALSE);

      return $info;
    }

    public static function Get($paymentRequestId, $paymentMethodId) {
      $info = new Info();
      Dal::Load($info, 'payment-request-info', array('paymentRequest' => $paymentRequestId, 'paymentMethod' => $paymentMethodId));

      return $info;
    }

    public static function GetByPaymentRequest($paymentRequest) {
      return new Info(array('paymentRequest' => $paymentRequest));
    }

    public static function LoadInfo(Info $object) {
      if ($object->id) {
        Dal::Load($object, 'payment-request-info', array('paymentRequest' => $object->id));
        return $object;
      }
      if ($object->paymentRequest) {
        Dal::Load($object, 'payment-request-info', array('paymentRequest' => $object->paymentRequest));
        return $object;
      };
    }

  }

}
?>

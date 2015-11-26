<?php

namespace printconnect\PaymentMethods {

  use printconnect\Dal;

  class Factory {

    public static function GetPaymentMethods()
    {
        return Dal::SendRequest('payment-method');
    }    

    public static function SavePaymentMethod($paymentmethodId)
    {
        $cartId = isset($_SESSION['cartid']) ? $_SESSION['cartid'] : NULL;
        return Dal::SendRequest('payment-method', 'POST', array(
            'cart' => $cartId,
            'paymentMethodId' => $paymentmethodId
        ));
    }

    public static function GetAll() {
      $paymentMethods = new PaymentMethods();

      Dal::LoadCollection($paymentMethods, 'payment-method', array(), function ($value) {
                        //return Factory::Get($value->id);
                        $paymentMethod = new PaymentMethod(get_object_vars($value));
                        $paymentMethod->loaded = TRUE;
                        return $paymentMethod;
                      });

                    //  $paymentMethods->Sort();

      return $paymentMethods;
    }

    public static function Get($id) {
      return new PaymentMethod(array('id' => $id));
    }

    public static function LoadPaymentMethod(PaymentMethod $object) {
      if ($object->id) {
        Dal::Load($object, 'payment-method', array($object->id));
      };
    }

    public static function Save($paymentMethodId, $order = null, $isPaymentRequest = false, $key = null)
    {
        if (null == $order) {
            $cart = \printconnect\Carts\Factory::Current();
        } else {
            $cart = $order;
        }
        $cart->payment_method = $paymentMethodId;
	$cart->isPaymentRequest = $isPaymentRequest;
	$cart->requestkey = $key;
        if ($cart->id) {
            Dal::Save($cart, 'payment-method', array());
        };
    }

  }

}

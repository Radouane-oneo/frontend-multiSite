<?php

namespace printconnect\PaymentMethods {

  use printconnect\Dal;

  class Factory {

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

  }

}
<?php

namespace printconnect\Carts\Discounts {

  use printconnect\Dal;

  class Factory {

    public static function Create($cart, $code) {
      return new Discount(array('order' => $cart, 'code' => $code));
    }

    public static function Save(Discount $object) {
      Dal::Save($object, 'order-discount-code', array());
    }

    public static function Delete($cartId, $id){
      Dal::Delete('order-discount-code', array('code' => $id, 'order' => $cartId));
    }

    public static function Get($id){
      return new Discount(array('id' => $id));
    }
    
     public static function LoadDiscount(Discount $object) {
      $id = $object->Get('id');

      if ($id) {
        Dal::Load($object, 'order-discount-code', array('id' => $id), $object->cache);
      }
    }

  }

}

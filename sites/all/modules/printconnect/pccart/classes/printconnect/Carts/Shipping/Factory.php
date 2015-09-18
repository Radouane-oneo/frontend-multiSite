<?php

namespace printconnect\Carts\Shipping {

use printconnect\Dal;

class Factory {

    public static function GetShippingTypes()
    {
        return Dal::SendRequest('shipping-type');
    }    

    public static function SetShippingType($shippingTypeId)
    {
        $cartId = isset($_SESSION['cartid']) ? $_SESSION['cartid'] : NULL;
        return Dal::SendRequest('shipping-type', 'POST', array(
            'cart' => $cartId,
            'shipping_type' => $shippingTypeId
        ));
    }

    public static function GetType($id) {
      return new Type(array('id' => $id));
    }

    public static function LoadType(Type $object) {
      $id = $object->Get('id');
      if ($id) {
        Dal::Load($object, 'shipping-type', array($id));
      };
    }

    public static function GetTypes() {
      $types = new Types();
      Dal::LoadCollection($types, 'shipping-type', array(), function ($value) {
                        $type = new Type(get_object_vars($value));
                        $type->loaded = true;
                        return $type;
                      });
      return $types;
    }

  }

}
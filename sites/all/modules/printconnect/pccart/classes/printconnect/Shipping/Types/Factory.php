<?php

namespace printconnect\Shipping\Types {

  use printconnect\Dal;

  class Factory {

    public static function GetCustomerShippingAddresses()
    {
        if (isset($_SESSION['customerid'])) {
            return Dal::SendRequest('customer-address/customer/'. $_SESSION['customerid']);
        }else {
            return NULL;
        }
    }

    public static function Get($id) {
      return new Type(array('id' => $id));
    }

    public static function LoadType(Type $object) {
      $id = $object->Get('id');
      if ($id) {
        Dal::Load($object, 'shipping-type', array($id));
      };
    }

    public static function GetAll() {
      $types = new Types();
      Dal::LoadCollection($types, 'shipping-type', array(), function ($value) {
                        $type = new Type(get_object_vars($value));
                        $type->loaded = true;
                        return $type;
                      });
      $types->Sort();
      return $types;
    }

  }

}
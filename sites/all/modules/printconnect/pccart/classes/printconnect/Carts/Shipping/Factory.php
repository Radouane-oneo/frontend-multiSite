<?php

namespace printconnect\Carts\Shipping {

  use printconnect\Dal;

  class Factory {

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
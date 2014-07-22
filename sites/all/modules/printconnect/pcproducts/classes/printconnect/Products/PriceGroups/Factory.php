<?php

namespace printconnect\Products\PriceGroups {

  use \printconnect\Dal;

  class Factory {

    public static function Get($id) {
      return new PriceGroup(array('id' => $id));
    }

    public static function LoadPriceGroup(PriceGroup $object) {
      $id = $object->Get('id');
      if ($id) {
        Dal::Load($object, 'product-price-group', array('id' => $id));
      };
    }

  }

}
<?php

namespace printconnect\Products\Pricing {

  use printconnect\Dal;
use printconnect\Products\Product;

  class Factory {

    public static function GetSellPrice($id, $quantity) {
      $object = New Pricing();
      Dal::Load($object, 'product-sell-price', array('id' => $id, 'quantity' => $quantity));
      $object->EnsureLoaded();
      $result = $object->sellPrice;
      return $result;
    }

    public static function GetPricings($id) {
      return new Pricings(array(), array('priceGroupId' => $id));
    }

    public static function LoadPricings(Pricings $object) {
      if ($object->priceGroupId) {
        Dal::LoadCollection($object, 'product-price', array('priceGroupId', $object->priceGroupId), function($value) {
                          return new Pricing(get_object_vars($value));
                        });
      }
    }

  }

}
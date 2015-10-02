<?php

namespace printconnect\Products\Shipping {

  use \printconnect\Dal;

  class Factory {

    public static function Get($productId, $items, $options, $qty) {
      $object= new \printconnect\Collection();
      
//      Dal::Load($object, 'shipping-date', array('product' => $productId, 'toolboxItems' => implode(',', $items), 'quantity' => $qty), function ($value) {
//                        $date = new \printconnect\Object($value);
//                        $date->loaded = TRUE;
//                        return $date;
//                      });


      Dal::LoadCollection($object, 'shipping-date', array('product' => $productId, 'toolboxItems' => implode(',', $items), 'quantity' => $qty), function ($value) {
                        $date = new \printconnect\Object($value);
                        $date->loaded = TRUE;
                        return $date;
                      }, TRUE);

      return $object;
    }

  }

}
<?php

namespace printconnect\Products\Options {

  use \printconnect\Dal;

  class Factory {

    public static function Get($id) {
      return new Option(array('id' => $id));
    }

    public static function LoadOption(Option $object) {
      $id = $object->Get('id');
      $options = new Options();
      if ($id) {
        Dal::LoadCollection($options, 'option',array(), function ($value) {
                          $option = new Option($value);
                          $option->loaded = TRUE;
                          return $option;
                        });
        
      }
     
      foreach ($options as $option){
        if ($option->id = $id){
          $object->LoadFromArray($option->GetProperties());
          return TRUE;
        }
      }
    }

    public static function GetOptions($productId, $items) {
      $object = new Options();
      try {
        Dal::LoadCollection($object, 'option', array('productId' => $productId, 'toolboxItem' => implode(',', $items)), function ($value) {
                          $option = new Option($value);
                          $option->loaded = TRUE;
                          return $option;
                        });
//        if (count($items) && ($object->count == 0)) {
//          array_pop($items);
//          return Factory::GetOptions($productId, $items);
//        } else {
        return $object;
//        }
      } catch (\printconnect\Dal\NotFoundException $ex) {
        if (count($items)) {
          array_pop($items);
          return Factory::GetOptions($productId, $items);
        } else {
          return $object;
        }
      }
    }

    public static function GetPrice(Option $option, $qty) {
      $option->EnsureLoaded();
      if ($option->unitSell == 0) {
        return 0;
      } else {
        $result = $option->startSell;
        $step = $option->unit;
        $i = 0;
        do {
          $result += $option->unitSell;
          $i += $step;
        } while ($i < $qty);
        return $result;
      } 
    }

  }

}
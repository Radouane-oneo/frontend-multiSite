<?php

namespace printconnect\Products\Templates {

  use \printconnect\Dal;

  class Factory {

    public static function GetTemplates($productId, $items) {
      $object = new Templates();
      try {
        Dal::LoadCollection($object, 'template', array('productId' => $productId, 'toolboxItem' => implode(',', $items)), function ($value) {
                          $template = new Template($value);
                          $template->loaded = TRUE;
                          return $template;
                        });
//        if (count($items) && ($object->count == 0)) {
//          array_pop($items);
//          return Factory::GetTemplates($productId, $items);
//        } else {
          return $object;
        //}
      } catch (\printconnect\Dal\NotFoundException $ex) {
//        if (count($items)) {
//          array_pop($items);
//           return Factory::GetTemplates($productId, $items);
//        } else {
          return $object;
        //}
      }
    }

  }

}
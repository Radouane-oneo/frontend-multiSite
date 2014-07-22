<?php

namespace printconnect\Products\RelatedProducts {

  use \printconnect\Dal;

  class Factory {

    public static function GetRelatedProducts($productId, $items) {
      $object = new RelatedProducts();
      try {
        Dal::LoadCollection($object, 'related-product', array('productId' => $productId, 'toolboxItem' => implode(',', $items)), function ($value) {
                          $relatedProduct = new RelatedProduct($value);
                          $relatedProduct->loaded = TRUE;
                          return $relatedProduct;
                        });
//        if ($object->count == 0 && count($items) > 0) {
//          array_pop($items);
//          return Factory::GetRelatedProducts($productId, $items);
//        } else {
          return $object;
//        }
      } catch (\printconnect\Dal\NotFoundException $ex) {
      //  if (count($items)) {
      //    array_pop($items);
       //   return Factory::GetRelatedProducts($productId, $items);
       // } else {
          return $object;
       // }
      }
    }

  }

}
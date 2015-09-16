<?php

namespace printconnect\Products {

  use printconnect\Dal;

  class Factory {

    public static function GetAll($language = FALSE, $dal = FALSE, $all = FALSE) {
      $products = new Products(array(), array(), FALSE, $language);

      $params = array();
      if (!$all) {
        $params['shopSpecific'] = 'true';
      }
      Dal::LoadCollection($products, 'product-list', $params, function ($value) {
                $product = new Product($value);
                $product->loaded = TRUE;
                return $product;
              }, TRUE, $dal);
      $products->loaded = true;


      return $products;
    }

    public static function GetTop() {
      $products = new Products();

      $params = array();

      $params['filter'] = 'top';

      Dal::LoadCollection($products, 'product-list', $params, function ($value) {
                $product = new Product($value);
                $product->loaded = TRUE;
                return $product;
              }, TRUE);
      $products->loaded = true;


      return $products;
    }

    public static function GetShopSpecific() {
      return self::GetAll(FALSE, FALSE, FALSE);
    }

    public static function Get($id, $language = FALSE) {
      return new Product(array('id' => $id), TRUE, $language);
    }

    public static function LoadProduct(Product $object) {
      $id = $object->Get('id');
      if ($id) {
        Dal::Load($object, 'product', array($id), TRUE);
      };
    }

    public static function Search($value) {
      global $language;
      $products = new Products();
      $log = FALSE;
      if (strlen($value) > 5) {
        $log = TRUE;
      }

      Dal::Search($products, $value, 'product', $language->id, function($value) {
                 
                $product = new Product(array('id' => $value->id));
                if (!isset($product->alias)) {
                  $product->alias = $value->aliasName;
                }
                return $product;
              }, $log);
      $products->loaded = true;
      return $products;

    }
    

    public static

    function GetOAB($productId) {
      $products = new Products();

      Dal::LoadCollection($products, 'product-list', array('filter' => 'bestSold', 'product' => $productId), function ($value) {
                $product = new Product(array('id' => $value->productId));
                $product->loaded = true;
                return $product;
              });
      $products->loaded = true;

      return $products;
    }

  }

}
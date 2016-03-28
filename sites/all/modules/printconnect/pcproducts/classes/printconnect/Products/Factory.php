<?php

namespace printconnect\Products {

  use printconnect\Dal;
  use printconnect\Segments\Factory as SegmentsFactory;
  class Factory {
  public static function GetProductWithPromo() 
  {
      return Dal::SendRequest('product-promo-price', 'GET', array());
  }

    public static function GetAll($language = FALSE, $dal = FALSE, $all = FALSE) {
      $host = $_SERVER['HTTP_HOST'];
      $parts = explode('.', $host);
      $subdomain = $parts[0];
      global $conf;
      if (isset($conf['cobrandedshops']) && array_key_exists($subdomain, $conf['cobrandedshops'])) {
	  $products = new Products(array(), array(), FALSE, $language);
          $params = array();
          if (!$all) {
              $params['shopSpecific'] = 'true';
          }
          Dal::LoadCollection($products, 'product-list', $params, function ($value) {
              $product = new Product($value);
              $product->loaded = TRUE;
              return $product;
              }, TRUE, $dal
          );
          $products->loaded = true;
          return $products;
      }
      global $language;
      $segments = SegmentsFactory::GetAll ( $language );
      $products = new Products ( array (), array (), FALSE, $language );
      foreach ( $segments as $seg ) {
      	foreach ( $seg->products as $product ) {
      		$product = new Product ( $product );
      		$product->loaded = TRUE;
      		$products->Add ( $product );
      	}
      }
      $products->loaded = true;
      return $products;
      $products = new Products(array(), array(), FALSE, $language);
      $basedPath = variable_get('pc_products_json_path');
      global $language;
      $fileName = null;
      switch($language->language) {
        case 'fr-Be':
            $fileName = 'flyerBe-fr-products.json';
        break;
        case 'nl-BE':
            $fileName = 'flyerBe-nl-products.json';
        break;
        case 'fr-FR':
            $fileName = 'flyerFr-fr-products.json';
        break;
        case 'lu-FR':
            $fileName = 'flyerLu-fr-products.json';
        break;
        case 'nl-NL':
            $fileName = 'flyerNl-nl-products.json';
        break;
      }
      $check = file_exists($basedPath.$fileName);
      if (!$check || filesize($basedPath.$fileName) <= 0) {
        $response = Dal::SendRequest('product-list');
        $data = $response->data;
        file_put_contents($basedPath.$fileName, $data);
        $data = json_decode($data);
      } else {
        $data = file_get_contents($basedPath.$fileName);
        if (0 === strpos(bin2hex($data), 'efbbbf')) {
          $data = $obj = json_decode(substr($data,3));
        } else {
          $data = json_decode($data);
        }
      }
      foreach ($data as $product) {
        $seg = new Product($product);
        $products->add($seg);
      }
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

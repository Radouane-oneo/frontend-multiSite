<?php

namespace printconnect\Products\Configurations {

  use printconnect\Dal;
use printconnect\Products\Product;
use printconnect\Products\Toolbox;
use printconnect\Products\Toolbox\Groups;
use printconnect\Products\Toolbox\Group;

  class Factory {

    public static function GetTree($productId, $items) {
      $tree = new \printconnect\Collection();

      Dal::LoadCollection($tree, 'product-item', array('id' => $productId, 'toolboxItems' => implode(',', $items)), function($value) {
                return new \printconnect\Object($value);
              });


      return $tree;
    }

    public static function GetTypeItems($productId, $language = FALSE) {
      $data = new \printconnect\Object(null, true, $language);
      $items = new \printconnect\Collection();

//      Dal::LoadCollection($items, 'product-item', array('id' => $productId, 'level' => true), function($value) {
//                        return new \printconnect\Object($value);
//                      });


      Dal::Load($data, 'product-item', array('id' => $productId, 'level' => true));

      foreach ($data->data as $item) {
        $items->add(new \printconnect\Object($item));
      }

      return $items;
    }

    public static function Get($productId) {
      return new Configurations(array(), array('productId' => $productId));
    }

    public static function LoadConfigurations(Configurations $object) {
      $properties = $object->GetProperties();
      $params = array();
      if (isset($properties['productId'])) {
        $params[] = $properties['productId'];
      } elseif (isset($properties['priceGroupId'])) {
        $params['priceGroupId'] = $properties['priceGroupId'];
      }

      Dal::LoadCollection($object, 'product-item', $params, function ($value) {
                $configuration = new Configuration($value);
                $configuration->loaded = TRUE;
                return $configuration;
              });

//$object->Sort();
    }

    public static function GetByPriceGroup($priceGroupId) {
      return new Configurations(array(), array('priceGroupId' => $priceGroupId));
    }

    public static function GetLevel($productId, $level) {
      $items = Factory::Get($productId);
      $result = new Configurations();
      foreach ($items as $item) {
        if ($item->level == $level) {
          $result->Add($item);
        }
      }
      return $result;
    }

    public static function GetToolboxItems($productId, $toolbox) {
      $items = Factory::GetLevel($productId, $level);
      $result = new Toolbox\Items();
      foreach ($items as $item) {
        $result->Add(Toolbox\Factory::Get($item->toolboxItem));
      }
      return $result;
    }

    public static function GetGroups($productId) {
      $configs = Factory::Get($productId);
      $groups = new Toolbox\Groups();
      foreach ($configs as $config) {
        $item = Toolbox\Factory::Get($config->toolboxItem);
        $group = Toolbox\Factory::GetGroup($item->group);
        $groups->Add($group, $group->id);
      }
      return $groups;
    }

    public static function GetProductGroups($productId) {
      $groups = new Groups();
      Dal::LoadCollection($groups, 'product-groups', array($productId), function ($value) {
                return new Group(get_object_vars($value));
              });
      return $groups;
    }

    public static function GetItems($productId, $group) {
      $configs = Factory::Get($productId);
      $items = new Toolbox\Items();
      foreach ($configs as $config) {
        $item = Toolbox\Factory::Get($config->toolboxItem);
        if ($item->group == $group->id) {
          $items->Add($item, $item->id);
        }
      }
      return $items;
    }

    public static function GetDefaults($productId, $items) {
      return new Defaults(array('product' => $productId, 'toolboxItems' => implode(',', $items), 'fallback' => true));
    }

    public static function LoadDefaults(Defaults $object) {
      $items = $object->toolboxItems;
      $items = explode(',', $items);
/*
      if (count($items) == 1) {
        try {
          Dal::Load($object, 'product-default-price', $object->GetProperties());
        } catch (\printconnect\Dal\Exception $ex) {
          Dal::Load($object, 'product-from-price', $object->GetProperties());
        }
      } else {*/
        Dal::Load($object, 'product-from-price', $object->GetProperties());
      //}
    }

  }

}
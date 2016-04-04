<?php

namespace printconnect\Products\Configurations {

  class Functions {

    public static function ItemExists($configs, $key) {
      $result = FALSE;
      foreach ($configs as $config) {
        if ($config->toolboxItem == (int) $key) {
          return TRUE;
        }
      }
    }

    public static function FilterByItems($configs, $items) {
      $result = $configs;
      foreach ($items as $value) {
        if ($value) {
          $result = Functions::FilterByItem($result, $value);
        }
      }
      return $result;
    }

    public static function FilterByItem($configs, $key) {
      $result = array();
      $priceGroups = array();
      foreach ($configs as $config) {
        if ($config->toolboxItem->id == (int) $key) {
          $priceGroups[$config->priceGroup] = $config->priceGroup;
        }
      }

      foreach ($configs as $config) {
        if (in_array($config->priceGroup, $priceGroups)) {
          $result[] = $config;
        }
      }

      return $result;
    }

    public static function FilterByGroup($configs, $key) {
      $result = array();
      foreach ($configs as $config) {
        if ($config->toolboxGroup == $key) {
          $result[] = $config;
        }
      }
      return $result;
    }

    public static function FilterGroup($configs, $group) {
      $result = array();
      foreach ($configs as $config) {
        if ($config->toolboxGroup == $group) {
          $result[$config->toolboxGroup] = $config;
        }
      }
      return $result;
    }

    public static function ExtractPriceGroups($configs) {
      $result = array();
      foreach ($configs as $config) {
        if (!in_array($config->priceGroup, $result)) {
          $result[] = $config->priceGroup;
        }
      }
      return $result;
    }


  }

}

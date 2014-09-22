<?php

namespace printconnect\Shop\Configuration {

  use printconnect\Dal;

  class Factory {

    public static function Current(){
     static $current;

     if ($current){
       return $current;
     }
     else{
       $current = new Configuration();
       return $current;
     }
    }

    public static function Language() {
      static $current = FALSE;

      if ($current){
        return $current;
      }

      global $language;
      $config = self::Current();

      foreach ($config->languages as $shopLanguage) {
        if (strtolower($shopLanguage->displayCode) == strtolower($language->language)) {
          $current =  $shopLanguage;
          return $current;
        }
      }
    }
    
     public static function LoadConfiguration(Configuration $object) {
      return Dal::Load($object, 'reseller-shop-configuration', array());
    }
  }
}



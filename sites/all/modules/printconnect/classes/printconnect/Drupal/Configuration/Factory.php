<?php

namespace printconnect\Drupal\Configuration {

  class Factory {

    protected static $_current = FALSE;

    public static function Create() {
      self::$_current = new Configuration();
      return self::$_current;
    }

    public static function Current(){
      return self::$_current;
    }

    public static function Save( $object) {
      self::$_current = $object;
    }

  }

}

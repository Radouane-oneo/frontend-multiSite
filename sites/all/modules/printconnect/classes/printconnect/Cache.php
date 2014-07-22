<?php

// $Id$

/**
 * @file
 * Cache
 *
 * Caching class
 */

namespace printconnect {

  use printconnect\Diagnostics\Debug;

  class Cache {

    protected static $_cache = array();

    public static function Get($name) {
      if (array_key_exists($name, self::$_cache)) {
        $data = self::$_cache[$name];
        return $data;
      } else {
        if (self::UseCache()) {
          $cachedObject = cache_get($name, 'cache');
          if ($cachedObject) {
            $data = $cachedObject->data;
            self::$_cache[$name] = $data;
            return $data;
          } else {
            self::$_cache[$name] = FALSE;
            return FALSE;
          }
        } else {
          return FALSE;
        }
      }
    }

    public static function Set($name, $value, $interval = CACHE_TEMPORARY) {
      if (self::UseCache()) {
        cache_set($name, $value, 'cache', $interval);
        self::$_cache[$name] = $value;
      }
    }

    public static function Clear($name) {
      cache_clear_all($name, 'cache');
      unset(self::$_cache[$name]);
    }

    public static function ClearAll() {
      drupal_flush_all_caches();
      self::$_cache = array();
    }

    private static function UseCache() {
      return  variable_get('pc_cache', TRUE);
    }
  }
}

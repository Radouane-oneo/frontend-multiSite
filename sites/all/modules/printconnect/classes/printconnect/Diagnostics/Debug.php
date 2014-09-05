<?php

// $Id$

/**
 * @file
 * Debug
 *
 * Functions for debugging
 */

namespace printconnect\Diagnostics {

  class Debug {

    static $log;

    public static function Log2($text, $level = 5) {
      $_SESSION['printconnect_log'][] = array(
          date('Y-m-d H:i:s') . '.' . self::MicroSeconds(),
          str_replace(array("\r", "\r\n", "\n"), '|', $text),
      );
    }

    public static function LogException2(\Exception $ex) {
      $_SESSION['printconnect_log'][] = array(
          date('Y-m-d H:i:s') . '.' . self::MicroSeconds(),
          str_replace(array("\r", "\r\n", "\n"), '|', $ex->__toString()),
      );
    }

    public static function GetLog() {
      if (isset($_SESSION['printconnect_log'])) {
        $return = $_SESSION['printconnect_log'];
        //unset($_SESSION['Log']);
        return $return;
      } else {
        return array();
      }
    }
    
    public static function Clear2(){
      unset($_SESSION['printconnect_log']);
    }

    private static function MicroSeconds() {
      $time = microtime();
      $parts = explode(' ', $time);
      return $parts[0] * 1000000;
    }

  }

}
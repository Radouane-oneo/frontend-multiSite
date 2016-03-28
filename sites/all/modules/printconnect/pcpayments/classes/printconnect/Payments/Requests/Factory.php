<?php

namespace printconnect\Payments\Requests {

  use printconnect\Dal;

  class Factory {

    public static function GetByKey($key) {
      return new Request(array('key' => $key), FALSE);
    }

    public static function LoadRequest(Request $object) {
      if ($object->key) {
        Dal::Load($object, 'payment-request', array('key' => $object->key), $object->cache);
      }
    }

  }

}
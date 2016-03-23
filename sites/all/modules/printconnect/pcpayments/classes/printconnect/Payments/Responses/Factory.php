<?php

namespace printconnect\Payments\Responses {

  use printconnect\Dal;

  class Factory {

    public static function Create($data) {
      $object = new Response($data);
      //$object->order = $data['orderID'];
      Dal::Create($object, 'payment-response');
      return $object;
    }

  }

}
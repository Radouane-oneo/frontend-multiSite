<?php

namespace printconnect\Newsletters\Subscriptions {

  use printconnect\Dal;

  class Factory {

    public static function GetByEmail($email) {
      return new Subscription(array('email' => $email));
    }

    public static function LoadSubscription(Subscription $object) {
      $email = $object->Get('email');
      if ($email) {
        Dal::Load($object, 'newsletter-subscription', array('email' => $email));
      }
    }

    public static function Create($email) {
      $object = new Subscription();
      $object->email = $email;
      $object->loaded = TRUE;
      return $object;
    }

    public static function Save(Subscription $object) {
      Dal::Save($object, 'newsletter-subscription', array());
    }

    public static function Delete($email) {
      Dal::Delete('newsletter-subscription', array('email' => $email));
    }
    
  }

}


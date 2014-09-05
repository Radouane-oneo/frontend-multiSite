<?php

namespace printconnect\GiftVouchers {

  use printconnect\Dal;

  class Factory {

    public static function Get($id, $cache = TRUE) {
      return new GiftVoucher(array('id' => $id), $cache);
    }

    public static function LoadGiftVoucher(GiftVoucher $object) {
      Dal::Load($object, 'gift-voucher', array('giftVoucher' => $object->id));
    }

    public static function GetFromOrder($orderId) {
      $result = array();
      $result[] = self::Get(1);
      $result[] = self::Get(2);

      return $result;
    }

    public static function Save(GiftVoucher $object) {
      if ($object->id) {
        Dal::Save($object, 'gift-voucher', array($object->id));
      } else {
        Dal::Save($object, 'gift-voucher', array());
      }
    }

    public static function Create($amount, $orderId) {
      $result = new GiftVoucher();
      $result->cartId = $orderId;
      $result->order = $orderId;
      $result->amount = $amount;
      $result->customer = 3664;
      $result->loaded = TRUE;
      return $result;
    }

    public static function Redeem(\printconnect\Customers\Customer $customer, $code) {
      $object = new \printconnect\Object();
      $object->customer = $customer->id;
      $object->code = $code;
      Dal::Save($object, 'internal-credit', array());
    }

    public static function Delete(GiftVoucher $object) {
      Dal::Delete('gift-voucher', array('giftVoucher' => $object->id));
    }

  }

}
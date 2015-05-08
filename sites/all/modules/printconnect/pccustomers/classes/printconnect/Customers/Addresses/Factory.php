<?php

namespace printconnect\Customers\Addresses;

use printconnect\Dal;
use printconnect\Customers\Customer;

class Factory {

  public static function Create() {
    return new Address();
  }

  public static function GetAddresses(Customer $customer, $cache = TRUE) {
    return new Addresses(array(), array('customer' => $customer), $cache);
  }

  public static function LoadAddresses(Addresses $object) {
    $customer = $object->Get('customer');
    if ($customer) {
      $id = $customer->Get('id');
      if ($id) {
        Dal::LoadCollection($object, 'customer-address', array('customer' => $id), function ($value) {
                  $item = new Address(get_object_vars($value));
                  $item->loaded = true;
                  return $item;
                  //return Factory::Get($value->id);
                }, $object->cache);
      }
    }
  }

  public static function ClearAddressesCache(Customer $object) {
    Dal::ClearCache(self::GetAddresses($object));
  }

  public static function Get($id, $cache = TRUE) {
      return new Address(array('id' => $id), $cache);
  }

  public static function LoadAddress(Address $object) {
    $id = $object->Get('id');
    if ($id) {
      Dal::Load($object, 'customer-address', array($id));
      //$object->country = \printconnect\Countries\Factory::Get($object->country);
    }
  }

  public static function Save(Address $object) {
    $id = $object->Get('id');
    $cart = \printconnect\Carts\Factory::Current();
    if ($id) {
      $object->cart = $id;
      Dal::Save($object, 'customer-address', array($id));
    } else {
      Dal::Save($object, 'customer-address', array());
    }
    \printconnect\Carts\Factory::saveInCache($cart, array(
        'shipping_address' => $object->id,
    ));
  }

  public static function Validate(Address $object) {
    $id = $object->Get('id');
    if ($id) {
      Dal::Save($object, 'customer-address', array($id), TRUE);
    } else {
      Dal::Save($object, 'customer-address', array(), TRUE);
    }
  }

  public static function Delete($id) {
    //$id = $object->Get('id');
    if ($id) {
      Dal::Delete('customer-address', array($id));
    }
  }

}


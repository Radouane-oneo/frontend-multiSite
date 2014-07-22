<?php

namespace printconnect\Customers\VatException;

use printconnect\Dal;
use printconnect\Customers\Customer;
use printconnect\Customers\BillingAccounts;

class Factory {

  public static function Create() {
    return new VatException();
  }

  public static function GetVatExceptions($billingAccount, $cache = TRUE) {
          return new VatExceptions(array(), array('billing-account' => $billingAccount), $cache);
  }

  public static function LoadVatExceptions(\printconnect\Object $object) {
    $billingAccount = $object->Get('billing-account');
    if ($billingAccount) {
        Dal::LoadCollection($object, 'vat-exception', array('billing-account' => $billingAccount), function ($value) {
            $item = new VatException($value);
            $item->loaded = true;
            return $item;
        }, FALSE);
    }
    return $object;
  }

  public static function ClearVatExceptionCache(Customer $object) {
    Dal::ClearCache(self::GetVatExceptions($object));
  }

  public static function Get($id) {
    return new VatException(array('id' => $id));
  }

  public static function LoadVatException(VatException $object) {
    $id = $object->Get('id');
    if ($id) {
      Dal::Load($object, 'vat-exception', array($id));
    }
  }

  public static function Save(VatException $object) {
    $id = $object->Get('id');
    if ($id) {
      Dal::Save($object, 'vat-exception', array($id));
    } else {
      Dal::Save($object, 'vat-exception', array());
    }
  }

  public static function Validate(VatException $object) {
    $id = $object->Get('id');
    if ($id) {
      Dal::Save($object, 'vat-exception', array($id), TRUE);
    } else {
      Dal::Save($object, 'vat-exception', array(), TRUE);
    }
    
  }

  public static function Delete($id) {
    if ($id) {
      Dal::Delete('vat-exception', array($id));
    }
  }

}


<?php

namespace printconnect\Invoices {

  use printconnect\Cache;
use printconnect\Dal;
use printconnect\Customers\Customer;

  class Factory {

    public static function GetBalance($invoice) {
      return $invoice->totalAmount - self::GetPaid($invoice);
    }

    public static function GetPaid($invoice) {
      $result = 0;
      foreach ($invoice->payments as $payment) {
        $result += $payment->amount;
      }
      return $result;
    }

    public static function Get($id) {
      return new Invoice(array('id' => $id));
    }

    public static function LoadInvoice(Invoice $object) {
      $id = $object->Get('id');
      if ($id) {
        Dal::Load($object, 'invoice', array($id));
        $object->lines = Factory::GetLines($object);
      }
    }

    public function ClearCache(Invoice $object) {
      Dal::ClearCache('invoice', array($object->id));
    }

    public static function GetInvoices(Customer $customer, $cache = TRUE) {
      return new Invoices(array(), array('customer' => $customer), $cache);
    }

    public static function LoadInvoices(Invoices $object) {
      $id = $object->customer->id;
      Dal::LoadCollection($object, 'invoice', array('customer' => $id), function ($value) {
                return new Invoice($value);
              }, $object->cache);
    }

    public static function GetLine($id) {
      return new Line(array('id' => $id));
    }

    public static function LoadLine(Line $object) {
      $id = $object->Get('id');
      if ($id) {
        Dal::Load($object, 'invoice-item', array($id));
      }
    }

    public static function GetLines(Invoice $object) {
      //return new Lines(array(),array('invoice' => $invoice));
      $lines = new Lines();
      $id = $object->Get('id');
      Dal::LoadCollection($lines, 'invoice-item', array('invoice' => $id), function ($value) {
                $line = new Line(get_object_vars($value));
                $line->loaded = true;
                return $line;
                //   return Factory::GetLine($value->id);
              });
      $lines->loaded = true;
      return $lines;
    }

  }

}


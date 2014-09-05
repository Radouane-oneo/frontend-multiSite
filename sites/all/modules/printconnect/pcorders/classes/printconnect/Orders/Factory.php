<?php

namespace printconnect\Orders {

  use printconnect\Cache;
use printconnect\Dal;
use printconnect\Customers\Customer;

  class Factory {

    public static function Get($id, $cache = false) {
      return new Order(array('id' => $id), $cache);
    }

    public static function LoadOrder(Order $object) {
      try {
        $id = $object->Get('id');
        $cache = $object->Get('cache');
        if ($id) {
          Dal::Load($object, 'order', array($id), $cache);
          //$object->items = Factory::GetItems($object);
          //$object->orderBillingAddress = Factory::GetInvoiceAddress($object);
          //$object->orderShippingAddress = Factory::GetDeliveryAddress($object);
          //$object->orderItemShipping = self::GetItem($object, $object->orderItemShipping);
        }
      } catch (\printconnect\Dal\NotFoundException $ex) {
        return FALSE;
      }
    }

    public static function ClearCustomerOrdersCache(Customer $object) {
      Dal::ClearCache(Factory::GetOrders($object));
    }

    public static function ClearCache(Order $object) {
      Dal::ClearCache('order', array($object->id));
    }

    public static function GetOrders(Customer $customer, $cache = false) {
      //return new Orders(array(), array('customer' => $customer));
      $orders = new Orders();
      Dal::LoadCollection($orders, 'order', array('customer' => $customer->id), function ($value) {
                $object = new Order(get_object_vars($value));
               // $object->invoiceAddress = Factory::GetInvoiceAddress($object);
                //$object->deliveryAddress = Factory::GetDeliveryAddress($object->id, $object->customer);
                $object->loaded = true;
                return $object;
              }, $cache);
      return $orders;
    }

    public static function GetActiveOrders(Customer $customer, $cache = TRUE) {
      //return new Orders(array(), array('customer' => $customer));
      $orders = new Orders();
      Dal::LoadCollection($orders, 'order', array('customer' => $customer->id), function ($value) {
                $object = new Order(get_object_vars($value));
                //$object->invoiceAddress = Factory::GetInvoiceAddress($object);
                //$object->deliveryAddress = Factory::GetDeliveryAddress($object->id, $object->customer);
                $object->loaded = true;
                return $object;
              }, $cache);
      return $orders;
    }

    public static function GetClosedOrders(Customer $customer) {
      //return new Orders(array(), array('customer' => $customer));
      $orders = new Orders();
      Dal::LoadCollection($orders, 'order', array('customer' => $customer->id, 'status' => 'closed'), function ($value) {
                $object = new Order(get_object_vars($value));
                //$object->invoiceAddress = Factory::GetInvoiceAddress($object);
                //$object->deliveryAddress = Factory::GetDeliveryAddress($object->id, $object->customer);
                $object->loaded = true;
                return $object;
              });
      return $orders;
    }

    public static function GetItem(Order $order, $id) {
      return new Item(array('id' => $id, 'order' => $order));
    }

    public static function LoadItem(Item $object) {
      $id = $object->Get('id');
      if ($id) {
        $orderId = $object->order->Get('id');
        Dal::Load($object, 'order-item', array('id' => $id, 'order' => $orderId));
      }
    }

    public static function GetItems(Order $order) {
      return new Items(array(), array('order' => $order));
    }

    public static function LoadItems(Items $items) {
      if ($items->order && $items->order->id) {
        $id = $items->order->id;
        Dal::LoadCollection($items, 'order-item', array('order' => $id), function ($value) {
                  $item = new Item(get_object_vars($value));
                  $item->loaded = true;
                  return $item;
                });
      }
    }

    public static function GetInvoiceAddress(Order $object) {
      return new InvoiceAddress(array('order' => $object));
    }

    public static function LoadInvoiceAddress(InvoiceAddress $object) {
      if ($object->order->id) {
        Dal::Load($object, 'order-billing-address', array('order' => $object->order->id, 'customer' => $object->order->customer));
      }
    }

    public static function GetDeliveryAddress($orderId, $customerId) {
      return new DeliveryAddress(array('order' => $orderId, 'customer' => $customerId));
    }

    public static function LoadDeliveryAddress(DeliveryAddress $object) {
      $orderId = $object->Get('order');
      $customerId = $object->Get('customer');
      Dal::Load($object, 'order-shipping-address', array('order' => $orderId, 'customer' => $customerId));
    }

    public static function GetStatusses() {
      return new Statusses(array());
    }

    public static function LoadStatusses(Statusses $items) {
      Dal::LoadCollection($items, 'order-status', array(), function ($value) {
                $item = new Status(get_object_vars($value));
                $item->loaded = true;
                return $item;
              });
    }
    
    public static function Reorder(Order $order){
      $object = new Order();
       Dal::Save($object, 'order', array('reorder' => $order->id));
       return $object;
    }

  }

}


<?php

namespace printconnect\Customers\Designs;

use printconnect\Dal;
use printconnect\Customers\Customer;

class Factory {

  public static function Get($id) {
    return new Design(array('id' => $id));
  }

  public static function LoadDesign(Design $object) {
    $id = $object->Get('id');
    if ($id) {
      Dal::Load($object, 'customer-design', array('designId' => $id));
    };
  }

  public static function GetByCustomer($customer, $cache = TRUE) {
    return new Designs(array(), array('customer' => $customer), $cache);
  }

  public static function LoadDesigns(Designs $object) {
    $id = $object->customer->id;

    Dal::LoadCollection($object, 'customer-design', array('customerId' => $id), function ($value) {
              $design = new Design($value);
              $design->loaded = TRUE;
              return $design;
            }, $object->cache);
  }

  public static function Delete($id) {
    try{
    return Dal::Delete('customer-design', array('designId' => $id));
    }
    catch (\Exception $ex){
      
    }
  }
  
  
    public static function Create(Customer $customer, $jobId, $priceGroup, $quantity, $options = array()) {
      $object = new Design();
      $object->jobId = $jobId;
      $object->priceGroup = $priceGroup;
      $object->quantity = $quantity;
      $object->customer = $customer->id;
      $object = Dal::Create($object, 'customer-design', array());
      $object->loaded = TRUE;
     
      //return $object;
      
      $result =  self::Get($object->id);
            
      return $result;
    }
    
    public static function Save(Design $object) {
      $object->EnsureLoaded();
      return Dal::Save($object, 'customer-design', array('designId' => $object->id));
    }

    
    public static function Refresh(Designs $object) {
      if ($object->HasProperty('items')) {
        //  Dal::ClearCache($object->items);
      }
      $customer = $object->customer;
      Dal::ClearCache($object);
      return self::GetByCustomer($customer);
    }
    
}
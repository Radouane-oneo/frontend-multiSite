<?php

namespace printconnect\Customers;

use printconnect\Dal\Rest\Remote;
use printconnect\Cache;
use printconnect\Dal;

class Factory {

  public static function Current() {
    static $current;

    if (empty($current)) {
      try {
        if (isset($_SESSION['customerid'])) {
          $current = Factory::Get($_SESSION['customerid']); // unserialize($_SESSION['customer']);
          $current->EnsureLoaded();

          $current->converted = isset($_SESSION['pccustomers'][$_SESSION['customerid']]['converted']) && $_SESSION['pccustomers'][$_SESSION['customerid']]['converted'];

          return $current;
        };
      } catch (\Exception $ex) {
        $current = FALSE;
        return false;
      }
    } else {
      return $current;
    }
  }

  public static function Refresh(Customer $object) {
    return Dal::ClearCache($object);
  }

  public static function Get($id) {  
      return new Customer(array('id' => $id));
  }

  public static function Create() {
    $customer = new Customer();
    $customer->loaded = TRUE;
    return $customer;
  }

  public static function Logout() {
    $customer = Factory::Current();
    unset($_SESSION['customerid']);
    unset($_SESSION['fbuser']);
    unset($_SESSION['googleuser']);
    Factory::ClearCache($customer);
  }

  public static function GetByEmail($email) {
    try {
      $customer = new Customer(array('email' => $email));
      Dal::Load($customer, 'customer', array('email' => $email));
      if ($customer->id) {
	return $customer;
      } else {
	return false;
      }
    } catch (Exception $ex) {
      return FALSE;
    }
  }

  public static function GetByEmailAndPassword($email, $password) {
    try {
      $customer = new Customer(array('email' => $email, 'password' => $password));
      Dal::Load($customer, 'customer', array('email' => $email, 'password' => $password), FALSE);
      return $customer;
    } catch (\printconnect\Dal\NotFoundException $ex) {
      return FALSE;
    }
  }

  public static function Login($email, $password) {
    try {
      $object = new Customer();

      Dal::Load($object, 'customer', array('email' => $email, 'password' => $password), FALSE);

      if (!valid_email_address($email) && isset($object->email)) {
        $conversion = array(
            'username' => $email,
            'email' => $object->email,
        );

        $object->conversion = $conversion;
        $object->converted = TRUE;
        //$_SESSION['pccustomers'][$object->id]['converted'] = TRUE;
        $_SESSION['pccustomers']['conversion'] = $conversion;
      } else {
        $object->converted = FALSE;
        unset($_SESSION['pccustomers']['conversion']);
      }

      if ($object->blocked) {
        return FALSE;
      } else {
        return $object;
      }
    } catch (\printconnect\Dal\NotFoundException $ex) {
      //drupal_set_message(print_r($ex, true));
      return false;
    }
  }

  public static function LoginByObject(Customer $object) {
    $_SESSION['customerid'] = $object->id;
    pccustomers_login($object->id);
  }

  public static function LoadCustomer(Customer $object) {
    $id = $object->Get('id');
    if ($id) {
      Dal::Load($object, 'customer', array($id));
    } else {
      $email = $object->Get('email');
      if ($email) {
        Dal::Load($object, 'customer', array('email' => $email), FALSE);
      }
    }
  }

  public static function Save(Customer $object) {
    $object->sector = 1;
    $object->reference = 1;
   if ($object->id) {
      $object->Remove('password');
      Dal::Save($object, 'customer', array($object->id));
    } else {

      Dal::Save($object, 'customer', array());
    }
  }

  public static function Validate(Customer $object) {
    if ($object->id) {
      Dal::Save($object, 'customer', array($object->id), TRUE);
    } else {
      Dal::Save($object, 'customer', array(), TRUE);
    }
  }

  public static function ClearCache(Customer $object) {
    Dal::ClearCache($object);
  }

  public static function RequestNewPassword(Customer $object) {
    $id = $object->Get('id');
    Dal::Save($object, 'customer', array('id' => $id, 'resetPassword' => TRUE));
  }

  public static function ChangePassword(Customer $object) {
    $id = $object->Get('id');
    Dal::Save($object, 'customer', array('id' => $id, 'changePassword' => TRUE));
  }

  public static function CreateAddress() {
    return new Address();
  }

  public static function GetAddresses($customer) {
    return new Addresses(array(), array('customer' => $customer));
  }

  public static function LoadAddresses(Addresses &$object) {
    $id = $object->customer->id;

    Dal::LoadCollection($object, 'customer-address', array('customer' => $id), function ($value) {
              return Factory::GetAddress($value->id);
            });
  }

  public static function ClearAddressesCache(Customer $object) {
    Dal::ClearCache(self::GetAddresses($customer));
  }

  public static function GetSectors() {
    return new Sectors();
  }

  public static function LoadSectors(Sectors $object) {
    //$url = "customer-sector/";
//    Remote::GetCollection($url, $object, function ($value) {
//              return new Sector(get_object_vars($value));
//            })
//    ;
    Dal::LoadCollection($object, 'customer-sector', array(), function ($value) {
              return new Sector(get_object_vars($value));
            });
  }

  public static function GetReferences() {
    return new References();
  }

  public static function LoadReferences($object) {
    Dal::LoadCollection($object, 'customer-reference', array(), function ($value) {
              return new Reference(get_object_vars($value));
            });
  }

  /*
    public static function GetLanguages() {
    return new Languages();
    }

    public static function GetLanguage($id) {
    return new Language(array(), array('id' => $id));
    }

    public static function LoadLanguages(Languages $object) {
    $url = "language/";
    Dal::LoadCollection($object, 'language', array(), function ($value) {
    return new Language(get_object_vars($value));
    });
    }

    public static function LoadLanguage(Language $object) {
    $id = $object->Get('id');
    if ($id) {
    Dal::Load($object, 'language', array($id));
    }
    }
   */

  public static function GetTypes() {
    return new Types();
  }

  public static function GetType($id) {
    return new Type(array(), array('id' => $id));
  }

  public static function LoadTypes(Types $object) {
    $url = "customer-type/";
//    Remote::GetCollection($url, $object, function ($value) {
//              return new Type(get_object_vars($value));
//            })
//    ;
    Dal::LoadCollection($object, 'customer-type', array(), function ($value) {
              return new Type(get_object_vars($value));
            })
    ;
  }

  public static function LoadType(Type $object) {
    if ($object->id) {
//      $url = "customer-type/$object->id";
//      $data = Remote::Get($url, $object);
      Dal::Load($object, 'customer-type', array($object->id));
    }
  }

  public static function GetGenders() {
    return new Genders();
  }

  public static function GetGender($id) {
    return new Gender(array(), array('id' => $id));
  }

  public static function LoadGenders(Genders $object) {
    $url = "gender/";
//    Remote::GetCollection($url, $object, function ($value) {
//              return new Gender(get_object_vars($value));
//            })
//    ;
    Dal::LoadCollection($object, 'gender', array(), function ($value) {
              return new Gender(get_object_vars($value));
            })





    ;
  }

  public static function LoadGender(Gender $object) {
    if ($object->id) {
//      $url = "gender/$object->id";
//      $data = Remote::Get($url, $object)      ;
      Dal::Load($object, 'gender', array($object->id));
    }
  }

//    public static function GetCountries() {
//      return new Countries();
//    }
//
//    public static function GetCountry($id) {
//      return new Country(array('id' => $id));
//    }
//
//    public static function LoadCountries(Countries $object) {
////    $url = "country/";
////    Remote::GetCollection($url, $object, function ($value) {
////              return new Country(get_object_vars($value));
////            })
////    ;
//
//      Dal::LoadCollection($object, 'country', array(), function ($value) {
//                        return new Country(get_object_vars($value));
//                      });
//    }
//
//    public static function LoadCountry(Country $object) {
//      $id = $object->Get('id');
//      if ($id) {
//        Dal::Load($object, 'country', array($id));
//      }
//    }
}

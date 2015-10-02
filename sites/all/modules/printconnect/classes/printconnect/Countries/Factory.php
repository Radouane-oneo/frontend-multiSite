<?php

// $Id$

/**
 * @file
 * Factory
 *
 * Factory for the Countries namespace
 */

namespace printconnect\Countries;

use printconnect\Dal\Rest\Remote;
use printconnect\Cache;
use printconnect\Dal;

class Factory {

  public static function GetCountries() {
    return new Countries();
  }

  public static function GetAll() {
    return new Countries();
  }

  public static function GetCountriesList()
  {
    return Dal::SendRequest('country/');
  }
  
  public static function GetAllActive() {
    $result = new Countries();
    $allCountries = $_self::GetAll();
    foreach ($allCountries as $country) {
      if ($country->active) {
        $result->Add($country);
      }
    }
    return $result;
  }

  public static function Get($id) {
    return new Country(array('id' => $id));
  }

  public static function LoadCountries(Countries $object) {
    Dal::LoadCollection($object, 'country', array(), function ($value) {
                      $country = new Country($value);
                      $country->loaded = TRUE;
                      return $country;
                    });
    //$object->Sort();
  }

  public static function LoadCountry(Country $object) {
    $id = $object->Get('id');
    if ($id) {
      Dal::Load($object, 'country', array($id));
    }
  }

}


<?php

namespace printconnect\bPost {

  use printconnect\Dal;

  class Factory {

    public static function Test() {
      $url = 'http://taxipost.geo6.be/locator?Format=xml&Function=search&Partner=999999&AppId=A01&Language=FR&Street=&Number=&Zone=TEST';
      $response = drupal_http_request($url);

      return ($response->code == 200);
    }

    public static function Search($postal, $place) {
      $pois = new POIs();
      if ($postal) {
        $zone = $postal;
      } elseif ($place) {
        $zone = $place;
      }

      $url = 'http://taxipost.geo6.be/locator?Format=xml&Function=search&Partner=999999&AppId=A01&Language=FR&Street=&Number=&Zone=' . urlencode($zone);

      $response = drupal_http_request($url);

      $result = $response->data;

      $xml = simplexml_load_string($result);

      $result = $xml->xpath("/TaxipostLocator/PoiList/Poi/Record");

      foreach ($result as $poi) {
        $pois->Add(self::GetDetail($poi->Id));
      }

      return $pois;
    }

    public static Function Get($id) {
        return self::GetDetail($id);
    }
     private function remplaceStr($string)
    {
        $string=trim($string);
        $string= strtr($string,"ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ","aaaaaaaaaaaaooooooooooooeeeeeeeecciiiiiiiiuuuuuuuuynn");
        return $string;
    }
    public static function GetDetail($poiId) {
      $cache = cache_get('pcbpost_' . $poiId);
      if ($cache) {
        $poi = $cache->data;
        return $poi;
      } else {
        $url = 'http://taxipost.geo6.be/locator?Format=xml&Function=info&Partner=999999&AppId=A01&Language=NL&Id=' . $poiId;
        $response = drupal_http_request($url);

        $xml = simplexml_load_string($response->data);
        $detail = $xml->xpath("/TaxipostLocator/Poi/Record[1]");
        $detail = $detail[0];

        $poi = new POI();

        $poi->Id = (string) $detail->ID;
//         $poi->Name = (string) self::remplaceStr($detail->OFFICE);
        $poi->Name = (string) $detail->OFFICE;
        $poi->Street = (string) $detail->STREET;
        $poi->Number = (string) $detail->NR;
        $poi->Zip = (string) $detail->ZIP;
        $poi->City = (string) $detail->CITY;
        $poi->Longitude = (string) $detail->Longitude;
        $poi->Latitude = (string) $detail->Latitude;
        $poi->Type = (int) $detail->Type;

        if (isset($detail)) {

          $openingHours = array();
          if (isset($detail->Hours)) {
            foreach ($detail->Hours->children() as $key => $hours) {
              $text = array();
              if (!empty($hours->AMOpen)) {
                $text[] = $hours->AMOpen . ' - ' . $hours->AMClose;
              }
              if (!empty($hours->PMOpen)) {
                $text[] = $hours->PMOpen . ' - ' . $hours->PMClose;
              }

              $openingHours[$key] = implode(', ', $text);
            }
          }
          $items = array();

          $services = $detail->Services->children();

          foreach ($services as $key => $service) {
            $items[] = (string) $service;
          }

          $poi->services = $items;

          $poi->openingHours = $openingHours;

          if ($detail->Type == 1) {
            $icon = 'postoffice.png';
          } else {
            $icon = 'postpoint.png';
          }
        }


        global $base_url;
        $path = $base_url . '/' . drupal_get_path('module', 'pcbpost') . '/' . $icon;
        $path = drupal_get_path('module', 'pcbpost') . '/' . $icon;

        $poi->Icon = $path;

        cache_set('pcbpost_' . $poi->Id, $poi);

        return $poi;
      }
    }

  }

}
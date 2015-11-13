<?php

namespace printconnect\Segments {

  use printconnect\Dal;

  class Factory {

    public static function GetAll($language = FALSE, $dal = FALSE, $all = FALSE, $cache = TRUE) {
      $host = $_SERVER['HTTP_HOST'];
      $parts = explode('.', $host);
      $subdomain = $parts[0];
      global $conf;
      if (isset($conf['cobrandedshops']) && array_key_exists($subdomain, $conf['cobrandedshops'])) {
	$object = new Segments(array(), array(), FALSE, $language);
	$params = array();
	Dal::LoadCollection($object, 'segment', $params, function ($value) {
	    $object = new Segment($value);
	    $object->loaded = TRUE;
	    return $object;
        }, $cache, $dal);
        $object->loaded = true;
        return $object;
      }
      $basedPath = variable_get('pc_segment_json_path');
      $object = new Segments(array(), array(), FALSE, $language);
      global $language;
      $fileName = null;
      switch($language->language) {
        case 'fr-Be':
            $fileName = 'flyerBe-fr-all.json';
        break;
        case 'nl-BE':
            $fileName = 'flyerBe-nl-all.json';
        break;
        case 'fr-FR':
            $fileName = 'flyerFr-fr-all.json';
        break;
        case 'lu-FR':
            $fileName = 'flyerLu-fr-all.json';
        break;
        case 'nl-NL':
            $fileName = 'flyerNl-nl-all.json';
        break;
      }
      $check = file_exists($basedPath.$fileName);
      if (!$check || filesize($basedPath.$fileName) <= 0) {
        $response = Dal::SendRequest('segment');
        $data = $response->data;
        file_put_contents($basedPath.$fileName, $data);
        $data = json_decode($data);
      } else {

      $data = file_get_contents($basedPath.$fileName);
      if (0 === strpos(bin2hex($data), 'efbbbf')) {
          $data = $obj = json_decode(substr($data,3));
      } else {
          $data = json_decode($data);
      }
	 }
      foreach ($data as $segment) {
          $seg = new Segment($segment);
          $object->add($seg);
      }
      return $object;
    }
    
    public static function Get($id, $language = FALSE) {
      $segment = new Segment(array('id' => $id), TRUE, $language);
      global $language;
      $fileName = null;
      $basedPath = variable_get('pc_segment_json_detail_path');
      switch($language->language) {
        case 'fr-Be':
            $fileName = 'flyerBe-fr-'.$id.'.json';
        break;
        case 'nl-BE':
            $fileName = 'flyerBe-nl-'.$id.'.json';
        break;
        case 'fr-FR':
            $fileName = 'flyerFr-fr-'.$id.'.json';
        break;
        case 'lu-FR':
            $fileName = 'flyerLu-fr-'.$id.'.json';
        break;
        case 'nl-NL':
            $fileName = 'flyerNl-nl-'.$id.'.json';
        break;
      }
      $check = file_exists($basedPath.$fileName);
      if (!$check) {
	$response = Dal::SendRequest('segment/segment/'. $id);
	$data = $response->data;
	file_put_contents($basedPath.$fileName, $data);
	$data = json_decode($data);
      } else {
          $data = file_get_contents($basedPath.$fileName);
          if (0 === strpos(bin2hex($data), 'efbbbf')) {
              $data = $obj = json_decode(substr($data,3));
          } else {
              $data = json_decode($data);
          }
      }
      $segment->LoadProperties($data);
      return $segment;
    }

    public static function LoadSegment(Segment $object) {
      
    }

    public static function LoadSegmentTemplate($id) {
      $object = new Segments(array(), array(), FALSE, $language);
      $params = array("segmentId" => $id );
         Dal::LoadCollection($object, 'design-template', $params, function ($value) {
                   $object = new Segment($value);
                   $object->loaded = TRUE;
                   return $object;
                 }, $cache, $dal);
         $object->loaded = true;

         return $object;
       }
     }

}

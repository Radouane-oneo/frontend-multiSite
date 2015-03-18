<?php

namespace printconnect\Segments {

  use printconnect\Dal;

  class Factory {

    public static function GetAll($language = FALSE, $dal = FALSE, $all = FALSE, $cache = TRUE) {
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

    public static function Get($id, $language = FALSE) {
      return new Segment(array('id' => $id), TRUE, $language);
    }

    public static function LoadSegment(Segment $object) {
      $id = $object->Get('id');      
      if ($id) {
        Dal::Load($object, 'segment', array('segment' => $id), TRUE);
      };
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
<?php

namespace printconnect\Designer\Upload {

  use printconnect\Dal;

  class Factory {

    public static function Get($id, $cache = TRUE) {
      return new Upload(array('id' => $id), $cache);
    }

    public static function LoadUpload(Upload $object) {
      $id = $object->Get('id');

      if ($id) {
        Dal::Load($object, 'upload-design', array('id' => $id), $object->cache);
      }
    }
    
    public static function Save(Upload &$object){
       return Dal::Save($object, 'upload-design', array());
    }

    public static function Confirm(Upload &$object) {
     return  Dal::Save(new \printconnect\Object(), 'upload-design-confirm', array('hash' => $object->hash));
    }
    
  }

}

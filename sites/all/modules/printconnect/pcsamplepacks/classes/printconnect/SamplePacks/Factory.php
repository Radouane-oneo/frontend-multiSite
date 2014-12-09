<?php

namespace printconnect\SamplePacks {

  use printconnect\Dal;

  class Factory {

    public static function Create() {
      return new SamplePack();
    }

    public static function Get($id) {
      return new SamplePack(array('id' => $id));
    }

    public static function LoadSamplePack(SamplePack $object) {
      $id = $object->Get('id');
      if ($id) {
        Dal::Load($object, 'samplepack', array($id));
        $object->country = \printconnect\Countries\Factory::Get($object->country);
        $object->language = \printconnect\Languages\Factory::Get($object->language);
      }
    }
    
  public static function GetAll(){
            $SampleFlips = new \printconnect\SamplePacks\SampleFlips(array(), array());
            return $SampleFlips;
}
        
  public static function LoadSampleFlip($object){
                Dal::LoadCollection($object, 'sampleflip', array(), function ($value) {
                    $sampleflip = new \printconnect\SamplePacks\SampleFlip($value);
                    $sampleflip->loaded = TRUE;
                    return $sampleflip;
                });
                return $object;
        }
        
    
    public static function Save(SamplePack $object) {
      $id = $object->Get('id');
      if ($id) {
        Dal::Save($object, 'samplepack', array($id));
      } else {
        Dal::Save($object, 'samplepack', array());
      }
    }

  }

}
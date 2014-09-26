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
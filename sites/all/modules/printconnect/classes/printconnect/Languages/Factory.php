<?php

namespace printconnect\Languages {

  use printconnect\Dal;

  class Factory {

    public static function GetAll() {
      return new Languages();
    }

    public static function Get($id) {
      return new Language(array('id' => $id));
    }

    public static function GetByLocale($locale) {
      return new Language(array('locale' => $locale));
    }

    public static function LoadLanguages(Languages $object) {
      Dal::LoadCollection($object, 'language', array(), function ($value) {
                        $language = new Language(get_object_vars($value));
                        $language->loaded = TRUE;
                        return $language;
                      });
    }

    public static function LoadLanguage(Language $object) {
      $id = $object->Get('id');
      if ($id) {
        Dal::Load($object, 'language', array($id));
      } else {
        $locale = $object->Get('locale');
        Dal::Load($object, 'language', array('locale' => $locale));
      }
    }

  }

}


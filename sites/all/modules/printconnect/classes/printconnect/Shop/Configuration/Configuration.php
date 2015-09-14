<?php

namespace printconnect\Shop\Configuration {

  class Configuration extends \printconnect\Object {

    protected function OnLoad() {
      parent::OnLoad();
      $this->debug = TRUE;
      $this->traceLevel = 10;
//      $this->languages = variable_get('languages', array(
//                  'nl-be' => 'NL',
//                  'fr-be' => 'FR',
//              ));
    }

    public function GetLanguage($language) {
      foreach ($this->languages as $shopLanguage) {
        if (strtolower($shopLanguage->displayCode) == strtolower($language)) {
          return $shopLanguage;
        }
      }
      return FALSE;
    }

  }

}
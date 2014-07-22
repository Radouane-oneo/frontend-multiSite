<?php

namespace printconnect\Drupal\Configuration {

  class Configuration extends \printconnect\Object {

    protected function OnLoad() {
      $this->debug = TRUE;
      $this->traceLevel = 10;
      $this->languages = variable_get('languages', array(
                  'nl-be' => 'NL',
                  'fr-be' => 'FR',
              ));
    }

  }

}
<?php

namespace printconnect\PaymentMethods {

  use printconnect\Object;

  class PaymentMethod extends Object {

    public function CalculateCost($amount) {
      return (($amount * ($this->rate)) + $this->cost);
    }

    public function get_confStrings() {

      $confStrings = explode(',', $this->paymentMethod->configuration);
      $conf = array();
      foreach ($confStrings as $confString) {
        $parts = explode('=', $confString);
        if (count($parts) > 1) {
          $conf[strtoupper(trim($parts[0]))] = strtoupper($parts[1]);
        }
      }

      return $conf;
    }

    public function get_brand() {
      $conf = $this->confStrings;
      if (isset($conf['BRAND'])) {
        return $conf['BRAND'];
      }
      return FALSE;
    }

    public function get_pm() {
      $conf = $this->confStrings;
      if (isset($conf['PM'])) {
        return $conf['PM'];
      }
      return FALSE;
    }

  }

}
<?php

namespace printconnect\bPost {

  class POI extends \printconnect\Object {

    public function get_openingHours() {
      if ($this->_properties['openingHours']) {
        return $this->_properties['openingHours'];
      } else {
        $detail = Factory::GetDetail($this);
        return $this->_properties['openingHours'];
      }
    }

    public function get_Type() {
      if ($this->Get('Type', true) == 1) {
        return 'office';
      } else {
        return'point';
      }
    }

    public function get_cartObject() {
      $result = new \printconnect\Object();
      $result->address = $this->Street . ' ' . $this->Number;
      $result->postalCode = $this->Zip;
      $result->city = $this->City;
      $result->country = 'BE';
      $result->pickupPointId = $this->Id;
      $result->name = $this->Name;
      $result->id = $this->Id;
      return $result;
    }

  }

}

  
<?php

namespace printconnect\Stores {

  class Store extends \printconnect\Object {

    public function get_cartObject() {
      $result = new \printconnect\Object();
      $this->EnsureLoaded();
      $result->address = $this->address;
      $result->postalCode = $this->postalCode;
      $result->city = $this->city;
      $result->country = $this->country;
      $result->pickupPointId = $this->id;
      $result->name = $this->name;
      $result->id = $this->id;
      $result->photo = $this->photo;
      if ($this->HasProperty('contactName')) {
        $result->contactName = $this->contactName;
      }
      if ($this->HasProperty('email')) {
        $result->email = $this->email;
      }
      if ($this->HasProperty('phone')) {
        $result->phone = $this->phone;
      }
       if ($this->HasProperty('contactEmail')) {
        $result->email = $this->contactEmail;
      }
      if ($this->HasProperty('contactPhone')) {
        $result->phone = $this->contactPhone;
      }
      return $result;
    }

  }

}

  
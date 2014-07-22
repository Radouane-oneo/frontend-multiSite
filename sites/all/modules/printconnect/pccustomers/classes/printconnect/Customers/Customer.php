<?php

namespace printconnect\Customers;
use printconnect\Object;
use printconnect\Customers\Factory;

class Customer extends Object {
  public function get_name() {
    return $this->firstName . ' ' . $this->lastName;
  }
}

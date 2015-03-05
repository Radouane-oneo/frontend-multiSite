<?php

namespace printconnect\Customers;
use printconnect\Collection;

class Countries extends Collection {
  protected function OnLoad() {
    return Factory::LoadCountries($this);
  }
}

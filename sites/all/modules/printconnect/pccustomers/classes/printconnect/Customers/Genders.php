<?php

namespace printconnect\Customers;
use printconnect\Collection;

class Genders extends Collection {
  protected function OnLoad() {
    return Factory::LoadGenders($this);
  }
}

<?php

namespace printconnect\Customers;
use printconnect\Object;

class Gender extends Object {
  protected function OnLoad() {
    return Factory::LoadGender($this);
  }
}

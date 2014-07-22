<?php
namespace printconnect\Customers{
use printconnect\Collection;

class Types extends Collection {

  protected function OnLoad() {
    return Factory::LoadTypes($this);
  }
}

}
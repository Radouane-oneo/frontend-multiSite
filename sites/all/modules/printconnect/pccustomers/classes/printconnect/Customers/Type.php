<?php
namespace printconnect\Customers{
use printconnect\Object;

class Type extends Object {

  protected function OnLoad() {
    return Factory::LoadType($this);
  }
}

}
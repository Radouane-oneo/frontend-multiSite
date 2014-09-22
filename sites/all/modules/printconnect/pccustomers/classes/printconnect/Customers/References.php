<?php
namespace printconnect\Customers{
class References extends \printconnect\Collection {
  protected function OnLoad() {
    return Factory::LoadReferences($this);
  }
}
}
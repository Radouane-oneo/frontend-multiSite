<?php
namespace printconnect\Customers{
class Sectors extends \printconnect\Collection {
  protected function OnLoad() {
    return Factory::LoadSectors($this);
  }
}
}
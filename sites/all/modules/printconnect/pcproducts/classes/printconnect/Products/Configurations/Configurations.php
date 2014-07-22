<?php

namespace printconnect\Products\Configurations {

  use printconnect\Collection;
use printconnect\Products\Toolbox;

  class Configurations extends Collection {

    public function Filter($toolboxItemId) {
      $result = new Configurations();
      $priceGroups = array();
      foreach ($this as $config) {
        if ($config->toolboxItem == $toolboxItemId) {
          $priceGroups[] = $config->priceGroup;
        }
      }

      foreach ($this as $config) {
        if (in_array($config->priceGroup, $priceGroups)) {
          $result->Add($config);
        }
      }

      return $result;
    }

    public function GetPriceGroup($items) {
      $configs = $this->GetMatches($items);
      if (count($configs)) {
        return $configs[0]->priceGroup;
      }

      //var_dump($configs);
    }

    public function GetTypeItems() {
      $items = new Toolbox\Items();
      foreach ($this as $config) {
        if ($config->level == 1) {
          if (!$items->Exists($config->toolboxItem->id)) {
            //$item = new Toolbox\Item(array('id' => $config->toolboxItem->id, 'name' => $config->toolboxItem->name));
           // $item = Toolbox\Factory::Get($config->toolboxItem->id);
            $items->Add(new Toolbox\Item((array)$config->toolboxItem), $config->toolboxItem->id);
          }
        }
      }
      return $items;
    }

    public function GetGroups() {
      $groups = new Toolbox\Groups();
      foreach ($this as $config) {
        if ($config->level > 1) {
          $toolboxItem = Toolbox\Factory::Get($config->toolboxItem);

          if (!$groups->Exists($toolboxItem->group)) {
            $group = Toolbox\Factory::GetGroup($toolboxItem->group);
            $groups->Add($group, $group->id);
          }
        }
      }
      return $groups;
    }

    public function Sort() {
      usort($this->_items, function (Configuration $a, Configuration $b) {
                if ($a->level > $b->level) {
                  return 1;
                } elseif ($a->level < $b->level) {
                  return -1;
                } else {
                  return ($a->sequence > $b->sequence);
                }
              });
    }

  }

}



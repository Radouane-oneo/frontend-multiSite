<?php

namespace printconnect\Products\Toolbox {

  use printconnect\Dal;
use printconnect\Products\Product;

  class Factory {

    public static function Get($id, $language= FALSE) {
      return new Item(array('id' => $id), TRUE, $language);
    }

    public static function LoadItem(Item $object) {
      $id = $object->Get('id');
      if ($id) {
        Dal::Load($object, 'toolbox-item', array($id), TRUE, $object->language);
      };
    }

    public static function GetGroup($id) {
      return new Group(array('id' => $id));
    }

    public static function LoadGroup(Group $object) {
      $id = $object->Get('id');
      if ($id) {
        Dal::Load($object, 'toolbox-group', array($id));
      };
    }

  }

}
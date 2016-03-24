<?php

namespace printconnect\DesignTool\Templates {

  use printconnect\DesignTool\Dal;

  class Factory {

    public static function Get($id) {
      return new Template(array('id' => $id));
    }

    public static function LoadTemplate(Template $object) {
      $dal = new Dal();
      \printconnect\Dal::Load($object, 'template', array('list', 'template' => $object->id), FALSE, $dal);
      $templates = $object->templates;
      if (count($templates) > 0) {
        $object->LoadFromArray($object->templates[0]);
        $object->set_loaded(TRUE);
      } else {
        $object->LoadFromArray(array('thumbnails' => array()));
        $object->set_loaded(TRUE);
      }
    }

  }

}
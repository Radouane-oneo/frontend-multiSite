<?php

namespace printconnect\Products\Templates {

  use \printconnect\Dal;

  class Factory {
    public static function GetTemplates($productId, $items, $templateId = NULL) {
      $object = new Templates();
      try {
          if($productId) {
              $data = array('productId' => $productId, 'toolboxItem' => implode(',', $items));
          }else {
              $data = array('templateId' => $templateId);
          }

          Dal::LoadCollection($object, 'template', $data, function ($value) {
              $template = new Template($value);
              $template->loaded = TRUE;
              return $template;
          });

          return $object;
      } catch (\printconnect\Dal\NotFoundException $ex) {
          return $object;
      }
    }
  }

}
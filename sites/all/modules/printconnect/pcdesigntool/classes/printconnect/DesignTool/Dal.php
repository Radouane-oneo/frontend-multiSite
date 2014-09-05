<?php

namespace printconnect\DesignTool {

  class Dal extends \printconnect\Rest\Dal {

    public function __construct() {
      $url = variable_get('pc_designtoolurl', 'http://designtool.stg.printconnect.com');
      $url .= '/';
      parent::__construct($url, '683b294b46464c455e4c277244', 30);
    }

    protected function GetUrl($entity, $params, $validateOnly = FALSE, $language = FALSE, $apikey = FALSE) {
      $url = $this->url . $entity;
      $impkey = variable_get('pc_designtoolimpkey', 'printconcept');

      if ($params && count($params) > 0) {
        foreach ($params as $key => $value) {
          if (is_string($key)) {
            $url .= '/' . urlencode($key) . '/' . urlencode($value);
          } else {
            $url .= '/' . urlencode($value);
          }
        }
      } else {
        $url .= '/';
      }

      $url .= "/apikey/$this->apikey/impkey/$impkey";

      return $url;
    }

  }

}
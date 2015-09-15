<?php

namespace printconnect\Templates {

  use \printconnect\Collection;

  class Templates extends Collection {
   
    public function GetActive() {
   $result = array();
      global $user;

     foreach ($this->_items as $item) {
        if ($item->active) {
          $result[] = $item;
        }
      }
      usort($result, function(Template $a, Template $b) {
                return ($a->sortOrder < $b->sortOrder);
              });
 
      //$result = array_reverse($result);
      
      return $result;
    }
  }

}
<?php

namespace printconnect\Stores\Maps {

  class Country extends \printconnect\Object {

    public function __construct($regions, $width, $height) {
      parent::__construct(array('regions' => $regions, 'width' => $width, 'height' => $height));
    } 
        

  }

}
<?php

namespace printconnect\Shipping\Types {

  class Types extends \printconnect\Collection {

    public function Sort() {
      usort($this->_items, function (Type $a, Type $b) {
                return ($a->price > $b->price);
              });
    }

  }

}

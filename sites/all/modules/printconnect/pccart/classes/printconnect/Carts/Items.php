<?php

namespace printconnect\Carts {

  class Items extends \printconnect\Collection {

    public function Sort() {
      usort($this->_items, function (Item $a, Item $b) {
                return ($a->id < $b->id);
              });
    }

  }

}

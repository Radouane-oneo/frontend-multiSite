<?php

namespace printconnect\Products {

  use printconnect\Collection;

  class Products extends Collection {

//    protected function OnLoad() {
//      return Factory::LoadProducts($this);
//    }

    public function Sort() {
      usort($this->_items, function (Product $a, Product $b) {
                return ($a->sortSequence > $b->sortSequence);
              });
    }

  }

}
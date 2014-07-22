<?php

namespace printconnect\PaymentMethods {

  use printconnect\Collection;

  class PaymentMethods extends Collection {

    public function Sort() {
      usort($this->_items, function (PaymentMethod $a, PaymentMethod $b) {
                return ($a->cost > $b->cost);
              });
    }

  }

}
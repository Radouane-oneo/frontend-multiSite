<?php

namespace printconnect\Shipping\Types {

  class Type extends \printconnect\Object {

    public function get_isPickup() {
      if ($this->shippingType->deliveryType == 'deliveryTypeDeliver' || $this->shippingType->deliveryType == 'deliveryTypePostal') {
        return FALSE;
      }
      return TRUE;
    }

  }

}

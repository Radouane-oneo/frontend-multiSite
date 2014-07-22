<?php

namespace printconnect\Carts {

  class Cart extends \printconnect\Object {

    public function Clear() {
      // $this->items->Clear();
    }

//    public function get_items(){
//        return $this->orderItems;
//    }

    public function get_itemsArray() {
      $result = array();
      foreach ($this->items as $item) {
        $result[$item->id] = $item;
      }
      return $result;
    }

    /*
      public function set_ShippingType($value) {
      $this->shipping_type = $value;
      }
     */

    public function get_productItems() {
      $result = array();
//       

      foreach ($this->orderItems as $item) {
        if (isset($item->configuration)) {
          $result[$item->id] = $item;
        }
      }

      return $result;
    }

    public function get_discountItems() {
      $result = array();
//      foreach ($this->items as $item) {
//        if ($item->discountId) {
//          $result[$item->id] = $item;
//        }
//      }

      foreach ($this->orderItems as $item) {
        if (!isset($item->configuration)) {
          $result[$item->id] = $item;
        }
      }

      return $result;
    }

    public function get_subTotalAmountWithoutPayment() {
      //drupal_set_message(print_r($this,TRUE));
      $value = $this->subTotalAmount;
      foreach ($this->orderItemsPayment as $payment) {
        if ($payment->type == 'payment' || $payment->type == 'credit') {
          $value -= ( $payment->price);
        }
      }
      return $value;
    }

    
    public function get_storeCreditUsed() {
      //drupal_set_message(print_r($this,TRUE));
      $value = FALSE;
      foreach ($this->orderItemsPayment as $payment) {
        if ($payment->type == 'credit') {
          $value -= ( $payment->price);
        }
      }
      return $value;
    }
    
    public function get_isPickup() {

      $shippingType = FALSE;

      if ($this->HasProperty('shipping_type')) {
        $shippingType = $this->shipping_type;
      }

      if ($shippingType) {
        $type = \printconnect\Shipping\Types\Factory::Get($shippingType);
        return $type->isPickup;
      }
      if (isset($this->orderItemShipping->shippingTypeResellerShop)) {
        try {
          $type = \printconnect\Shipping\Types\Factory::Get($this->orderItemShipping->shippingTypeResellerShop);
          return $type->isPickup;
        } catch (\printconnect\Dal\NotFoundException $ex) {
          return $false;
        }
      }
      return TRUE;
    }

    /*
      public function get_ShippingType() {
      if (isset($this->shipping_type)) {
      return $this->shipping_type;
      switch ($this->shipping_type) {
      case 3:
      return 'pickup';
      break;
      case 2:
      return 'delivery';
      break;
      }
      }
      if (isset($this->orderItemShipping->shippingTypeResellerShop)) {
      return $this->orderItemShipping->shippingTypeResellerShop;
      switch ($this->orderItemShipping->shippingTypeResellerShop) {
      case 3:
      return 'pickup';
      break;
      case 2:
      return 'delivery';
      break;
      }
      } else {
      return 3;
      return 'pickup';
      }
      }
     */

    public function get_subTotalAmount() {
      return $this->Get('subTotalAmount', TRUE);
    }

    public function get_totalAmount() {
      return $this->Get('totalAmount', TRUE);
    }

    public function get_vatAmount() {
      return $this->Get('vatAmount', TRUE);
    }

    public function get_subTotalWithoutPayment() {
      $amount = 0;
      foreach ($this->orderItems as $item) {
        $amount += $item->price * (1 - $item->discount);
      }
      return $amount;
    }

    public function get_onlyPostal() {
      if (count($this->orderItems) == 0 && $this->hasVouchers) {
        return true;
      } else {
        return false;
      }
    }

    public function get_hasVouchers() {
      return count($this->giftVouchers) > 0;
    }

    public function get_isFilled() {
      $result = count($this->orderItems) > 0 || count($this->giftVouchers) > 0;
      return $result;
    }

    public function get_count() {
      return count($this->productItems) + count($this->giftVouchers);
    }

    public function get_socialcardsOnly() {
      foreach ($this->productItems as $item) {
        if ($item->configuration->productId != 38) {
          return false;
        }
      }
      return true;
    }

    public function get_uniqueVatPercentage() {
      $vat = FALSE;
      foreach ($this->orderItems as $item) {
        if ($vat && $vat != $item->vat) {
          return FALSE;
        }
        $vat = $item->vat;
      }
      return $vat;
    }

    public function get_allFilesUploaded() {
      $vat = FALSE;
      $selectedItem = array();
      foreach ($this->orderItems as $value) {
          if(!$value->discountId){
            $selectedItem[] = $value;
          }
      }
      foreach ($selectedItem as $item) {
        if (!count($item->files) && !$item->emailDesigner) {
          return FALSE;
        }
      }

      return TRUE;
    }

  }

}

  
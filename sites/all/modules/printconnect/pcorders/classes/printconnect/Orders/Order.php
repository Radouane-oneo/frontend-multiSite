<?php

namespace printconnect\Orders {

  use printconnect\Object;

  class Order extends Object {

//  public function get_path(){
//    return 'http://admin.dev.printconnect.com/fileserver-file/download/ticket/' . $this->pdf;
//  }
//
    public function get_number() {
      $creationDate = $this->creationDate;
      $year = date('y', strtotime($creationDate));
      if ($this->oldId) {
        return $this->oldId;
      }
      return 'OR' . $year . '-' . $this->id;
    }

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

    public function get_expectedShippingDate() {
      if ($this->HasProperty('expectedShippingDate', TRUE)) {
        return $this->Get('expectedShippingDate', TRUE);
      } else {
        return $this->finishedDate;
      }
    }

    public function get_itemsSubTotal() {
      $amount = 0;
      foreach ($this->productItems as $item) {
        $amount += $item->price * (1 - $item->discount);
      }
      return $amount;
    }

    public function get_subTotalWithoutPayment() {
      $amount = 0;
      foreach ($this->orderItems as $item) {
        $amount += $item->price * (1 - $item->discount);
      }
      return $amount;
    }

    public function get_status() {
      if (is_object($this->orderStatus)) {
        return $this->orderStatus->name;
      } else {
        return $this->orderStatus;
      }
    }

//    public function get_giftVouchers(){
//      $result = $this->_properties['giftVouchers'];
//      
//     return $result;
//    }
  }

}
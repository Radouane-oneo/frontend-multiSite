<?php
namespace printconnect\Invoices{
use printconnect\Object;

class Invoice extends Object {
  
  public function get_balance(){
    return $this->totalAmount - $this->paid;
   
  }

  public function get_paid(){
    $result = 0;
    foreach ($this->payments as $payment){
      $result += $payment->amount;
    }
    return $result;
  }

  public function get_paymentmethodIcon(){
    foreach ($this->payments as $payment){
       return \printconnect\Drupal\Functions::GetImage('paymentmethods', $payment->type);
    }
    return false;
  }

  public function get_path(){
    return \printconnect\Files\Factory::getFileUrl($this->pdf);
    return 'http://admin.dev.printconnect.com/fileserver-file/download/ticket/' . $this->pdf;
  }

//  public function get_number(){
//    return  'IN10-' . $this->id;
//  }

}
}
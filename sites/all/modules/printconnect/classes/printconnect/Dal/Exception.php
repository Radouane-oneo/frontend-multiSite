<?php

// $Id$

/**
 * @file
 * Exception
 *
 * printconnect\Dal\Exception class
 */

namespace printconnect\Dal {

  class Exception extends \Exception {

    public $errors = array();
    public $action;
    public $data;
    
    public function __construct($action, $data, $errors) {
      
       $this->action = $action ;

      if (is_array($data)) {
        $this->data .= implode("\n", $data);
      } else {
        $this->data .= $data;
      }
      $this->errors = $errors;
     
      $message = "Rest exception\n";
      $message .= "\nAction\n";
      $message .= $this->action;
      $message .= "\n";
      
      $message .= "\nData\n";
      $message .= $this->data;
      $message .= "\n";
      
      $message .= "\nErrors\n";
      $message .= implode("\n", $errors);
      $message .= "\n";
             
      parent::__construct($message);

    }



  }

}
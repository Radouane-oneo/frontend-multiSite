<?php

namespace printconnect\Customers\Designs;
use printconnect\Object;

class Design extends Object {

  
   public function get_lastEdited(){
     if ($this->HasProperty('updatedDate')){
       return strtotime($this->updatedDate);
     }
     else{
       return strtotime($this->creationDate);
     }
   }
}

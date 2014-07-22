<?php
namespace printconnect\Products {
  use printconnect\Object;
  class Product extends Object {

//    protected function OnLoad() {
//      return Factory::Load($this);
//    }

    public function get_name(){
      $name = $this->Get('name', TRUE);

      if (is_object($name)){
        return $name->name;
      }
      else{
        return $name;
      }
    }

     public function get_longDescription(){
      $name = $this->Get('name', TRUE);

      if (is_object($name)){
        return $name->longDescription;
      }
    }

     public function get_shortDescription(){
      $name = $this->Get('name', TRUE);

      if (is_object($name)){
        return $name->shortDescription;
      }
    }

     public function get_baseline(){
      $name = $this->Get('name', TRUE);

      if (is_object($name)){
        return $name->baselineDescription;
      }
    }

  }

}
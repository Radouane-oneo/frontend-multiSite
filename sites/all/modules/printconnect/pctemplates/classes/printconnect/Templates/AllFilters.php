<?php

namespace printconnect\Templates{
use \printconnect\Collection;
class AllFilters extends Collection {
public function GetActiveFilters() {
        $filtertemplateItme = array();
        $filtertemplateFilter = array();
        $filtertemplates = array();
        $resultfilters = array();
        $result = array();
        $resultfilter = $this;
        $resultfilters[] = get_object_vars($resultfilter);
        foreach ($resultfilters as $filtertemplates) {
         foreach ($filtertemplates as $filtertemplateItme) {      
           foreach ($filtertemplateItme as $filtertemplateFilter) { 
             array_push($result, $filtertemplateFilter); 
           }
         } 
        }
       return $result;
    }
  }
}

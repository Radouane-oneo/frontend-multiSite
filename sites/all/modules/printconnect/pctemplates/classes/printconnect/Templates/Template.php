<?php

namespace printconnect\Templates {

  use printconnect\Object;

  class Template extends Object {

    public function get_Dimension() {
      $filters = $this->filters;
      $dimFilter = $this->filters[0];
      return $dimFilter->items[0];
    }

    public function get_Product() {
      return $this->products[0];
    }

    public function get_Orientation() {
      $filters = $this->filters;
      $orientationFilter = $this->filters[1];
      return $orientationFilter->items[0];
    }

    public function IsEligible($property, array $values) {
      if (count($values)) {


        if ($this->HasProperty($property)) {
          $propertyValues = $this->Get($property);
          foreach ($values as $value) {
            if (in_array($value, $propertyValues)) {
              return true;
            }
          }
        }
        return false;
      } else {
        return true;
      }
    }

    public function get_filtersArray() {
      $result = array();
      foreach ($this->filters as $filter) {
        foreach ($filter->items as $item) {
          $result[$filter->id][] = $item->id;
        }
      }
      return $result;
    }

  }
}
<?php
// $Id$

/**
 * @file
 * Countries
 *
 * Collection of Countries
 */
namespace printconnect\Countries{
class Countries extends \printconnect\Collection {

    public function Sort(){
      usort($this->_items, function (Country $a, Country $b)        {
        return ($a->weight >= $b->weight);
      });
    }
}
}
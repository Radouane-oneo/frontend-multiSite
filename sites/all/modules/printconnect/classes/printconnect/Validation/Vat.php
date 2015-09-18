<?php

namespace printconnect\Validation;

use printconnect\Object;
use printconnect\Dal;


class Vat
{

    /**
     * Validate Vat number
     *
     * @param $number
     * @return boolean
     */
    public static function validate( $number)
    {
        $object = new Object();
        Dal::Load($object, 'vat', array('vatNumber' =>  $number, 'validate' => 'true'));
        return $object->valid;
    }
}
<?php
namespace printconnect\Validation;

class PostalCode
{
    /**
     * @param $element
     * @param $country
     *
     * Validation for the postal codes
     */
    public static function validate($element, $country)
    {
        $valid = false;
        switch ($country->iso) {
            case 'NL' :
                $valid = preg_match("/^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/", $element['#value']);
                break;
            case 'FR' :
                $valid = preg_match("/^(F-)?((2[A|B])|[0-9]{2})[0-9]{3}$/", $element['#value']);
                break;
            case 'GB' :
                $valid = preg_match(
                    "/^([A-Z]{1,2}[0-9]{1,2}|[A-Z]{3}|[A-Z]{1,2}[0-9][A-Z])( |-|)[0-9][A-Z]{2}/"
                    , $element['#value']
                );
                break;
            case 'LU' :
                $valid = preg_match("/^[1-9]{1}[0-9]{3}$/", $element['#value']);
                break;
            case 'BE' :
                $valid = preg_match("/^[1-9]{1}[0-9]{3}$/", $element['#value']);
                break;
            case 'ES' :
                $valid = preg_match("/^([1-9]{2}|[0-9][1-9]|[1-9][0-9])[0-9]{3}$/", $element['#value']);
                break;
            default :
                if (!empty($element['#value'])) {
                    $valid = true;
                }
                break;

        }

        return $valid;
    }
}
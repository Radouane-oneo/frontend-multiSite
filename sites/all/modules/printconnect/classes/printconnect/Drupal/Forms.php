<?php

// $Id$

/**
 * @file
 * Forms
 *
 * Specific functions for Drupal forms
 */

namespace printconnect\Drupal {

  class Forms {

    public static function LoadObject($properties, \printconnect\Object &$object) {
      foreach ($properties as $property => $value) {
        //if (isset($form[$property]['#type'])) {
        //if (!empty($properties[$property])) {
        $object->$property = $value;
        //}
        // }
      }
    }

    public static function LoadElement(&$element, $properties) {
      foreach (element_children($element) as $property) {
        if (array_key_exists($property, $properties)) {
          $value = $properties[$property];

          if ($element[$property]['#type'] == 'item') {
            $element[$property]['#markup'] = $value;
          } else {
            $element[$property]['#value'] = $value;
          }
        }
      }
    }

    public static function HandleException(\printconnect\Dal\Exception $ex, $element, $structure = '') {
      if (count($ex->errors) > 0) {
        foreach ($ex->errors as $key => $error) {
          if (is_string($key) && !empty($element[$key])) {
            if (!empty($element[$key]['#title'])) {
              form_set_error($structure . $key, t($element[$key]['#title']) . ' ' . t($error));
            } else {
              form_set_error($structure . $key, t($key) . ' ' . t($error));
            }
          } else {
            form_set_error($structure, t($error));
          }
        }
      } else {
        form_set_error($structure, 'A general exception occured.');
      }
    }

    public static function Date($date) {
      $date = str_replace('CEST', ' ', $date);
      $date = substr($date, 0, 10);
      $date = strtotime($date);
      //var_dump($date);
      //return $date;
      return array(
          'day' => date('j', $date),
          'month' => date('n', $date),
          'year' => date('Y', $date),
      );
    }

  }

}

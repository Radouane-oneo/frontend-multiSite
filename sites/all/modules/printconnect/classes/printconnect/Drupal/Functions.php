<?php

// $Id$

/**
 * @file
 * Functions
 *
 * Specific Drupal functions
 */

namespace printconnect\Drupal {

  use printconnect\Diagnostics\Debug;

  class Functions {

    public function Login($email, $password) {
      $customer = \printconnect\Customers\Factory::Login($email, $password);
      if ($customer) {
        return $customer;
      } else {
        drupal_set_message(t('Cannot log in'), 'error');
        return false;
      }
    }

    public static function HandleException(\Exception $ex) {
      global $user;
      Debug::LogException($ex);

      //drupal_mail('printconnect', 'error', variable_get('site_mail', 'ewald.de.wreede@printconnect.com'), 'nl', array('exception' => $ex));
      if ($user->uid) {
        drupal_set_message($ex->GetMessage(), 'error');
        drupal_add_http_header('Status', '500 Service unavailable (with message)');
        return '<pre>' . print_r($ex, true) . '</pre>';
      } else {
        drupal_set_message(t('An exception occurred.'), 'error');
        drupal_add_http_header('Status', '500 Service unavailable (with message)');
        return t('An exception occurred.');
      }
    }

    public static function FormatNumber($value, $decimals = 2) {
      $decimalSeparator = variable_get('decimal_separator', '.');
      $thousandSeparator = variable_get('thousand_separator', ',');

      return number_format($value, $decimals, $decimalSeparator, $thousandSeparator);
    }

    public static function IsValidPath($path) {
      return drupal_valid_path($path, TRUE) || drupal_lookup_path('source', $path);
    }

    public static function FormatCurrency($value) {
      return self::FormatNumber($value);
    }

    public static function Round($value, $decimals = 2) {
      return round($value, $decimals);
    }

    public static function GetImage($type, $id) {
      $cache = &drupal_static(__FUNCTION__);
      if (!$cache) {
        $cache = cache_get('_printconnect_images', 'cache');
        if (!$cache) {
          $cache = array();
        } else {
          $cache = $cache->data;
        }
      }

      $hash = $type . '/' . $id;

      if (array_key_exists($hash, $cache)) {
        return $cache[$hash];
      }

      $pathToTheme = path_to_theme();
      $themeImage = $pathToTheme . "/images/$type/$id.png";
      if (file_exists($themeImage)) {
        $path = $themeImage;
      } else {
        $themeImage = $pathToTheme . "/images/$type/$id.jpg";
        if (file_exists($themeImage)) {
          $path = $themeImage;
        } else {
          $themeTypeDefault = $pathToTheme . "/images/$type/default.png";
          if (file_exists($themeTypeDefault)) {
            $path = $themeTypeDefault;
          } else {
            $themeTypeDefault = $pathToTheme . "/images/$type/default.jpg";
            if (file_exists($themeTypeDefault)) {
              $path = $themeTypeDefault;
            } else {
              $themeDefault = $pathToTheme . "/images/default.jpg";
              if (file_exists($themeDefault)) {
                $path = $themeDefault;
              } else {
                $path = drupal_get_path('module', 'printconnect') . '/default.jpg';
              }
            }
          }
        }
      }

      $cache[$hash] = $path;
      cache_set('_printconnect_images', $cache, 'cache');

      return $path;
    }

    public static function CreateUrl($text, $separator='-') {
      $pattern = '/[^a-zA-Z0-9\/]+/';
      $output = trim($text);
      $output = str_replace('é', 'e', $output);
      $output = str_replace('è', 'e', $output);
      $output = str_replace('à', 'a', $output);
      $output = str_replace('ó', 'o', $output);
      $output = strtolower(preg_replace($pattern, $separator, $output));
      return $output;
    }

    public static function GetLanguages() {
      $pclanguages = \printconnect\Languages\Factory::GetAll();
      $languages = array();
      foreach (language_list() as $language) {

        $locale = $language->language;
        $locale = strtoupper(str_replace('-', '_', $locale));

        foreach ($pclanguages as $pclanguage) {
          if (preg_match('/^' . preg_quote($locale) . "/", strtoupper($pclanguage->locale))) {
            //if ($pclanguage->locale == $locale) {
            $language->id = $pclanguage->id;
            $language->code = $pclanguage->internalCode;
            $languages[] = $language;
          }
        }
      }
      return $languages;
    }

    public static function GetDefaultLanguage() {
      $pclanguages = \printconnect\Languages\Factory::GetAll();

      $language = language_default();
      $locale = $language->language;
      $locale = str_replace('-', '_', $locale);

      foreach ($pclanguages as $pclanguage) {
        //if (preg_match('^' . $locale , $pclanguage->locale)) {
        if ($pclanguage->locale == $locale) {
          $language->id = $pclanguage->id;
          $language->code = $pclanguage->internalCode;
        }
      }

      return $language;
      return FALSE;
    }


    public static function FormatDate($timestamp, $type = 'short_date', $format =''){
      $localtime = format_date($timestamp, $type, $format,  variable_get('pc_timezone', 'Europe/Brussels'));
      return $localtime;
    }

  }

}

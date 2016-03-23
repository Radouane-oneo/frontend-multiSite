<?php

// $Id$

/**
 * @file
 * Object
 *
 * Base object
 */

namespace printconnect {

  use printconnect\Diagnostics\Debug;

  class Object {

    protected $_loaded;
    protected $_loading;
    protected $_constructing;
    protected $_cache;
    protected $_properties;
    protected $_contentlanguage;

    public function __construct($properties = null, $cache = TRUE, $language = FALSE) {
      $this->_loaded = FALSE;
      $this->_loading = FALSE;
      $this->_properties = array();
      $this->_cache = $cache;
      $this->_contentlanguage = $language;
      $this->LoadProperties($properties);
    }

    public function LoadProperties($properties = null) {
      if (is_array($properties)) {
        $this->LoadFromArray($properties);
      } elseif (is_object($properties)) {
        $this->LoadFromObject($properties);
      }
    }

    public function __get($name) {
      return $this->Get($name);
    }

    public function Get($name, $skipGetter = FALSE) {
      $propertyGetter = 'get_' . $name;
      if (!$skipGetter && method_exists($this, $propertyGetter)) {
        return $this->$propertyGetter();
      } elseif (array_key_exists($name, $this->_properties)) {
        return $this->_properties[$name];
      } elseif (!$this->_loaded && !$this->_loading) {
        $this->Load();
        if ($skipGetter) {
          return $this->_properties[$name];
        } else {
          return $this->__get($name);
        }
      } /* elseif (array_key_exists($name, $this->_properties)) {
        return $this->_properties[$name];
        } */
    }

    public function __set($name, $value) {
      $this->Set($name, $value);
    }

    public function Set($name, $value) {
      $propertySetter = 'set_' . $name;
      if (is_string($value)) {
        $value = $value;
      }
      if (method_exists($this, $propertySetter)) {
//$this->EnsureLoaded();
        $this->_properties[$name] = $this->$propertySetter($value);
//$this->SetDirty($name);
      } else {
        $this->_properties[$name] = $value;
      }
    }

    public function __isset($name) {
      if (array_key_exists($name, $this->_properties)) {
        return isset($this->_properties[$name]);
      }
      return false;
    }

    public function Remove($name) {
      unset($this->_properties[$name]);
    }

    public function GetProperties() {
      $properties = array();

      foreach ($this->_properties as $name => $property) {
        if (!is_object($property)) {
          $properties[$name] = $property;
        }else if($name == 'fileCheck') {
          $properties[$name] = $property;
        }
      }
      return $properties;
    }

    public function LoadFromArray($data) {
      foreach ($data as $name => $value) {
        $this->Set($name, $value);
      }
    }

    public function LoadFromObject($object) {
      $this->LoadFromArray(get_object_vars($object));
    }

    public function HasProperty($property, $skipGetter = FALSE) {
      $this->EnsureLoaded();
      $propertyGetter = 'get_' . $property;
      if (!$skipGetter && method_exists($this, $propertyGetter)) {
        return true;
      } else {
        if (isset($this->_properties[$property])) {
          return true;
        }
      }
      return false;
    }

    public function EnsureLoaded() {
      if (!$this->_loaded && !$this->_loading) {
        if ($this->Load()) {
// $this->Reset();
        };
      }
    }

    protected function OnLoad() {
      $reflector = new \ReflectionClass($this);
      $className = $reflector->getShortName();
      $ns = $reflector->getNamespaceName();
      $factory = $ns . '\Factory';
      if (in_array($factory, get_declared_classes())) {
        if (method_exists($factory, 'Load' . $className)) {
          return call_user_func(array($factory, 'Load' . $className), $this);
        }
      }

      return FALSE;
    }

    public function Load() {
      $this->_loading = TRUE;
      $result = $this->OnLoad();
      $this->_loading = FALSE;
      // if ($result) {
      $this->loaded = TRUE;
      //}
      return $result;
    }

    public function set_loaded($value) {
      $this->_loaded = $value;
    }

    public function get_properties() {
      $this->EnsureLoaded();
      return $this->_properties;
    }

    public function get_cache() {
      return $this->_cache;
    }

    public function get_contentlanguage() {
      return $this->_contentlanguage;
    }

    public function toArray() {
      return $this->properties;
    }

  }

}

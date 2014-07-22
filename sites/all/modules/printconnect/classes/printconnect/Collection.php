<?php

// $Id$

/**
 * @file
 * Collection
 *
 * Base class for collections
 */

namespace printconnect;

//use printconnect\Diagnostics\Debug;

class Collection extends Object implements \Iterator, \ArrayAccess {

  protected $_items;

  protected $paginator;
  public function __construct($items = array(), $properties = array(), $cache = TRUE, $language = FALSE) {
    parent::__construct($properties, $cache, $language);
    $this->_items = array();
    $this->LoadItemsFromArray($items);
  }

  function rewind() {
    $this->EnsureLoaded();
    return reset($this->_items);
  }

  function current() {
    $this->EnsureLoaded();
    return current($this->_items);
  }

  function key() {
    $this->EnsureLoaded();
    return key($this->_items);
  }

  function next() {
    $this->EnsureLoaded();
    return next($this->_items);
  }

  function valid() {
      $this->EnsureLoaded();
    return key($this->_items) !== NULL;
  }

  public function offsetSet($offset, $value) {
    $this->EnsureLoaded();
    if (is_null($offset)) {
      $this->_items[] = $value;
    } else {
      $this->_items[$offset] = $value;
    }
  }

  public function offsetExists($offset) {
    $this->EnsureLoaded();
    return isset($this->_items[$offset]);
  }

  public function offsetUnset($offset) {
    $this->EnsureLoaded();
    unset($this->_items[$offset]);
  }

  public function offsetGet($offset) {
    $this->EnsureLoaded();
    return isset($this->_items[$offset]) ? $this->_items[$offset] : NULL;
  }

  public function Add(Object $item, $key = NULL) {
    // $this->EnsureLoaded();
    if (!$key) {
      $this->_items[] = $item;
    } else {
      $this->_items[(string) $key] = $item;
    }
  }

  public function Exists($key) {
    if (!is_object($key)) {
      return in_array((string) $key, $this->_items);
    } else {
      var_dump($key);
    }
  }

  public function Remove($key) {
    unset($this->_items[$key]);
  }

  public function Clear() {
    $this->_items = array();
  }

//  public function Exists($key) {
//    return array_key_exists($key, $this->_items);
//  }

  public function LoadItemsFromArray($items) {
    if (is_array($items)) {
      foreach ($items as $key => $value) {
        $this->_items[$key] = $value;
      }
    }
  }

  public function Top($count) {
    return array_slice($this->_items, 0, $count);
  }

  public function get_items() {
    return $this->_items;
  }

  public function get_count() {
    $this->EnsureLoaded();
    return count($this->_items);
  }

  public function toJSON() {
    $items = array();

    foreach ($this->_items as $item) {
      $items[] = $item->toArray();
    }

    return json_encode($items);
  }

  public function toKeyedArray() {
    $items = array();
    foreach ($this->_items as $item) {
      $items[$item->id] = $item;
    }
    return $items;
  }

}
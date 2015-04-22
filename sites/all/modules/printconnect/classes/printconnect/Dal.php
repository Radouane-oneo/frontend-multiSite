<?php

// $Id$

/**
 * @file
 * DAL
 *
 * Main data acces class, specifics implemented in modules
 */

namespace printconnect {

  use printconnect\Dal\NotFoundException;

  class Dal {

    protected static $_cache = array();
    public static $totalCountTemplates ;

    public static function updateElement(Object $object, $entity, $params, $fieldToUpdate)
    {
        if (!$object->contentlanguage) {
            global $language;
        } else {
            $language = $object->contentlanguage;
        }
        $tempObject = new Object();;
        $dal = Dal::GetDal();
        $hash = $dal->GetHash($entity, $params, $language);
        if (array_key_exists($hash, self::$_cache)) {
            $data = self::$_cache[$hash];
        }

        if (!$data) {
            $data = Cache::Get($hash);
        }
        if ($data) {
	    $data = unserialize($data);
            $tempObject->LoadProperties($data);
        }
	
        if ($tempObject && !empty($fieldToUpdate)) {
	    $data = $tempObject->GetProperties();
            foreach ($fieldToUpdate as $key => $field) {
                $tempObject->$key = $field;
	        $data[$key] = $field; 
            }
	    if ($data && $tempObject->HasProperty('id')) {
                Cache::Set($hash, serialize($data));
                self::$_cache[$hash] = serialize($data);
	    }
        }
    }

    public static function Load(Object $object, $entity, $params, $cache = TRUE, $dal = FALSE) {
      if (!$object->contentlanguage) {
        global $language;
      } else {
        $language = $object->contentlanguage;
      }
 
      if (!$dal) {
        $dal = Dal::GetDal();
      }
      $hash = $dal->GetHash($entity, $params, $language);
      $data = false;
      if (true) {
        if (array_key_exists($hash, self::$_cache)) {
          $data = self::$_cache[$hash];
        }

        if (!$data) {
          $data = Cache::Get($hash);
        }

        
        if (!$data) {
                $data = $dal->Get($entity, $params, $language);
                Cache::Set($hash, serialize($data));
                self::$_cache[$hash] = serialize($data);
            } else {
                $data = unserialize($data);
            }
      } else {
        $data = $dal->Get($entity, $params, $language);
      }
      $object->LoadProperties($data);
      $object->source = array('Entity' => $entity, 'Params' => $params);
    }

    public static function LoadCollection(Collection &$object, $entity, $params, $callback, $cache = TRUE, $dal = FALSE) {
      if (!$object->contentlanguage) {
        global $language;
      } else {
        $language = $object->contentlanguage;
      }
      if (!$dal) {
        $dal = Dal::GetDal();
      }

      $hash = $dal->GetHash($entity, $params, $language);
      $items = false;
      if ($cache) {
        if (array_key_exists($hash, self::$_cache)) {
           $items = self::$_cache[$hash];
        }
        if (!$items) {
            if ($entity == 'shipping-date') {
                $cachedObject = cache_get($hash, 'cache');
                if ($cachedObject->expire > strtotime(date('Y-m-d H:i:s'))) {
                    $items = Cache::Get($hash);
                }
            } else {
                $items = Cache::Get($hash);
            }
        }
        
        if (!$items) {
            $items = $dal->GetList($entity, $params, $language);
            $items = (array) $items;
            if ($entity == 'shipping-date') {
                $lifeTime = strtotime(date('Y-m-d') . '10:00:00');
                if (date('H') > 10) {
                    $lifeTime = strtotime("+1 day", strtotime(date('Y-m-d') . '10:00:00'));
                }
                Cache::Set($hash, serialize($items), $lifeTime);
            } else {
                Cache::Set($hash, serialize($items));
            }
            self::$_cache[$hash] = serialize($items);
        } else {
          $items = unserialize($items);
        }
      } else {
        $items = $dal->GetList($entity, $params, $language);
      }
     
      if ($entity == 'design-template' ) { 
         self::$totalCountTemplates = $items->totalCount;
         $templateItems = $items->designTemplates;
         if ($templateItems === null) {
            self::$totalCountTemplates = $items['totalCount'];
            $items = $items['designTemplates'];
         } else {
             $items = $templateItems;
         }
      } elseif($entity == 'design-template-top'){
          $templateItems = $items->designTemplates;
         if ($templateItems === null) {
            $items = $items['designTemplates'];
         } else {
             $items = $templateItems;
      }
    }
      if (is_array($items)) {
          foreach ($items as $value) {
           $object->Add($callback($value, $params));   
         }
      }
      $object->source = array('Entity' => $entity, 'Params' => $params);
      
    }

    public static function LoadCollection_Old(Collection &$object, $entity, $params, $callback, $cache = TRUE) {
      $dal = Dal::GetDal();
      $hash = $dal->GetHash($entity, $params);
      $items = unserialize(Cache::Get($hash));
      if ($items === FALSE) {
        try {
          $items = $dal->GetList($entity, $params);
          $items = (array) $items;
        } catch (NotFoundException $ex) {
          $items = array();
        }
        Cache::Set($hash, serialize($items));
      }

      if (is_array($items)) {
        foreach ($items as $value) {
          $object->Add($callback($value, $params));
        }
      }
      $object->source = array('Entity' => $entity, 'Params' => $params);
    }

    public static function Save(Object &$object, $entity, $params, $validateOnly = FALSE) {
      
      $dal = Dal::GetDal();
      $properties = $object->GetProperties();
      if ($object->id) {
        $data = $dal->Update($properties, $entity, $params, $validateOnly);
        $object->LoadProperties($data);
      } else {
        $data = $dal->Create($properties, $entity, $params, $validateOnly);
        $object->LoadProperties($data);
      }

      Dal::ClearCache($object);
      return $object;
    }

    public static function Create(Object $object, $entity, $params = null) {
      $dal = Dal::GetDal();
      $properties = $object->GetProperties();
      return $dal->Create($properties, $entity, $params);
    }

    public static function ClearCache(Object $object) {
      if (is_array($object->source)) {
        $dal = Dal::GetDal();
        list($entity, $params) = array_values($object->source);
        $hash = $dal->GetHash($entity, $params);
        Cache::Clear($hash);
        unset(self::$_cache[$hash]);
        $object->loaded = false;
      }
      return $object;
    }

    public static function Delete($entity, $params) {
      $dal = Dal::GetDal();
      return $dal->Delete($entity, $params);
    }

    public static function Search(Collection $object, $value, $entity, $language, $callback, $log = FALSE) {
      $dal = Dal::GetDal();
      $items = $dal->Search($value, $entity, $language, $log);
      if (is_array($items)) {
        foreach ($items as $value) {
          if ($value->aliasName){
          $object->Add($callback($value));
      }
        }
      }
      return $object;
    }

    private static function GetDal() {
      global $pcDal;
      if (!$pcDal) {
        throw new Exceptions\NotImplementedException('No dal defined');
      }
      return $pcDal;
    }
  }
}

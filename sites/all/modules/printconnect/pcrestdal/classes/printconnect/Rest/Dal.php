<?php

// $Id$

/**
 * @file
 * DAL
 *
 * Implements the REST dal
 */

namespace printconnect\Rest {

use printconnect\Diagnostics\Debug;
use printconnect\Cache;
use printconnect\Rest\Exceptions\Exception;
use printconnect\Dal\NotFoundException;
use printconnect\Dal\ForbiddenException;

  class Dal {

    protected $url;
    protected $apikey;
    protected $timeout;

    public function __construct($url, $apikey, $timeout) {
      $this->url = $url;
      $this->apikey = $apikey;
      $this->timeout = $timeout;
    }

    public function Get($entity, $params, $language = FALSE) {
      $url = $this->GetUrl($entity, $params, FALSE, $language);
            if(variable_get('pc_env', 'production') == 'production') {
                $json = $this->fromCache($url);
		if ($entity == 'pickuppointdetail/service/store') {
                    if ($_SERVER["HTTP_HOST"] == 'http://preprd.flyer.fr/')
                        $json = utf8_encode($json);
                }
            }else {
                $json = $this->Call($url);
                /*if(preg_match('/store/', $entity)) {
                    $input = iconv('UTF-8', 'UTF-8//IGNORE', utf8_encode($json));
                    $json = json_decode($input);
                    return $json;
                }*/
		if ($entity == 'pickuppointdetail/service/store') {
		   $json = utf8_encode($json);
		}
            }
	return json_decode($json);
    }

    public function Search($value, $entity, $language, $log = FALSE) {
      if (isset($language->id)) {
        $languageId = $language->id;
      } else {
        $languageId = 2;
      }

      $url = $this->url . 'search/type/' . $entity . '/value/' . urlencode($value) . '/language/' . urlencode($languageId);

      if ($log) {
        $url .= '/savekey/true';
      }
      
      $url .= "?apikey=$this->apikey";

      $json = $this->Call($url);

      return json_decode($json);
    }

    public function GetHash($entity, $params, $language = FALSE, $apikey = FALSE) {
      return $this->GetUrl($entity, $params, FALSE, $language, $apikey);
    }

    protected function GetUrl($entity, $params, $validateOnly = FALSE, $language = FALSE, $apikey = FALSE) {
    if (!$language) {
        global $language;
      }
      $url = $this->url . $entity;
      if($entity != 'design-template' && $entity != 'design-template-filter' ) {
        if ($params && count($params) > 0) {
          foreach ($params as $key => $value) {
            if (is_string($key)) {
              $url .= '/' . urlencode($key) . '/' . urlencode($value);
            } else {
              $url .= '/' . urlencode($value);
            }
          }
        } else {
          $url .= '/';
        }
      }
      if (!$apikey) {
        $url .= "?apikey=$this->apikey";
      } else {
        $url .= "?apikey=$apikey";
      }

      if (isset($language->id)) {
        $url .= '&language=' . $language->id;
      } else {
        $url .= '&language=2';
      }

      if ($validateOnly) {
        $url .= '&validate=TRUE';
      }
      if ($entity == 'design-template' || $entity == 'design-template-filter') {
                $url = $this->url . $entity . "/?";
                if(array_key_exists("designTemplateId", $params)) {
                   $url = $this->url . $entity . "/get/?";
                }
                if ($params && count($params) > 0) {
                    $queryParams = array();
                    foreach ($params as $key => $value) {
                        if ($key == "productId" || $key == "segmentId") {
                            $key = str_ireplace("Id", "", $key);
                        }
                        $queryParams[] = "$key=$value";
                    }
                    $url.=implode("&", $queryParams);
                }
            }

        if ($entity == 'design-template') {
             $url .=  '&';
        }
        $url .=  'apikey='.$this->apikey;
        if (isset($language->id)) {
            $url .= '&language=' . $language->id;
        } else {
            $url .= '&language=2';
        }
        if ($entity == 'pickuppointdetail/service/store') {
	}
        //echo $url;echo '<br>';
      return $url;
    }

    public function GetList($entity, $params, $language = FALSE) {
      $url = $this->GetUrl($entity, $params, FALSE, $language);
//      $json = $this->fromCache($url);
 $json = $this->Call($url);
      $items = json_decode($json);
      if ($entity == 'pickuppoint/service/store' || $entity == 'pickuppointdetail/service/store') {
	$json = utf8_encode($json);
	$items = json_decode($json);
      } 
     
      return $items;
    }

    private function Call($url) {
      $header = array('Content-Type' => 'application/json');
      $start = microtime(true);
      $response = drupal_http_request($url, array('header' => $header, 'method' => 'GET', 'timeout' => $this->timeout));
      $end = microtime(true);
        try{
        if((int) $response->code !=200 ){
            pcprintlog_HandelError( $_SESSION['customerid'], $_SESSION['cartid'], 'pcrestdal', '%timing on %type %url \n Data \n %data \n Response %response', array('%type' => 'GET', '%url' => $url, '%timing' => ($end - $start), '%data' => '', '%response' => print_r($response, TRUE)), $url );

        }
        }catch (\printconnect\Rest\Exceptions\Exception $ex) {
        }
      watchdog('pcrestdal', '%timing on %type %url \n Data \n %data \n Response %response', array('%type' => 'GET', '%url' => $url, '%timing' => ($end - $start), '%data' => '', '%response' => print_r($response, TRUE)), WATCHDOG_DEBUG, ($end - $start) . ' on GET ' . $url);
      switch ((int) $response->code) {
        case 200:
          $data = $response->data;
          $data= html_entity_decode($data, ENT_NOQUOTES);
          return $data;
        case 404:
          throw new NotFoundException($url, array($response->data), array());
          return FALSE;
          break;
        case 403:
          throw new ForbiddenException($url, array($response->data), $this->ReadErrorInformation($response));
          break;
        case 500:
          return($response->data);
          break;
        default:
          throw new Exception('GET ' . $url, null, $this->ReadErrorInformation($response));
          break;
      }
    }

    public function Update($properties, $entity, $params, $validateOnly = FALSE) {

      $url = $this->GetUrl($entity, $params, $validateOnly);
      $header = array('Content-Type' => 'application/json');

      if($entity == 'cart-item') {
        if($properties['originPrice'] > $properties['price']) {
          $properties['pPrice'] = $properties['price'];
        }
      }
     
	$data = json_encode($properties);
      $start = microtime(true);
      $response = drupal_http_request($url, array('header' => $header, 'method' => 'PUT', 'data' => $data));
      $end = microtime(true);
      watchdog('pcrestdal', '%timing on %type %url \n Data \n %data \n Response %response', array('%type' => 'PUT', '%url' => $url, '%timing' => ($end - $start), '%data' => $data, '%response' => print_r($response, TRUE)), WATCHDOG_DEBUG, ($end - $start) . ' on PUT ' . $url);
  
      if ($response->code == 200) {
        $data = json_decode($response->data);
        return $data;
      } else {
          var_dump("Error", $url, $data);die;
        throw new Exception('PUT ' . $url, $data, $this->ReadErrorInformation($response));
      }
    }

    public function Create($properties, $entity, $params, $validateOnly = FALSE) {
      $url = $this->GetUrl($entity, $params, $validateOnly);
     
      $header = array('Content-Type' => 'application/json');
      $start = microtime(true);
      if ($properties) {
        $data = json_encode($properties);
        $response = drupal_http_request($url, array('header' => $header, 'method' => 'POST', 'data' => $data));
      } else {
        $data = array();
        $response = drupal_http_request($url, array('header' => $header, 'method' => 'POST'));
      }
      $end = microtime(true);
      watchdog('pcrestdal', '%timing on %type %url \n Data \n %data \n Response %response', array('%type' => 'POST', '%url' => $url, '%timing' => ($end - $start), '%data' => $data, '%response' => print_r($response, TRUE)), WATCHDOG_DEBUG, ($end - $start) . ' on POST ' . $url);
      
      if ($response->code == 200) {
        $data = json_decode($response->data);

        return $data;
      } else {
          try{
              pcprintlog_HandelError( $_SESSION['customerid'], $_SESSION['cartid'], 'pcrestdal', '%timing on %type %url \n Data \n %data \n Response %response', array('%type' => 'GET', '%url' => $url, '%timing' => ($end - $start), '%data' => '', '%response' => print_r($response, TRUE)), $url );
          }catch (\printconnect\Rest\Exceptions\Exception $ex) {
          }
        throw new Exception('POST ' . $url, $data, $this->ReadErrorInformation($response));
      }
//     if($entity == "order-discount-code"){
//        $_SESSION['data']=$data;
//      }
    }

    public function Delete($entity, $params) {
      $url = $this->GetUrl($entity, $params);
      $header = array('Content-Type' => 'application/json');
      $start = microtime(true);
      $response = drupal_http_request($url, array('header' => $header, 'method' => 'DELETE'));
      $end = microtime(true);
      watchdog('pcrestdal', '%timing on %type %url \n Data \n %data \n Response %response', array('%type' => 'DELETE', '%url' => $url, '%timing' => ($end - $start), '%data' => '', '%response' => print_r($response, TRUE)), WATCHDOG_DEBUG, ($end - $start) . ' on DELETE ' . $url);
      if ($response->code == 200) {
        $data = json_decode($response->data);
        return $data;
      } else {
          try{
              pcprintlog_HandelError( $_SESSION['customerid'], $_SESSION['cartid'], 'pcrestdal', '%timing on %type %url \n Data \n %data \n Response %response', array('%type' => 'GET', '%url' => $url, '%timing' => ($end - $start), '%data' => '', '%response' => print_r($response, TRUE)), $url );
          }catch (\printconnect\Rest\Exceptions\Exception $ex) {
          }
        throw new Exception('DELETE ' . $url, null, $this->ReadErrorInformation($response));
      }
    }

    private function ReadErrorInformation($response) {
      $errors = array();
      if (isset($response->data)) {
        $data = json_decode($response->data);
        if ($data) {
          if (is_object($data)) {
            $data = get_object_vars($data);
          }
          if (is_array($data)) {
            foreach ($data as $key => $value) {
              if ($value) {
                foreach ($value as $error) {
                  $errors[$key] = $error;
                }
              }
            }
          } elseif (is_string($data)) {
            $errors[] = $data;
          }
        }
      } else {
        $errors[] = $response->error;
      }
      return $errors;
    }
//--------------file cache-------------------
        public function fromCache($urlFinal, $fromCache = true) {
            $urls = array('cart', 'customer', 'shipping-date', 'billing-account');
            $dontCache = false ;
            foreach ($urls as $item) {
                if (preg_match("@$item@", $urlFinal)) {
                    $dontCache = true;
                    break;
                }
            }
            $data = $this->getCacheData($urlFinal);
            if ($fromCache && !empty($data)) {
                return $data;
            } else {
                $data = $this->call($urlFinal);
                $result = json_decode($data);
                if (isset($result) == true && $dontCache == false) {
                    $this->saveCacheData($urlFinal, $data);
                }
            }
            return $data;
        }

        public function saveCacheData($key, $data) {
            $group = $this->getGroup($key);
            $saveData = "$group|$key|$data\n";
            $fp = fopen('cache.txt', 'a+');
            fwrite($fp, $saveData);
            fclose($fp);
        }

        public function getGroup($restUrl) {
            $groups = array(
                "price" => "price",
                "product" => "product",
                "template" => "template",
            );
            $groupKey = "standard" ;
            foreach ($groups as $key => $group) {
                if (preg_match("@$group@", $restUrl)==1) {
                    $groupKey = $key;
                    break;
                }
            }
            return $groupKey;
        }

        public function getCacheData($key) {
            $handle = false;
            if (($handle = fopen("cache.txt", "r")) !== FALSE) {
                while (($buffer = fgets($handle)) !== false) {
                    $data = explode("|", $buffer);
                    if ($key == $data[1]) {
                        return $data[2];
                    }
                }
                fclose($handle);
                $handle = false;
            }
            return $handle;
        }
//---------------------------------    
  }
}

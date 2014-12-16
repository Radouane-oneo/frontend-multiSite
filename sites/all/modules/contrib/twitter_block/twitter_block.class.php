<?php

/**
 * @file
 * Lightweight implementation of the Twitter API in PHP.
 *
 * This code does the heavy lifting behind the Drupal twitter_block module. It
 * does not aim to authenticate users nor provide complex integration. We only 
 * need to grab public feeds, and as such we use the Twitter Search API. For 
 * more information on the twitter search API, @see 
 * @link http://dev.twitter.com/doc/get/search
 */

/**
 * TwitterBlockSearch provides the class for using the Twitter Search API.
 *
 * For more information on the API, see http://dev.twitter.com/doc/get/search
 */
class TwitterBlockSearch {

  // HTTP status code returned
   private $http_status;
  
   private $host;
  
   private $method;
   
   private $path ;
   
  // Search parameters as defined by the API to be used w/ http_build_query
  private $options = array();

  // Determines which getter to use.
  private $search_type;

  // What were we looking for again?
  private $search_string;
  private $twitter_name;

  // The API type we'll pull data from.
  private $api;

  // The url including the encoded query
  public $url_query;
 
  public function __construct($config = array()) {
 
    // @todo: Make this a configurable URL.
    $this->host = 'api.twitter.com';
    $this->method = 'GET';
    $this->path = '/1.1/search/tweets.json';
    $this->search_type = $config['search_type'];
    $this->api = in_array($this->search_type, array('getTweetsFrom')) ? 'rest' : 'search';
       
    if ($config['search_type'] == 'searchHashtag') {
      // We presume the search string is already validated.
      $this->search_string = $config['search_string'];
    }
    else {
      $this->twitter_name = $config['search_string'];
    }
    $count = ($this->api == 'rest') ? 'count' : 'rpp';  
    // The number of tweets to return per page.
    if (!empty($config['results_per_page'])) {
      $this->options[$count] = $config['results_per_page'];
    }
    else {
      $this->options[$count] = variable_get('twitter_block_default_results_per_page', 15);
    }

    // Filter by language, but only if there is one set in the config.
    if (isset($config['lang']) && !empty($config['lang'])) {
      $this->options['lang'] = $config['lang'];
    }
  }

  /**
   * Retrieve JSON encoded search results
   */
  public function getJSON() {
    $response = call_user_func(array($this, $this->search_type));
    $return = array(
      'status' => TRUE,
      'results' => array(),
      'debug' => $response,
    );
    if (empty($response)) {
      $return['status'] = 'Empty response from Twitter.';
    }
    else {
      $decoded = json_decode($response);
      if (empty($decoded)) {
        $return['status'] = 'Response from Twitter is not valid JSON data.';
      }
      elseif ($this->api == 'rest') {
        $data = $decoded;
      }
      else {
        $data = $decoded->results;
      }
      // An error from the API.
      if (!empty($data->error)) {
        $return['status'] = $data->error;
      }
      // Everything was ok.
      else {
        $return['results'] = $data;
      }
    }
    return $return;
  }

  /**
   * Returns the most recent tweets from $twittername 
   * @param string $twittername to search. Note: begins with @
   * @return string $json JSON encoded search response
   */
  private function getTweetsFrom() {
    $this->options['screen_name'] = $this->twitter_name;
    // @todo: Make this URL a configurable option.
    $this->host = 'api.twitter.com';
    $this->method = 'GET';
    $this->path = '/1.1/statuses/user_timeline.json';
    $json = $this->search();
    return $json;

  }

  /**
   * Returns the most recent mentions (status containing @twittername)
   * @param string $twittername to search. Note: begins with @
   * @return string $json JSON encoded search response
   */
  private function getMentions() {
    $this->options['q'] = "@$this->twitter_name";
    $json = $this->search();
    return $json;
  }

  /**
   * Returns the most recent @replies to $twittername.
   * @param string $twittername to search. Note: begins with @. 
   * @return string JSON encoded search response
   */
  private function getReplies() {
    $this->options['q'] = "to:$this->twitter_name";
    $json = $this->search();
    return $json;
  }

  /**
   * Returns the most recent tweets containing a string or hashtag.
   * @param string $hashtag to search. May or may not begin with #. 
   * @return string JSON encoded search response
   */
  private function searchHashtag() {
    $this->options['q'] = ($this->search_string);
    $json = $this->search();
    return $json;
  }

  /**
   * Returns the last HTTP status code
   * @return integer
   */
  public function lastStatusCode() {
    return $this->http_status;
  }

  /**
   * Executes a Twitter Search API call
   * @return string JSON encoded search response.
   */
  function search() {
      
    $token = '110450066-I7hzIR8VSxSto8ZJHvSPoXT4V4Kfq0vjg6x2pYQk';
    $token_secret = 'GtKEIjrXTPkB0pbk06GFgKwtWaDDR6SWvzUZIycl0o';
    $consumer_key = 'pE8P8WkNSJzy4Afmlt2kQ';
    $consumer_secret = 'hWV2qQv4uG5rfXbzpyP1JGHmqgo5h0NrfRNJHlDmQ';

    $query = $this->options;
    $oauth = array(
        'oauth_consumer_key' => $consumer_key,
        'oauth_token' => $token,
        'oauth_nonce' => (string)mt_rand(),
        'oauth_timestamp' => time(),
        'oauth_signature_method' => 'HMAC-SHA1',
        'oauth_version' => '1.0'
    );

    $oauth = array_map("rawurlencode", $oauth); 
    $query = array_map("rawurlencode", $query);

    $arr = array_merge($oauth, $query); 
    asort($arr);
    ksort($arr); 

    $querystring = urldecode(http_build_query($arr, '', '&'));

    $url = "https://$this->host$this->path";

    $base_string = $this->method."&".rawurlencode($url)."&".rawurlencode($querystring);

    $key = rawurlencode($consumer_secret)."&".rawurlencode($token_secret);

    $signature = rawurlencode(base64_encode(hash_hmac('sha1', $base_string, $key, true)));

    $url .= "?".http_build_query($query);

    $oauth['oauth_signature'] = $signature; 
    ksort($oauth); 

    function add_quotes($str) { return '"'.$str.'"'; }
    $oauth = array_map("add_quotes", $oauth);


    $auth = "OAuth " . urldecode(http_build_query($oauth, '', ', '));

    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_USERAGENT, "Drupal Twitter Block Module");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array("Authorization: $auth"));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER , false);

    $twitter_data = curl_exec($ch);
    $this->http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $twitter_data;

  }

  function getApi() {
    return $this->api;
  }
}

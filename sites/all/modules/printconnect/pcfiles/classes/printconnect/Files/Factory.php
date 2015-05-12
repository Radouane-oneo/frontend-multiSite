<?php

namespace printconnect\Files {

  class Factory {

    public static function Get($id) {
      return new File(array('id' => $id));
    }

    public static function LoadFile(File $object) {
      $id = $object->Get('id');
      $attachments = array();
      $type = 'unknown';
      if ($id) {
        $file = self::findById($id);
        if (is_object($file)) {
          $type = $file->type;
          foreach ((array) $file->_attachments as $attachmentId => $attachment) {
            $attachments[$attachmentId] = new Attachment(array(
                        'id' => $attachmentId,
                        'url' => self::getUrl() . $id . '/' . $attachmentId,
                        'length' => $attachment->length,
                        'contentType' => $attachment->content_type,
                    ));
          }
        }
      }
      $object->Set('type', $type);
      $object->Set('attachments', $attachments);
    }

    public static function getFileUrl($id) {
      return 'pc_file/' . $id;
    }

    public static function getServerFileUrl($id) {
      $url = self::getUrl();
      $fileserverFile = self::findById($id);
      if ($fileserverFile == NULL) {
        return NULL;
      }
      if (!isset($fileserverFile->_attachments)) {
        return NULL;
      }
      $attachments = (array) $fileserverFile->_attachments;
      $attachment = array_shift(array_keys($attachments));
      return $url . '/' . $id . '/' . $attachment;
    }

    /**
     * Find file by id
     *
     * @param string $id
     * @return StdClass on success, NULL on !error
     */
    public static function findById($id) {
      $url = self::getUrl();

      $response = drupal_http_request($url . $id, array('method' => 'GET'));

      if ($response->code != 200) {
        return NULL;
      } else {
        $resultObj = json_decode($response->data);
        //$resultObj->headers = $response->headers;
        if (isset($resultObj->error)) {
          $resultObj = NULL;
        }
        if (!isset($resultObj->_id)) {
          $resultObj = NULL;
        }
        return $resultObj;
      }

      $cmd = 'curl -s -X GET ' . $url . $id;

      exec($cmd, $resultJson, $returnCode);
      if ($returnCode != 0) {
        return NULL;
      } else {
        $resultObj = json_decode(current($resultJson));
        if (isset($resultObj->error)) {
          $resultObj = NULL;
        }
        if (!isset($resultObj->_id)) {
          $resultObj = NULL;
        }
        return $resultObj;
      }
    }

    /**
     * Save a file on the fileserver, properties are append/update only
     * Delete is supported via removeProperty() and removeFile()
     *
     * @param array $data, set $data['id'] for update
     * @param string $file absolute path to a file
     * @return StdClass on success, NULL on error
     */
    public static function save($name, $file) {
      $url = self::getUrl();
      $fileserverFile = NULL;
      $rev = NULL;


      // if no item is found, create new item for add
      if ($fileserverFile == NULL) {
        $fileserverFile = new \stdClass();
        if (isset($data['id'])) {
          $fileserverFile->_id = $data['id'];
        } else {
          $fileserverFile->_id = sha1(microtime(TRUE));
        }
      }

      // remove old attachment
      $savedFileserverFile = self::removeProperty($fileserverFile->_id, '_attachments');
      if ($savedFileserverFile != NULL) {
        $rev = '?rev=' . $savedFileserverFile->_rev;
      }

      // add new attachment
      $finfo = finfo_open(FILEINFO_MIME_TYPE);
      $mimeType = finfo_file($finfo, $file);
      $dirtyFileName = $name; //end(explode('/', $file));
      $cleanFileName = '';
      for ($i = 0; $i < strlen($dirtyFileName); $i++) {
        $dirtyChar = $dirtyFileName[$i];
        if ($dirtyChar == ' ') {
          $cleanFileName .= '_';
          continue;
        }
        if (preg_match("/[a-zA-Z0-9-_.]/", $dirtyChar) == 1) {
          $cleanFileName .= $dirtyChar;
          continue;
        }
      }

      $command = 'curl -s -X PUT ' . $url . $fileserverFile->_id . '/' . $cleanFileName . $rev . ' ' .
              '--data-binary @\'' . $file . '\' -H "Content-Type: ' . $mimeType . '"';

      exec($command, $resultJson, $returnCode);
      if ($returnCode != 0) {
        return NULL;
      } else {
        $resultObj = json_decode(current($resultJson));
        if (isset($resultObj->error)) {
          return NULL;
        }
        $fileserverFile = self::Get($fileserverFile->_id);
      }

//
//      // add or update the given values
//      foreach ($data as $key => $value) {
//        if ($key == 'id') {
//          continue; // we use _id instead
//        }
//        $fileserverFile->$key = $value;
//      }
//      exec('curl -s -X PUT ' . $url . $fileserverFile->_id . $rev . ' ' .
//              "-d '" . json_encode($fileserverFile) . "'", $resultJson, $returnCode);
//      if ($returnCode != 0) {
//        return NULL;
//      } else {
//        $resultObj = json_decode(current($resultJson));
//        if (isset($resultObj->error)) {
//          return NULL;
//        }
//        $fileserverFile = self::findById($fileserverFile->_id);
//      }

      return $fileserverFile;
    }

    /**
     * Remove a file
     *
     * @param string $id
     * @return boolean success
     */
    public static function removeFile($id) {
      $url = self::getUrl();
      $fileserverFile = $this->findById($id);
      if ($fileserverFile == NULL) {
        return TRUE;
      }

      exec('curl -s -X DELETE ' . $url . $fileserverFile->_id .
              '?rev=' . $fileserverFile->_rev, $resultJson, $returnCode);
      if ($returnCode != 0) {
        return FALSE;
      } else {
        return TRUE;
      }
    }

    /**
     * Remove a property
     *
     * @param string $id
     * @param string $name
     * @return StdClass on success, NULL on error
     */
    public static function removeProperty($id, $name) {
      $url = self::getUrl();
      $fileserverFile = self::findById($id);
      if ($fileserverFile == NULL) {
        return NULL;
      }

      if (isset($fileserverFile->$name)) {
        unset($fileserverFile->$name);

        exec('curl -s -X PUT ' . $url . $fileserverFile->_id . '?rev=' . $fileserverFile->_rev . ' ' .
                "-d '" . json_encode($fileserverFile) . "'", $resultJson, $returnCode);
        if ($returnCode != 0) {
          return NULL;
        } else {
          $resultObj = json_decode(current($resultJson));
          if (isset($resultObj->error)) {
            return NULL;
          }
          $fileserverFile = self::findById($fileserverFile->_id);
        }
      }

      return $fileserverFile;
    }

    private static function getUrl() {
      // return 'http://files.dev.printconnect.com/';
      // return 'http://files.stg.printconnect.com/';
      return variable_get('pc_files', 'http://files.stg.printconnect.com/');
    }

  }

}

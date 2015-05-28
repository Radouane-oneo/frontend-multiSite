<?php

namespace printconnect\Files {

  class File extends \printconnect\Object {

    function get_url() {
      return 'file/' . $this->id;
    }

    function get_serverUrl() {
      foreach ($this->attachments as $attachmentKey => $attachment) {
        return $attachment->url;
      }
    }

  }

}
?>

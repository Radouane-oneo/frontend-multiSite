<?php

namespace printconnect\Products\RelatedProducts {

  class RelatedProduct extends \printconnect\Object {

    public function get_thumbnail() {
      return 'http://admin.dev.printconnect.com/fileserver-file/download/ticket/' . $this->Get('thumbnail', TRUE);
    }

  }

}
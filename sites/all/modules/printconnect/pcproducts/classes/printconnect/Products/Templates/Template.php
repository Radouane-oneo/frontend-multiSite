<?php

namespace printconnect\Products\Templates {

  use printconnect\Files;

  class Template extends \printconnect\Object {

    public function get_pdf() {
      return Files\Factory::getFileUrl( $this->Get('pdf', TRUE));
    }
  }
}

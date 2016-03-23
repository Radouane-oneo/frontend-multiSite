<?php
// $Id$

/**
 * @file
 * Translation
 *
 * printconnect\Translation class
 */

namespace printconnect\Translations{
use printconnect\Object;

class Translation extends Object {

  protected function OnLoad() {
    return Factory::Load($this);
  }
}

}
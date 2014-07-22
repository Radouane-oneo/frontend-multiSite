<?php
// $Id$

/**
 * @file
 * Translations Factory
 *
 * Factory for the printconnect\Translations namespace
 */

namespace printconnect\Translations{

use printconnect\Dal\Rest;

class Factory {
  public static function Get($tag, $languageCode = 'nl_BE') {
    return new Translation(array('tag' => $tag, 'languageCode' => $languageCode));
  }

  public static function Load($translation) {
    $tag = $translation->tag;
    $languageCode = $translation->languageCode;
    $url = "translate/tag/$tag/languageInternalCode/$languageCode";

    return Rest::Get($url);
  }

}
}


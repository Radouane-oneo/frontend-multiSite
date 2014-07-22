<?php
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language ?>" lang="<?php print $language->language ?>" dir="<?php print $language->dir ?>">
  <head>
    <title><?php print $head_title ?></title>
    <?php print $head ?>
    <?php print $styles ?>
    <?php print $scripts ?>
  </head>
  <body class="<?php print $classes ?>">

    <div class="background"></div>
    
    <div class="section-header section">

      <?php print theme('image', array('path' => $logo)); ?>

    </div>

    <div class="section-main section">
      <h1><?php print $title; ?></h1>
      <?php print $content; ?>
    </div>

  </body>
</html>

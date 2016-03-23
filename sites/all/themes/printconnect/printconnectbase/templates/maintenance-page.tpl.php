<?php
/**
 * @file
 * Default theme implementation to display a single Drupal page while offline.
 *
 * All the available variables are mirrored in html.tpl.php and page.tpl.php.
 * Some may be blank but they are provided for consistency.
 *
 * @see template_preprocess()
 * @see template_preprocess_maintenance_page()
 *
 * @ingroup themeable
 */
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language ?>" lang="<?php print $language->language ?>" dir="<?php print $language->dir ?>">

  <head>
    <title><?php print $head_title; ?></title>
    <?php print $head; ?>
    <?php print $styles; ?>
    <?php print $scripts; ?>
  </head>
  <body class="<?php print $classes; ?>">
    <div id="canvas">
      <div class="container">


        <div id="header">

          <?php if ($logo): ?>
            <a href="<?php print $front_page ?>" title="<?php print $site_name; ?>">
              <img src="<?php print $logo ?>" alt="<?php print $site_name; ?>" title="<?php print $site_name; ?>" />
            </a>
          <?php endif; ?>

        </div>

        <div id="navigation" class="clearfix">

          <?php if ($main_menu): ?>
            <?php print theme('links__system_main_menu', array('links' => $main_menu, 'attributes' => array('id' => 'main-menu'))); ?>
          <?php endif; ?>
        </div>



        <div id="main" class="clearfix">


          <div id="content">

            <?php print $breadcrumb; ?>

            <?php if ($title): ?>
              <h1><?php print render($title_prefix); ?><?php print $title ?><?php print render($title_suffix); ?></h1>
            <?php endif; ?>

            <?php if ($tabs): ?>
              <?php print render($tabs); ?>
            <?php endif; ?>

            <?php if ($messages): ?>
              <?php print $messages; ?>
            <?php endif; ?>

            <?php print $content; ?>

          </div>
        </div>

      </div>


      <div id="bottom">
        <div id="inner-bottom">
          <div id="footer" class="clearfix">
            <?php if ($site_slogan): ?>
              <div id="site-slogan"> <?php print $site_slogan; ?></div>
            <?php endif; ?>
          </div>

        </div>    
      </div>    

    </div>
  </body>
</html>
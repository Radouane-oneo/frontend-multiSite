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
<?php print $head; ?><?php print $styles; ?><?php print $scripts; ?>
</head>
<body class="<?php print $classes; ?>">
<div id="canvas">
  <div class="container">
    <?php if ($top): ?>
    <div id="top"> <?php print render($top); ?> </div>
    <?php endif; ?>
    <div id="header">
      <?php if ($logo): ?>
      <div id="header_left"> <a href="<?php print $front_page ?>" title="<?php print $site_name ?>"> 
        <img  width="165" height="120" src="<?php print $logo ?>" alt="<?php print $site_name ?>" title="<?php print $site_name ?>" /> </a> </div>
      <?php endif; ?>

            <?php if ($header_right): ?>
              <?php print render($header_right); ?>
            <?php endif; ?>
          </div>
      <?php if ($main_menu): ?>
      <?php print theme('links__system_main_menu', array('links' => $main_menu, 'attributes' => array('id' => 'main-menu'))); ?>
      <?php endif; ?>
    </div>
    <?php if ($productmenu): ?>
    <div id="product-menu"> <?php print render($productmenu); ?> </div>
    <?php endif; ?>
    <?php if ($cart): ?>
    <div id="cart"> <?php print render($cart); ?> </div>
    <div class="clearfix"></div>
    <?php endif; ?>
    <div id="main">
      <?php if ($sidebar_first): ?>
      <div id="sidebar-first"> <?php print render($sidebar_first); ?> </div>
      <?php endif; ?>
      <div id="content">
        <?php if ($highlighted): ?>
        <div id="highlighted"> <?php print render($highlighted); ?> </div>
        <?php endif; ?>
        <?php print $breadcrumb; ?>
        <?php if ($contenttop): ?>
        <?php print render($contenttop); ?>
        <?php endif; ?>
        <div class="clearfix"></div>
        <div class="whitebox clearfix">
          <?php if ($title): ?>
          <h1><?php print render($title_prefix); ?> <?php print $title ?><?php print render($title_suffix); ?></h1>
          <?php endif; ?>
          <?php if ($tabs): ?>
          <?php print render($tabs); ?>
          <?php endif; ?>
          <?php if ($messages): ?>
          <?php print $messages; ?>
          <?php endif; ?>
          <?php print render($help); ?> <?php print render($content); ?> </div>
        <?php if ($contentbottom): ?>
        <?php print render($contentbottom); ?>
        <?php endif; ?>
      </div>
      <?php if ($sidebar_second): ?>
      <div id="sidebar-second"> <?php print render($sidebar_second); ?> </div>
      <?php endif; ?>
      <div id="footer"> <?php print render($footer); ?> </div>
      <div class="clearfix"></div>
    </div>
  </div>
  <div id="bottom">
    <div class="clearfix"></div>
    <?php if ($closure): ?>
    <div id="closure"> <?php print render($closure); ?> </div>
    <?php endif; ?>
  </div>
</div>
</body>
</html>
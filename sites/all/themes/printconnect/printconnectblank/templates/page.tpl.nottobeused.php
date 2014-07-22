<div id="canvas">
  <div class="container">

    <?php if ($page['top']): ?>
      <?php print render($page['top']); ?>
    <?php endif; ?>

    <div id="header">

      <?php if ($logo): ?>
        <a href="<?php print $front_page ?>" title="<?php print $site_name; ?>">
          <img src="<?php print $logo ?>" alt="<?php print $site_name; ?>" title="<?php print $site_name; ?>" />
        </a>
      <?php endif; ?>

      <?php if ($page['header_right']): ?>
        <?php print render($page['header_right']); ?>
      <?php endif; ?>

    </div>

    <div id="navigation" class="clearfix">

      <?php if ($main_menu): ?>
        <?php print theme('links__system_main_menu', array('links' => $main_menu, 'attributes' => array('id' => 'main-menu'))); ?>
      <?php endif; ?>

      <?php if ($page['nav_right']): ?>
        <?php print render($page['nav_right']); ?>
      <?php endif; ?>

    </div>

    <?php if ($page['highlight']): ?>
      <?php print render($page['highlight']); ?>
    <?php endif; ?>

    <div id="main" class="clearfix">

      <?php if ($page['sidebar_first']): ?>
        <?php print render($page['sidebar_first']); ?>
      <?php endif; ?>

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

        <?php print render($page['content']); ?>
      </div>

      <?php if ($page['sidebar_second']): ?>
        <?php print render($page['sidebar_second']); ?>
      <?php endif; ?>

    </div>

  </div>


  <div id="bottom">
    <div id="inner-bottom">

      <?php print render($page['footer']); ?>

      <div class="clearfix"></div>
      <?php print render($page['closure']); ?>

    </div>    
  </div>    

</div>
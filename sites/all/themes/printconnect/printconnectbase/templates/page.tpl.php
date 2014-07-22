<?php if ($page['announcements']): ?>
  <div id="announcements">
    <?php print render($page['announcements']); ?>
  </div>
<?php endif; ?>


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

      <?php if (isset($page['dropdown']) && $page['dropdown']): ?>
        <div id="dropdown"  >
          <?php print render($page['dropdown']); ?>
        </div>
      <?php endif; ?>
    </div>



    <div id="main" class="clearfix">

      <?php if ($page['sidebar_first']): ?>
        <?php print render($page['sidebar_first']); ?>
      <?php endif; ?>

      <div id="content">
        <?php if ($page['highlighted'] && $is_front): ?>
          <?php print render($page['highlighted']); ?>
        <?php endif; ?>

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

      <?php if (isset($page['triptych']) && $page['triptych']): ?>
        <div id="triptych" class="clearfix">
          <?php print render($page['triptych']); ?>
        </div>
      <?php endif; ?>
      <?php if ($page['footer']): ?>
        <div id="footer" class="clearfix">
          <?php print render($page['footer']); ?>
          <?php if ($site_slogan): ?>
            <div id="site-slogan"<?php
        if ($hide_site_slogan) {
          print ' class="element-invisible"';
        }
            ?>> <?php print $site_slogan; ?></div>
               <?php endif; ?>
        </div>
      <?php endif; ?>


      <div class="clearfix"></div>
      <?php print render($page['closure']); ?>

    </div>    
  </div>    

</div>

<?php print render($page['announcements']); ?>

<div class="section-header section">
  <?php print render($page['top']); ?>
  <?php print render($page['header']); ?>
  <?php print render($page['subheader']); ?>
</div>

<div class="section-main section">
  <?php if ($is_admin): ?>
    <?php print render($page['admin']); ?>
  <?php endif; ?>


  <?php print render($page['highlight']); ?>
  <?php print render($page['highlightsidebar']); ?>

  <div class="left">


    <?php if (!$is_front && $breadcrumb): ?>
      <?php print $breadcrumb; ?>
    <?php endif; ?>

    <?php if (!$is_front && $title): ?>
      <h1 class="title" id="page-title">
        <?php print render($title_prefix); ?>
        <?php print $title; ?>
      </h1>
    <?php endif; ?>

    <?php if (!$is_front && $title_suffix): ?>
      <h2 class="subtitle">
        <?php print render($title_suffix); ?>
      </h2>
    <?php endif; ?>



    <?php if ($messages): ?>
      <div id="messages">
        <?php print1 $messages; ?>
      </div>
    <?php endif; ?>
    <?php if ($tabs): ?>
      <div class="tabs">
        <?php print render($tabs); ?>
      </div>
    <?php endif; ?>
    <?php print render($page['help']); ?>
    <?php if ($action_links): ?>
      <ul class="action-links">
        <?php print render($action_links); ?>
      </ul>
    <?php endif; ?>



    <?php if ($is_front): ?>
      <?php //print render($page['sidebar']); ?>
      <?php print render($page['featured']); ?>
    <?php endif; ?>

    <?php print render($page['content']); ?>

  </div>
  <div class="right">
    <?php //if (!$is_front): ?>
    <?php print render($page['sidebar']); ?>
    <?php print render($page['cbsidebar']); ?>
    <?php //endif; ?>
  </div>
  <div class="clearfix"></div>
</div>
</div>                
<div class="section-triptych section">
  <?php print render($page['triptych']); ?>
  <div class="clearfix"></div>
</div>

<div class="section-footer section">
  <?php print render($page['footer']); ?>
  <?php print render($page['closure']); ?>
</div>


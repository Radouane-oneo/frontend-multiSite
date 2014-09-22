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

  <div class="left">

    <?php if ($breadcrumb): ?>
      <?php print $breadcrumb; ?>
    <?php endif; ?>

    <?php if ($title): ?>
      <h1 class="title" id="page-title">
        <?php print render($title_prefix); ?>
        <?php print $title; ?>
        <?php print render($title_suffix); ?>
      </h1>
    <?php endif; ?>

    <?php if ($subtitle): ?>
      <h2 class="subtitle">
        <?php print render($subtitle); ?>
      </h2>
    <?php endif; ?>

    <?php if ($messages): ?>
      <div id="messages">
        <?php print $messages; ?>
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

    <?php print render($page['content']); ?>

  </div>
  <?php if ($page['sidebar']): ?>
    <div class="right">
    
      <?php print render($page['sidebar']); ?>
    </div>
  <?php endif; ?>
  <div class="clearfix"></div>
</div>

<div class="section-triptych section">
  <?php print render($page['triptych']); ?>
  <div class="clearfix"></div>
</div>

<div class="section-footer section">
  <?php print render($page['footer']); ?>
  <?php print render($page['closure']); ?>
</div>

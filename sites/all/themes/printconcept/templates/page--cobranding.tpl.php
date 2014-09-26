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


  <?php if ($messages): ?>
    <div id="messages">
      <?php print $messages; ?>
    </div>
  <?php endif; ?>

  <?php print render($page['content']); ?>



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
</div>


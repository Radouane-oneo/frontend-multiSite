<?php if (isset($logo) && $logo): ?>
  <img src="<?php print $logo ?>" alt="<?php print $site_name ?>" title="<?php print $site_name ?>" />
<?php endif; ?>


<?php if (isset($page['contenttop']) && $page['contenttop']): ?>
  <div class="whitebox clearfix">
    <?php print render($page['contenttop']); ?>
  </div>
<?php endif; ?>
<div class="whitebox clearfix">
  <?php if ($title): ?>
    <h1><?php print $title ?></h1>
  <?php endif; ?>

  <?php if ($messages): ?>
    <div id="messages">
      <?php print $messages; ?>
    </div>
  <?php endif; ?>

  <?php print render($page['content']); ?>
</div>
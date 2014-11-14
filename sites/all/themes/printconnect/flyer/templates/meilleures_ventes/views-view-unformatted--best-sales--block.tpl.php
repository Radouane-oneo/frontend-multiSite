<?php

/**
 * @file
 * Default simple view template to display a list of rows.
 *
 * @ingroup views_templates
 */
$i=0;
?>

  <div class="headproduct"><h2><?php print strtoupper('Nos meilleures ventes'); ?></h2> <a href="/nos-produits"><span class="allproduct"><?php print t("Tous les produits"); ?></span></a></div>
  <ul class="clearfix">
    <?php foreach ($rows as $id => $row): ?>
      <li style="position:relative;" <?php if ($classes_array[$id]) { print ' class="' . $classes_array[$id] .'"';  } ?>>
        <?php if($i==0) echo '<span class="promo-notif"><span>- 10%</span></span>'; ?>
        
        <?php print $row; ?>
      </li>
      
    <?php $i++; endforeach; ?>
  </ul>

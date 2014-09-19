<?php

/**
 * @file
 * Default simple view template to display a list of rows.
 *
 * @ingroup views_templates
 */
?>

  <div class="headproduct"><a href="/nos-produits"><span class="allproduct"></span></a></div>
  <ul>
    <?php foreach ($rows as $id => $row): ?>
      <li<?php if ($classes_array[$id]) { print ' class="' . $classes_array[$id] .'"';  } ?>>
        <?php print $row; ?>
      </li>
    <?php endforeach; ?>
  </ul>

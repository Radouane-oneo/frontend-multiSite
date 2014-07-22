<h2><?php print t('Print calculator'); ?></h2>
<?php print t('Best quality for the best price! Order your prints here!'); ?>
<div style="height:10px">&nbsp;</div>
<?php
print drupal_render_children($form);
?>

<div id="products">
  <?php foreach ($form['products']['#value'] as $key => $item): ?>
    <div class="<?php print $key; ?>" >
      <a class="item">
      <?php print $item['name']; ?>
    </a>
  </div>
  <?php endforeach; ?>
    </div>

<?php if (isset($form['items']['#value'])):?>
    <div id="items">
  <?php foreach ($form['items']['#value'] as $key => $item): ?>
          <div class="<?php print $key; ?>" >
            <div class="item">
              <?php //print theme('image', array('path' => $item['image']) );?>
      <?php// print l( theme('image', array('path' => $item['image']) ), $item['link'], array('html' => TRUE,'attributes' => array('onclick' => "_gaq.push(['_trackEvent', 'calculator', 'calculate_price', 'price_calculator']);") )); ?>
      <?php print $item['image'];?>
      <?php print $item['name']; ?>
        </div>
      </div>
  <?php endforeach; ?>
      </div>
<?php endif;?>
      <div id="product-dropdown">
        <fieldset>
          <legend><span class="fieldset-legend"><?php print t('Select your product'); ?></span></legend>
    <div class="fieldset-wrapper"></div>
  </fieldset>
</div>
<div id="specs-dropdown">
        <fieldset>
          <legend><span class="fieldset-legend"><?php print t('Select your format'); ?></span></legend>
    <div class="fieldset-wrapper"></div>
  </fieldset>
</div>


<div class="autocomplete" style="z-index:2000; width:448px; padding:10px; position:absolute; display:none; background-color:white;border:solid 1px #D2D2D2; margin-top:5px;"><div>autocomplete</div></div>

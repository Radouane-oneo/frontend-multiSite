<div class="products">
 <div class="first top10">
    <h2 style="font-size:18px; margin:15px 0 15px 0; color:#FFF"><?php print t('Top 10 products'); ?></h2>


    <div class="content font" style="color:#FFFFFF">
      <?php print theme('item_list', array('items' => $top10)); ?>
   
    </div>

  </div>
 
 
  <div class="second">
    <h2 style="font-size:18px; margin:15px 0 0 0; "><?php print t('PrintConcept.com products'); ?></h2>
    <?php foreach ($columns[0] as $letter => $products): ?>
    <h2><?php print $letter; ?></h2>
    <?php print theme('item_list', array('items' => $products)); ?>
    <?php endforeach; ?>
  </div>
  <div class="third">
  <h2 style="height:30px">&nbsp;</h2>
    <?php foreach ($columns[1] as $letter => $products): ?>
    <h2><?php print $letter; ?></h2>
    <?php print theme('item_list', array('items' => $products)); ?>
    <?php endforeach; ?>
  </div>
  <div class="fourth last">
  <h2 style="height:30px;">&nbsp;</h2>
    <?php if (isset($columns[2])): ?>
    <?php foreach ($columns[2] as $letter => $products): ?>
    <h2><?php print $letter; ?></h2>
    <?php print theme('item_list', array('items' => $products)); ?>
    <?php endforeach; ?>
 <!--<div class="promo" style="height:0px;"> <?php print l(theme('image', array('path' => 'sites/default/files/images/Campaign/promo_menu.png')), 'drukwerk/folders', array('html' => true)); ?></div>-->
    
    
    <?php endif; ?>
  </div>
 
  <div class="clearfix"></div>
</div>

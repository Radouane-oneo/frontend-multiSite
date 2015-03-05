<?php if (!count($results)):?>
<div class="box">
  <?php print t('No results');?>
</div>
<?php endif;?>

<?php foreach( $results as $result):?>
<hr style="margin-top:15px; margin-bottom:5px" />
<div style="width:620px;">
  <div style="width:120px; float:left; padding-top:10px">
    <div class="zoekdinges"><?php print l(theme('image', array('path' => $result['image'])),$result['link'], array('html' => true)) ;?></div>
  </div>
  
  <div style="width:500px; float:right; ">
    <h3><?php print l($result['title'], $result['link']);?></h3>
    <p><?php print $result['snippet'];?></p>
    <div class="search-icon"><?php print l(t('Products and possibilities'), $result['link']); ?> </div></div>
</div>
<?php endforeach;?>

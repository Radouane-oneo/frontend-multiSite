<?php //dsm($fields);?>


<?php if(!empty($fields['field_vignette_nouveaute']->content)):?>	
        <div class="img">
    <a href="<?php print $fields['field_lien_nouveaute']->content; ?>">
        <?php print $fields['field_vignette_nouveaute']->content; ?>
    </a>
        </div>
     <h3 class="title"><?php print $fields['title']->content; ?></h3>
 <?php endif;?>
<?php  print  $fields['contextual_links']->content ; ?>
   

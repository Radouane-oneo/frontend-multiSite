<?php //dsm($fields);?>


<?php if(!empty($fields['field_vignette_nouveaute']->content)):?>	
       
    <a href="<?php print $fields['field_lien_nouveaute']->content; ?>">

        <?php print $fields['field_vignette_nouveaute']->content; ?>

    </a>
   
 <?php endif;?>
<?php  print  $fields['contextual_links']->content ; ?>
   

<?php //dsm($fields);?>


<?php if(!empty($fields['field_vignette_nouveaute']->content)):?>	
       
    <a href="<?php print $fields['field_lien_nouveaute']->content; ?>">

        <?php print $fields['field_vignette_nouveaute']->content; ?>
        <h2><?php print $fields['title']->content; ?></h2>
    </a>
   
 <?php endif;?>
<?php  print  $fields['contextual_links']->content ; ?>
   

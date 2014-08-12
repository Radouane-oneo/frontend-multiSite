<?php //dsm($fields);?>


<?php if(!empty($fields['body']->content)):?>	


    <h2><?php print $fields['title']->content; ?></h2>
    <?php print $fields['body']->content; ?>
    <?php print $fields['view_node']->content; ?>

 <?php endif;?>

<?php  print  $fields['contextual_links']->content ; ?>
   

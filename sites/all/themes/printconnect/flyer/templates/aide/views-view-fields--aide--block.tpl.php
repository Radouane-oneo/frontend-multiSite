<?php //dsm($fields);?>

<?php if(!empty($fields['body']->content)):?>	
    <h2><?php print $fields['title']->content; ?></h2>
    <div class="accordion-item">
	    <?php print $fields['body']->content; ?>
	    <div class="link"><?php print $fields['view_node']->content; ?></div>
	</div>

 <?php endif;?>

<?php  print  $fields['contextual_links']->content ; ?>
   

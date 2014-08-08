<?php //dsm($fields);

list($prix1, $prix2) = split('[,.]', $fields['field_prix']->content);
?>

<div class="blocprd">
    <?php if(!empty($fields['field_vignette_vente']->content)):?>	
        <a href="products/1">
            
            <?php print $fields['field_vignette_vente']->content; ?>

            <h2><?php print $fields['title']->content; ?></h2>
            
        </a>
     <?php endif;?>
</div>

<div class="from">
    <?php if(!empty($fields['field_prix']->content)):?>
    <span class="txt"><?php print t('À partir de'); ?> </span> 
    <span class="price">
        <span class="value">

            <span class="currency">€</span>&nbsp;
            <span class="whole"><?php print $prix1; ?></span>
            <span class="decimalpoint">,</span>
            <span class="decimals"><?php print $prix2; ?></span>

        </span>

    </span>
    <?php endif;?>
</div>
<a class="order btn-cmd" href="products/1">
    <span class="flesh"></span>
    <?php print t('Commandez maintenant'); ?> 
</a>

   

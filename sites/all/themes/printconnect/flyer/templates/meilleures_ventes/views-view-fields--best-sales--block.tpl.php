<?php //dsm($fields);
list($prix1, $prix2) = split('[,.]', $fields['field_prix']->content);
?>
<div class="blocprd">
    <a href="<?php print $fields['field_lien_vente_1']->content; ?>">
        <?php if(!empty($fields['field_image_link']->content)):?>
            <img src="<?php print $fields['field_image_link']->content; ?>" />
        <?php endif;?>
        <h2>coco<?php print $fields['title']->content; ?></h2> 
    </a> 
</div>

<div class="from">
    <?php if(!empty($fields['field_prix']->content)):?>
    <span class="txt"><?php print t('À partir de'); ?> </span> 
    <span class="price">
        <span class="value">
            <?php
                global $language;
                $arrayLanguage = array('befr', 'lufr', 'frfr');
                if (in_array($language->prefix, $arrayLanguage)): ?>
                    <span class="whole"><?php print $prix1; ?></span><span class="decimalpoint">,</span><span class="decimals"><?php print $prix2; ?></span>&nbsp;<span class="currency">€</span>
                <?php else: ?>
                    <span class="currency">€&nbsp;</span><span class="whole"><?php print $prix1; ?></span><span class="decimalpoint">,</span><span class="decimals"><?php print $prix2; ?></span>
                <?php endif; ?>
        </span>

    </span>
    <?php endif;?>
</div>
<a class="order btn-cmd" href="<?php print $fields['field_lien_vente_1']->content; ?>">
    <span class="flesh"></span>
    <?php print t('Commandez maintenant'); ?> 
</a>

   

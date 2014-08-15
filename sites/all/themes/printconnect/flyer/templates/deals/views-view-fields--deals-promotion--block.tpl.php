<?php //dsm($fields);?>


<?php if(!empty($fields['field_vignette_deal']->content)):?>	

        <?php print $fields['field_vignette_deal']->content; ?>

        <?php print $fields['body']->content; ?>
        
    <p id="prixdeal">
        <span class="pricedeal"> <?php print $fields['field_prix_deal']->content ?></span><span class="euro"> €</span> au lieu de <span class="pricedeal"><?php print $fields['field_prix_promotion']->content; ?></span><span class="euro"> €</span>
    </p>
    
     <?php print $fields['field_temps_deal']->content; ?>
    
        <?php if(!empty($fields['field_lien_deal']->content)):?>	
            <a href="<?php print $fields['field_lien_deal']->content; ?>" class="ui-button plusinfobtn" >
                <span class="flesh"></span>
                    PLus d’info
                </span>
            </a>
        <?php endif; ?>
<?php endif; ?>	

<?php  print  $fields['contextual_links']->content ; ?>
   

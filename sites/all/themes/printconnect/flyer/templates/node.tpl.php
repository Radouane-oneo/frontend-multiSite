<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>
    <div class="content"<?php print $content_attributes; ?>>
       <?php
         // We hide the comments and links now so that we can render them later.
         hide($content['comments']);
         hide($content['links']);
         print render($content);
       ?>
    </div>
    <div class="lireSuite">
            <a href="javascript:history.back()" title="<?php echo t("Retour")?>"><?php echo t("Retour")?></a>
    </div>	 
</div>
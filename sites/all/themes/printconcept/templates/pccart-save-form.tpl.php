<fieldset><legend><span class="fieldset-legend"><?php print t('You just added...'); ?></span></legend>
  <div class="fieldset-wrapper">
    <div class="product">
      <div class="image">
        <?php print theme('image', array('path' => $form['image']['#value'])); ?>
      </div>
      <div class="text">
        <h3><?php print $form['title']['#value']; ?></h3>
        <?php print theme('item_list', array('items' => $form['list']['#value'])); ?>
      </div>
      <div class="clear"></div>
     
    </div>
    

    
    
    <div class="upgrade">
    
      <?php if (isset($form['upgrade'])): ?>
       <hr />
      <h3><?php print t('Upgrade nu en bespaar meteen!'); ?></h3>
          <div class="bubble">
        <?php print theme('image', array('path' =>  $form['bubble']['#value'])); ?>
        </div>
        <div class="save">


        <?php print t('Upgrade to %qty ex. for ', array('%qty' => $form['upgrade']['qty']['#value'])); ?>
        <?php print t('upgrade_only') . '&nbsp;' . theme('price', array('value' => $form['upgrade']['price']['#value'])) . '&nbsp;' . t('more'); ?>
<div style="height:10px">&nbsp;</div>
        <?php print drupal_render($form['submit']); ?>
        </div>


      <?php endif; ?>

          <div class="clear"></div>
        </div>
      </div>    
    </fieldset>

<?php print drupal_render_children($form); ?>
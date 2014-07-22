


<fieldset>
  <legend><span class="fieldset-legend"><?php print t('Pickup your order for FREE in one of our pickup points'); ?></span></legend>
  <div class="fieldset-wrapper">
<?php print t('About the free pickuppoints'); ?>
    <?php print drupal_render($form['country']); ?>
    <table>
      <tr>
        <td>
          <?php print drupal_render($form['postalcode']); ?>
        </td>
        <td>&nbsp;<?php print t('or');?>&nbsp;</td>
        <td>
          <?php print drupal_render($form['place']); ?>
        </td>
        <td>
          <?php print drupal_render($form['find']); ?>
        </td>
      </tr>
    </table>

    <div class="results-container">
      <div class="text">
        <h3><?php print t('Choose a pickup point'); ?></h3>
        <?php print t('You have not selected a pickupoint. Fill in your postal code or place above and click \'Find\''); ?>
        </div>  
        <div  class="results">
          <h3><?php print t('Select your pickup point'); ?></h3>
          <hr/>
          <ul>

          </ul>
        <?php print l(t('Select this pickup point'), '<front>', array('attributes' => array('class' => array('button', 'display-block', 'select')))); ?>
        </div>
      </div>

    <?php hide($form['result']['icon']); ?>

          <input class="icon" type="hidden" value="/sites/all/themes/printconcept/css/images/icon_pickuppoint.png"></input>

    <?php print drupal_render($form['map']); ?>


          <li class="item-template"><div class="name"></div><div class="address"></div><!--<div class="select-container"><a class="select" href=""><?php print t('Select this pickup point');?></a></div>--></li>

          <div class="infowindow-template"><div class="name"></div><div class="address"></div><div class="openinghours"></div><a href="" class="button select"><?php print t('Select this pickuppoint'); ?></a></div>


    <?php print drupal_render_children($form); ?>
  </div>
</fieldset>

<fieldset class="step-1">
  <legend><span class="fieldset-legend"><?php print t('Configure your product'); ?></span></legend>
  <div class="fieldset-wrapper">
    <div>
      <div class="image" style="margin-top:30px;">
        <?php print theme('image', array('path' => $form['image']['#value'], 'alt' => drupal_get_title(), 'title' => drupal_get_title())); ?>
      </div>
      <div class="configuration">
        <?php print t('Select your options'); ?>
        <hr />
        <?php print drupal_render($form['groups']); ?>
      </div>
    </div>
    <div class="clear"></div>
  </div></fieldset>


<fieldset class="step-2">
  <legend><span class="fieldset-legend"><?php print t('Select your amount'); ?></span></legend>
  <div class="fieldset-wrapper">
    <div>
      <table class="clear grid">
        <thead>
          <tr>
            <th class="quantity"><?php print t('Quantity'); ?></th>
            <th></th>
            <th class="right price"><?php print t('Price VAT excl.'); ?></th>
            <th class="right promo"> </th>
            <th class="right promo"> </th>
            <th class="right priceperpiece"><?php print t('Price per piece'); ?></th>
            <th></th>
          </tr>
        </thead>
        <thead>
          <tr class="selected custom">
            <td class="quantity"><?php print drupal_render($form['custom_quantity']); ?></td>
            <td class="select">
              <?php print drupal_render($form['quantity']['custom']['radio']); ?>
            </td>
            <td class="price"><?php print isset($form['quantity']['custom']['price']['#value']) ? theme('price', array('value' => $form['quantity']['custom']['price']['#value'], 'currency' => TRUE)) : theme('price', array('value' => 1, 'currency' => TRUE)); ?></td>
            <td class=""></td>
            <td class=""></td>
            <td class="priceperpiece"><?php print isset($form['quantity']['custom']['priceperpiece']['#value']) ? theme('price', array('value' => $form['quantity']['custom']['priceperpiece']['#value'], 'currency' => TRUE)) : theme('price', array('value' => 1, 'currency' => TRUE)); ?></td>
            <td align="right" class="save"><?php
              if (isset($form['quantity']['custom']['save']['#value']) && $form['quantity']['custom']['save']['#value'] > 0) {
                print t('Save @value %', array('@value' => \printconnect\Drupal\Functions::FormatNumber($form['quantity']['custom']['save']['#value'], 0)));
              }
              ?></td>

            <td class="text" colspan="6"><?php print t('Enter any quantity or select a price below'); ?></td>
          </tr>
        </thead>
        <tbody>
          <?php unset($form['quantity']['custom']); ?>
          <?php foreach (element_children($form['quantity']) as $key): ?>
            <tr class="">
              <td class="emphasize quantity">
                <?php print t('@qty ex.', array('@qty' => number_format($key, 0, ',', '.'))); ?>

              </td>
              <td>
                <?php print drupal_render($form['quantity'][$key]['radio']); ?>
              </td>
              <?php if (isset($form['quantity'][$key]['promo']['#value'])): ?>
                <td class="old price"><?php print theme('price', array('value' => $form['quantity'][$key]['promo']['#value'], 'currency' => TRUE)) ?></td>
                <td class="promo">
                  <?php print theme('price', array('value' => $form['quantity'][$key]['price']['#value'], 'currency' => TRUE)); ?>
                </td>
                <td class="promo"><?php print t('Promo!'); ?></td>

              <?php else: ?>

                <td class="price">
                  <?php print theme('price', array('value' => $form['quantity'][$key]['price']['#value'], 'currency' => TRUE)); ?>
                </td>
                <td></td>
                <td></td>
              <?php endif; ?>

              <td class="priceperpiece">
                <?php print theme('price', array('value' => $form['quantity'][$key]['priceperpiece']['#value'], 'currency' => TRUE)); ?></td>
              <td align="right"><?php
              if ($form['quantity'][$key]['save']['#value'] > 0) {
                print t('Save @value %', array('@value' => \printconnect\Drupal\Functions::FormatNumber($form['quantity'][$key]['save']['#value'], 0)));
              }
                ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
    <div>

      <?php if (isset($form['options']['#options']) && count($form['options']['#options'])): ?>
        <h4><?php print t('Additional finishing'); ?></h4>
        <?php $form['options']['#title_display'] = 'invisible'; ?>
        <?php print drupal_render($form['options']); ?>
        <?php print t('Depending on the options, the delivery time may vary'); ?>

      <?php endif; ?>

      <?php print drupal_render($form['elections']); ?>


    </div>
    
      <div class="footer clearfix">

        <!-- brolcode by cee -->
        <!-- Dates block -->
<!--        <div style="border-right:1px solid #d2d2d2; height:120px; float:left; width:300px">

          <div style="float:right; width:120px;">

            <a href="#tooltip"><?php // print theme('image', array('path' => printconcept\Drupal\Functions::GetImage('shipping', $form['shipping']['#value']['shipsIn'])));  ?>
              <?php print drupal_render($form['shipping']['image']); ?>
                                      <center><div style="font-size:10px; margin-top:-10px;"><?php print t('Need to know more?'); ?></div></center></a>

          </div>
          -->
          
          <?php print drupal_render($form['shipping']);?>
          

<!--          <fieldset id="tooltip" style="width:420px;">
            <legend><span class="fieldset-legend"><?php print t('Supply times'); ?></span></legend>

            <div class="fieldset-wrapper">
              <?php print t('PrintConcept is fast blabla...'); ?>

              <table>

                <?php foreach ($form['deadlines']['#value']->items as $deadline): ?>
                  <tr>
                    <td class="supply"><?php print t('Supply before'); ?>: <?php print \printconnect\Drupal\Functions::FormatDate(strtotime($deadline->deadlineDate), 'custom', 'l H:i'); ?></td>
                    <td class="delivery"><?php print t('Shipping_deadline'); ?>: <?php print format_date(strtotime($deadline->shippingDate), 'custom', 'l'); ?><?php //print t('Pickup / delivery');  ?><?php //print format_date(strtotime($deadline->deliveryDate), 'custom', 'l');  ?></td>
                  </tr>	
                <?php endforeach; ?>
              </table>
              <div class="box" style="margin-top:20px;">
                <?php print t('Depending on your delivery address...'); ?>
              </div>
            </div>
          </fieldset>-->


<!--
        </div>-->

        <!-- end brolcode by cee -->



        <div class="right">
          <div class="priceblock">
            <table>
              <tr class="totalexvat">
                <td><?php print t('Total excl. VAT'); ?></td>
                <td class="value"><?php print theme('price', array('value' => $form['subtotal']['#value'])); ?></td>
              </tr>
              <tr class="vat">
                <td><?php print t('VAT'); ?></td>
                <td  class="value"><?php print theme('price', array('value' => $form['vat']['#value'])); ?></td>
              </tr>
              <tr class="total">
                <td class="totallabel"><?php print t('Total incl. VAT'); ?></td>
                <td  class="value"><?php print theme('price', array('value' => $form['total']['#value'], 'total' => TRUE)); ?></td>
              </tr>
            </table>
          </div>
          <?php  print drupal_render($form['addToCart']); ?>
        
      </div>
    </div>
  </div>
</fieldset>

<?php print drupal_render($form['deadlines']); ?>

<?php print drupal_render($form['other']); ?>


<div id="toolboxitems">
  <?php foreach ($form['toolboxItems']['#value'] as $key => $item): ?>


    <div id="<?php print $key; ?>" >
      <div class="item">
        <?php print theme('image', array('path' => $item['image'])); ?>
        <?php print $item['name']; ?>
      </div>
    </div>
  <?php endforeach; ?>
</div>

<div id="dropdowns">
  <?php foreach ($form['tree']['#value'] as $groupId => $group): ?>

    <fieldset id="<?php print $form['groups'][$groupId]['#id'] . '-dropdown'; ?>">
      <legend><span class="fieldset-legend"><a class="close"><?php print theme('image', array('path' => path_to_theme() . '/css/images/delete.png')); ?></a><?php print t('Select your') . "&nbsp;" . strtolower($group['name']); ?></span></legend>
      <div class="fieldset-wrapper"></div>

    </fieldset>

  <?php endforeach; ?>
</div>

<?php print drupal_render_children($form); ?>



<div class="grid-overlay" style="padding-top:60px;">
  <div class="filler"></div>
  <div class="spinner">
    <img src="/sites/all/themes/printconnect/images/ajax-loader-large.gif"/>
    <div><?php print t('Your prices are being calculated...'); ?></div>
  </div>
</div>

<div class="overlay"><div class="filler"></div></div>

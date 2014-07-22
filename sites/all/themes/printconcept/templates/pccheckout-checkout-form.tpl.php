<?php print drupal_render($form['logout']); ?>


<?php if (isset($form['login'])): ?>

  <fieldset class="first <?php print $form['login']['fieldsetclass']['#value']; ?>"><legend><span class="fieldset-legend"><?php print t('Register or login'); ?></span></legend>
    <div class="fieldset-wrapper">

      <?php print t('Account advantages'); ?>

      <?php print drupal_render($form['login']['options']); ?>
      <?php print drupal_render($form['login']['email']); ?>
      <?php print drupal_render($form['login']['password']); ?>

      <table class="actions">
        <tr>
          <td>
            <?php if ($form['login']['option']['#value'] == 'existing'): ?>
              <?php print l(t('Forgot your password?'), 'myprintconcept/forgotpassword', array('attributes' => array('class' => array('linkbutton', 'forgot-password', 'iframe')), 'query' => array('callback' => ' pccheckout_forgotpassword_callback'))); ?>
            <?php else: ?>
              <?php print t('Text on spam'); ?>
            <?php endif; ?>
          </td>
          <td class="text-right"><?php print drupal_render($form['login']['submit']); ?><?php print drupal_render($form['login']['register']); ?></td>
        </tr></table>
    </div>
  </fieldset>
<?php endif; ?>


<?php if (isset($form['personal'])): ?>
  <fieldset class="first <?php print $form['personal']['fieldsetclass']['#value']; ?>"><legend><span class="fieldset-legend"><?php print t('Register or login'); ?></span></legend>
    <div class="fieldset-wrapper">

      <h2><?php print t('Your details'); ?></h2>
      <?php print t('In case something is unclear, we need your contact details.'); ?>
      <?php print drupal_render($form['personal']['firstName']); ?>
      <?php print drupal_render($form['personal']['lastName']); ?>
      <?php print drupal_render($form['personal']['phone']); ?>
      <table class="actions">
        <tr><td/><td class="text-right"> <?php print drupal_render($form['personal']['submit']); ?></td></tr>
      </table>
    </div>
  </fieldset>

<?php endif; ?>

<fieldset class="second shipping <?php print $form['shipping']['fieldsetclass']['#value']; ?>"><legend><span class="fieldset-legend"><?php print t('Shipping'); ?></span></legend>
  <div class="fieldset-wrapper">

    <?php if (isset($form['shipping']['pickup'])): ?>

      <?php print t('You specified to pick this parcel up at a pick up point.'); ?>
      <?php print drupal_render($form['shipping']['pickup']['contact']); ?>
      <?php print drupal_render($form['shipping']['pickup']['sms']); ?>
      <?php print drupal_render($form['shipping']['pickup']['email']); ?>

      <?php print drupal_render($form['shipping']['pickup']); ?>

      <!--
      
        <div class="pup box <?php print $form['shipping']['pickup']['selected']['#value'] ? '' : 'invisible'; ?>">
          <div class="col first">
            <h4 class="name"><?php print htmlentities($form['shipping']['pickup']['name']['#value']); ?></h4>
            <div class="address"> <?php print $form['shipping']['pickup']['address']['#value']; ?><br/><?php print $form['shipping']['pickup']['postalCode']['#value']; ?> <?php print $form['shipping']['pickup']['city']['#value']; ?></div>
      <?php print drupal_render($form['shipping']['pickup']['another']); ?>
          </div>

          <div class="col">
            <h4><?php print t('Opening hours'); ?></h4>
            <div class="openinghours-container">
      <?php
      if ($form['shipping']['pickup']['openinghours']['#value']) {
        $rows = array();

        foreach ($form['shipping']['pickup']['openinghours']['#value'] as $day => $hours) {
          $rows[] = array(
              array('data' => t($day), 'class' => array('day')),
              array('data' => $hours),
          );
        }

        print theme('table', array('rows' => $rows, 'attributes' => array('class' => array('openinghours'))));
      }
      ?>
            </div>
          </div>

          <div class="clear"></div>
        </div>
      -->
      <!--
            <div class="nopup box <?php print $form['shipping']['pickup']['selected']['#value'] ? 'invisible' : ''; ?>">
      <?php print drupal_render($form['shipping']['pickup']['new']); ?>
            </div>
      -->

      <table class="actions" style="margin-top:10px;">
        <tr>
          <td><div class="c-icon"><?php // print l(t('Ship this order'), 'checkout/shipping/delivery');    ?></div></td>
          <td  class="text-right"><?php print drupal_render($form['shipping']['pickup']['submit']); ?></td>
        </tr>
      </table>

    <?php endif; ?>
    <?php if (isset($form['shipping']['delivery'])): ?>

      <?php print t('You specified a delivery for this order. Whom shall we ship it to?'); ?>
      <?php print drupal_render($form['shipping']['delivery']['address']); ?>
      <?php //print l('+', '<front>', array('attributes' => array('class' => array('add')))); ?>
      <?php print drupal_render($form['shipping']['delivery']['company']); ?>
      <?php print drupal_render($form['shipping']['delivery']['name']); ?>
      <?php print drupal_render($form['shipping']['delivery']['street']); ?>
      <?php $form['shipping']['delivery']['postalCode']['#title'] = t('PC and city'); ?>
      <?php $form['shipping']['delivery']['city']['#title_display'] = 'invisible'; ?>
      <?php print drupal_render($form['shipping']['delivery']['postalCode']); ?>
      <?php print drupal_render($form['shipping']['delivery']['city']); ?>
      <?php print drupal_render($form['shipping']['delivery']['country']); ?>
      <?php print drupal_render($form['shipping']['delivery']['phone']); ?>

      <table class="actions">
        <tr>

          <td><?php if (variable_get('pcpickuppoints_enabled')): ?>
              <div class="c-icon"><?php // print l(t('Pickup this order for free'), 'checkout/shipping/pickup');    ?>
              <?php endif; ?></div></td>
          <td class="text-right"><?php print drupal_render($form['shipping']['delivery']['submit']); ?></td>
        </tr>
      </table>


    <?php endif; ?>

    <?php print drupal_render($form['shipping']['neutral']); ?>

    <?php print drupal_render($form['shipping']['giftvouchers']); ?>  


    <div class="box invoice">
      <div class="header">

        <h2><?php print t('Need an invoice?'); ?></h2>

        <?php print drupal_render($form['invoice']['needinvoice']); ?>
      </div>

      <?php print drupal_render($form['invoice']['address']); ?>


    </div>



    <table class="actions" style="margin-top:10px;">
      <tr>
        <td></td>
        <td  class="text-right"><?php print drupal_render($form['shipping']['submit']); ?></td>
      </tr>
    </table>


  </div>
</fieldset>

<fieldset class="third payment <?php print $form['payment']['fieldsetclass']['#value']; ?>"><legend><span class="fieldset-legend"><?php print t('Payment'); ?></span></legend>
  <div class="fieldset-wrapper">


    <?php print drupal_render($form['payment']['credit']); ?>

    <?php if (isset($form['payment']['method'])): ?>
      <table class="payment-methods">
        <thead>
          <tr>
            <th/>
            <th><?php print t('Method'); ?></th>
            <th/>
            <th><?php print t('Excl. VAT'); ?></th>
          </tr>
        </thead>
        <tbody>
          <?php foreach (element_children($form['payment']['method']) as $key): ?>
            <tr>
              <td width="40" style="padding-left: 30px;"><?php print drupal_render($form['payment']['method'][$key]); ?></td>
              <td width="80"><?php print theme('image', array('path' => $form['payment']['methods']['#value'][$key]['image'])); ?></td>
              <td width="130"><?php print $form['payment']['methods']['#value'][$key]['name']; ?><span class="price"> (<?php print theme('price', array('value' => $form['payment']['methods']['#value'][$key]['cost'], 'free' => TRUE)); ?>)</span></td>
              <td><span style="font-size: 9px; color: #999;"><?php print $form['payment']['methods']['#value'][$key]['description']; ?></span></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>



    <div class="box pricebox">
      <div class="right" style="position:relative;">
        <!--        <div class="priceblock">
                  <table>
                    <tr>
                      <td><?php print t('Total excl. VAT'); ?></td>
                      <td class="value total-excl-vat"><?php print theme('price', array('value' => $form['payment']['subtotal']['#value'])); ?></td>
                    </tr>
                    <tr>
                      <td><?php print t('VAT'); ?></td>
                      <td  class="value vat"><?php print theme('price', array('value' => $form['payment']['vatamount']['#value'])); ?></td>
                    </tr>
                    <tr>
                      <td class="totallabel"><?php print t('Total incl. VAT'); ?></td>
                      <td  class="value total-incl-vat"><?php print theme('price', array('value' => $form['payment']['total']['#value'], 'total' => TRUE)); ?></td>
                    </tr>
                  </table>
                </div>-->
        <?php print drupal_render($form['payment']['priceblock']); ?>
        <?php print drupal_render($form['payment']['submit']); ?>
        <div class="overlay" style="display:none;">
          <div class="filler"></div>
          <div class="spinner">
            <img src="/sites/all/themes/printconcept/images/ajax-loader-large.gif"/>                                        
          </div>
        </div>
      </div>

      <div class="terms">
        <?php print drupal_render($form['payment']['terms']); ?><?php print t('I agree with the ') . l(t('terms and conditions'), 'node/67', array('attributes' => array('target' => '_blank'))); ?>&nbsp;*
      </div>
      <div class="clear"></div>
    </div>





  </div>
</fieldset>



<?php print drupal_render_children($form); ?>

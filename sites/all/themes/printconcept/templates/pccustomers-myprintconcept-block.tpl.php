<div id="profile-info">
  <h3><?php print $customer->firstName . ' ' . $customer->lastName; ?></h3>
  <ul>
    <li><span>t</span> <?php print $customer->phone; ?></li>
    <li><span>e</span> <?php print $customer->email; ?></li>
  </ul>
  <?php print l(t('Update your profile'), 'myprintconcept/profile'); ?> | <?php print l(t('Change your password'), 'myprintconcept/changepassword'); ?>
</div>
<fieldset>
  <legend>
    <span class="fieldset-legend"><?php print t('MyPrintConcept.com'); ?></span>
  </legend>
  <div class="fieldset-wrapper">
    <?php print theme_item_list($items['orders']); ?>
    <?php print theme_item_list($items['personal']); ?>
    <?php print theme_item_list($items['logout']); ?>
  </div>
</fieldset>

<fieldset>
  <legend>
    <span class="fieldset-legend"> <?php print t('MyPrintConcept.com'); ?></span>
  </legend>
  <div class="fieldset-wrapper">
    <?php
    print theme('item_list', array('items' => array(
                l(t('Open orders'), 'myprintconcept/orders'),
                l(t('Closed orders'), 'myprintconcept/closedorders'),
                l(t('Invoices'), 'myprintconcept/invoices'),
            )));
    ?>
    <?php
    print theme('item_list', array('items' => array(
                l(t('Addresses'), 'myprintconcept/addresses'),
                l(t('Add address'), 'myprintconcept/addresses/new'),
            )));
    ?>
    <?php
    print theme('item_list', array('items' => array(
                l(t('Logout'), 'myprintconcept/logout'),
            )));
    ?>
  </div>
</fieldset>
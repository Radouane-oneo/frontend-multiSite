<?php
	$Products = array(
		'1' 	=> array(		'title'	=> t('Flyers'),
							'price'	=> '14,83',
							'pack'	=> t('for @qty pcs.', array( '@qty' => '10')),	),
		'4'	=> array(		'title'	=> t('Posters'),
							'price'	=> '15,00',
							'pack'	=> t('for @qty pcs.', array( '@qty' => '1')),	),
		'8' 	=> array(		'title'	=> t('Business cards'),
							'price'	=> '13,00',
							'pack'	=> t('for @qty pcs.', array( '@qty' => '50')),	),
		'6' 	=> array(		'title'	=> t('Folders'),
							'price'	=> '41,00',
							'pack'	=> t('for @qty pcs.', array( '@qty' => '10')),	),
	);

	switch (arg(1)) {
		case '1':	$T = array(4,8,6);	break;
		case '4':	$T = array(1,8,6);	break;
		case '8':	$T = array(1,4,6);	break;
		default:	$T = array(1,4,8);	break;
	}

	global $language;
	$lang = $language->prefix;
?>

<div class="static-products other clearfix form-wrapper" id="edit-other">
	<h3 class="sp-title"><?php print t('We also make'); ?></h3>

	<?php	foreach ($T as $id): ?>

		<div class="item form-wrapper" id="edit-other-<?php print $id; ?>">
			<div class="image form-wrapper" id="edit-other-<?php print $id; ?>-image">
				<img typeof="foaf:Image" src="http://pc-images.s3-eu-west-1.amazonaws.com/images.printconcept.com/products/<?php print $id; ?>.png" alt="">
			</div>
			<h3><?php print $Products[$id]['title'] ?></h3>
			<span class="price" decimal_separator=",">
				<span class="currency">€</span>
				<span class="value"><?php print $Products[$id]['price'] ?></span>
			</span> <?php print $Products[$id]['pack'] ?>
			<div class="a-icon form-wrapper" id="edit-other-<?php print $id; ?>-link">
				<?php print l($Products[$id]['title'] . ' ' .  t('Ordering'), 'products/'.$id, array('language' => $lang)) ; ?>
			</div>
		</div>

	<?php endforeach; ?>

</div>

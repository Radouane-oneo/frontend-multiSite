<?php

	global $language;
	$lang = $language->prefix;

	$T = array(1,4,8);

	$Products = array(
		'1' 	=> array(		'title'	=> t('Flyers / Tracts'),
							'price'	=> '23,00',
							'pack'	=> t('for @qty pcs.', array( '@qty' => '500')),
							'image'=> 'https://d4e7wxbvl20c1.cloudfront.net/images.flyer.fr/products/1.png',
							'link'	=> '/products/1/1,10,18//500'	),
		'4'	=> array(		'title'	=> t('Posters'),
							'price'	=> '55,00',
							'pack'	=> t('for @qty pcs.', array( '@qty' => '50')),
							'image'=> 'https://d4e7wxbvl20c1.cloudfront.net/images.flyer.fr/products/4.png',
							'link'	=> '/products/4/43,11,18//50'	),
		'8' 	=> array(		'title'	=> t('Business cards'),
							'price'	=> '31,00',
							'pack'	=> t('for @qty pcs.', array( '@qty' => '250')),
							'image'=> 'https://d4e7wxbvl20c1.cloudfront.net/images.flyer.fr/products/8.png',
							'link'	=> '/products/8/189,10,286//250'	),
	);

?>

<div class="static-products other clearfix form-wrapper" id="edit-other">
	<h3 class="sp-title"><?php print t('We also make'); ?></h3>

	<?php	foreach ($T as $id): ?>

		<div class="item form-wrapper" id="edit-other-<?php print $id; ?>">
			<div class="image form-wrapper" id="edit-other-<?php print $id; ?>-image">
				<img typeof="foaf:Image" src="<?php print $Products[$id]['image']; ?>" alt="">
			</div>
			<h3 class="prod-title"><?php print t($Products[$id]['title']) ?></h3>
			<span class="price" decimal_separator=",">
				<span class="currency">€</span>
				<span class="value"><?php print $Products[$id]['price'] . ' (hors TVA)' ?></span>
			</span> <?php print $Products[$id]['pack'] ?>
			<div class="a-icon form-wrapper" id="edit-other-<?php print $id; ?>-link">
				<?php print l(t($Products[$id]['title'].' '.'Ordering'), $Products[$id]['link'], array('language' => $lang)) ; ?>
			</div>
		</div>

	<?php endforeach; ?>

</div>

<?php

function flyer_breadcrumb($vars) {
	$breadcrumb = $vars['breadcrumb'];
	if (!empty($breadcrumb)) {
		$breadcrumb[] = drupal_get_title();
		return '<div class="breadcrumb">' . implode(' » ', $breadcrumb) . '</div>';
	}
}
function flyer_preprocess_page(&$variables) {
		drupal_add_library('system', 'ui.button');
		$_SESSION['isfront']=0;
		if ($variables['is_front']) {
				$_SESSION['isfront']=1;
		}
		//  drupal_add_css('http://fonts.googleapis.com/css?family=Magra:400,700', array('type' => 'external'));
		if( arg(0) == "taxonomy" && arg(1) == "term") {
					 $variables['page']['content']['system_main']['main'] = null;
					 $variables['title']=t('Aide');
		}

}

/**
 * Disable the sticky header for the quantities table on the product page
 * @param $js
 */
/*function flyer_js_alter(&$js) {
	unset($js['misc/tableheader.js']);
}*/

function flyer_form_pccheckout_invoiceanddelivery_form_alter(&$form, &$form_state) {
	$form['invoice']['address']['current']['postalCode']['#title'] = t('PC and city');
	$form['invoice']['address']['current']['city']['#title_display'] = 'invisible';
	$form['shipping']['detail']['current']['postalCode']['#title'] = t('PC and city');
	$form['shipping']['detail']['current']['city']['#title_display'] = 'invisible';
}

function flyer_form_pccheckout_personal_form_alter(&$form, &$form_state) {
	$form['address']['postalCode']['#title'] = t('PC and city');
	$form['address']['city']['#title_display'] = 'invisible';
}

function flyer_form_pccustomers_address_form_alter(&$form, &$form_state) {
	$form['postal_codeCity']['postalCode']['#title'] = t('PC and city');
	$form['postal_codeCity']['city']['#title_display'] = 'invisible';
}

function flyer_form_pccustomers_newaddress_form_alter(&$form, &$form_state) {
	$form['postalCode']['#title'] = t('PC and city');
	$form['city']['#title_display'] = 'invisible';
}

function flyer_form_pcsamplepacks_request_form_alter(&$form, &$form_state) {
	$form['postalCode']['#title'] = t('PC and city');
	$form['city']['#title_display'] = 'invisible';
}

function flyer_table($variables) {
	$header = $variables['header'];
	$rows = $variables['rows'];
	$attributes = $variables['attributes'];
	$caption = $variables['caption'];
	$colgroups = $variables['colgroups'];
	$sticky = $variables['sticky'];
	$empty = $variables['empty'];

	// Add sticky headers, if applicable.
	if (count($header) && $sticky) {
		drupal_add_js('misc/tableheader.js');
		// Add 'sticky-enabled' class to the table to identify it for JS.
		// This is needed to target tables constructed by this function.
		$attributes['class'][] = 'sticky-enabled';
	}

	$output = '<table' . drupal_attributes($attributes) . ">\n";

	if (isset($caption)) {
		$output .= '<caption>' . $caption . "</caption>\n";
	}

	// Format the table columns:
	if (count($colgroups)) {
		foreach ($colgroups as $number => $colgroup) {
			$attributes = array();

			// Check if we're dealing with a simple or complex column
			if (isset($colgroup['data'])) {
				foreach ($colgroup as $key => $value) {
					if ($key == 'data') {
						$cols = $value;
					} else {
						$attributes[$key] = $value;
					}
				}
			} else {
				$cols = $colgroup;
			}

			// Build colgroup
			if (is_array($cols) && count($cols)) {
				$output .= ' <colgroup' . drupal_attributes($attributes) . '>';
				$i = 0;
				foreach ($cols as $col) {
					$output .= ' <col' . drupal_attributes($col) . ' />';
				}
				$output .= " </colgroup>\n";
			} else {
				$output .= ' <colgroup' . drupal_attributes($attributes) . " />\n";
			}
		}
	}

	// Add the 'empty' row message if available.
	if (!count($rows) && $empty) {
		$header_count = 0;
		foreach ($header as $header_cell) {
			if (is_array($header_cell)) {
				$header_count += isset($header_cell['colspan']) ? $header_cell['colspan'] : 1;
			} else {
				$header_count++;
			}
		}
		$rows[] = array(array('data' => $empty, 'colspan' => $header_count, 'class' => array('empty', 'message')));
	}

	// Format the table header:
	if (count($header)) {
		$ts = tablesort_init($header);
		// HTML requires that the thead tag has tr tags in it followed by tbody
		// tags. Using ternary operator to check and see if we have any rows.
		$output .= (count($rows) ? ' <thead><tr>' : ' <tr>');
		$i = 0;
		foreach ($header as $cell) {
			$i++;
			$cell = tablesort_header($cell, $header, $ts);
			if (!is_array($cell)) {
				$cell = array(
						'data' => $cell,
				);
			}

			if ($i == 1) {
				$cell['class'][] = 'first-child';
			}
			if ($i == count($header)) {
				$cell['class'][] = 'last-child';
			}

			$output .= _theme_table_cell($cell, TRUE);
		}
		// Using ternary operator to close the tags based on whether or not there are rows
		$output .= (count($rows) ? " </tr></thead>\n" : "</tr>\n");
	} else {
		$ts = array();
	}

	// Format the table rows:
	if (count($rows)) {
		$output .= "<tbody>\n";
		$flip = array('even' => 'odd', 'odd' => 'even');
		$class = 'even';
		foreach ($rows as $number => $row) {
			$attributes = array();

			// Check if we're dealing with a simple or complex row
			if (isset($row['data'])) {
				foreach ($row as $key => $value) {
					if ($key == 'data') {
						$cells = $value;
					} else {
						$attributes[$key] = $value;
					}
				}
			} else {
				$cells = $row;
			}



			if (count($cells)) {
				// Add odd/even class
				if (empty($row['no_striping'])) {
					$class = $flip[$class];
					$attributes['class'][] = $class;
				}

				if ($number == 0) {
					$attributes['class'][] = 'first-child';
				} elseif ($number == count($rows) - 1) {
					$attributes['class'][] = 'last-child';
				}


				// Build row
				$output .= ' <tr' . drupal_attributes($attributes) . '>';
				$i = 0;
				foreach ($cells as $cell) {
					$cell = tablesort_cell($cell, $header, $ts, $i++);
					if (!is_array($cell)) {
						$cell = array(
								'data' => $cell,
						);
					}

					if ($i == 1) {
						$cell['class'][] = 'first-child';
					}
					if ($i == count($cells)) {
						$cell['class'][] = 'last-child';
					}
					$output .= _theme_table_cell($cell);
				}
				$output .= " </tr>\n";
			}
		}
		$output .= "</tbody>\n";
	}

	$output .= "</table>\n";
	return $output;
}

function flyer_preprocess_html(&$vars) {
	$arg = arg();

	if (arg(0) == 'news')
		$vars['head_title'] = t('newstitle') . ' | ' . check_plain(variable_get('site_name', 'Drupal'));
	elseif (arg(0) == 'products' && is_null(arg(1)))
		$vars['head_title'] = t('produitstitle') . ' | ' . check_plain(variable_get('site_name', 'Drupal'));

	// save class from node
	$node = menu_get_object();
	if ($node && isset($node->nid)) {
		$node = node_load($node->nid);
		if (isset($node->field_flyerstrap_template['und'])&&$node->field_flyerstrap_template['und'][0]['value']=="1")
			$vars['node_css_class'] = ' flyerstrap';
	}
}

 function flyer_js_alter(&$javascript) {
	$node = node_load(arg(1));
	if($node && $node->type == "webform"){
		unset($javascript['sites/all/themes/printconnect/flyer/libraries/jquery.selectBox/jquery.selectBox.js']);
	}

	if ($_SESSION['isfront'] == 1) {
		unset($javascript['sites/all/modules/printconnect/pcbpost/pcbpost.js']);
		unset($javascript['sites/all/modules/printconnect/pcdesigns/pcdesigns.js']);
		unset($javascript['sites/all/modules/printconnect/pcdesigntool/pcdesigntool.js']);
		unset($javascript['sites/all/modules/printconnect/pcflyerstores/pcflyerstores.js']);
		unset($javascript['sites/all/modules/printconnect/pcpayments/pcpayments.js']);
		unset($javascript['sites/all/modules/printconnect/pctemplates/jquery.ui.position.min.js']);
		unset($javascript['sites/all/modules/printconnect/pctemplates/jquery.ui.autocomplete.min.js']);
		unset($javascript['sites/all/modules/printconnect/pcvat/pcvat.js']);
		unset($javascript['sites/all/modules/printconnect/pcrotator/jquery.rotate.js']);
		unset($javascript['sites/all/modules/printconnect/pcrotator/pcrotator.js']);
		unset($javascript['sites/all/libraries/jquery.masonry/jquery.masonry.min.js']);
		unset($javascript['sites/all/modules/printconnect/pcanalytics/pcanalytics.js']);
		unset($javascript['sites/all/modules/printconnect/pccheckout/pccheckout.js']);
		unset($javascript['sites/all/modules/printconnect/pccustomers/pccustomers.js']);
		unset($javascript['sites/all/modules/printconnect/pcdesigner/pcdesigner.js']);
		unset($javascript['sites/all/modules/printconnect/pcflyerstores/pcflyerstores_map.js']);
		unset($javascript['sites/all/modules/printconnect/pccart/pccart.js']);
		unset($javascript['sites/all/modules/printconnect/pcsegments/pcsegments.js']);
		unset($javascript['sites/all/modules/printconnect/pctemplates/pctemplates.js']);
		unset($javascript['sites/default/files/languages/fr-FR_QWeOKmQMsmBnHhrmoNY7dbJ-x7DwPdy_2c8mJnefIL0.js']);
		unset($javascript['https://maps.googleapis.com/maps/api/js?key=AIzaSyBS0SrsMbBXJ_v2kkgCvbiqwFUatl1pd_s&sensor=true&language=nl']);
		unset($javascript['https://maps.googleapis.com/maps/api/js?libraries=geometry,places']);
		unset($javascript['sites/all/modules/contrib/panels/js/panels.js']);
		unset($javascript['sites/all/modules/contrib/block_tab/js/block_tab.js']);
		unset($javascript['sites/all/modules/printconnect/pcflyerstores/pcflyerstores.js']);
	}
	unset($javascript['misc/tableheader.js']);
	//We define the path of our new jquery core file
	//assuming we are using the minified version 1.8.3
	$jquery_path = drupal_get_path('theme', 'flyer') . '/js/jquery1.7.1.js';

	//We duplicate the important information from the Drupal one
	$javascript[$jquery_path] = $javascript['misc/jquery.js'];
	//..and we update the information that we care about
	$javascript[$jquery_path]['version'] = '1.7.1';
	$javascript[$jquery_path]['data'] = $jquery_path;

	//Then we remove the Drupal core version
	unset($javascript['misc/jquery.js']);
	unset($javascript['sites/all/modules/printconnect/pccart/pccart.js']);
        $args = arg();

        if($args[0]=="cart" || $args[0]=="products" || $args[0]=="payment" || ($args[0]=="checkout" && $args[1]=="invoiceanddelivery")) {
            unset($javascript['sites/all/libraries/fancybox/fancybox/jquery.fancybox-1.3.4.js']);
            unset($javascript['sites/all/modules/contrib/fancybox/js/fancybox.js']);
            unset($javascript['sites/all/themes/printconnect/flyer/libraries/scrollBarPlugin/jquery.mCustomScrollbar.min.js']);
            unset($javascript['sites/all/themes/printconnect/flyer/libraries/scrollBarPlugin/jquery.mCustomScrollbar.concat.min.js']);
            unset($javascript['sites/all/themes/printconnect/flyer/libraries/homeSlider/homeslider.js']);
            unset($javascript['sites/all/themes/printconnect/flyer/js/html5shiv.js']);
            unset($javascript['sites/all/themes/printconnect/flyer/js/selectivizr-min.js']);
            unset($javascript['sites/all/themes/printconnect/flyer/js/flyerstrap.js']);
            unset($javascript['sites/all/modules/printconnect/pcrotator/jquery.rotate.js']);
            unset($javascript['sites/all/modules/printconnect/pcrotator/pcrotator.js']);
            //unset($javascript['sites/all/modules/printconnect/pcbpost/pcbpost.js']);
            unset($javascript['sites/all/modules/printconnect/pccontact/pccontact.js']);
            unset($javascript['sites/all/modules/printconnect/pccustomers/pccustomers.js']);
            unset($javascript['sites/all/modules/printconnect/pcdesigner/pcdesigner.js']);
            unset($javascript['sites/all/modules/printconnect/pcdesigns/pcdesigns.js']);
            unset($javascript['sites/all/modules/printconnect/pcdesigntool/pcdesigntool.js']);
            unset($javascript['sites/all/modules/printconnect/pcorders/pcorders.js']);
            unset($javascript['sites/all/modules/printconnect/pcpayments/pcpayments.js']);
            unset($javascript['sites/all/modules/printconnect/pcproducts/pcproducts.js']);
            unset($javascript['sites/all/modules/printconnect/pcsegments/jquery.qtip.min.js']);
            unset($javascript['sites/all/modules/printconnect/pcsegments/pcsegments.js']);
            unset($javascript['sites/all/modules/printconnect/pctemplates/jquery.ui.position.min.js']);
            unset($javascript['sites/all/modules/printconnect/pctemplates/jquery.ui.autocomplete.min.js']);
            unset($javascript['sites/all/modules/printconnect/pctemplates/pctemplates.js']);
            unset($javascript['sites/all/modules/printconnect/pcvat/pcvat.js']);
        }

        if($args[0] == 'stores' && $args[1] == 'picker' && $args[2] == 'callback') {
            unset($javascript['sites/all/libraries/fancybox/fancybox/jquery.fancybox-1.3.4.js']);
            unset($javascript['sites/all/modules/contrib/fancybox/js/fancybox.js']);
            unset($javascript['sites/all/themes/printconnect/flyer/libraries/scrollBarPlugin/jquery.mCustomScrollbar.min.js']);
            unset($javascript['sites/all/themes/printconnect/flyer/libraries/scrollBarPlugin/jquery.mCustomScrollbar.concat.min.js']);
            unset($javascript['sites/all/themes/printconnect/flyer/libraries/homeSlider/homeslider.js']);
            unset($javascript['sites/all/themes/printconnect/flyer/js/html5shiv.js']);
            unset($javascript['sites/all/themes/printconnect/flyer/js/selectivizr-min.js']);
            unset($javascript['sites/all/themes/printconnect/flyer/js/flyerstrap.js']);
            unset($javascript['sites/all/modules/printconnect/pcrotator/jquery.rotate.js']);
            unset($javascript['sites/all/modules/printconnect/pcrotator/pcrotator.js']);
            unset($javascript['sites/all/modules/printconnect/pcbpost/pcbpost.js']);
            unset($javascript['sites/all/modules/printconnect/pccheckout/pccheckout.js']);
            unset($javascript['sites/all/modules/printconnect/pccontact/pccontact.js']);
            unset($javascript['sites/all/modules/printconnect/pccustomers/pccustomers.js']);
            unset($javascript['sites/all/modules/printconnect/pcdesigner/pcdesigner.js']);
            unset($javascript['sites/all/modules/printconnect/pcdesigns/pcdesigns.js']);
            unset($javascript['sites/all/modules/printconnect/pcdesigntool/pcdesigntool.js']);
            unset($javascript['sites/all/modules/printconnect/pcflyerstores/lib/jquery.jcarousel.js']);
            unset($javascript['sites/all/modules/printconnect/pcorders/pcorders.js']);
            unset($javascript['sites/all/modules/printconnect/pcpayments/pcpayments.js']);
            unset($javascript['sites/all/modules/printconnect/pcproducts/pcproducts.js']);
            unset($javascript['sites/all/modules/printconnect/pcsegments/jquery.qtip.min.js']);
            unset($javascript['sites/all/modules/printconnect/pcsegments/pcsegments.js']);
            unset($javascript['sites/all/modules/printconnect/pctemplates/jquery.ui.position.min.js']);
            unset($javascript['sites/all/modules/printconnect/pctemplates/jquery.ui.autocomplete.min.js']);
            unset($javascript['sites/all/modules/printconnect/pctemplates/pctemplates.js']);
            unset($javascript['sites/all/modules/printconnect/pcvat/pcvat.js']);
        }

        if($args[0]=="products" || $args[0]=="payment") {
        	unset($javascript['sites/all/modules/printconnect/pcflyerstores/pcflyerstores_map.js']);
        }

        if($args[0]=="myprintconnect" && $args[1]=="addresses" && $args[2]== "new" ) {
            unset($javascript['sites/all/modules/printconnect/pcflyerstores/pcflyerstores_map.js']);
        }

        if($args[0]=="myprintconnect" && $args[1]=="mybillingaddress" && $args[2]== "new" ) {
            unset($javascript['sites/all/modules/printconnect/pcflyerstores/pcflyerstores_map.js']);
        }

        if($args[0]=="myprintconnect" && $args[1]=="changepassword" ) {
            unset($javascript['sites/all/modules/printconnect/pcflyerstores/pcflyerstores_map.js']);
        }

        if($args[0]=="myprintconnect" && $args[1]=="login" ) {
            unset($javascript['sites/all/modules/printconnect/pcflyerstores/pcflyerstores_map.js']);
        }

        if($args[0]=="checkout" && $args[1]=="personal" ) { 
            unset($javascript['sites/all/modules/printconnect/pcflyerstores/pcflyerstores_map.js']);
        }

        if($args[0]=="myprintconnect" && $args[1]=="editBillingaddresses" ) { 
            unset($javascript['sites/all/modules/printconnect/pcflyerstores/pcflyerstores_map.js']);
        }

        if($args[0]=="myprintconnect" && $args[1]=="editBillingaddresses" ) { 
            unset($javascript['sites/all/modules/printconnect/pcvat/pcvat.js']);
        }
}

function flyer_css_alter(&$css) {
	if ($_SESSION['isfront'] == 1) {
		unset($css['sites/all/modules/printconnect/pcbpost/pcbpost.css']);
		unset($css['sites/all/modules/printconnect/pcdesigner/pcdesigner.css']);
		unset($css['sites/all/modules/printconnect/pcdesigns/pcdesigns.css']);
		unset($css['sites/all/modules/printconnect/pcdesigntool/pcdesigntool.css']);
		unset($css['sites/all/modules/printconnect/pcflyerstores/pcflyerstores.css']);
		unset($css['sites/all/modules/printconnect/pcoffers/pcoffers.css']);
		unset($css['sites/all/modules/printconnect/pcorders/pcorders.css']);
		unset($css['sites/all/modules/printconnect/pcpayments/pcpayments.css']);
		unset($css['sites/all/modules/printconnect/pcsamplepacks/pcsamplepacks.css']);
		unset($css['sites/all/modules/printconnect/pcsegments/pcsegments.css']);
		unset($css['modules/search/search.css']);
		unset($css['sites/all/modules/contrib/ckeditor/ckeditor.css']);
		unset($css['sites/all/modules/contrib/ctools/css/ctools.css']);
		unset($css['sites/all/modules/contrib/panels/css/panels.css']);
		unset($css['sites/all/modules/printconnect/pcrotator/pcrotator.css']);
		unset($css['sites/all/modules/contrib/block_tab/css/block_tab.css']);
	}
}

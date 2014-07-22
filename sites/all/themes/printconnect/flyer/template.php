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
//  drupal_add_css('http://fonts.googleapis.com/css?family=Magra:400,700', array('type' => 'external'));
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
  $form['postalCode']['#title'] = t('PC and city');
  $form['city']['#title_display'] = 'invisible';
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

  if (arg(0) == 'news') {
    $vars['head_title'] = t('newstitle') . ' | ' . check_plain(variable_get('site_name', 'Drupal'));

  }elseif(arg(0) == 'products' && is_null(arg(1)) ) {
    $vars['head_title'] = t('produitstitle') . ' | ' . check_plain(variable_get('site_name', 'Drupal'));
  }
}

 function flyer_js_alter(&$javascript) {
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
    }


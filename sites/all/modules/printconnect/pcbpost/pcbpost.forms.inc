<?php

function pcbpost_picker_form($form, &$form_state, $callback = FALSE) {
  if (!\printconnect\bPost\Factory::Test()) {
    $form['bpost'] = array(
        '#type' => 'container',
        '#title' => 'bPost',
    );
    $form['bpost']['text'] = array(
        '#markup' => t('This service is temporarily unavailable. We apologize for this inconvenience... Please try again later or choose another shipping method...'),
    );
    return $form;
  }

  drupal_add_js('https://maps.google.com/maps/api/js?sensor=false');
  drupal_add_js(drupal_get_path('module', 'pcbpost') . '/pcbpost_picker_form.js');
  if ($callback)
    drupal_add_js(array('callback' => $callback), 'setting');


  $ajax = array(
      'callback' => 'pcbpost_picker_form_callback',
      'wrapper' => 'result',
      'method' => 'replace',
      'effect' => 'fade',
      'progress' => array(
          'message' => NULL,
          'type' => NULL,
      ),
  );
  // $title = 'bPost';

  $types = printconnect\Shipping\Types\Factory::GetAll();


  foreach ($types as $item) {
    if ($item->shippingType->type == 'shippingTypeBpostPickupPoint') {
      $title = $item->shippingType->tag;
    }
  }
  
  drupal_set_title($title);
  
  $form['bpost'] = array(
      '#type' => 'container',
      '#title' => $title,
  );


  $form['bpost']['search'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('search')),
  );

  $form['bpost']['search']['wrap_leftInput'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('leftInput')),
  );

//  $form['bpost']['search']['title'] = array(
//      '#type' => 'markup',
//      '#markup' => t('Find your pickup point'),
//      '#prefix' => '<h2>',
//      '#suffix' => '</h2>',
//  );

  $form['bpost']['search']['postal'] = array(
      '#type' => 'textfield',
      '#title' => t('Postal code'),
      '#size' => 10,
          //  '#ajax' => $ajax,
  );

  $form['bpost']['search']['wrap_leftInput']['place'] = array(
      '#type' => 'textfield',
      '#title' => t('Place'),
      '#size' => 20,
          //'#ajax' => $ajax,
  );

  $form['bpost']['search']['wrap_leftInput']['search'] = array(
      '#type' => 'submit',
      '#value' => t('Find'),
      //'#button_type' => 'button',
      '#ajax' => $ajax,
          //'#attributes' => array('class' => array('noreplace', 'button')),
  );

  $form['bpost']['result'] = array(
      '#type' => 'container',
      '#id' => 'result',
      '#attributes' => array('class' => array('clearfix')),
  );

  $form['bpost']['result']['pois'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('hidden', 'pois'), 'style' => array('display:none;')),
  );

  $form['bpost']['result']['map'] = array(
      '#type' => 'container',
      '#id' => 'map',
  );


  $form['bpost']['result']['poisjson'] = array(
      '#type' => 'hidden',
      '#value' => '',
      '#id' => 'poisjson',
  );



  $form['bpost']['result']['pois']['content'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('list')),
  );

  $form['bpost']['result']['pois']['content']['text']['header'] = array(
      '#markup' => '<h3>' . t('Choose a pickup point') . '</h3>',
  );

  $form['bpost']['result']['pois']['content']['text']['help'] = array(
      '#markup' => t('You have not selected a pickupoint. Fill in your postal code or place above and click \'Find\''),
  );



  $form['bpost']['result']['infowindow'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('hidden'), 'style' => array('display:none;')),
  );

  $form['bpost']['result']['html'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('hidden'), 'style' => array('display:none;')),
  );


  _pcbpost_picker_form_add_results($form, $form_state);

//  $form['#tree'] = TRUE;
  $form_state['cache'] = TRUE;

  return $form;
}

function pcbpost_picker_form_callback(&$form, &$form_state) {
  _pcbpost_picker_form_add_results($form, $form_state);
  return $form['bpost']['result'];
}

function pcbpost_picker_form_validate($form, &$form_state) {
  $form_state['rebuild'] = TRUE;
}

function pcbpost_picker_form_submit($form, &$form_state) {
  $postal = $form_state['values']['postal'];
  $place = $form_state['values']['place'];

  if ($postal) {
    $zone = $postal;
  } elseif ($place) {
    $zone = $place;
  }

  $url = 'http://taxipost.geo6.be/locator?Format=xml&Function=search&Partner=999999&AppId=A01&Language=nl&Street=&Number=&Zone=' . $zone;

  $response = drupal_http_request($url);
}

function _pcbpost_picker_form_add_results(&$form, &$form_state) {
  if (isset($form_state['values']['postal']) || isset($form_state['values']['place'])) {
    $postal = $form_state['values']['postal'];
    $place = $form_state['values']['place'];

    if (isset($form_state['build_info']['args'][0])) {
      $selectable = TRUE;
    } else {
      $selectable = FALSE;
    }

    $pois = \printconnect\bPost\Factory::Search($postal, $place);

    if ($pois->Count) {

      foreach ($pois as $poi) {
        $id = $poi->Id;

        $items[] = theme('pcbpost_poi', array('poi' => $poi, 'format' => 'list', 'attributes' => array('id' => 'li-' . $id)));
        $form['bpost']['result']['infowindow'][(string) $id] = array(
            '#markup' => theme('pcbpost_poi', array('poi' => $poi, 'format' => 'infowindow', 'selectable' => $selectable, 'attributes' => array('id' => 'infowindow-' . $id))),
        );
        $form['bpost']['result']['html'][(string) $id] = array(
            '#markup' => theme('pcbpost_poi', array('poi' => $poi, 'format' => 'detail', 'attributes' => array('id' => 'html-' . $id, 'class' => array('class' => array('pup', 'box', 'clearfix'))))),
        );
      }

      $json = $pois->toJSON();

      $form['bpost']['result']['poisjson']['#value'] = $json;

      $form['bpost']['result']['pois']['content']['list']['#markup'] = theme('item_list', array('items' => $items));
      hide($form['bpost']['result']['pois']['content']['text']);
    } else {
      $form['bpost']['result']['pois']['content']['text']['help']['#markup'] = t('No pickup points found');
    }
  }
}
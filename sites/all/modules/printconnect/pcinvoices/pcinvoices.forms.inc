<?php

function biblioImages($form, $form_state) {
    if (!is_array($form)) $form = array();
    $customer = printconnect\Customers\Factory::Current();
    if ($customer) {
        $url = variable_get('pc_designtoolurl').'/';
        $url .= 'library/index/impkey/printconcept/k/';
        $hash = sha1($customer->id . 'agD04vQPx1?FSspl');
        $url.= $customer->id.'/h/'.$hash.'/theme/flyer';
        $form['bibilio'] = array(
            '#type' => 'container',
            '#attributes' => array('class' => array('summary', 'clearfix')),
        );

        $form['summary']['invoice'] = array(
            '#type' => 'item',
            '#id' => 'bibilio-image',
        );

        $form['summary']['invoice']['#markup'] = "<iframe style='height:500px;width:100%; border-width: 1px' class='page_flipper' 
        src='".$url."'>
        </iframe>";
    }
        
    return $form;
}


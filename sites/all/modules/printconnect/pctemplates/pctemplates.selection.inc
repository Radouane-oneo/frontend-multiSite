<?php

use \printconnect\Templates\Factory;
use \printconnect\Templates\Template;
use \printconnect\Drupal\Functions;
use \printconnect\Files;

function _pctemplates_count($templates, $options, $selectedOptions) {
    $counter = array();
    foreach ($options as $property => $values) {
        foreach ($values as $value) {
            $targetOption = $selectedOptions;
            unset($targetOption[$property]);
            $targetOption[$property][$value] = $value;
            $count = _pctemplates_counttemplates($templates, $targetOption);
            $counter[$property][$value] = $count;
        }
    }
    return $counter;
}

function _pctemplates_filter($templates, $selectedFilters) {
    $selectedTemplates = array();
    foreach ($templates->GetActive() as $template) {
        if (_pctemplates_selected($selectedFilters, $template)) {
            $selectedTemplates[] = $template;
        }
    }
    return $selectedTemplates;
}

function _pctemplates_counttemplates($templates, $filterId, $value) {
    $count = 0;
    foreach ($templates as $template) {
        foreach ($template->filters as $filter) {
            if ($filter->id == $filterId) {
                foreach ($filter->items as $item) {
                    if ($item->id == $value) {
                        $count++;
                        break;
                    }
                }
            }
        }
    }

    return $count;
}

function pctemplates_selectionblock_form($form, &$form_state, $productId) {
    $templates = Factory::GetAll($productId);
    $templates->EnsureLoaded();
    $selectedFilters = _pctemplates_selection($templates);
    $filters = array();
    foreach ($templates->GetActive() as $template) {
        foreach ($template->filters as $filter) {
            foreach ($filter->items as $key => $item) {
                if (isset($item->value) && trim($item->value) != '') {
                    $filters[$filter->id]['items'][$item->id]['name'] = $item->name;
                    $filters[$filter->id]['items'][$item->id]['value'] = $item->value;
                } else {
                    $filters[$filter->id]['items'][$item->id]['name'] = $item->name;
                    $filters[$filter->id]['items'][$item->id]['value'] = FALSE;
                }

                if (isset($item->sortOrder)) {
                    $filters[$filter->id]['items'][$item->id]['sortOrder'] = $item->sortOrder;
                } else {
                    $filters[$filter->id]['items'][$item->id]['sortOrder'] = 0;
                }
            }
            $filters[$filter->id]['name'] = $filter->name;
        }
    }

    foreach ($filters as $key => $values) {
        $items = $values['items'];
        uasort($items, function ($a, $b) {
                    return ($a['sortOrder'] > $b['sortOrder']);
                });
        $filters[$key]['items'] = $items;
    }

    $form['text'] = array(
        '#markup' => t('Fine-tune your selection by using these filters. You can easily remove any filter by deleting them on the left.'),
    );

    $selectedTemplates = _pctemplates_filter($templates, $selectedFilters);
    foreach ($filters as $filterId => $filter) {
        $items = array();
        foreach ($filters[$filterId]['items'] as $itemId => $item) {
            $link = _pctemplates_link($productId);
            $targetFilters = $selectedFilters;
            $targetFilters[$filterId] = array();
            $selectedTemplates = _pctemplates_filter($templates, $targetFilters);
            $count = _pctemplates_counttemplates($selectedTemplates, $filterId, $itemId);
            $targetFilters = $selectedFilters;
            $class = array();
            if (isset($selectedFilters[$filterId][$itemId])) {
                unset($targetFilters[$filterId][$itemId]);
                $query = _pctemplates_query($targetFilters, 1);
                $class[] = 'selected';
            } else {
                $targetFilters[$filterId][$itemId] = TRUE;
                $query = _pctemplates_query($targetFilters, 1);
                if ($count == 0) {
                    $class[] = 'disabled';
                }
            }

            if ($item['value']) {
                $class[] = 'value-' . $item['value'];
                $text = '';
                $count = '';
            } else {
                $text = $item['name'];
                $count = ' (' . $count . ')';
            }

            $title = $item['name'];
            $text .= $count;
            $items[] = l($text, $link, array('query' => $query, 'attributes' => array('class' => $class, 'title' => $title, 'rel' => array('nofollow'))));
        }
        if (count($items) > 1) {
            $form['filter'][$filterId] = array(
                '#type' => 'fieldset',
                '#title' => t('Browse by') . ' ' . $filter['name'],
            );

            $form['filter'][$filterId]['list'] = array(
                '#markup' => theme('item_list', array('items' => $items)),
            );
        }
    }

    return $form;
}

function _pctemplates_pager_link($productId, $selectedFilters, $page, $currentPage) {
    $class = array('pager-item');
    if ($page == $currentPage) {
        $class[] = 'current';
    }

    return l($page, _pctemplates_link(($productId)), array('query' => _pctemplates_query($selectedFilters, $page), 'attributes' => array('class' => $class, 'rel' => 'nofollow')));
}

function pctemplates_owndesignblock_form($form, $form_state, $productId = null) {
    $form['link'] = array(
        '#markup' => l(t('Upload your own design'), 'products/' . $productId),
    );
    return $form;
}

function pctemplates_selection_form2($form, &$form_state) {
    global $language;
    if (isset($language->code)) {
        $languageCode = $language->code;
    } else {
        $languageCode = 'en_US';
    }
    $page = 0;
    $limit = 24;
    $order = 'desc';
    if (isset($_GET['order'])) {
        $order = $_GET['order'];
    }

    if (isset($_GET['page'])) {
        $page = ($_GET['page'] -1) * $limit;
    }

    if (isset($_GET['limit'])) {
        $limit = $_GET['limit'];
    }

    $arrayFilter= array();
    $params = array('limit' => $limit, 'offset' => $page, 'order' => $order);
    if(isset($_GET['filter'])) {
        foreach ($_GET['filter'] as $filterGr) {
            foreach ($filterGr as $value) {
                $arrayFilter[] = $value;
            }
        }
    }
    
    if (!empty($arrayFilter)) {
       $params['filter'] = implode(',', $arrayFilter); 
    }
    
    if (isset($_GET['products']) && $_GET['products'] !=0) {
        $params['productId'] = $_GET['products'];
    }

    if (isset($_GET['segments']) && $_GET['segments'] !=0) {
        $params['segmentId'] = $_GET['segments'];
    }
    $filtertemplates = \printconnect\Templates\Factory::GetAllFilters();
    $filtertemplates->EnsureLoaded();
    $filtertemplates = $filtertemplates->GetActiveFilters();
    list($tmpFilters, $tmpProducts, $tmpSegments) = $filtertemplates;
    $availableFilters = array();
    $availableProducts = array();
    $allFilters = array();
    $allProducts = array();
    \printconnect\Templates\Factory::setparams($params);
    $templates = \printconnect\Templates\Factory::GetAll();
    $templates->EnsureLoaded();
    $templates = $templates->GetActive();
    $selectedTemplates = _pctemplates_filter2($templates);
    list($availableFilters, $availableProducts, $availableSegments) = _pctemplates_getFiltersNew($filtertemplates);
    list($page, $products, $segments, $filters, $search) = _pctemplates_selection_readQueryString();
    $selectedFilters = array();
    foreach ($products as $productId) {
        if ($productId != 0) {
            $newProducts = $products;
            unset($newProducts[$productId]);
            $text = t('Product') . ': ' . $availableProducts[$productId];
            $selectedFilters[] = l($text, 'templates', array('query' => _pctemplates_selection_getQueryString(null, $newProducts, $segments, $filters, $search), 'attributes' => array('rel' => 'nofollow', 'class' => array('delete'))));
        }
    }

    foreach ($segments as $segmentId) {
        if ($segmentId != 0) {
            $newSegments = $segments;
            unset($newSegments[$segmentId]);
            $text = t('Segment') . ': ' . $availableSegments[$segmentId];
            $selectedFilters[] = l($text, 'templates', array('query' => _pctemplates_selection_getQueryString(null, $products, $newSegments, $filters, $search), 'attributes' => array('rel' => 'nofollow', 'class' => array('delete'))));
        }
    }

    foreach ($filters as $filterId => $values) {
        if ($filterId != 0) {
            foreach ($values as $value) {
                $newFilters = $filters;
                unset($newFilters[$filterId][$value]);
                $text = $availableFilters[$filterId]['name'] . ': ' . $availableFilters[$filterId]['items'][$value]['name'];
                $selectedFilters[] = l($text, 'templates', array('query' => _pctemplates_selection_getQueryString(null, $products, $segments, $newFilters, $search), 'attributes' => array('rel' => 'nofollow', 'class' => array('delete'))));
            }
        }
    }

    if (count($selectedFilters)) {
        array_unshift($selectedFilters, l(t('Clear all filters'), 'templates', array('attributes' => array('class' => array('delete')))));
        $form['selectedFilters'] = array(
            '#theme' => 'item_list',
            '#items' => $selectedFilters,
            '#attributes' => array('class' => array('selected', 'clearfix')),
            '#weight' => 10,
        );
    }


    $templatesPerPage = $limit;
    $rangeFrom = (($page - 1) * $templatesPerPage) + 1;
    $rangeTo = $page * $templatesPerPage;
    $items = array();
    foreach ($selectedTemplates as $template) {
        $build = array(
            'image' => array(
                '#theme' => 'pcfilesthumb',
                '#file' => $template->thumbnail->file,
            ),
            'name' => array(
                '#markup' => $template->name,
            )
        );
        $templateUrl = 'templates/' . $template->id;
        if(isset($params['productId'])){
            $templateUrl .= '/product/' . $params['productId'];
        }
        
        $items[] = l(drupal_render($build), $templateUrl , array('html' => true));
    }

    if (count($items)) {
        $form['templates'] = array(
            '#theme' => 'item_list',
            '#items' => $items,
            '#attributes' => array('class' => array('templates', 'clearfix')),
            '#weight' => 50,
        );
    } else {
        $form['templates'] = array(
            '#type' => 'item',
            '#markup' => t('No templates found'),
            '#attributes' => array('class' => array('templates', 'clearfix')),
            '#weight' => 50,
        );
    }

    $form['pager'] = array(
        '#theme' => 'item_list',
        '#items' => _pctemplates_selection(\printconnect\Templates\Factory::getTemplatesCount(), $page, $products, $segments, $filters, $search, $limit),
        '#attributes' => array('class' => array('pager')),
        '#weight' => 60,
    );

    $form['filters'] = array(
        '#type' => 'container',
        '#attributes' => array('class' => array('filters')),
        '#weight' => 100,
    );
    asort($availableProducts);
    asort($availableSegments);
    
    // filters by prodacts commenté le 06082014 flyer fr
//    if (count($availableProducts) > 0) {
//        $items = array();
//        $items[0]= t('choose');
//        foreach ($availableProducts as $productId => $name) {
//            $class = array();
//            $newProducts = $products;
//            $newProducts[] = $productId;
//            $items[$productId] = $name;
//        }
//
//        if (count($items) > 1) {
//            $form['filters']['products'] = array(
//                '#type' => 'select',
//                '#title' => t('product'),
//                '#options' => $items,
//            );
//        }
//    }
//   
    if (count($availableSegments) > 0) {
        $items = array();
        $items[0] = t('choose');

        foreach ($availableSegments as $segmentId => $name) {
            $items[$segmentId] = str_replace('&amp;', '&', $name);
        }

        if (count($items) > 1) {
            $form['filters']['segments'] = array(
                '#type' => 'select',
                '#title' => t('segment'),
                '#options' => $items,
            );
        }
         $form['filters']['inputsegments'] = array(
                '#type' => 'textfield',
                '#title' => t('segment'),
                '#size'=>'20',
                '#required' => TRUE,
                '#attributes' => array('placeholder' => 'Rechercher'),  
             
         ); 
    }
//     // filters by autres filters commenté le 06082014 flyer fr
     
    foreach ($availableFilters as $filterId => $filter) {
        $items = array();
        $inputType = 'select';
        $iscolor = false;
        foreach ($availableFilters[$filterId]['items'] as $itemId => $item) {
            $class = array();
            $text = $item['name'];
            if ($item['value']) {
                $iscolor = true;
                if ($items[0] == t('choose')) {
                    array_shift($items);
                }
                $class[] = 'value-' . $item['value'];
                $inputType = 'color';
                $newFilters = $filters;
                $newFilters[$filterId][] = $itemId;
                $items[] = l($text, 'templates', array('query' => null, 'attributes' => array('rel' => 'nofollow', 'class' => $class, 'data-id' =>$itemId, 'parent-id' =>$filterId)));
            } else {
                $items[$itemId] = $text;
            }
        }
        
        asort($items);
       
        if (count($items) > 1) {
            
            if (!$iscolor) {
              $newItems = array();
              $newItems[0]= t('Choose');
              foreach ($items as $key => $value) {
                  $newItems[$key] = $value;
              }
              
              $items=$newItems;
            }
            
            if ($inputType == 'select') {
                $form['filters'][$filterId] = array(
                    '#type' => 'select',
                    '#title' => $filter['name'],
                    '#options' => $items,
                );
            } else {
                $form['filters'][$filterId] = array(
                    '#type' => 'fieldset',
                    '#title' => $filter['name'],
                );

                $form['filters'][$filterId]['list'] = array(
                    '#markup' => theme('item_list', array('items' => $items, 'attributes' => array('class' => array('type-' . $filterId)))),
                );
            }
        }
    }

    $form['filters']['submit']= array(
        '#type' => 'submit',
        '#value' => t("search")
    );


//    if (count($products)) {
//        $productId = reset($products);
//        $form['filters']['actions'] = array(
//          '#type' => 'actions',
//          'link' => array('#markup' => l(t('Upload your own design'), 'products/' . $productId, array('attributes' => array('class' => array('owndesigntop', 'button'))))),
//        );
//    } else {
//        $form['filters']['actions'] = array(
//            '#type' => 'actions',
//            'link' => array('#markup' => l(t('Upload your own design'), 'products', array('attributes' => array('class' => array('owndesigntop', 'button'))))),
//        );
//    }


    if (count($products)) {
        $productId = reset($products);
        $form['actions'] = array(
            '#type' => 'actions',
            'link' => array('#markup' => l(t('Upload your own design'), 'products/' . $productId, array('attributes' => array('class' => array('owndesign', 'button'))))),
        );
    } else {
        $form['actions'] = array(
            '#type' => 'actions',
            'link' => array('#markup' => l(t('Upload your own design'), 'products', array('attributes' => array('class' => array('owndesign', 'button'))))),
        );
    }

    $form['actions']['submit']['#disabled'] = TRUE;
    $form['#id'] = 'pctemplates-selection-form';
    $form['#cache'] = TRUE;
    $form['#method'] = 'post';

    return $form;
}

function pctemplates_selection_form2_submit($form, &$form_state) {
   list($page, $products, $segments, $filters, $search) = _pctemplates_selection_readQueryString(TRUE);
   drupal_goto('templates', array('query' => _pctemplates_selection_getQueryString(null, $products, $segments, $filters, $search)));
}

function _pctemplates_filter2($templates) {
    $result = array();
    list($page, $products, $segments, $filters, $search) = _pctemplates_selection_readQueryString();
    $i = 0;
    foreach ($templates as $template) {
        if ($products) {
            $found = FALSE;
            foreach ($template->products as $product) {
                if (in_array($product->id, $products)) {
                    $found = true;
                }
            }
            if (!$found) {
                continue 1;
            }
        }

        if ($segments) {
            $found = FALSE;
            foreach ($template->segments as $segment) {
                if (in_array($segment->id, $segments)) {
                    $found = true;
                }
            }
            if (!$found) {
                continue 1;
            }
        }

        if ($search) {
            if (stripos($template->name, $search) === FALSE) {
                continue;
            }
        }

        if ($filters) {
            $templateFilters = $template->filtersArray;
            foreach ($filters as $filterId => $filterValues) {
                if (is_numeric($filterId)) {
                    if (!array_key_exists($filterId, $templateFilters)) {
                        continue 2;
                    }
                    foreach ($filterValues as $filterValue) {
                        if (!in_array($filterValue, $templateFilters[$filterId])) {
                            continue 3;
                        }
                    }
                }
            }
        }
    }
    return $templates;
}

function _pctemplates_selection_readQueryString($typeArgs = FALSE) {
    $args = $_GET;
    if ($typeArgs) {
        $args =$_POST;
    }
     if(isset($_GET['segments'])) {
       $args ['segments']= $_GET['segments'];
    }
    $filters = array();
    $result = array();
    $page = 1;
    $products = array();
    $segments = array();
    $search = FALSE;
    if (isset($args['products']) && $args['products'] !=0) {
        $values = explode(',', $args['products']);
        unset($args['products']);
        foreach ($values as $value) {
            $products[$value] = $value;
        }
    }
    if (isset($args['segments']) && $args['segments'] !=0) {
        $values = explode(',', $args['segments']);
        unset($args['segments']);
        foreach ($values as $value) {
            $segments[$value] = $value;
        }
    }
    if (isset($args['page'])) {
        $page = $args['page'];
        unset($args['page']);
    }

    if (!$typeArgs) {
      foreach ($args['filter'] as $filter => $value) {
        if (is_numeric($filter)) {
            $values = $value;
            foreach ($values as $value) {
                $filters[$filter][$value] = $value;
            }
        }
      }
    } else {
        foreach ($args as $filter => $value) {
          if (is_numeric($filter)) {
            if ($value != 0) {
                $values = explode(',', $value);
                foreach ($values as $value) {
                    $idFilter = substr($filter, 0,strlen($filter)-strlen($value));
                    if ($idFilter == null) {
                        $idFilter = $filter;
                    }
                    $filters[$idFilter][$value] = $value;
                }
            }
          }
        }
    }

    return array($page, $products, $segments, $filters, $search);
}

function _pctemplates_selection($totalCount, $page, $products, $segments, $filters, $search, $templatesPerPage = 24) {
    $pages = ceil($totalCount / $templatesPerPage);
    $items = array();
    if ($pages > 1) {
        $middle = $pages / 2;
        $prev = $page - $middle;
        $next = $page + $pages - $middle;
        $class = array('pager-item');
        $slots = array_fill(1, $pages, FALSE);
        $slots[1] = TRUE;
        $slots[$pages] = TRUE;
        $previous = l(t('Previous'), 'templates', array('query' => _pctemplates_selection_getQueryString($page - 1, $products, $segments, $filters, $search), 'attributes' => array('class' => array('pager-item'), 'rel' => 'nofollow')));
        $next = l(t('Next'), 'templates', array('query' => _pctemplates_selection_getQueryString($page + 1, $products, $segments, $filters, $search), 'attributes' => array('class' => array('pager-item'), 'rel' => 'nofollow')));
        switch ($page) {
            case 1:
                $previous = '<span class="pager-item">' . t('Previous') . '</span>';
            case 2:
                for ($i = 1; $i < 5 && $i < $pages; $i++) {
                    $slots[$i] = TRUE;
                }
                break;
            case $pages :
                $next = '<span class="pager-item">' . t('Next') . '</span>';
            case $pages - 1:
                for ($i = $pages; $i > $pages - 4 && $i > 1; $i--) {
                    $slots[$i] = TRUE;
                }
                break;
            default:
                $slots[$page - 1] = TRUE;
                $slots[$page] = TRUE;
                $slots[$page + 1] = TRUE;
        }

        $items[] = $previous;
        foreach ($slots as $key => $value) {
            $class = array('pager-item');
            if ($page == $key) {
                $class[] = 'current';
            }
            if ($value) {
                $items[] = l($key, 'templates', array('query' => _pctemplates_selection_getQueryString($key, $products, $segments, $filters, $search), 'attributes' => array('class' => $class, 'rel' => 'nofollow')));
            } else {
                if ($previous) {
                    $items[] = '...';
                }
            }
            $previous = $value;
        }
        $items[] = $next;
    }
    return $items;
}

function _pctemplates_getFilters($templates) {
    $filters = array();
    $products = array();
    $segments = array();
    foreach ($templates as $template) {
        foreach ($template->filters as $filter) {
            foreach ($filter->items as $key => $item) {
                if (isset($item->value) && trim($item->value) != '') {
                    $filters[$filter->id]['items'][$item->id]['name'] = $item->name;
                    $filters[$filter->id]['items'][$item->id]['value'] = $item->value;
                } else {
                    $filters[$filter->id]['items'][$item->id]['name'] = $item->name;
                    $filters[$filter->id]['items'][$item->id]['value'] = FALSE;
                }

                if (isset($item->sortOrder)) {
                    $filters[$filter->id]['items'][$item->id]['sortOrder'] = $item->sortOrder;
                } else {
                    $filters[$filter->id]['items'][$item->id]['sortOrder'] = 0;
                }
            }
            $filters[$filter->id]['name'] = $filter->name;
        }

        foreach ($template->products as $product) {
            $products[$product->id] = $product->name;
        }
        foreach ($template->segments as $segment) {
            $segments[$segment->id] = $segment->name->name;
        }
    }

    foreach ($filters as $key => $values) {
        $items = $values['items'];
        uasort($items, function ($a, $b) {
                    return ($a['sortOrder'] > $b['sortOrder']);
                });
        $filters[$key]['items'] = $items;
    }

    return array($filters, $products, $segments);
}

function _pctemplates_getFiltersNew($filtertemplates) {
    list($tmpFilters, $tmpProducts, $tmpSegments) = $filtertemplates;
    $fullFilterData = array();
    $fullsegmentsData = array();
    foreach ($tmpFilters as $filterone) {
        $newItems = array();
        $exist = false;
        $nb = 0;
        foreach ($fullFilterData as $data) {
            $cle = $filterone->id;
            if ($data['name'] == $filterone->category->name) {
                $exist = true;
                $singleValue = null;
                if (isset($filterone->value) && trim($filterone->value) != '') {
                    $singleValue = $filterone->value;
                }
                $data['items'][$cle] = array(
                    'name' => $filterone->name,
                    'value' => $singleValue,
                    'sortorder' => $filterone->sortOrder,);
                $fullFilterData[$nb] = $data;
                break;
            }
            $nb++;
        }
        if ($exist == false) {
            $cle = $filterone->id;
            $newItems = array();
            $singleValue = null;
            if (isset($filterone->value) && trim($filterone->value) != '') {
                $singleValue = $filterone->value;
            }
            $newItems[$cle] = array(
                'name' => $filterone->name, 'name' => $filterone->name,
                'value' => $singleValue,
                'sortorder' => $filterone->sortOrder,
            );
            $dt['items'] = $newItems;
            $dt['name'] = $filterone->category->name;
            $fullFilterData[] = $dt;
        }
    }

    foreach ($tmpProducts as $product) {
        $products[$product->id] = $product->name;
    }
    foreach ($tmpSegments as $segment) {
        $segments[$segment->id] = $segment->name;
    }
    return array($fullFilterData, $products, $segments);
}

<?php

//drupal_add_js(array('color' => array('logo' => theme_get_setting('logo', 'printconnectwood'))), 'setting');

$info = array(
    // Available colors and color labels used in theme.
    'fields' => array(
        'block' => t('Block'),
        'block2' => t('Block secondary'),
        'link' => t('Link'),
        'text' => t('Text'),
        'button' => t('Button'),
        'highlight' => t('Highlight'),
        'highlight2' => t('Highlight secondary'),
    ),
    // Pre-defined color schemes.
    'schemes' => array(
        'default' => array(
            'title' => t('Default'),
            'colors' => array(
                'block' => '#febf01',
                'block2' => '#ff8d02',
                'link' => '#6eb003',
                'text' => '#023a2c',
                'button' => '#006b17',
                'highlight' => '#90d105',
                'highlight2' => '#6fba17',
            ),
        ),
        'test' => array(
            'title' => t('Black & white'),
            'colors' => array(
                'block' => '#dddddd',
                'block2' => '#bbbbbb',
                'link' => '#222222',
                'text' => '#aaaaaa',
                'button' => '#000000',
                'highlight' => '#ffffff',
                'highlight2' => '#000000',
            ),
        ),
        'bestdruk' => array(
            'title' => t('Best druk'),
            'colors' => array(
                'block' => '#fff500',
                'block2' => '#f7c400',
                'link' => '#000000',
                'text' => '#000000',
                'button' => '#d7241c',
                'highlight' => '#d7241c',
                'highlight2' => '#f7c400',
            ),
        ),
    ),
    // CSS files (excluding @import) to rewrite with new color scheme.
    'css' => array(
        'css/colors.css',
    ),
    // Files to copy.

    'copy' => array(
        'logo.png',
    ),
    // Gradient definitions.
    /*
      'gradients' => array(
      array(
      // (x, y, width, height).
      'dimension' => array(0, 0, 0, 0),
      // Direction of gradient ('vertical' or 'horizontal').
      'direction' => 'vertical',
      // Keys of colors to use for the gradient.
      'colors' => array('top', 'bottom'),
      ),
      ),
     */
    // Color areas to fill (x, y, width, height).
    'fill' => array(),
    // Coordinates of all the theme slices (x, y, width, height)
    // with their filename as used in the stylesheet.
    'slices' => array(),
    // Reference color used for blending. Matches the base.png's colors.
    'blend_target' => '#ffffff',
    // Preview files.
//    'preview_css' => 'color/preview.css',
//    'preview_js' => 'color/preview.js',
//    'preview_html' => 'color/preview.html',
    // Base file for image generation.
    'base_image' => 'color/base.png',
);

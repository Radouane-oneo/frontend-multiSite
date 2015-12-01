<?php

/**
 * @file
 * Default theme implementation to display the basic html structure of a single
 * Drupal page.
 *
 * Variables:
 * - $css: An array of CSS files for the current page.
 * - $language: (object) The language the site is being displayed in.
 *   $language->language contains its textual representation.
 *   $language->dir contains the language direction. It will either be 'ltr' or 'rtl'.
 * - $rdf_namespaces: All the RDF namespace prefixes used in the HTML document.
 * - $grddl_profile: A GRDDL profile allowing agents to extract the RDF data.
 * - $head_title: A modified version of the page title, for use in the TITLE
 *   tag.
 * - $head_title_array: (array) An associative array containing the string parts
 *   that were used to generate the $head_title variable, already prepared to be
 *   output as TITLE tag. The key/value pairs may contain one or more of the
 *   following, depending on conditions:
 *   - title: The title of the current page, if any.
 *   - name: The name of the site.
 *   - slogan: The slogan of the site, if any, and if there is no title.
 * - $head: Markup for the HEAD section (including meta tags, keyword tags, and
 *   so on).
 * - $styles: Style tags necessary to import all CSS files for the page.
 * - $scripts: Script tags necessary to load the JavaScript files and settings
 *   for the page.
 * - $page_top: Initial markup from any modules that have altered the
 *   page. This variable should always be output first, before all other dynamic
 *   content.
 * - $page: The rendered page content.
 * - $page_bottom: Final closing markup from any modules that have altered the
 *   page. This variable should always be output last, after all other dynamic
 *   content.
 * - $classes String of classes that can be used to style contextually through
 *   CSS.
 *
 * @see template_preprocess()
 * @see template_preprocess_html()
 * @see template_process()
 *
 * @ingroup themeable
 */
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML+RDFa 1.0//EN"
  "http://www.w3.org/MarkUp/DTD/xhtml-rdfa-1.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language; ?>" version="XHTML+RDFa 1.0" dir="<?php print $language->dir; ?>"<?php print $rdf_namespaces; ?>>

<head profile="<?php print $grddl_profile; ?>">
    <meta http-equiv="cache-control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="expires" content="0" />
    <meta http-equiv="pragma" content="no-cache" />
  <?php print $head; ?>
  <title><?php print $head_title; ?></title>
  <?php print $styles; ?>
  <?php print $scripts; ?>
  <script src="//load.sumome.com/" data-sumo-site-id="05fcb8fc80d0ed7d3b05209edd96c6c64ab0f99c7496911c3100d14a2e13c935" async="async"></script>
</head>
<body class="<?php print $classes.$node_css_class; ?>" <?php print $attributes;?>>
   <?php if ($language->prefix == 'nlnl'): ?>  
<script src="//config1.veinteractive.com/tags/cfbffe97/e5d2/4e6b/9068/f79727b560ca/tag.js" type="text/javascript" async></script>
<?php if (arg(3) == 'confirmation') :?>
<img src="//drs2.veinteractive.com/DataReceiverService.asmx/Pixel?journeycode=cfbffe97-e5d2-4e6b-9068-f79727b560ca" width="1" height="1"/>
<?php endif; ?> 
<!-- Google Tag Manager -->
<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-PBZ8Q5"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PBZ8Q5');</script>
<!-- End Google Tag Manager -->
   <?php endif; ?>
   <?php if ($language->prefix == 'benl'): ?>
<!-- Google Tag Manager -->
<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-5GVQ93"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5GVQ93');</script>
<!-- End Google Tag Manager -->
   <?php endif; ?>
   <?php if ($language->prefix == 'befr'): ?>
<script src="//config1.veinteractive.com/tags/A1436EEF/EC59/4D50/AB2A/8B27C27BDF6A/tag.js" type="text/javascript" async></script>
<?php if (arg(3) == 'confirmation') :?>
<img src="//drs2.veinteractive.com/DataReceiverService.asmx/Pixel?journeycode=A1436EEF-EC59-4D50-AB2A-8B27C27BDF6A" width="1" height="1"/>
<?php endif; ?> 
<!-- Google Tag Manager -->
<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-5GVQ93"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5GVQ93');</script>
<!-- End Google Tag Manager -->
   <?php endif; ?> 
   <?php if ($language->prefix == 'lufr'): ?>
<script src="//config1.veinteractive.com/tags/def9f390/5969/4edd/aa51/25e8c97b2f7b/tag.js" type="text/javascript" async></script>
<?php if (arg(3) == 'confirmation') :?>
<img src="//drs2.veinteractive.com/DataReceiverService.asmx/Pixel?journeycode=def9f390-5969-4edd-aa51-25e8c97b2f7b" width="1" height="1"/>
<?php endif; ?> 
<!-- Google Tag Manager -->
<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-MW2SDM"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MW2SDM');</script>
<!-- End Google Tag Manager -->
   <?php endif; ?> 
   <?php if ($language->prefix == 'frfr'): ?>
<!-- Google Tag Manager -->
<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-NNMLJR"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NNMLJR');</script>
<!-- End Google Tag Manager -->
   <?php endif; ?> 
  <div id="skip-link">
    <a href="#main-content" class="element-invisible element-focusable"><?php print t('Skip to main content'); ?></a>
  </div>
  <?php print $page_top; ?>
  <?php print $page; ?>
  <?php print $page_bottom; ?>
<?php if (arg(0) == 'products') : ?>
    <script type="text/javascript">
        var product = {
            identifier: GlobalProductId
        };
    </script>
<?php endif; ?>
<?php if (arg(0) == 'cart') : ?>

    <script type="text/javascript">
        var
        basket = {},
        products=[];
       
    </script>
<?php endif; ?>
<?php if (arg(1) == 'redirect') : ?>
    <div id="hiddensPricesPayment" style="display: none;">
        <?php
        $cart = \printconnect\Carts\Factory::Current();
        foreach ($cart->productItems as $item) {
            $productID = $item->configuration->productId;
            echo "<input type='hidden'  quantity='$item->quantity' productId='$productID' price='$item->price'>";
        }
        ?>
    </div>
    <script type="text/javascript">
    var
    basket = {},
    products=[],
    totalprice=0;
    jQuery("#hiddensPricesPayment input").each(function() {
        products.push({ identifier: jQuery(this).attr('productId'), amount: parseFloat(jQuery(this).attr('price')), currency: 'EUR', quantity: jQuery(this).attr('quantity') });
        totalprice += parseFloat(jQuery(this).attr('price'));
    });
    basket['products'] = products;
    var url = location.pathname.split('/');
    basket['transaction'] = url[4];
    basket['amount'] = totalprice;
    basket['currency'] = 'EUR';
    console.log(basket);
    </script>
<?php endif; ?>

<?php if (arg(3) == 'confirmation') :
    $order = \printconnect\Orders\Factory::Get($_SESSION['orderID'], false);
    ?>
    <div id="#hiddenPricesPayment" style="display: none;">
        <?php
        $date = new DateTime();
        $date = $date->getTimestamp();
        echo "<input type='hidden' id='transaction' transaction='$date'><div id='hiddenPricesPayment'>";
        foreach ($order->productItems as $item) {
            $productID = $item->configuration->productId;
            echo "<input type='hidden'  quantity='$item->quantity' productId='$productID' price='$item->price'>";
        }
        ?>
    </div></div>
    <script type="text/javascript">
    var
    basket = {},
    products=[],
    totalprice=0;
    jQuery("#hiddenPricesPayment input").each(function() {
            products.push({ identifier: jQuery(this).attr('productId'), amount: parseFloat(jQuery(this).attr('price')), currency: 'EUR', quantity: jQuery(this).attr('quantity') });
            totalprice += parseFloat(jQuery(this).attr('price'));
    });
    basket['products'] = products;
    basket['transaction'] = jQuery('input[id="transaction"]').attr('transaction');
    basket['amount'] = totalprice;
    basket['currency'] = 'EUR';
    console.log(basket);
    </script>
<?php endif; ?>
<script type="text/javascript">
    (function(){
        var s   = document.createElement('script');
        var x   = document.getElementsByTagName('script')[0];
        s.type  = 'text/javascript';
        s.async = true;
        s.src   = ('https:'==document.location.protocol?'https://':'http://')
                + 'eu-sonar.sociomantic.com/js/2010-07-01/adpan/flyer-be';
        x.parentNode.insertBefore( s, x );
    })();
</script>
</body>
</html>

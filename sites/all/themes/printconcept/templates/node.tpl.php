<?php
// $Id: node.tpl.php,v 1.2 2010/12/01 00:18:15 webchick Exp $

/**
 * @file
 * Bartik's theme implementation to display a node.
 *
 * Available variables:
 * - $title: the (sanitized) title of the node.
 * - $content: An array of node items. Use render($content) to print them all,
 *   or print a subset such as render($content['field_example']). Use
 *   hide($content['field_example']) to temporarily suppress the printing of a
 *   given element.
 * - $user_picture: The node author's picture from user-picture.tpl.php.
 * - $date: Formatted creation date. Preprocess functions can reformat it by
 *   calling format_date() with the desired parameters on the $created variable.
 * - $name: Themed username of node author output from theme_username().
 * - $node_url: Direct url of the current node.
 * - $display_submitted: Whether submission information should be displayed.
 * - $submitted: Submission information created from $name and $date during
 *   template_preprocess_node().
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It can be manipulated through the variable $classes_array from
 *   preprocess functions. The default values can be one or more of the
 *   following:
 *   - node: The current template type, i.e., "theming hook".
 *   - node-[type]: The current node type. For example, if the node is a
 *     "Blog entry" it would result in "node-blog". Note that the machine
 *     name will often be in a short form of the human readable label.
 *   - node-teaser: Nodes in teaser form.
 *   - node-preview: Nodes in preview mode.
 *   The following are controlled through the node publishing options.
 *   - node-promoted: Nodes promoted to the front page.
 *   - node-sticky: Nodes ordered above other non-sticky nodes in teaser
 *     listings.
 *   - node-unpublished: Unpublished nodes visible only to administrators.
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 *
 * Other variables:
 * - $node: Full node object. Contains data that may not be safe.
 * - $type: Node type, i.e. story, page, blog, etc.
 * - $comment_count: Number of comments attached to the node.
 * - $uid: User ID of the node author.
 * - $created: Time the node was published formatted in Unix timestamp.
 * - $classes_array: Array of html class attribute values. It is flattened
 *   into a string within the variable $classes.
 * - $zebra: Outputs either "even" or "odd". Useful for zebra striping in
 *   teaser listings.
 * - $id: Position of the node. Increments each time it's output.
 *
 * Node status variables:
 * - $view_mode: View mode, e.g. 'full', 'teaser'...
 * - $teaser: Flag for the teaser state (shortcut for $view_mode == 'teaser').
 * - $page: Flag for the full page state.
 * - $promote: Flag for front page promotion state.
 * - $sticky: Flags for sticky post setting.
 * - $status: Flag for published status.
 * - $comment: State of comment settings for the node.
 * - $readmore: Flags true if the teaser content of the node cannot hold the
 *   main body content.
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 * - $is_admin: Flags true when the current user is an administrator.
 *
 * Field variables: for each field instance attached to the node a corresponding
 * variable is defined, e.g. $node->body becomes $body. When needing to access
 * a field's raw values, developers/themers are strongly encouraged to use these
 * variables. Otherwise they will have to explicitly specify the desired field
 * language, e.g. $node->body['en'], thus overriding any language negotiation
 * rule that was previously applied.
 *
 * @see template_preprocess()
 * @see template_preprocess_node()
 * @see template_process()
 */
?>

<?php if ($page): ?>
  <div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"> <?php print render($title_prefix); ?> <?php print render($title_suffix); ?>
    <?php if (isset($content['field_image'])): ?>
      <div class="image-container-firstrow"><?php print render($content['field_image']); ?></div>
      
    <?php endif; ?>
      <div class="image-container-firstrow"><?php print theme('image', array('path'=> $content['field_image3'][0]['#markup']));?></div>
    <div class="content clearfix">
      <?php if (!$is_front && $type != 'page'): ?>
        <div style="color:999999; font-weight:normal; font-size:10px"><?php print t('Submitted on') . '&nbsp;' . $date . ' ' . t('in category') . ' ' . drupal_render($content['morelikethis']); ?> </div>
      <?php endif; ?>
      <?php
      // We hide the comments and links now so that we can render them later.
      hide($content['comments']);
      hide($content['links']);
      hide($content['field_source']);
      print render($content);
      ?>
    </div>
    <?php if (!$is_front && $node->nid < 670 && $node->nid > 676): ?>
      <hr style="margin:5px 0 5px 0" />
      <div style="color:999999; font-weight:normal; font-size:10px"><?php print t('Submitted on') . '&nbsp;' . $date . ' ' . t('in category') . ' ' . drupal_render($content['morelikethis']); ?> <br />
        <?php print isset($content['field_source']['#items']) ? l($content['field_source']['#items'][0]['value'], $content['field_source']['#items'][0]['value'], array('attributes' => array('target' => 'blank'))) : ''; ?></div>
    <?php endif; ?>
    <?php if (!$is_front && $node->nid < 670 && $node->nid > 676): ?>
      <div style="vertical-align:top; margin-top:11px;">

        <div class="box clear">
          <!-- AddThis Button BEGIN -->
          <div class="addthis_toolbox addthis_default_style" style="line-height:30px; vertical-align:middle">
            <div style="float:left; width:55%"><a class="addthis_button_google_plusone"></a>
              <a class="addthis_button_facebook_like" fb:like:layout="button_count" ></a>
              <a class="addthis_button_tweet" ></a></div>

            <?php
            global $language;
            $twitter = variable_get('pcsocial_twitter_' . $language->language, 'printconcept_be');
            ?>

            <div style="float:right; width:45%"><a class="twitter-follow-button" href="http://twitter.com/<?php print $twitter; ?>" style="width:200px">Follow @<?php print $twitter; ?></a></div>

          </div>
          <script src="http://platform.twitter.com/widgets.js" type="text/javascript"></script>
          <script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=xa-4dece94d5ac2cb1a"></script>
          <script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=xa-4deceaa63e966c82"></script>
          <!-- AddThis Button END -->
        </div>



      </div>
      <hr style="margin:5px 0 5px 0" />

      <!-- Facebook commentblock -->
      <h2><?php print t('Comment on this topic, your feedback is important!'); ?></h2>
      <div id="fb-root"></div>
      <script src="http://connect.facebook.net/en_US/all.js#appId=153045024741523&amp;xfbml=1"></script>
      <fb:comments href="<?php
        global $base_root;
        print $base_root . request_uri();
        ?>" num_posts="5" width="600"></fb:comments>


  <?php endif; ?>
  </div>





<?php else: ?>

  <style type="text/css">
    .blog_info_firstrow{
      background: url(/sites/all/themes/printconcept/images/blog_info_firstrow.png) no-repeat;
      margin-top: -10px;
      width: 610px;
      height: 30px;
      font-size: 10px;
      color: #999;
      line-height: 30px;
      padding-left: 10px;
      position: relative;
    }

    .image-container-firstrow{
      width: 618px;
      height: 180px;
      border: 1px solid #d2d2d2;
      border-radius: 7px 7px 7px 7px;
      overflow: hidden;
    }

    .blog_title_firstrow{
      height: auto;	
    }

    .secondrow{
      width: 194px !important;
      margin-right: 19px;
    }

    .secondrow.last{
      margin-right: 0;	
    }

    .image-container-secondrow{
      width: 192px;
      height: 178px;
      border: 1px solid #d2d2d2;
      border-radius: 7px 7px 7px 7px;
    }

    .secondrow .field-type-image img{
      max-width: none !important;
      max-height: none !important;
      width: auto !important;
    }

    .blog_info_secondrow{
      background: url(/sites/all/themes/printconcept/images/blog_info_secondrow.png) no-repeat;
      margin-top: -10px;
      width: 194px;
      height: 30px;
      font-size: 10px;
      color: #999;
      line-height: 30px;
      padding-left: 10px;
      position: relative;
    }

    .blog_content{float:left}
    .blog_content br{display:none}

    .blog_content p,
    .blog_content h1,
    .blog_content h2,
    .blog_content h3,
    .blog_content h4,
    .blog_content h5,
    .blog_content h6,
    .blog_content h7,
    .blog_content h8,
    .blog_content strong,
    .blog_content em{
      margin: 0 !important;
      padding: 0 !important;
      line-height: 18px !important;
      color: #666 !important;
      font-size: 12px !important;
      font-style: normal !important;
      font-weight: normal !important;
      text-align: left !important;
      text-decoration: none !important;
      border: none !important;
      cursor: default !important;
    }

  </style>

  <?php if ($id == 1): ?>
    <div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> firstrow"> <a href="<?php print $node_url; ?>">
        <div class="image-container-firstrow" style="padding-top:-150px"><?php print render($content['field_image']); ?></div>
        <div class="image-container-firstrow" style="padding-top:-150px"><?php print theme('image', array('path'=> $content['field_image3'][0]['#markup']));?></div>
        
        <div class="blog_info_firstrow">
          <span style="color:#999; font-size:10px;"><?php print format_date($node->created, 'custom', 'd/m/Y') . "&nbsp;-&nbsp;" . drupal_render($content['morelikethis']); /* print t('Submitted on') . "&nbsp;" . $date . ' ' . t('in category') . ' ' . drupal_render($content['morelikethis']); */ ?></span>
        </div>
        <div class="blog_title_firstrow">
          <h1 style="border-bottom:0px;"><?php print $title; ?></h1>
        </div>
        <div class="blog_content">
          <?php
          hide($content['comments']);
          hide($content['links']);
          hide($content['field_source']);
          print drupal_render($content);
          ?>
        </div>
        <a href="<?php print $node_url; ?>"><?php print t('Read more'); ?></a> </div>
    <!-- second row with 3 small posts-->
  <?php endif; ?>
  <?php if ($id == 2): ?>
    <!-- <hr /> -->
    <div class="clear" style="margin-top: 10px;"></div>
  <?php endif; ?>
  <?php if ($id == 2 || $id == 3 || $id == 4): ?>
    <div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> secondrow <?php if ($id == 4): ?>last<?php endif; ?>"> <a href="<?php print $node_url; ?>">
        <div class="image-container-secondrow"><?php print render($content['field_image']); ?></div></a>
         <div class="image-container-secondrow"><?php print theme('image', array('path'=> $content['field_image3'][0]['#markup']));?></div>
      <div class="blog_info_secondrow">
        <span style="color:#999; font-size:10px;"><?php print format_date($node->created, 'custom', 'd/m/Y') . "&nbsp;-&nbsp;" . drupal_render($content['morelikethis']); /* print t('Submitted on') . "&nbsp;" . $date . ' ' . t('in category') . ' ' . drupal_render($content['morelikethis']); */ ?></span>
      </div>
      <div class="blog_title">
        <h2><a href="<?php print $node_url; ?>" title="<?php print $title; ?>"><?php print $title; ?></a></h2>
      </div>
      <div class="blog_content" style="width:194px;">
        <?php
        hide($content['comments']);
        hide($content['links']);
        hide($content['field_source']);
        print drupal_render($content);
        ?>
        <a href="<?php print $node_url; ?>"><?php print t('Read more'); ?></a> </div>
    </div>
  <?php endif; ?>
  <!-- list with all posts-->
  <?php if ($id == 4): ?>
    <div class="clear"></div>
  <?php endif; ?>
  <?php if ($id > 4): ?>
    <hr style="margin-top:15px; margin-bottom:5px" />
    <div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> thirdrow clearfix " <?php print $attributes; ?> >
      <div style="width:620px;">
        <div style="width:85px; float:left; padding-top:10px">
          <div class="image-container-thirdrow"><a href="<?php print $node_url; ?>"><?php print render($content['field_image']); ?></a></div>
           <div class="image-container-thirdrow"><?php print l(theme('image', array('path'=> $content['field_image3'][0]['#markup'])), $node_url, array('html' => true));?></div>
        </div>
        <div style="width:535px; float:right; ">
          <div style="float:left; width:49%;">
            <h2><a href="<?php print $node_url; ?>" title="<?php print $title; ?>"><?php print $title; ?></a></h2>
          </div>
          <div style="float:right; width:49%;"> <span style=" color:#999; font-size:9px; padding-top:10px; float:right"><?php print t('Submitted on') . "&nbsp;" . $date . ' ' . t('in category') . ' ' . drupal_render($content['morelikethis']); ?></span></div>
          <div class="blog_content" class="clearfix" style="margin-bottom:5px;">
            <?php
            hide($content['comments']);
            hide($content['links']);
            hide($content['field_source']);
            hide($content['field_image']);
            print drupal_render($content);
            ?>
            <a href="<?php print $node_url; ?>"><?php print t('Read more'); ?></a>
            <div> </div>
          </div>
        </div>
      </div>
    </div>
  <?php endif; ?>

<?php endif; ?>

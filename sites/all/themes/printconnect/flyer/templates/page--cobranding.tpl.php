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
            <?php print $breadcrumb; ?>
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
            <div id="sidebar-second">
                <?php print render($page['sidebar_second']); ?>
            </div>
            <?php endif; ?>
            <div id="footer">
                <?php print render($page['footer']); ?>
            </div>
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

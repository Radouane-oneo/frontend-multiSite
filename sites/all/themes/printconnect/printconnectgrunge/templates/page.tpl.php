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
				<a href="<?php print $front_page ?>" title="<?php print $site_name_and_slogan ?>">
                	<img src="<?php print $logo ?>" alt="<?php print $site_name_and_slogan ?>" title="<?php print $site_name_and_slogan ?>" />
				</a>
            </div>
		<?php endif; ?>
        
        <?php if ($page['header_right']): ?>
        	<div id="header_right">
				<?php print render($page['header_right']); ?>
        	</div>
		<?php endif; ?>

    </div>
    
    <div id="navigation">
    
    	<?php if ($main_menu): ?>
  			<?php print theme('links__system_main_menu', array('links' => $main_menu, 'attributes' => array('id' => 'main-menu'))); ?>
		<?php endif; ?>
        
        <?php if ($page['nav_right']): ?>
        	<div id="nav_right">
				<?php print render($page['nav_right']); ?>
        	</div>
		<?php endif; ?>
        
        <div class="clearfix"></div>
        
    </div>
    
    <div id="main">
    
		<?php if ($page['sidebar_first']): ?>
			<div id="sidebar-first">
				<?php print render($page['sidebar_first']); ?>
			</div>
		<?php endif; ?>
        
        <div id="content">
        
			<?php print $breadcrumb; ?>
           
            <?php if ($title): ?>
                <h1><?php print render($title_prefix); ?><?php print $title ?><?php print render($title_suffix); ?></h1>
            <?php endif; ?>
            
            <?php if ($tabs): ?>
                <?php print render($tabs); ?>
            <?php endif; ?>
            
            <?php if ($messages): ?>
                <?php print $messages; ?>
            <?php endif; ?>
            
            <?php print render($page['content']); ?>
		</div>
        
		<?php if ($page['sidebar_second']): ?>
			<div id="sidebar-second">
				<?php print render($page['sidebar_second']); ?>
			</div>
		<?php endif; ?>
        
        <div class="clearfix"></div>
    
    </div>
    
</div>


<div id="bottom">
<div id="inner-bottom">

	 <div id="footer">
    	<?php print render($page['footer']); ?>
    </div>
    
    <div class="clearfix"></div>
    
    <div id="closure">
    	<?php print render($page['closure']); ?>
    </div>
    
</div>    
</div>    
    
</div>
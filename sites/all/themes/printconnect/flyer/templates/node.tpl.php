<?php 
	//header('Content-Type: application/json');
	//print '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<';
	$title       = $content['body']['#object']->title;
	$description = $content['body']['#object']->field_description_meta["und"][0]["metatags_quick"];
	
	$body = $content['body']['#object']->body;
	
	foreach ($node->body as $key => $value) {
		$desc = $value[0]['value'];
	}
	if(empty($description))
	$description = substr(preg_replace('/\s+/', ' ', strip_tags(preg_replace("/<script\\b[^>]*>(.*?)<\\/script>/s", "",preg_replace("/<style\\b[^>]*>(.*?)<\\/style>/s", "", print_r($desc, 1))))), 0, 600) . '...';
	
	if(!empty($description) && $description != '...') {
		$body = stripslashes(json_encode($body));
	
		$imgposition = strpos($body, 'header-image', 0);
		$imgposition2 = strpos($body, 'header--image', 0);
		
		$headerimage = strpos(render($content), '.headerimage', 0);
		
		$topimg = strpos(render($content), '.topimg', 0);
		
		$summaryimg = strpos(render($content), 'field-type-text-with-summary', 0);
		$summaryimg = strpos(render($content), '<img', $summaryimg);
		
		if($imgposition) {
			$first = strpos($body, 'src="', $imgposition);
			$last  = strpos($body, '"', $first+5);
			
			$src   = substr($body, $first+5, ($last - $first) - 5);
		} else if($imgposition2) {
			$first = strpos($body, 'src="', $imgposition2);
			$last  = strpos($body, '"', $first+5);
			
			$src   = substr($body, $first+5, ($last - $first) - 5);
		} else if($headerimage) {
			$first = strpos(render($content), "url(", $headerimage);
			$last  = strpos(render($content), ")", $first+4);
			
			$src   = substr(render($content), $first+4, ($last - $first) - 4);
		} else if($topimg) {
			$first = strpos(render($content), "url(", $topimg);
			$last  = strpos(render($content), ")", $first+4);
			
			$src   = substr(render($content), $first+4, ($last - $first) - 4);
		} else if($summaryimg) {
			$first = strpos(render($content), 'src="', $summaryimg);
			$last  = strpos(render($content), '"', $first+5);
			
			$src   = substr(render($content), $first+5, ($last - $first) - 5);
		}
		
		$type = 'summary';
		$element = array(
		  '#tag' => 'meta', // The #tag is the html tag - 
		  '#attributes' => array( // Set up an array of attributes inside the tag
		    'name' => 'twitter:title', 
		    'content' => strtoupper ( trim($title) )
		  ),
		);
		drupal_add_html_head($element, 'twitter_title');
		
		$element = array(
		  '#tag' => 'meta', // The #tag is the html tag - 
		  '#attributes' => array( // Set up an array of attributes inside the tag
		    'name' => 'twitter:description', 
		    'content' => trim($description)
		  ),
		);
		drupal_add_html_head($element, 'twitter_description');
		
		if(strpos($src, 'http://') != -1) {
			$img  = str_replace('"', '', trim($src));
			
			$element = array(
			  '#tag' => 'meta', // The #tag is the html tag - 
			  '#attributes' => array( // Set up an array of attributes inside the tag
			    'name' => 'twitter:image', 
			    'content' => $img
			  ),
			);
			drupal_add_html_head($element, 'twitter_image');
			
			$size = getimagesize($img);
			
			if($size[0] > 500) {
				$type = 'summary_large_image';
			}
			//print '<script> console.log(\'image\', \'' .. '\')</script>';
		}
		
		$element = array(
		  '#tag' => 'meta', // The #tag is the html tag - 
		  '#attributes' => array( // Set up an array of attributes inside the tag
		    'name' => 'twitter:card', 
		    'content' => $type
		  ),
		);
		drupal_add_html_head($element, 'twitter_type');
		
	}
	
	
	//print '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>';
	//die();
?>

<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>
    <div class="content"<?php print $content_attributes; ?>>
       <?php
         // We hide the comments and links now so that we can render them later.
         hide($content['comments']);
         hide($content['links']);
         print render($content);
       ?>
    </div>
    <div class="lireSuite">
            <a href="javascript:history.back()" title="<?php echo t("Retour")?>"><?php echo t("Retour")?></a>
    </div>	 
</div>
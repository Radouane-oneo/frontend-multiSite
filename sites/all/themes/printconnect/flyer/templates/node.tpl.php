<?php 
	
	/*
	//header('Content-Type: application/json');
	
	foreach ($node->body as $key => $value) {
		$desc = $value[0]['value'];
	}
	
	$description = substr(preg_replace('/\s+/', ' ', strip_tags(preg_replace("/<script\\b[^>]*>(.*?)<\\/script>/s", "",preg_replace("/<style\\b[^>]*>(.*?)<\\/style>/s", "", print_r($desc, 1))))), 0, 600) . '...';
	
	$nodejson = json_encode($node);
	
	$node = json_decode($nodejson, true); 
	print $description . '<br><br>';
	
	//print indent(json_encode($node));
	$parentnode =  $node['view']['display']['default']['display_options']['title'];
	
	print $parentnode . '<br><br>';
	
	$title = $node['title'];
	
	print $title . '<br><br>';
	//print_r($node);
	
	die(); */
	
	function indent($json) {

	    $result      = '';
	    $pos         = 0;
	    $strLen      = strlen($json);
	    $indentStr   = '  ';
	    $newLine     = "\n";
	    $prevChar    = '';
	    $outOfQuotes = true;
	
	    for ($i=0; $i<=$strLen; $i++) {
	
	        // Grab the next character in the string.
	        $char = substr($json, $i, 1);
	
	        // Are we inside a quoted string?
	        if ($char == '"' && $prevChar != '\\') {
	            $outOfQuotes = !$outOfQuotes;
	
	        // If this character is the end of an element,
	        // output a new line and indent the next line.
	        } else if(($char == '}' || $char == ']') && $outOfQuotes) {
	            $result .= $newLine;
	            $pos --;
	            for ($j=0; $j<$pos; $j++) {
	                $result .= $indentStr;
	            }
	        }
	
	        // Add the character to the result string.
	        $result .= $char;
	
	        // If the last character was the beginning of an element,
	        // output a new line and indent the next line.
	        if (($char == ',' || $char == '{' || $char == '[') && $outOfQuotes) {
	            $result .= $newLine;
	            if ($char == '{' || $char == '[') {
	                $pos ++;
	            }
	
	            for ($j = 0; $j < $pos; $j++) {
	                $result .= $indentStr;
	            }
	        }
	
	        $prevChar = $char;
	    }
	
	    return $result;
	}
	
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
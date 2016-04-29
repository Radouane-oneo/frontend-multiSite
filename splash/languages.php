<?php 
	$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
	global $beurl;
	$beurl = 'http://www.flyer.be/befr';
	if($lang == 'nl')
		$beurl = 'http://www.flyer.be/benl';
?>
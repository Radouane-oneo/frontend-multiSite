<?php

$url = "http://d4e7wxbvl20c1.cloudfront.net/images.flyer.eu/Leadgen_Gidsen/Foldergids.pdf";
header("Content-Type: application/pdf");
header("Content-Transfer-Encoding: Binary");
header("Content-disposition: attachment; filename=Foldergids.pdf"); 
readfile($url);

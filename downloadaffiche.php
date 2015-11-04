<?php

$url = "http://d4e7wxbvl20c1.cloudfront.net/images.flyer.fr/Leadgen_Gidsen/Affichegids.pdf";
header("Content-Type: application/pdf");
header("Content-Transfer-Encoding: Binary");
header("Content-disposition: attachment; filename=Affichegids.pdf"); 
readfile($url);

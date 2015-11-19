<?php
$url = "http://d4e7wxbvl20c1.cloudfront.net/images.flyer.eu/Leadgen_Gidsen/VisitekaartenGids.pdf";
header("Content-Type: application/pdf");
header("Content-Transfer-Encoding: Binary");
header("Content-disposition: attachment; filename=VisitekaartenGids.pdf"); 
readfile($url);


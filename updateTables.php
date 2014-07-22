<?php

$ChainSearch = "images.printconcept.com/flyer";
$ChanRelace = "images.flyer.eu";

$host = "localhost";
$db = "drupal";
$user = "root";
$psw = "";

$connexion = mysql_connect($host, $user, $psw)
        or die("Connexion impossible au serveur $host avec l'usager $user" . mysql_error());
mysql_select_db($db)
        or die("la base de donnÃ©e: $db n'existe pas" . mysql_error());
$liste = "show tables";
$reponse = mysql_query($liste) or die("Erreur : liste = $liste <br>" . mysql_error());
$nb = mysql_num_rows($reponse); // permet de savoir le nombre de tables
print "$nb tables <br>";
while ($List_rep = mysql_fetch_array($reponse)) {

  $str = array();
  $sqlCol = "SHOW COLUMNS FROM " . $List_rep[0];
  $reponse_show = mysql_query($sqlCol);
  while ($List_rep_show = mysql_fetch_array($reponse_show)) {
    $str[] = "CONVERT( `" . $List_rep_show [0] . "` USING utf8 ) LIKE '%" . $ChainSearch . "%'";
  }

  $where = implode(' OR ', $str);
  $sql = "SELECT * FROM `$db`.`" . $List_rep[0] . "` WHERE (" . $where . ")";

  //print $sql . '<br/>';
  if ($rs = mysql_query($sql)) {

    while ($tab = mysql_fetch_array($rs)) {

      if (count($tab) > 0) {

        foreach ($tab as $cle => $valeur) {
          if (preg_match('#' . $ChainSearch . '#', $valeur)) {
            if (is_string($cle)) {
              $change = "UPDATE " . $List_rep[0] . " SET " . $cle . " = REPLACE(" . $cle . ",'" . $ChainSearch . "','" . $ChanRelace . "')";
              if ($done = mysql_query($change)) {
                echo $List_rep[0] . "--> ok <br> ";
              } else {

                echo "Erreur DB";
                die();
              }
              print '<pre>' . $change . '</pre>';
            }
          }
        }
      }
    }
  }
}
?>
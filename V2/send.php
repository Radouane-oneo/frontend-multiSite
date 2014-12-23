<?php 
$reponse = "0";
	if(isset($_POST['valeursend']) and !empty($_POST['valeursend'])){

		if (filter_var($_POST['valeursend'], FILTER_VALIDATE_EMAIL) or preg_match("#^0[1-68]([-. ]?[0-9]{2}){4}$#", $_POST['valeursend'])) {
			$reponse = "1";
			// envoi de mail
			$to      = 'dennis.peeters@printconcept.com,jeroen.debart@printconcept.com,tom.vanlerberghe@printconcept.com';
    		$subject = '';
     		$message = 'New application : ' . $_POST['valeursend'];
		    $headers = 'From: webmaster@printconcept.com' . "\r\n"; 

     		mail($to, $subject, $message, $headers);

		} 

	}
	echo $reponse;
?>
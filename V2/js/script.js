
/** Functions **/

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
}

function isValidPhone(emailAddress){
	var pattern=new RegExp(/([\+][0-9]{1,3}([ \.\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9A-Z \.\-]{1,32})((x|ext|extension)?[0-9]{1,4}?)/);
	return pattern.test(emailAddress);
}
 
 function sendmail1(valmail,exval){
 	$.post("send.php", {valeursend:valmail}, function(theResponse){
 		var resutl=0;
		if(theResponse==1){  
			//document.location.href = 'http://www.printconcept.be/expert-service'; 
			$(".form1 #inputEmail1").addClass("correct").removeClass("erreur").val(exval).delay(1200);  
			document.location.href = 'thank-you.html#section2'; 
		}
		else
		{
			// afficher message d'erreur !!!	 
			exval=valeursend;
			$(".form1 #inputEmail1").addClass("erreur").removeClass("correct").val("Invalid Email or Phone").click(function(){ $(this).val(exval); });
		}
		 
	}, "text"); 
 }
 function sendmail2(valmail,exval){
 	$.post("send.php", {valeursend:valmail}, function(theResponse){
 		var resutl=0;
		if(theResponse==1){  
			//document.location.href = 'http://www.printconcept.be/expert-service';

			$(".form2 #inputEmail2").addClass("correct").removeClass("erreur").val(exval).delay(1200);
			document.location.href = 'thank-you.html#section2'; 			 			
		}
		else
		{ 
			exval=valeursend;
			$(".form2 #inputEmail2").addClass("erreur").removeClass("correct").val("Invalid Email or Phone").click(function(){ $(this).val(exval); });
		}
		 
	}, "text"); 
 }

 	$( window ).resize(function() {
 		/*var max = -1;
		$("#section3  .cell").each(function() {
    		var h = $(this).height(); 
    		max = h > max ? h : max; 
		}); 
		 $("#section3  .cell").css("min-height",max);*/
		 var liMaxHeight = -1;
			var node;
			$(".list-cell  .cell").each(function(index) {
			    if ($(this).outerHeight() > liMaxHeight) {
			 		liMaxHeight = $(this).outerHeight(); 
			    }
			});
			 $(".list-cell  .cell").css("min-height",liMaxHeight+19);

	});
$(document).ready(function() {  
		 
		/*var max = -1;
		$("#section3  .cell").each(function() {
    		var h = $(this).height(); 
    		max = h > max ? h : max;
    	 
		});
		 $("#section3  .cell").css("min-height",max);*/
		

		 	var liMaxHeight = -1;
			var node;
			$(".list-cell  .cell").each(function(index) {
			    if ($(this).outerHeight() > liMaxHeight) {
			 		liMaxHeight = $(this).outerHeight(); 
			    }
			});

			$(".list-cell  .cell").each(function(index) {
			    if ($(this).outerHeight() < liMaxHeight) {
			 		
			 		$(this).css("min-height",liMaxHeight);
			    }
			});
			 


		 

		$('.form1 button[type="submit"]').on('click',function(e){
			$(".form1 #inputEmail1").unbind("click");
			var valeursend = $(".form1 #inputEmail1").val(); 
			var exval;
			
			if(isValidPhone(valeursend)==false){
				if (isValidEmailAddress(valeursend)==false) 
				{
					exval=valeursend;
					$(".form1 #inputEmail1").addClass("erreur").removeClass("correct").val("Invalid Email or Phone").click(function(){ $(this).val(exval); });
				}
				else{
					 
					exval=$(".form1 #inputEmail1").val();					
					sendmail1(valeursend,exval); 
					
				} 
			} 
			else{
				exval=$(".form1 #inputEmail1").val(); 
				sendmail1(valeursend,exval);
				 
			}
			return false;
		});

			$('.form2 button[type="submit"]').on('click',function(e){
			$(".form2 #inputEmail2").unbind("click");
			var valeursend = $(".form2 #inputEmail2").val(); 
			var exval;
			var ressend;
			if(isValidPhone(valeursend)==false){
				if (isValidEmailAddress(valeursend)==false) 
				{
					exval=valeursend;
					$(".form2 #inputEmail2").addClass("erreur").removeClass("correct").val("Invalid Email or Phone").click(function(){ $(this).val(exval); });
				}
				else{
					 
					exval=$(".form2 #inputEmail2").val(); 
					sendmail2(valeursend,exval);  
				} 
			} 
			else{
				exval=$(".form2 #inputEmail2").val();
				$(".form2 #inputEmail2").addClass("correct").removeClass("erreur").val(exval); 
				 sendmail2(valeursend,exval); 
			 
			}

			return false;
		});
		 
		 
	
	

	/****************************My script********************************/
	 
  	 
   
	 
	 
	$('.form-inline button[type="submit"]').click(function() {
		//$(".form-inline").submit();
		return false;
	});
 



 	/*********************end script************************************/
 
	
});
	 

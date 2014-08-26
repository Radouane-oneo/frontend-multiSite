//// JavaScript Document
//
//
//function validate(email, phone) {
//
//    if (emailReg.test(email)) {
//        jQuery(document).find('#pccontact_general_form #edit-actions')
//		.append("<p class='errorForm'>Email Invalide</p>").hide().fadeIn().show();
//
//        return false;
//    } else if (phoneReg(phone)) {
//
//        jQuery(document).find('#pccontact_general_form #edit-actions')
//		.append("<p class='errorForm'>Télephone Invalide</p>").hide().fadeIn().show();
//
//        return false;
//    }
//    return false;
//}
jQuery(document).ready(function (e) {
    jQuery(".popupOverlay").live('click', function(){
        jQuery('#popup_overlay').css('display', 'block'); 
    
    });
     jQuery(".remove").live('click', function(){
   
        jQuery('#popup_overlay').css('display', 'none'); 
    
    });
    
    if(window.location.search == "?contentonly" ){
        jQuery('body').css("background","none");
    }

    jQuery('#pccontact_general_form').submit(function (e) {
        var name = jQuery('#pccontact_general_form').find('#edit-name').val();
        var phone = jQuery('#pccontact_general_form').find('#edit-phone').val();
        var email = jQuery('#pccontact_general_form').find('#edit-email').val();
        var comment = jQuery('#pccontact_general_form').find('#edit-comment').val();
	var emailReg = /^^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i;
        var phoneReg = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
		
		

		if (name === "" || phone === "" || email === "" || comment === "") {
			var GlobalError = jQuery('#pccontact_general_form').attr('data-GlobalError');
			 jQuery(document).find('.errorForms').remove();
			 jQuery(document).find('#pccontact_general_form #edit-actions')
				.append('<p class="errorForms">'+GlobalError+'</p>').hide().fadeIn().show();
			return false;
		}
		else if ( !emailReg.test( email ) ) {
			var MailError = jQuery('#pccontact_general_form').find('#edit-email').attr('data-MailError');
			jQuery(document).find('.errorForms').remove();
			jQuery(document).find('#pccontact_general_form #edit-actions')
				.append('<p class="errorForms">'+MailError+'</p>').hide().fadeIn().show();
            return false;
         }
		else if (!phoneReg.test( phone ) ) {
			var PhoneError = jQuery('#pccontact_general_form').find('#edit-phone').attr('data-PhoneError');
			jQuery(document).find('.errorForms').remove();
			jQuery(document).find('#pccontact_general_form #edit-actions')
				.append('<p class="errorForms"> '+PhoneError+'</p>').hide().fadeIn().show();
            return false;
         } 
		 else{
			 return true;
	}		
		
    });
    jQuery("#pccontact_popup_form").submit(function() {

            var url = "mailpopup.php"; // the script where you handle the form input.

            jQuery.ajax({
                   type: "POST",
                   url: url,
                   data: jQuery("#pccontact_popup_form").serialize(), // serializes the form's elements.
                   success: function(data)
                   {
                       alert(data); // show response from the php script.
                   }
                 });

            return false; // avoid to execute the actual submit of the form.
    });	
    /*
        jQuery('#pccontact_popup_form').submit(function (e) {
        var name = jQuery('#pccontact_popup_form').find('#edit-nom').val();
        var prenom = jQuery('#pccontact_popup_form').find('#edit-prenom').val();
          var phone = jQuery('#pccontact_popup_form').find('#edit-telephone').val();
        var email = jQuery('#pccontact_popup_form').find('#edit-email').val();
       
      
	var emailReg = /^^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i;
        var phoneReg = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
		
		

		if (name === "" || name === "" || prenom === "" || email === "") {
			var GlobalError = jQuery('#pccontact_popup_form').attr('data-GlobalError');
			 jQuery(document).find('.errorForms').remove();
			 jQuery(document).find('#pccontact_popup_form #edit-actions')
				.append('<p class="errorForms">'+GlobalError+'</p>').hide().fadeIn().show();
			return false;
		}
		else if ( !emailReg.test( email ) ) {
			var MailError = jQuery('#pccontact_general_form').find('#edit-email').attr('data-MailError');
			jQuery(document).find('.errorForms').remove();
			jQuery(document).find('#pccontact_general_form #edit-actions')
				.append('<p class="errorForms">'+MailError+'</p>').hide().fadeIn().show();
            return false;
         }
		else if (!phoneReg.test( phone ) ) {
			var PhoneError = jQuery('#pccontact_general_form').find('#edit-phone').attr('data-PhoneError');
			jQuery(document).find('.errorForms').remove();
			jQuery(document).find('#pccontact_general_form #edit-actions')
				.append('<p class="errorForms"> '+PhoneError+'</p>').hide().fadeIn().show();
            return false;
         } 
		 else{
			 return true;
	}		
			
    });
    */
     jQuery('#pccontact_stors_form').submit(function (e) {
        var name = jQuery('#pccontact_stors_form').find('#edit-name').val();
        var phone = jQuery('#pccontact_stors_form').find('#edit-phone').val();
        var email = jQuery('#pccontact_stors_form').find('#edit-email').val();
        var socity = jQuery('#pccontact_stors_form').find('#edit-socity').val();
        var activity = jQuery('#pccontact_stors_form').find('#edit-activity').val();
        var vatnumber = jQuery('#pccontact_stors_form').find('#edit-vatnumber').val();
        var comment = jQuery('#pccontact_stors_form').find('#edit-comment').val();
	var emailReg = /^^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i;
        var phoneReg = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
		
		

       if (name === "" || phone === "" || email === "" || comment === "") {
            var GlobalError = jQuery('#pccontact_stors_form').attr('data-GlobalError');
            jQuery(document).find('.errorForms').remove();
            jQuery(document).find('#pccontact_stors_form #edit-actions')
            .append('<p class="errorForms">'+GlobalError+'</p>').hide().fadeIn().show();
            return false;
        }
        else if (!emailReg.test( email )) {
            var MailError = jQuery('#pccontact_stors_form').find('#edit-email').attr('data-MailError');
            jQuery(document).find('.errorForms').remove();
            jQuery(document).find('#pccontact_stors_form #edit-actions')
            .append('<p class="errorForms">'+MailError+'</p>').hide().fadeIn().show();
            return false;
        }
          else if (socity === "") {
            var socityError = jQuery('#pccontact_stors_form').find('#edit-socity').attr('data-socityError');
            jQuery(document).find('.errorForms').remove();
            jQuery(document).find('#pccontact_stors_form #edit-actions')
            .append('<p class="errorForms">'+socityError+'</p>').hide().fadeIn().show();
            return false;
        }
          else if (activity === "") {
            var activityError = jQuery('#pccontact_stors_form').find('#edit-activity').attr('data-activityError');
            jQuery(document).find('.errorForms').remove();
            jQuery(document).find('#pccontact_stors_form #edit-actions')
            .append('<p class="errorForms">'+activityError+'</p>').hide().fadeIn().show();
            return false;
        }
         else if (vatnumber === "") {
            var vatnumberError = jQuery('#pccontact_stors_form').find('#edit-vatnumber').attr('data-vatnumberError');
            jQuery(document).find('.errorForms').remove();
            jQuery(document).find('#pccontact_stors_form #edit-actions')
            .append('<p class="errorForms">'+vatnumberError+'</p>').hide().fadeIn().show();
            return false;
        }
        else if (!phoneReg.test( phone ) ) {
            var PhoneError = jQuery('#pccontact_stors_form').find('#edit-phone').attr('data-PhoneError');
            jQuery(document).find('.errorForms').remove();
            jQuery(document).find('#pccontact_stors_form #edit-actions')
            .append('<p class="errorForms"> '+PhoneError+'</p>').hide().fadeIn().show();
            return false;
        }else{
	 return true;
	}		
			
    });

});



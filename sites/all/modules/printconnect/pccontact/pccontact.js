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
   
        // hide all error span message
      
        jQuery("#callme").live('click', function(){
            jQuery('.info-bloc #popup_overlay2 span.required').hide();
            jQuery('.info-bloc #popup_overlay2').show(); 
            jQuery('.info-bloc #popup_overlay2 #edit-actions').show(); 

        });
         jQuery(".info-bloc #popup_overlay2 .close").live('click', function(){

            jQuery('.info-bloc #popup_overlay2').hide(); 
            jQuery('.info-bloc #popup_overlay2 #edit-actions').hide(); 

        });
        jQuery('#pccontact_popup_form').submit(function () {
              
            var name = jQuery('#pccontact_popup_form').find('#edit-nom').val();
            var prenom = jQuery('#pccontact_popup_form').find('#edit-prenom').val();
            var phone = jQuery('#pccontact_popup_form').find('#edit-telephone').val();
            var email = jQuery('#pccontact_popup_form').find('#edit-email').val();
       
      
            var emailReg = /^^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i;
            var phoneReg = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
		
            errorInput('edit-nom');
            errorInput('edit-prenom');
            errorInput('edit-telephone');
            errorInput('edit-email');

            if (name === "" || prenom === "" || phone === "" || email === "") {
                    var GlobalError = jQuery('#pccontact_popup_form').attr('data-GlobalError');
                     jQuery(document).find('.errorForms').remove();
                     jQuery(document).find('#pccontact_popup_form #edit-actions')
                            .append('<p class="errorForms">'+GlobalError+'</p>').hide().fadeIn().show();
                    return false;
            }else{
                        
                                               
                        jQuery('#popupContent').hide(); 
                        jQuery('.info-bloc #popup_overlay2 #edit-actions').hide(); 
            		jQuery('.info-bloc #popup_overlay2 #messageSent').show();
                   return false;       
            }			
    });
    
     var errorInput = function (id){
        if( jQuery("#"+id).val() === ""){            
            jQuery("#"+id).addClass('error');
            jQuery("."+id+' span.required').show();
        }else if ( !emailReg.test( email ) ) {
//                    var MailError = jQuery('#pccontact_general_form').find('#edit-email').attr('data-MailError');
//                    jQuery(document).find('.errorForms').remove();
//                    jQuery(document).find('#pccontact_general_form #edit-actions')
//                            .append('<p class="errorForms">'+MailError+'</p>').hide().fadeIn().show();
                    jQuery('#edit-email').addClass('error');   
                return false;
            }else if (!phoneReg.test( phone ) ) {
//			var PhoneError = jQuery('#pccontact_general_form').find('#edit-phone').attr('data-PhoneError');
//			jQuery(document).find('.errorForms').remove();
//			jQuery(document).find('#pccontact_general_form #edit-actions')
//				.append('<p class="errorForms"> '+PhoneError+'</p>').hide().fadeIn().show();
                        jQuery('#edit-telephone').addClass('error');   
                return false;
            }else{                 
            jQuery("#"+id).removeClass('error');
            jQuery("."+id+' span.required').hide();
        }
    };
    
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



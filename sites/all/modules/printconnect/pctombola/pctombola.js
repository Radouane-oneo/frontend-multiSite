
function validate(email, phone){
	var emailReg = /^^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i;
	var regEx = /^[0-9-+]+$/;
	if(!emailReg.test( email )) {
        var emailErreurBenl = window.location.href.indexOf("/benl");
            if (emailErreurBenl  != -1) {
                jQuery(document).find('#fancybox-content #edit-userforms').append("<p class='error'>Het e-mail adres is niet geldig</p>").hide().fadeIn().show();
            }
        var emailErreurnlnl = window.location.href.indexOf("/nlnl");
            if (emailErreurnlnl  != -1) {
                jQuery(document).find('#fancybox-content #edit-userforms').append("<p class='error'>Het e-mail adres is niet geldig</p>").hide().fadeIn().show();
            }
        var emailErreurBefr = window.location.href.indexOf("/befr");
            if (emailErreurBefr  != -1) {
                jQuery(document).find('#fancybox-content #edit-userforms').append("<p class='error'>L'adresse e-mail n'est pas valide<p/>").hide().fadeIn().show();
            }
        var emailErreurlufr = window.location.href.indexOf("/lufr");
            if (emailErreurlufr  != -1) {
                jQuery(document).find('#fancybox-content #edit-userforms').append("<p class='error'>L'adresse e-mail n'est pas valide</p>").hide().fadeIn().show();
            }
        var emailErreurfrfr = window.location.href.indexOf("/frfr");
            if (emailErreurfrfr  != -1) {
                jQuery(document).find('#fancybox-content #edit-userforms').append("<p class='error'>L'adresse e-mail n'est pas valide</p>").hide().fadeIn().show();
            }

		return false;
                
	}else if(!regEx.test(phone)) {
        var msgErreurBenl = window.location.href.indexOf("/benl");
            if (msgErreurBenl  != -1) {
                jQuery(document).find('#fancybox-content #edit-userforms').append("<p class='error'>Het telefoonnummer is niet geldig</p>").hide().fadeIn().show();
            }
        var msgErreurnlnl = window.location.href.indexOf("/nlnl");
            if (msgErreurnlnl  != -1) {
                jQuery(document).find('#fancybox-content #edit-userforms').append("<p class='error'>Het telefoonnummer is niet geldig</p>").hide().fadeIn().show();
            }
        var msgErreurBefr = window.location.href.indexOf("/befr");
            if (msgErreurBefr  != -1) {
                jQuery(document).find('#fancybox-content #edit-userforms').append("<p class='error'>Le numéro de téléphone n'est pas correct<p/>").hide().fadeIn().show();
            }
        var msgErreurlufr = window.location.href.indexOf("/lufr");
            if (msgErreurlufr  != -1) {
                jQuery(document).find('#fancybox-content #edit-userforms').append("<p class='error'>Le numéro de téléphone n'est pas correct</p>").hide().fadeIn().show();
            }
        var msgErreurfrfr = window.location.href.indexOf("/frfr");
            if (msgErreurfrfr  != -1) {
                jQuery(document).find('#fancybox-content #edit-userforms').append("<p class='error'>Le numéro de téléphone n'est pas correct</p>").hide().fadeIn().show();
            }
		return false;
	}else{
		jQuery(document).find('#fancybox-content #edit-userforms').find('.error').remove();
		return true;
	}
  }
//Import YouTube API//
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

jQuery(document).ready(function () {
    var befr = window.location.href.indexOf("/befr");
    if (befr != -1) {
        jQuery("#block-pctombola-info").css({
            "background-image": "url('sites/all/themes/printconnect/flyer/css/images/tombola/FR/Encart_10_ans_BE.png')"
        });
        return true;
    }
    var benl = window.location.href.indexOf("/benl");
    if (benl != -1) {
        jQuery("#block-pctombola-info").css({
            "background-image": "url('sites/all/themes/printconnect/flyer/css/images/tombola/NL/Encart_10_ans_BE.jpg')"
        });

        return true;
    }
    var frfr = window.location.href.indexOf("/frfr");
    if (frfr != -1) {
        jQuery("#block-pctombola-info").css({
            "background-image": "url('sites/all/themes/printconnect/flyer/css/images/tombola/FR/Encart_10_ans_FR.png')"
        });
        return true;
    }
    var nlnl = window.location.href.indexOf("/nlnl");
    if (nlnl != -1) {
        jQuery("#block-pctombola-info").css({
            "background-image": "url('sites/all/themes/printconnect/flyer/css/images/tombola/NL/Encart_10_ans_NL.jpg')"
        });
        return true;
    }
    var frlu = window.location.href.indexOf("/lufr");
    if (frlu != -1) {
        jQuery("#block-pctombola-info").css({
            "background-image": "url('sites/all/themes/printconnect/flyer/css/images/tombola/FR/Encart_10_ans_LU.png')"
        });
        return true;
    }
});
// Fires whenever a player has finished loading
//function onPlayerReady(event) {
//    event.target.playVideo();
//}
// Fires when the player's state changes.

function onPlayerStateChange(event) {
    // Go to the next video after the current one is finished playing
    if (event.data === 0) {
        jQuery(document).find('#edit-introholder').fadeOut().hide();
        jQuery(document).find('#Q1').fadeIn().show().before('<div class="imageQ1" />');
        jQuery(document).find('#edit-next').show();
        jQuery('#fancybox-content #video').empty();
    }
}
jQuery(document).find('#edit-questions > .form-item-Q1').attr('id', 'Q1');
jQuery(document).find('#edit-questions > .form-item-Q2').attr('id', 'Q2');
jQuery(document).find('#edit-questions > .form-item-Q3').attr('id', 'Q3');

/****************Click*****/

function onYouTubePlayerAPIReady() {
    jQuery(document).ready(function (e) {		
jQuery(document).find("#fancybox-content").css({"margin-left" : "25px"});
        jQuery('#edit-questions > .form-item-Q1').attr('id', 'Q1');
        jQuery('#edit-questions > .form-item-Q2').attr('id', 'Q2');
        jQuery('#edit-questions > .form-item-Q3').attr('id', 'Q3');
 if (jQuery.fancybox) {
            jQuery('#edit-paticiperbtn, #Popupbenl, #Popupbefr, #Popupfrfr, #Popupnlnl ,#Popuplufr').fancybox({
                scrolling: false,
                //showCloseButton :false,
                'hideOnOverlayClick': false,
                content: jQuery("#edit-globalform").html().replace("submit", "button")
                    .replace("edit-endslider", "edit-endslider-new"),
                onComplete: function (links, index) {
          
                       var videobenl = window.location.href.indexOf("/benl");
                        if (videobenl != -1) {
                           jQuery('#fancybox-content #video').append('<iframe id="VideoId" enablejsapi=1 width="664" height="353" src="http://www.youtube.com/embed/JOreWvsecMc?enablejsapi=1&version=3&wmode=transparent" frameborder="0" allowfullscreen wmode="Opaque"></iframe>');
                        }
                         var videobefr = window.location.href.indexOf("/befr");
                        if (videobefr != -1) {
                           jQuery('#fancybox-content #video').append('<iframe id="VideoId" enablejsapi=1 width="664" height="353" src="http://www.youtube.com/embed/2cx9jzi1KXE?enablejsapi=1&version=3&wmode=transparent" frameborder="0" allowfullscreen wmode="Opaque"></iframe>');
                        }
                         var videonlnl = window.location.href.indexOf("/nlnl");
                        if (videonlnl != -1) {
                           jQuery('#fancybox-content #video').append('<iframe id="VideoId" enablejsapi=1 width="664" height="353" src="http://www.youtube.com/embed/gp-j1gvl54E?enablejsapi=1&version=3&wmode=transparent" frameborder="0" allowfullscreen wmode="Opaque"></iframe>');
                        }
                         var videofrfr = window.location.href.indexOf("/frfr");
                        if (videofrfr != -1) {
                           jQuery('#fancybox-content #video').append('<iframe id="VideoId" enablejsapi=1 width="664" height="353" src="http://www.youtube.com/embed/6V1VSQ1B5Rw?enablejsapi=1&version=3&wmode=transparent" frameborder="0" allowfullscreen wmode="Opaque"></iframe>');
                        }
                         var videolufr = window.location.href.indexOf("/lufr");
                        if (videolufr != -1) {
                           jQuery('#fancybox-content #video').append('<iframe id="VideoId" enablejsapi=1 width="664" height="353" src="http://www.youtube.com/embed/NYOK-aJGIg?enablejsapi=1&version=3&wmode=transparent" frameborder="0" allowfullscreen wmode="Opaque"></iframe>');
                        }


                    var id = jQuery('#fancybox-content #video').find('iframe')
                        .attr('id');
                    var player = new YT.Player(id, {
                        events: {
                            //'onReady': onPlayerReady,
                            'onStateChange': onPlayerStateChange
                        }
                    });
                    jQuery('a.playLink').click(function () {
                        jQuery(document).find('#edit-introholder').fadeOut().hide();
                        jQuery(document).find('#Q1').fadeIn().show().before('<div class="imageQ1" />');

                        var benl0 = window.location.href.indexOf("/benl");
                        if (benl0 != -1) {
                            jQuery(document).find(".imageQ1").css({
                                "background": "url('sites/all/themes/printconnect/flyer/css/images/Miss_NL/Question_01.png')"
                            });

                        }
                        var nlnl0 = window.location.href.indexOf("/nlnl");
                        if (nlnl0 != -1) {
                            jQuery(document).find(".imageQ1").css({
                                "background": "url('sites/all/themes/printconnect/flyer/css/images/Miss_NL/Question_01.png')"
                            });

                        }
                        jQuery(document).find('#edit-next').show();
                        jQuery('#fancybox-content #video').empty();
                        return false;
                    });

                    jQuery(document).find("#Q1 input[type='radio'], #Q2 input[type='radio'], #Q3 input[type='radio']").click(function () {
                        if (jQuery(document).find('#Q1').is(":visible")) {
                            jQuery(document).find('#Q1').fadeOut().hide();
                            jQuery(document).find('div.imageQ1').remove();
                            jQuery(document).find('#Q2').fadeIn().show()
                                .before('<div class="imageQ2" />');
                            var benl1 = window.location.href.indexOf("/benl");
                            if (benl1 != -1) {
                                jQuery(document).find(".imageQ2").css({
                                    "background": "url('sites/all/themes/printconnect/flyer/css/images/Miss_NL/Question_02.png')"
                                });

                            }
                            var nlnl1 = window.location.href.indexOf("/nlnl");
                        if (nlnl1 != -1) {
                            jQuery(document).find(".imageQ2").css({
                                "background": "url('sites/all/themes/printconnect/flyer/css/images/Miss_NL/Question_02.png')"
                            });

                        }
                        } else
                        if (jQuery(document).find('#Q2').is(":visible")) {
                            jQuery(document).find('#Q2').fadeOut().hide();
                            jQuery(document).find('div.imageQ2').remove();
                            jQuery(document).find('#Q3').fadeIn().show()
                                .before('<div class="imageQ3" />');
                            var benl2 = window.location.href.indexOf("/benl");
                            if (benl2 != -1) {
                                jQuery(document).find(".imageQ3").css({
                                    "background": "url('sites/all/themes/printconnect/flyer/css/images/Miss_NL/Question_03.png')"
                                });
                            }
                            var nlnl2 = window.location.href.indexOf("/nlnl");
                            if (nlnl2 != -1) {
                                jQuery(document).find(".imageQ3").css({
                                    "background": "url('sites/all/themes/printconnect/flyer/css/images/Miss_NL/Question_03.png')"
                                });

                            }
                        } else
                        if (jQuery(document).find('#Q3').is(":visible")) {
                            jQuery(document).find('#Q3').fadeOut().hide();
                            jQuery(document).find('#edit-userformoptions')
                                .fadeIn().show().before('<div class="Cercle" />');
                            jQuery(document).find('#edit-next').fadeOut().hide();
                            jQuery(document).find('div.imageQ3').remove();
                          
                             var benl3 = window.location.href.indexOf("/benl");
                           if (benl3 != -1) {
                                jQuery(document).find(".Cercle").css({
                                    "background": "url('sites/all/themes/printconnect/flyer/css/images/Cercle-benl.png')",
                                    "background-repeat" : "no-repeat"
                                });

                            }                                  
                            var befr4 = window.location.href.indexOf("/befr");
                           if (befr4 != -1) {
                                jQuery(document).find(".Cercle").css({
                                    "background": "url('sites/all/themes/printconnect/flyer/css/images/Cercle_befr.png')",
                                    "background-repeat" : "no-repeat"
                                });

                            } 
                          
                        }
                    });

                    jQuery(document).find('#edit-next').click(function () {
                        if (jQuery(document).find('#Q1').is(":visible")) {
                            jQuery(document).find('#Q1').fadeOut().hide();
                            jQuery(document).find('div.imageQ1').remove();
                            jQuery(document).find('#Q2').fadeIn().show()
                                .before('<div class="imageQ2" />');
                        } else
                        if (jQuery(document).find('#Q2').is(":visible")) {
                            jQuery(document).find('#Q2').fadeOut().hide();
                            jQuery(document).find('div.imageQ2').remove();
                            jQuery(document).find('#Q3').fadeIn().show()
                                .before('<div class="imageQ3" />');
                        } else
                        if (jQuery(document).find('#Q3').is(":visible")) {
                            jQuery(document).find('#Q3').fadeOut().hide();
                            jQuery(document).find('#edit-userformoptions')
                                .fadeIn().show().before('<div class="Cercle" />');
                            jQuery(document).find('#edit-next').fadeOut().hide();
                            jQuery(document).find('div.imageQ3').remove();
                        }
                    });
                    jQuery(document).find('a.partoculierLink').click(function () {
                        jQuery(document).find('#edit-userformoptions').fadeOut()
                            .hide();
                        jQuery(document).find('#edit-userform .form-item-nameCompany').hide();
                        jQuery(document).find('#edit-userform .form-item-sectorCompany').hide();
                        jQuery(document).find('#edit-userform').fadeIn().show();
                        jQuery(document).find('#edit-send').fadeIn().show();
                        return false;
                    });
                    jQuery(document).find('a.SocieteLink').click(function () {
                        jQuery(document).find('#edit-userformoptions').fadeOut().hide();
                        jQuery(document).find('#edit-userform').fadeIn().show();
                        jQuery(document).find('#edit-send').fadeIn().show();
                        return false;
                    });


                    jQuery(document).find('#edit-send').click(function (e) {
						
                                                
						
						var email = jQuery('#fancybox-content #edit-userforms .form-item')
							.find('input#edit-email').val();
						var phone = jQuery('#fancybox-content #edit-userforms .form-item')
							.find('input#edit-tel').val();
						var result = validate(email, phone);	

						var email = jQuery('#fancybox-content #edit-userforms .form-item')
							.find('input#edit-email').val();
						var phone = jQuery('#fancybox-content #edit-userforms .form-item')
							.find('input#edit-tel').val();
						var result = validate(email, phone);	

                        if (jQuery(document).find('#edit-userform .form-item-nameCompany').is(':visible') && jQuery(document).find('#edit-userform .form-item-sectorCompany').is(':visible')) {
					    	   if(result ){
                            if ( jQuery(document).find('#fancybox-content #edit-userforms .form-item')
                                .find('input#edit-name').val() === "" || jQuery(document).find('#fancybox-content #edit-userforms .form-item')
                                .find('input#edit-lastname').val() === "" || jQuery(document).find('#fancybox-content #edit-userforms .form-item')
                                .find('input#edit-email').val() === ""  || jQuery(document).find('#fancybox-content #edit-userforms .form-item')
                                .find('input#edit-tel').val() === "" || jQuery(document).find('#fancybox-content #edit-userforms .form-item')
                                .find('input#edit-namecompany').val() === "" || jQuery(document).find('#fancybox-content #edit-userforms .form-item')
                                .find('input#edit-sectorcompany').val() === "") 
								 {
                                 var errorbenl = window.location.href.indexOf("/benl");
                               if (errorbenl != -1) {
                                  jQuery(document).find('#fancybox-content #edit-userforms').append('<p class="error">Gelieve alle velden in te vullen</p>').hide().fadeIn().show();
                               }
                                var errornlnl = window.location.href.indexOf("/nlnl");
                               if (errornlnl != -1) {
                                  jQuery(document).find('#fancybox-content #edit-userforms').append('<p class="error">Gelieve alle velden in te vullen</p>').hide().fadeIn().show();
                               }
                                var errorbefr = window.location.href.indexOf("/befr");
                               if (errorbefr != -1) {
                                  jQuery(document).find('#fancybox-content #edit-userforms').append('<p class="error">Champs obligatoires</p>').hide().fadeIn().show();
                               }
                                var errorfrfr = window.location.href.indexOf("/frfr");
                               if (errorfrfr != -1) {
                                  jQuery(document).find('#fancybox-content #edit-userforms').append('<p class="error">Champs obligatoires</p>').hide().fadeIn().show();
                               }
                               
                                var errorlufr = window.location.href.indexOf("/lufr");
                               if (errorlufr != -1) {
                                  jQuery(document).find('#fancybox-content #edit-userforms').append('<p class="error">Champs obligatoires</p>').hide().fadeIn().show();
                               	
                            }

								 }
							  else  {
                                jQuery('#fancybox-content input[id^="edit"]').each(function () {
                                    id = jQuery(this).attr('id');
                                    val = jQuery(this).val();
                                    jQuery('.block-pctombola').find("#" + id).val(val);
                                    if (jQuery(this).attr('type') == 'checkbox' ||
                                        jQuery(this).attr('type') == 'radio') {
                                        jQuery('.block-pctombola').find("#" + id).attr('checked', true);
                                    }
                                });
                                jQuery(document).find('.block-pctombola #edit-send').trigger('mousedown');
                                jQuery(document).find('#edit-userform').fadeOut().hide();
                                jQuery(document).find('#edit-endslider-new').fadeIn().show();
                                jQuery(document).find('#edit-send').fadeOut().hide();
                            }
								 }
                        } else {

							   if(result){
                            if (jQuery(document).find('#fancybox-content #edit-userforms .form-item')
                                .find('input#edit-name').val() === "" || jQuery(document).find('#fancybox-content #edit-userforms .form-item')
                                .find('input#edit-lastname').val() === "" || jQuery(document).find('#fancybox-content #edit-userforms .form-item')
                                .find('input#edit-email').val() === "" || jQuery(document).find('#fancybox-content #edit-userforms .form-item')
                                .find('input#edit-tel').val() === "")  {
                               
                                var errorbenl1 = window.location.href.indexOf("/benl");
                               if (errorbenl1 != -1) {
                                  jQuery(document).find('#fancybox-content #edit-userforms').append('<p class="error">Gelieve alle velden in te vullen</p>').hide().fadeIn().show();
                               }
                                var errornlnl2 = window.location.href.indexOf("/nlnl");
                               if (errornlnl2 != -1) {
                                  jQuery(document).find('#fancybox-content #edit-userforms').append('<p class="error">Gelieve alle velden in te vullen</p>').hide().fadeIn().show();
                               }
                                var errorbefr3 = window.location.href.indexOf("/befr");
                               if (errorbefr3 != -1) {
                                  jQuery(document).find('#fancybox-content #edit-userforms').append('<p class="error">Champs obligatoires</p>').hide().fadeIn().show();
                               }
                                var errorfrfr4 = window.location.href.indexOf("/frfr");
                               if (errorfrfr4 != -1) {
                                  jQuery(document).find('#fancybox-content #edit-userforms').append('<p class="error">Champs obligatoires</p>').hide().fadeIn().show();
                               }
                               
                                var errorlufr5 = window.location.href.indexOf("/lufr");
                               if (errorlufr5 != -1) {
                                  jQuery(document).find('#fancybox-content #edit-userforms').append('<p class="error">Champs obligatoires</p>').hide().fadeIn().show();
                               }
								}
                         else {
                                jQuery('#fancybox-content input[id^="edit"]').each(function () {
                                    id = jQuery(this).attr('id');
                                    val = jQuery(this).val();
                                    jQuery('.block-pctombola').find("#" + id).val(val);
                                    if (jQuery(this).attr('type') == 'checkbox' ||
                                        jQuery(this).attr('type') == 'radio') {
                                        jQuery('.block-pctombola').find("#" + id).attr('checked', true);
                                    }
                                });
                                jQuery(document).find('.block-pctombola #edit-send').trigger('mousedown');
                                jQuery(document).find('#edit-userform').fadeOut().hide();
                                jQuery(document).find('#edit-endslider-new').fadeIn().show();
                                jQuery(document).find('#edit-send').fadeOut().hide();
                            }
                        }
						   } 
                        return false;

						


                    });
                },
                onClosed: function () {
                    jQuery(document).find('#edit-introholder').fadeIn().show();
                    jQuery(document).find('#edit-userform').fadeOut().hide();
                    jQuery(document).find('#Q1').fadeOut().hide();
                    jQuery(document).find('#Q2').fadeOut().hide();
                    jQuery(document).find('#Q3').fadeOut().hide();
                    jQuery(document).find('#edit-userformoptions').fadeOut().hide();
                    jQuery('#fancybox-content #video').empty();
                }
            });
        }


    }
);
}
/*** End Fancy Box Click Event***/
(function ($) {
    Drupal.behaviors.pctombola = {
        detach: function (context) {},
        attach: function (context, settings) {

        }
    }
})(jQuery);
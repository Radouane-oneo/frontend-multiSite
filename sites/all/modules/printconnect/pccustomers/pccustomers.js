var registerClicked = false;
(function ($) {
    $(document).ready(function () {
      $("#pccustomers-newaddress-form, #pccustomers-newaddress-billingaddresses-form").submit(function() {
          $("#pccustomers-newaddress-form #edit-submit, #pccustomers-newaddress-billingaddresses-form #edit-submit").prop('disabled', true);
      });
        $('#pccustomers-address-billingaddresses-form #edit-country').trigger('change');
      $("#pccustomers-login-form .register-button").click(function(ev) {
          if(registerClicked) {
              return false;
          }

          registerClicked = true;
          //$(".register-button, .login-button").prop('disabled', true);
      });

      $('#pccustomers-address-billingaddresses-form #edit-country').change(function() {
	$('#pccustomers-address-billingaddresses-form #edit-vatnumber-number').val('');
      });
      if($('#pccustomers-address-billingaddresses-form')[0]){
      }
      
      if ($('#isUserCompany:checked').length > 0) {
	$('#edit-vatnumber-number').addClass('required');
	}
      var globalEroorVat = false;
      var vatFormats = [{'BE': 10},{'NL' : 12},{'LU' : 8},{'FR' : 11}];
      $('#pccustomers-address-billingaddresses-form #edit-vatnumber-number', '#pccustomers-newaddress-billingaddresses-form #edit-vatnumber-number').blur(function(){
         
            if ($('#edit-vatnumber-number').val() !='' && $('.country').val() != '') {
		$('.vatAlreadyUsed').parent().hide();
                var vatNumberBA = $("#edit-vatnumber-number").val().replace(/\./g, "").replace(/ /g,"");
                var decision = false;
                $.each(vatFormats, function(c, obj){
                    $.each(obj, function(t, dt){
                        if (t == $('#edit-vatnumber-country').val() && $("#edit-vatnumber-number").val().length == dt) {
                            decision = true;
                        }
                    });
                });
		switch($('#edit-vatnumber-country').val()) {
            	    case 'BE':
                        decision = (vatNumberBA.charAt(0) == 0) ? decision : false;
            	    break;
            	    case 'LU':
                        decision = ($.isNumeric(vatNumberBA)) ? decision : false;
	            break;
		    case 'NL':
			var re = /^[0-9]{9}B[0-9]{2}$/;
    			decision = re.test(vatNumberBA);
		    break;
		    case 'FR':
                        var re = /^[0-9A-Z]{2}[0-9]{9}$/;
                        decision = re.test(vatNumberBA);
                    break;
            	    break
            	    default:
            	        decision = decision;
            	    break;
         	}
                if (decision == false) {
		    globalEroorVat = true;
                    $("#edit-vatnumber-number").addClass('error');
                    //$("#edit-vatnumber-number").val('');
                    var vatplaceholder = Drupal.t('insert a valid vat number please');
		    labels["vatNotNumber"] = vatplaceholder;
                    $('.customErrors').remove();
                    if ($('.messages').length == 1){
                        $('.region-content').before('<div class="messages error"><ul><li class="customErrors">'+vatplaceholder+'</li></ul></div>');
                    } else {
                        $('.messages ul').append('<li class="customErrors">'+vatplaceholder+'</li>');
                    }
                    $('html, body').animate({
                        scrollTop:$(".messages.error").offset().top
                    }, 'slow');
                } else {
		    globalEroorVat = false;
		    $("#edit-vatnumber-number").removeClass('error');
                    $.ajax({
                        type: 'GET',
                        url: Drupal.settings.basePath +'checkout/getBillingAccoutFromVat',
                        data: { 'vatNumber': $('#edit-vatnumber-country').val()+vatNumberBA },
                        dataType: 'json',
                        success: function (data){
                            if (data.code == 200 && $.isEmptyObject(data.data) == false) {
				console.log('wsel hna');
				var path = window.location.href.split('/'); path[path.length -1]
				if (data.data.id != path[path.length -1]) {
                                    $('#edit-vatnumber-number').addClass('error');
                                    $('#edit-vatnumber-number').val('');
				    $('.vatAlreadyUsed').parent().show();
				    $('.vatAlreadyUsed').show();
				}
                            }
                        }
                    });
                 }
            } else if (number.val() !='' && $('#companyInput').val() != ''){
                $('.country').addClass('error');
                $('.country').parents('form').find('select').addClass('error');
                $('#edit-vatnumber-number').val('');
                $('#countryDropDown').addClass('error');
            } else if (number.val() !='' && $('#companyInput').val() == '') {
                var vatplaceholder = Drupal.t('company name is required');
		$('.customErrors').remove();
                if ($('.messages').length == 0){
                    $('.region-content').before('<div class="messages error"><ul><li class="customErrors">'+vatplaceholder+'</li></ul></div>');
                } else {
                    $('.messages ul').append('<li class="customErrors">'+vatplaceholder+'</li>');
                }
                $('html, body').animate({
                    scrollTop:$(".messages.error").offset().top
                }, 'slow');
            }
        });
      /* ========== PCCUSTOMER form validation ========== */
 
      $('.save-button').click(function (e) {
      	  $('.vatAlreadyUsed').parent().hide(); 
	  $('.messages.error').each(function(){
              if(!$(this).hasClass('vatAlreadyUsed')) {
                  $(this).remove();
              }
          });
          
          $('#content form .required').removeClass("error");
          var errorMarkup = "<div class='messages error'><ul>";
          var errorMsgs = new Array();
 
          var isoList = {
            21 : "BE",
            73 : "FR",
            150 : "NL",
            124 : "LU"
          };
 	  var isoLengths = {
	    21 : 4,
            73 : 5,
            150 : 7,
            124 : 4
	  }
           if ($('#edit-street').val().length <= 4 && $('#edit-street').val().length != 0){
                $('#edit-street').addClass('error');
                errorMsgs[0] = Drupal.t('Le champs rue est trop court');
                errorMarkup += "<li>"+errorMsgs[0]+"</li>";console.log(errorMarkup);
                //return false;
            }
          $('#content form input.required, #content form select.required').each(function(i, elem) {
            var _this = $(this); 
           
            var inputName;
            if ($(elem).attr('name') == 'vatNumber[number]'){
                if(_this.val() == "" || _this.val() == 0) {
                    errorMsgs[i] = Drupal.t('Le champ N° de TVA est requis.');
                    errorMarkup += "<li>"+errorMsgs[i]+"</li>";
                }else{
                    //errorMsgs[i] = Drupal.t('insert a valid vat number please');
                }
                
                   console.log('coco');
            }else{
           
            var erTel = /^([0-9\/\s\-_\.]*)$/g;
            if(_this.val() == "" || _this.val() == 0) {
                inputName = $(elem).attr('name');
                _this.addClass('error');
                if(inputName == "vatNumber[number]"){
                   errorMsgs[i] = Drupal.t('Le champ N° de TVA est requis.');
                }
                else if(inputName == "firstName"){
                   errorMsgs[i] = Drupal.t('firstName message error');
                }else if(inputName == "lastName"){
                   errorMsgs[i] = Drupal.t('lastName message error');
                }else if(inputName == "phone"){
                   errorMsgs[i] = Drupal.t('phone message error');
                }else if(inputName == "street"){
                   errorMsgs[i] = Drupal.t('street message error');
                }else if(inputName == "postalCode"){
                   errorMsgs[i] = Drupal.t('postalCode message error');
                }else if(inputName == "city"){
                   errorMsgs[i] = Drupal.t('city message error');
                }else if(inputName == "country"){
                   errorMsgs[i] = Drupal.t('country message error');
                }else if(inputName == "company"){
                   errorMsgs[i] = Drupal.t('company message error');
                }
                else
                    errorMsgs[i] = labels["isRequired"].replace('!name', inputName);
                errorMarkup += "<li>"+errorMsgs[i]+"</li>";
            } else if (_this.val().length < 3 && this.name !="postalCode" && this.name !="country" && this.name !="phone") {
                inputName = $(elem).attr('name');
                _this.addClass('error');
                errorMsgs[i] = inputName+": "+labels["invalidCharactersLength"];
                errorMarkup += "<li>"+errorMsgs[i]+"</li>";
            } else if (this.name =="phone" && ( !erTel.test(_this.val()) || _this.val().length < 9)) {
                inputName = $(elem).attr('name');
                _this.addClass('error');
                errorMsgs[i] = labels["phoneNumberError"];
                errorMarkup += "<li>"+errorMsgs[i]+"</li>";
            } else if (this.name =="email") {
                inputName = $(elem).attr('name');
                var emailReg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                var emailTest = emailReg.test(_this.val());
                if (!emailTest) {
                  _this.addClass('error');
                  errorMsgs[i] = labels["invaliEmail"];
                  errorMarkup += "<li>"+errorMsgs[i]+"</li>";
                }
            } else if ($(this).parents("form").attr("id") == "pccustomers-changepassword-form") {
                var password = $("#pccustomers-changepassword-form #edit-password").val();
                var passwordConfirm = $("#pccustomers-changepassword-form #edit-passwordconfirm").val();
                if((password != passwordConfirm) && (this.name == "password")) {
                  $("#pccustomers-changepassword-form #edit-password").addClass('error');
                  $("#pccustomers-changepassword-form #edit-passwordconfirm").addClass('error');
                  errorMsgs[i] = labels["passwordMatch"];
                  errorMarkup += "<li>"+errorMsgs[i]+"</li>";
                }
            } else if (this.name =="vatNumber[number]") {
		if (globalEroorVat) {
                    inputName = $(elem).attr('name');
                    _this.addClass('error');
                    errorMsgs[i] = labels["vatNotNumber"];
                    errorMarkup += "<li>"+errorMsgs[i]+"</li>";
		}
            } else if (this.name == "postalCode") { 
                var country = $('#edit-country option:selected').val();
                var iso = isoList[country];
                value = $(this).val();
                inputName = $(elem).attr('name');
		var re = /^[0-9]+$/;
		if ((country != 0 && value.length != isoLengths[country] && iso != 'NL') || (iso == 'NL' && value.length > 7)) {
                    _this.addClass('error');
                    errorMsgs[i] = labels["invalidPostalCodeLenght"+iso];
                    errorMarkup += "<li>"+errorMsgs[i]+"</li>";
		} else if(country != 0 && iso != 'NL' && !re.test(value)) {
		    _this.addClass('error');
                    errorMsgs[i] = labels["invalidPostalCodeContent"+iso];
                    errorMarkup += "<li>"+errorMsgs[i]+"</li>"; 
		} 
                if (country != 0 && !value.length && country != 0) {
                  result = ValidatePostalCode(iso, value);
                  if(result == -1){
                    _this.addClass('error');
                    errorMsgs[i] = labels["invalidPostalCode"];
                    errorMarkup += "<li>"+errorMsgs[i]+"</li>";
                  }
                }
            } 
          }
          });  
          //start validation vatnumber
          if ($('#isUserCompany:checked').length > 0) {              
            var number = $('.number');
            var company = $('#companyInput');
            if (number.val() == '' || company.val() == '') {
                 e.preventDefault();
                  number.addClass('error');
                  company.addClass('error');
            }
            else{
                var vatNumberBA = $("#edit-vatnumber-number").val().replace(/\./g, "").replace(/ /g,"");
                var decision = false;
                $.each(vatFormats, function(c, obj){
                    $.each(obj, function(t, dt){
                        if (t == $('#edit-vatnumber-country').val() && $("#edit-vatnumber-number").val().length == dt) {
                            decision = true;
                        }
                    });
                });
		switch($('#edit-vatnumber-country').val()) {
            	    case 'BE':
                        decision = (vatNumberBA.charAt(0) == 0) ? decision : false;
            	    break;
            	    case 'LU':
                        decision = ($.isNumeric(vatNumberBA)) ? decision : false;
	            break;
		    case 'NL':
			var re = /^[0-9]{9}B[0-9]{2}$/;
    			decision = re.test(vatNumberBA);
		    break;
		    case 'FR':
                        var re = /^[0-9A-Z]{2}[0-9]{9}$/;
                        decision = re.test(vatNumberBA);
                    break;
            	    break
            	    default:
            	        decision = decision;
            	    break;
         	}
                if (decision == false) {
		    globalEroorVat = true;
                    $("#edit-vatnumber-number").addClass('error');
                    //$("#edit-vatnumber-number").val('');
                    var vatplaceholder = Drupal.t('insert a valid vat number please');
		    labels["vatNotNumber"] = vatplaceholder;
                    $('.customErrors').remove();
                    if ($('.messages').length == 1){
                        $('.region-content').before('<div class="messages error"><ul><li class="customErrors">'+vatplaceholder+'</li></ul></div>');
                    } else {
                        $('.messages ul').append('<li class="customErrors">caca'+vatplaceholder+'</li>');
                    }
                    $('html, body').animate({
                        scrollTop:$(".messages.error").offset().top
                    }, 'slow');
                    return false;
                } 
            }
          }
          //end validation vatnumber
          errorMarkup += "</ul></div>";
          if(errorMsgs.length != 0 ) {
            e.preventDefault();
            $( "#content h1:first" ).after( errorMarkup );
            $('html, body').animate({
              scrollTop:$(".messages.error").offset().top
            }, 'slow');
          }
      });

      /* ========== Register form validation ========== */
      $('.register-button').click(function (e) {
        $('.messages.error').remove();
        $('#content form .required').removeClass("error");
        var errorMarkup = "<div class='messages error'><ul>";
        var errorMsgs = new Array();

        $('#content form .last-item .required').each(function(i, elem) {
          var _this = $(this);
          var inputName;
          
          if(_this.val() == "") {
            inputName = $(elem).attr('name');
            _this.addClass('error');
            errorMsgs[i] = labels["isRequired"].replace('!name', inputName);
            errorMarkup += "<li>"+errorMsgs[i]+"</li>";
            } else if (this.name == "emailnew") {
              inputName = $(elem).attr('name');
              var emailReg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
              var emailTest = emailReg.test(_this.val());
              if (!emailTest) {
                _this.addClass('error');
                errorMsgs[i] = labels["invaliEmail"];
                errorMarkup += "<li>"+errorMsgs[i]+"</li>";
              }
            } else if ( this.name =="newpassword" && _this.val().length < 5 ) {
                inputName = $(elem).attr('name');
                _this.addClass('error');
                errorMsgs[i] = inputName+": "+labels["newpassword"];
                errorMarkup += "<li>"+errorMsgs[i]+"</li>";
            }
        });

        errorMarkup += "</ul></div>";
        if(errorMsgs.length != 0 ) {
          e.preventDefault();
          $( "#content h1:first" ).after( errorMarkup );
          $('html, body').animate({
            scrollTop:$(".messages.error").offset().top
          }, 'slow');
        }        
      }); 
      
      /* ========== Login form validation ========== */
      $('.login-button').click(function (e) {
        $('.messages.error').remove();
        $('#content form .required').removeClass("error");
        var errorMarkup = "<div class='messages error'><ul>";
        var errorMsgs = new Array();

        $('#content form .first-item .required').each(function(i, elem) {
          var _this = $(this);
          var inputName;
          
          if(_this.val() == "") {
            inputName = $(elem).attr('name');
            _this.addClass('error');
            errorMsgs[i] = labels["isRequired"].replace('!name', inputName);
            errorMarkup += "<li>"+errorMsgs[i]+"</li>";
            } else if (this.name =="email") {
              inputName = $(elem).attr('name');
              var emailReg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
              var emailTest = emailReg.test(_this.val());
              if (!emailTest) {
                _this.addClass('error');
                errorMsgs[i] = labels["invaliEmail"];
                errorMarkup += "<li>"+errorMsgs[i]+"</li>";
              }
            }
        }); 

        errorMarkup += "</ul></div>";
        if(errorMsgs.length != 0 ) {
          e.preventDefault();
          $( "#content h1:first" ).after( errorMarkup );
          $('html, body').animate({
            scrollTop:$(".messages.error").offset().top
          }, 'slow');
        }        
      });  
      
      /* ========== PCCUSTOMER isUserCompany ========== */
      jQuery("#isUserCompany").click(function(e) {
        if(jQuery(this).is(':checked'))  {
          jQuery('#companyInput , #edit-vatnumber-number').addClass('required');
        } else {
          jQuery('#companyInput , #edit-vatnumber-number').removeClass('required');
        }
      }); 
    });

/* ========== Validate PostalCode ========== */  
function ValidatePostalCode(iso,value) {
    switch (iso){
      case 'NL' : valid = value.search(/^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/);
      break;
      case 'FR' : valid = value.search(/^(F-)?((2[A|B])|[0-9]{2})[0-9]{3}$/);
      break;
      case 'LU' : valid = value.search(/^[1-9]{1}[0-9]{3}$/);
      break;
      case 'BE' : valid = value.search(/^[1-9]{1}[0-9]{3}$/);
      break;
      default : valid = 'x';
    }
    return valid;
  }
    
  Drupal.behaviors.pccustomers= {
    detach: function (context) {
    },
    attach: function(context, settings) {
    var UserCompany;

    /* display  vat & company input afther click box */
    $("#isUserCompany").live('click', function () {
        if (this.checked){
            UserCompany = "yes";
        } else {
            UserCompany = "no";
        }
    });
    
         $('#pccustomers-newaddress-billingaddresses-form').submit(function (e) {
                           var number = $('.number');
                           var company = $('#companyInput');
                           if (UserCompany == "yes") {
                               if (number.val() == '' || company.val() == '') {
                                   e.preventDefault();
                                    number.addClass('error');
                                    company.addClass('error');

                               }
                           }
           });
        
        
       $('#edit-country').change(function () {
                var url = Drupal.settings.basePath + '?q=js/country/' + $(this).val();
                $.getJSON(url, null, function (data) {
                    $('#edit-vatnumber-country').val(data.vatPrefix).trigger('change');
                });
            });
    }
  }
   $('#edit-vatnumber-country').val('');
   if ($('#edit-country').val() != 0) {
       var url = Drupal.settings.basePath + '?q=js/country/' + $("#edit-country").val();
           $.getJSON(url, null, function (data) {
               $('#edit-vatnumber-country').val(data.vatPrefix).trigger('change');
       });
   }
})(jQuery);

function pccustomers_login_form_submit(form,triggeringElement) {
  var url = form.attr('action');
  var data = form.serialize();

  form.css('cursor', 'wait');

  if (triggeringElement) {
    data = '_triggering_element_name=' + triggeringElement.attr("name") + '&' + data;
  }

  data = data + '&op=ajax';

  jQuery.ajax({
    type: 'POST',
    url: url,
    data: data,
    success: function(data){
      form.html(jQuery('#' + form.attr('id'), data).html());
      Drupal.attachBehaviors(form);
    },
    complete: function (){
      form.css('cursor', 'default');
    }
  });
};



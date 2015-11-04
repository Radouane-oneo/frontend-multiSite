(function ($) {
    $(document).ready(function () {
      if($('#pccustomers-address-billingaddresses-form')[0]){
      }
      var vatFormats = [{'BE': 10},{'NL' : 12},{'LU' : 8},{'FR' : 11}];
      $('#pccustomers-address-billingaddresses-form #edit-vatnumber-number').blur(function(){
            if ($('#edit-vatnumber-number').val() !='' && $('.country').val() != '') {
                var vatNumberBA = $("#edit-vatnumber-number").val().replace(/\./g, "").replace(/ /g,"");
                var decision = false;
                $.each(vatFormats, function(c, obj){
                    $.each(obj, function(t, dt){
                        if (t == $('#edit-vatnumber-country').val() && $("#edit-vatnumber-number").val().length == dt) {
                            decision = true;
                        }
                    });
                });
                if (decision == false) {
                    number.addClass('error');
                    number.val('');
                    var vatplaceholder = Drupal.t('insert a valid vat number please');
                    $('.customErrors').remove();
                    if ($('.messages').length == 0){
                        $('.region-content').before('<div class="messages error"><ul><li class="customErrors">'+vatplaceholder+'</li></ul></div>');
                    } else {
                        $('.messages ul').append('<li class="customErrors">'+vatplaceholder+'</li>');
                    }
                    $('html, body').animate({
                        scrollTop:$(".messages.error").offset().top
                    }, 'slow');
                } else {
                    $.ajax({
                        type: 'GET',
                        url: Drupal.settings.basePath +'checkout/getBillingAccoutFromVat',
                        data: { 'vatNumber': $('#edit-vatnumber-country').val()+vatNumberBA },
                        dataType: 'json',
                        success: function (data){
                            if (data.code == 200 && $.isEmptyObject(data.data) == false) {
                                $('#edit-vatnumber-number').addClass('error');
                                $('#edit-vatnumber-number').val('');
                                $.fancybox({content : $('#popUpContainer').html(),
                                    openEffect  : 'none',
                                    closeEffect : 'none',
                                    width    : 330,
                                    height   : 100,
                                    afterClose : function(){
                                    }
                                });
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
          $('.messages.error').remove();
          $('#content form .required').removeClass("error");
          var errorMarkup = "<div class='messages error'><ul>";
          var errorMsgs = new Array();

          $('#content form input.required, #content form select.required').each(function(i, elem) {
            var _this = $(this);
            var inputName;
            if(_this.val() == "" || _this.val() == 0) {
              inputName = $(elem).attr('name');
              _this.addClass('error');
              errorMsgs[i] = labels["isRequired"].replace('!name', inputName);
              errorMarkup += "<li>"+errorMsgs[i]+"</li>";
            } else if (_this.val().length < 3 && this.name !="country" && this.name !="phone") {
                inputName = $(elem).attr('name');
                _this.addClass('error');
                errorMsgs[i] = inputName+": "+labels["invalidCharactersLength"];
                errorMarkup += "<li>"+errorMsgs[i]+"</li>";
            } else if (this.name =="phone" && (isNaN(_this.val()) || _this.val().length != 9)) {
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
            } else if (this.name =="vatNumber[number]" && isNaN(_this.val())) {
                inputName = $(elem).attr('name');
                _this.addClass('error');
                errorMsgs[i] = labels["vatNotNumber"];
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
   console.log('herer');
   if ($('#edit-country').val() != 0) {
       var url = Drupal.settings.basePath + '?q=js/country/' + $(this).val();
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



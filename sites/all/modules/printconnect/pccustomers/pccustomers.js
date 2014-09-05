(function ($) {

  Drupal.behaviors.pccustomers= {
    detach: function (context) {

    },
    attach: function(context, settings) {
      var request;
      /*
      $('#pccustomers-login-form .form-item-options input[type="radio"]').change(function(){
        pccustomers_login_form_submit($('#pccustomers-login-form'), $(this));
      });
*/
//      $('.customer-email').keyup(function(){
//        var textfield = $(this);
//        if (request){
//          request.abort();
//        }
//        if (this.timer) {
//          clearTimeout(this.timer);
//        }
//        this.timer = setTimeout(function () {
//          request = $.getJSON('/js/myprintconnect/exists/' + textfield.val(), null, function(data){
//            if(data){
//              textfield.addClass('validated');
//            }
//            else{
//              textfield.removeClass('validated');
//            }
//          })
//        }, 1000);
//      });
//
//      $('.customer-email').change(function(){
//        if (request){
//          request.abort();
//        }
//
//        request = $.getJSON('/js/myprintconnect/exists/' + $(this).val(), null, function(data){
//          if(data){
//            $(this).addClass('found');
//          }
//          else{
//            $(this).removeClass('found');
//          }
//        });
//      });
      /*
      $('#pccustomers-login-form .customer-email').change(function(){
        $.getJSON('/js/myprintconnect/exists/' + $(this).val(), null, function(data){
          if(data){
            $('#pccustomers-login-form .register').hide();
            $('#pccustomers-login-form .login').show();
          }
          else{
            $('#pccustomers-login-form .register').show();
            $('#pccustomers-login-form .login').hide();
          }
        });
      });
*/
      // Load the vat prefix from the default select country
      var countryId = $('#pccustomers-address-form .form-item-country select :selected, #pccustomers-newaddress-form .form-item-country select :selected').val();
      if (!isNaN(countryId)) {
        var url = '/js/country/' + countryId;
        $.getJSON(url, null, function (data){
          $('.form-item-vatNumber .country').val(data.vatPrefix);
        });
      }

      // Change the vat prefix when change the country
      $('#pccustomers-address-form .form-item-country select, #pccustomers-newaddress-form .form-item-country select').once().change(function() {
        var url = '/js/country/' + $(this).val();
        $.getJSON(url, null, function (data){
          $('.form-item-vatNumber .country').val(data.vatPrefix);
        });
      });
      
        /* 
      $('a.forgot-password').fancybox({
        width:400,
        height:300,
        padding: 0,
        margin: 0,
        scrolling: false,
        autoScale: true,
        hideOnOverlayClick: true,
        autoDimensions: true,
        onComplete: function(){
          Drupal.attachBehaviors();
        }
      });
         */

    }
  }

})(jQuery);

function pccustomers_login_form_submit(form,triggeringElement) {
  //var fers_login_form_submit(orm = $('#pccheckout-login-form');
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



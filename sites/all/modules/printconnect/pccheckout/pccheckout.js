(function ($) {

    $(".button_null_address_vat").live("click",function(){
          $('#light').hide();
             $('#fademe').hide();
            $("input[name='invoice[address][current][vatNumber][number]']").val(''); 
    });

  $("#isUserCompany").live('click', function(){
      if(this.checked){
          $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").show();
      }else {
          $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").hide();
          
          $("#companyInput").val("");
          $("#vatNumber").val("");
      }
  });

  $(document).ready(function(){
    $(".selectBilling2").select2();
      if(typeof $("#isUserCompany")[0] != "undefined"){
          if($("#companyInput").val() != ''){
              $("#isUserCompany")[0].checked = true;
              $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").show();
          }else {
              $("#isUserCompany")[0].checked = false;
              $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").hide();
          }
      }

      /***********Script pour remplacer fieldset par div***********/
            
            var fieldsetContent = $("#invoice-address > legend").html();
            $("#invoice-address > legend").replaceWith("<div class='legend'>" + fieldsetContent + "</div>");
            var fieldsetContent = $("#shipping-address > legend").html();
            $("#shipping-address > legend").replaceWith("<div class='legend'>" + fieldsetContent + "</div>");
      

  });
  
  $.fn.checkoutOverlay = function(overlay) {
    $(this).once(function(){

      overlay = overlay.clone();
      overlay.show();

      overlay.css('display', 'block');
      overlay.css('position', 'absolute');
      overlay.css('z-index', '1000');

      overlay.css('top', $(this).attr('offsetTop'));
      overlay.css('left', $(this).attr('offsetLeft') );
      overlay.css('width', $(this).outerWidth());
      overlay.css('height', $(this).outerHeight());


      $('.filler', overlay).css('width', $(this).outerWidth());
      $('.filler', overlay).css('height', $(this).outerHeight());

      $(this).parent().append(overlay);
      overlay.position($(this).position());
    });
  }


  Drupal.behaviors.pccheckout = {
    detach: function (context) {

    },
    attach: function(context, settings) {
    if($("#pccheckout-payment-form table ")){
          var width = (662/$("#pccheckout-payment-form  table.payment-methods-table tbody tr").length)-21.2;
         // var width = 122.4;
          $('#pccheckout-payment-form').find('table.payment-methods-table tbody tr').css('width', width+'px');
          $('#pccheckout-payment-form').find('table.payment-methods-table tbody tr.last-child').css('border-right', 'none');
      }
      // Toggle shipping and invoice form

//      $('#pccheckout-invoiceanddelivery-form .summary .toggle').once().click(function(){
//      var url = $(this).attr('href');
//      var target = url.substring(url.indexOf('#')); 
//      $('form fieldset.collapsible:not(".collapsed")').each(function(){
//         Drupal.toggleFieldset($(this));
//       })
//        Drupal.toggleFieldset($(target));
//       //$.scrollTop($('#invoice-address').scrollTop());
//      return false;
//      });
//
//      $('#pccheckout-checkout-form').submit(function(){
//        $('.payment .right', this).checkoutOverlay($('.overlay'));
//        return true;
//      });
      
   $(".popupOverlay").live('click', function(){
   $('#popup_overlay.popin_overlay').css('display', 'block');
   });
  
    $(".headpopin .closeme").live('click', function(){
    $('#popup_overlay.popin_overlay').css('display', 'none');
    });
       jQuery('#pccheckout-invoiceanddelivery-form fieldset.tohiding').hide();
       //jQuery('#pccheckout-invoiceanddelivery-form fieldset.tohiding div').hide();
       var hash = location.hash;
       if(hash!=""){
        jQuery("#pccheckout-invoiceanddelivery-form fieldset.tohiding" + hash ).show();
        //jQuery("#pccheckout-invoiceanddelivery-form fieldset.tohiding" + hash + " div").show();
       }
      $('#pccheckout-invoiceanddelivery-form .summary .toggle').once().click(function(){
        var url = jQuery(this).attr('href');
       var target = url.substring(url.indexOf('#'));
       jQuery('form fieldset.tohiding').hide();
       //jQuery('form fieldset.tohiding div').hide();
       jQuery(target).show();
       //jQuery(target + " div").show();
       jQuery(".select2-display-none").hide();
      });

      $('#pccheckout-checkout-form').submit(function(){
        $('.payment .right', this).checkoutOverlay($('.overlay'));
        return true;
      });
      
   
      $('#pccheckout-checkout-form .form-item-login-options input[type="radio"]').change(function(){
      
        pccheckout_submit_form($('#pccheckout-checkout-form'), $(this));
      });


      $("#pccheckout-checkout-form").ajaxStart(function(){
        $(this).css('cursor', 'progress');
      });

      $("#pccheckout-checkout-form").ajaxStop(function(){
        $(this).css('cursor', 'default');
      });

      if ($.fancybox){
        $('#pccheckout-checkout-form .open').fancybox({
          width: 800,
          height: 700,
          padding: 0,
          margin: 0,
          scrolling: false,
          autoScale: false,
          hideOnOverlayClick: false,
          autoDimensions: false
        });
      }
      $('#pccheckout-checkout-form .add').click(function(){
        setDeliveryAddress(0);
        return false;
      });

      $('#pccheckout-checkout-form .add').click(function(){
        setInvoiceAddress(0);
        return false;
      });

      $('#pccheckout-checkout-form .form-item-delivery-address select').change(function(){
        setDeliveryAddress($(this).val());
      });

      $('#pccheckout-checkout-form .form-item-shipping-delivery-address select').change(function(){
        setDeliveryAddress($(this).val());
      });
      $('#pccheckout-checkout-form .form-item-payment-address select').once().change(function(){
        setInvoiceAddress($(this).val());
      });
      
      $('#pccheckout-checkout-form .form-item-invoice-address-address select').once().change(function(){
        setInvoiceAddress($(this).val());
      });


      $('#pccheckout-checkout-form .form-item-shipping-giftvouchers-address-address select').once().change(function(){
        setGiftVouchersAddress($(this).val());
      });
      

      $('#pccheckout-checkout-form .form-item-payment-country select' ).once().change(function(){
        var url = '/js/country/' + $(this).val();
        $.getJSON(url, null, function (data){
          $('.form-item-payment-vatNumber .country').val(data.vatPrefix).trigger('change');
        });
      });

      $('#pccheckout-checkout-form .form-item-invoice-address-country select' ).once().change(function(){
        var url = Drupal.settings.basePath  + '?q=js/country/' + $(this).val();
        $.getJSON(url, null, function (data){
          $('.form-item-invoice-address-vatNumber .country').val(data.vatPrefix).trigger('change');
        });
      });

      $('#pccheckout-invoiceanddelivery-form .form-item-invoice-address-current-country select' ).once().change(function(){
        var url = Drupal.settings.basePath  + '?q=js/country/' + $(this).val();
        $.getJSON(url, null, function (data){
          $('.form-item-invoice-address-current-vatNumber .country').val(data.vatPrefix).trigger('change');
        });
      });

      /*
      $('#pccheckout-checkout-form .payment-methods input[type="radio"]' ).change(function(){
        pccheckout_submit_form($('#pccheckout-checkout-form'), $(this));
      });

      $('#pccheckout-checkout-form input[name="payment[credit][use]"]' ).change(function(){
        pccheckout_submit_form($('#pccheckout-checkout-form'), $(this));
      });
      
      $('#pccheckout-checkout-form input[name="payment[credit][amount]"]' ).change(function(){
        pccheckout_submit_form($('#pccheckout-checkout-form'), $(this));
      });
        


*/

      $('#pccheckout-checkout-form .payment-methods input' ).change(function(){
        //      window.location.href='/checkout/payment/' + $(this).val();
        /*
        var url = '/js/cart/set/paymentMethod/' + $(this).val();
        $.getJSON(url, null, function(data){
           $('#pccheckout-payment-form .vat, #block-pccheckout-cart .vat').html($(data.vatAmount));
           $('#pccheckout-payment-form .total-excl-vat, #block-pccheckout-cart .total-excl-vat').html(data.subTotalAmount);
           $('#pccheckout-payment-form .total-incl-vat, #block-pccheckout-cart .total-incl-vat').html(data.totalAmount);
        });
  */
        });
      /*
      $('#pccheckout-checkout-form .payment-invoice-wrapper').hide();

      if ($("#pccheckout-checkout-form .form-item-needinvoice input").attr('checked')){
        $('#pccheckout-checkout-form .payment-invoice-wrapper').show();
      }
*/


      $("#pccheckout-checkout-form .form-item-payment-needinvoice input").change(function(){
        toggleInvoiceAddress();
        $('#pccheckout-checkout-form .form-type-vatfield').vatfieldValidate();
        pccheckout_submit_form($('#pccheckout-checkout-form'), $('#pccheckout-checkout-form .form-type-vatfield .number'));
      });


      $(" #pccheckout-checkout-form .form-item-invoice-needinvoice input").change(function(){
        toggleInvoiceAddress();
      //  $('#pccheckout-checkout-form .form-type-vatfield').vatfieldValidate();
      //        pccheckout_submit_form($('#pccheckout-checkout-form'), $('#pccheckout-checkout-form .form-type-vatfield .number'));
      });


      /*
      $('#pccheckout-checkout-form .form-type-vatfield input').once().change(function(){
        $('#pccheckout-checkout-form .form-type-vatfield').vatfieldValidate();
        pccheckout_submit_form($('#pccheckout-checkout-form'), $('#pccheckout-checkout-form .form-type-vatfield .number'));
      });

      $('#pccheckout-checkout-form .form-type-vatfield').vatfieldValidate();
*/  

      $('#pccheckout-checkout-form .form-item-payment-credit-amount').appendTo('#pccheckout-checkout-form .form-type-radio.form-item-payment-credit-use:first');

    //   $('#pccheckout-checkout-form .form-type-vatfield').bind('validated', function(event, result){
    //alert(result);
    //   pccheckout_submit_form($('#pccheckout-checkout-form'), $('.number', this));
    // });

    /*
       $('#pccheckout-checkout-form a.forgot-password').fancybox({
                width:400,
                height: 300,
                padding: 0,
                margin: 0,
                scrolling: false,
                autoScale: true,
                hideOnOverlayClick: true,
                autoDimensions: false,
                onComplete: function(){
                  Drupal.attachBehaviors();
                }
      });
*/

    }
  }


  function setDeliveryAddress(id){
    if (id == 0) {
      $('#pccheckout-checkout-form .form-item-shipping-delivery-address select').val(0);
      $('#pccheckout-checkout-form .form-item-shipping-delivery-company input').val('');
      $('#pccheckout-checkout-form .form-item-shipping-delivery-name input').val('');
      $('#pccheckout-checkout-form .form-item-shipping-delivery-country select').val(0);
      $('#pccheckout-checkout-form .form-item-shipping-delivery-street input').val('');
      $('#pccheckout-checkout-form .form-item-shipping-delivery-postalCode input').val('');
      $('#pccheckout-checkout-form .form-item-shipping-delivery-city input').val('');
      $('#pccheckout-checkout-form .form-item-shipping-delivery-phone input').val('');
    }
    else{
      var url = Drupal.settings.basePath + '?q=js/myprintconnect/address/' + id;
      $.getJSON(url, null, function (data){
        $('#pccheckout-checkout-form .form-item-shipping-delivery-address select').val(data.id);
        $('#pccheckout-checkout-form .form-item-shipping-delivery-company input').val(data.company);
        $('#pccheckout-checkout-form .form-item-shipping-delivery-name input').val(data.name);
        $('#pccheckout-checkout-form .form-item-shipping-delivery-country select').val(data.country);
        $('#pccheckout-checkout-form .form-item-shipping-delivery-street input').val(data.street);
        $('#pccheckout-checkout-form .form-item-shipping-delivery-postalCode input').val(data.postalCode);
        $('#pccheckout-checkout-form .form-item-shipping-delivery-city input').val(data.city);
        $('#pccheckout-checkout-form .form-item-shipping-delivery-phone input').val(data.phone);
      });
    }
  }

  function setInvoiceAddress(id){
    if (id == 0) {
      $('#pccheckout-checkout-form .form-item-payment-address select').val(0);
      $('#pccheckout-checkout-form .form-item-payment-company input').val('');
      $('#pccheckout-checkout-form .form-item-payment-name input').val('');
      $('#pccheckout-checkout-form .form-item-payment-country select').val(0);
      $('#pccheckout-checkout-form .form-item-payment-street input').val('');
      $('#pccheckout-checkout-form .form-item-payment-postalCode input').val('');
      $('#pccheckout-checkout-form .form-item-payment-city input').val('');
      $('#pccheckout-checkout-form .form-item-payment-phone input').val('');
      $('#pccheckout-checkout-form .form-item-payment-vatNumber .country').val('');
      $('#pccheckout-checkout-form .form-item-payment-vatNumber .number').val('');
      
      $('#pccheckout-checkout-form .form-item-invoice-address-address select').val(0);
      $('#pccheckout-checkout-form .form-item-invoice-address-company input').val('');
      $('#pccheckout-checkout-form .form-item-invoice-address-name input').val('');
      $('#pccheckout-checkout-form .form-item-invoice-address-country select').val(0);
      $('#pccheckout-checkout-form .form-item-invoice-address-street input').val('');
      $('#pccheckout-checkout-form .form-item-invoice-address-postalCode input').val('');
      $('#pccheckout-checkout-form .form-item-invoice-address-city input').val('');
      $('#pccheckout-checkout-form .form-item-invoice-address-phone input').val('');
      $('#pccheckout-checkout-form .form-item-invoice-address-vatNumber .country').val('');
      $('#pccheckout-checkout-form .form-item-invoice-address-vatNumber .number').val('');
    }
    else{
      var url = Drupal.settings.basePath + '?q=js/myprintconnect/address/' + id;
      $.getJSON(url, null, function (data){
        $('#pccheckout-checkout-form .form-item-payment-address select').val(data.id);
        $('#pccheckout-checkout-form .form-item-payment-company input').val(data.company);
        $('#pccheckout-checkout-form .form-item-payment-name input').val(data.name);
        $('#pccheckout-checkout-form .form-item-payment-country select').val(data.country);
        $('#pccheckout-checkout-form .form-item-payment-street input').val(data.street);
        $('#pccheckout-checkout-form .form-item-payment-postalCode input').val(data.postalCode);
        $('#pccheckout-checkout-form .form-item-payment-city input').val(data.city);
        $('#pccheckout-checkout-form .form-item-payment-phone input').val(data.phone);
        $('#pccheckout-checkout-form .form-item-payment-vatNumber .country').val(data.vatNumber.country);
        $('#pccheckout-checkout-form .form-item-payment-vatNumber .number').val(data.vatNumber.number);
        $('#pccheckout-checkout-form .form-item-payment-vatNumber .number').trigger('change');
        
        $('#pccheckout-checkout-form .form-item-invoice-address-address select').val(data.id);
        $('#pccheckout-checkout-form .form-item-invoice-address-company input').val(data.company);
        $('#pccheckout-checkout-form .form-item-invoice-address-name input').val(data.name);
        $('#pccheckout-checkout-form .form-item-invoice-address-country select').val(data.country);
        $('#pccheckout-checkout-form .form-item-invoice-address-street input').val(data.street);
        $('#pccheckout-checkout-form .form-item-invoice-address-postalCode input').val(data.postalCode);
        $('#pccheckout-checkout-form .form-item-invoice-address-city input').val(data.city);
        $('#pccheckout-checkout-form .form-item-invoice-address-phone input').val(data.phone);
        $('#pccheckout-checkout-form .form-item-invoice-address-vatNumber .country').val(data.vatNumber.country);
        $('#pccheckout-checkout-form .form-item-invoice-address-vatNumber .number').val(data.vatNumber.number);
      // $('#pccheckout-checkout-form .form-item-invoice-address-vatNumber .number').trigger('change');
      });
    }
    $('#pccheckout-checkout-form .form-type-vatfield').vatfieldValidate();
  // pccheckout_submit_form($('#pccheckout-checkout-form'), $('#pccheckout-checkout-form .form-type-vatfield .number'));
  }

  function setGiftVouchersAddress(id){
    if (id == 0) {
      $('#pccheckout-checkout-form .form-item-shipping-giftvouchers-address-address select').val(0);
      $('#pccheckout-checkout-form .form-item-shipping-giftvouchers-address-company input').val('');
      $('#pccheckout-checkout-form .form-item-shipping-giftvouchers-address-name input').val('');
      $('#pccheckout-checkout-form .form-item-shipping-giftvouchers-address-country select').val(0);
      $('#pccheckout-checkout-form .form-item-shipping-giftvouchers-address-street input').val('');
      $('#pccheckout-checkout-form .form-item-shipping-giftvouchers-address-postalCode input').val('');
      $('#pccheckout-checkout-form .form-item-shipping-giftvouchers-address-city input').val('');
      $('#pccheckout-checkout-form .form-item-shipping-giftvouchers-address-phone input').val('');
    }
    else{
      var url = Drupal.settings.basePath + '?q=js/myprintconnect/address/' + id;
      $.getJSON(url, null, function (data){
        $('#pccheckout-checkout-form .form-item-shipping-giftvouchers-address-address select').val(data.id);
        $('#pccheckout-checkout-form .form-item-shipping-giftvouchers-address-company input').val(data.company);
        $('#pccheckout-checkout-form .form-item-shipping-giftvouchers-address-name input').val(data.name);
        $('#pccheckout-checkout-form .form-item-shipping-giftvouchers-address-country select').val(data.country);
        $('#pccheckout-checkout-form .form-item-shipping-giftvouchers-address-street input').val(data.street);
        $('#pccheckout-checkout-form .form-item-giftvouchers-address-postalCode input').val(data.postalCode);
        $('#pccheckout-checkout-form .form-item-shipping-giftvouchers-address-city input').val(data.city);
        $('#pccheckout-checkout-form .form-item-shipping-giftvouchers-address-phone input').val(data.phone);
      });
    }
  }

  function toggleInvoiceAddress(){
    if ($("#pccheckout-checkout-form .form-item-payment-needinvoice input").attr('checked')){
      $('#pccheckout-checkout-form .payment-invoice-wrapper').slideDown();
    }
    else{
      $('#pccheckout-checkout-form .payment-invoice-wrapper').slideUp();
    }
    if ($("#pccheckout-checkout-form .form-item-invoice-needinvoice input").attr('checked')){
      $('#pccheckout-checkout-form .invoice-invoice-wrapper').slideDown();
    }
    else{
      $('#pccheckout-checkout-form .invoice-invoice-wrapper').slideUp();
    }
    
  }

})(jQuery);

function pccheckout_forgotpassword_callback(){
  jQuery.fancybox.close() ;
}


function pccheckout_picker_callback(pup){
  /*
  var picker = jQuery('#pccheckout-checkout-form .pup');
  jQuery('.id', picker).val(pup.id);
  jQuery('.country-code', picker).val(pup.countryCode);
  jQuery('.name', picker).html(pup.name);
  jQuery('.address', picker).html(pup.address  + '<br/>' + pup.postalCode + ' ' + pup.city);
  jQuery('.openinghours-container', picker).html(jQuery(pup.openingHours));
  Drupal.attachBehaviors(picker);

  picker.show();
  jQuery('#pccheckout-checkout-form .nopup').hide();
  */
  jQuery('#pccheckout-checkout-form .pup').replaceWith(pup.html);
  jQuery('#pccheckout-checkout-form input[name="shipping[pickup][id]"]').val(pup.id);  
  jQuery('#pccheckout-checkout-form input[name="shipping[pickup][country]"]').val(pup.countryCode);  
  

  jQuery.fancybox.close() ;
}


var pccheckoutRequest;

function pccheckout_submit_form(form,triggeringElement) {
  //var form = $('#pccheckout-login-form');


  jQuery('#pccheckout-checkout-form .payment .right').checkoutOverlay(jQuery('.overlay'));
  
  if (pccheckoutRequest){
    pccheckoutRequest.abort();
  }

  var url = form.attr('action');
  var data = form.serialize();

  form.css('cursor', 'wait');

  if (triggeringElement) {
    data = '_triggering_element_name=' + triggeringElement.attr("name") + '&' + data;
  }

  data = data + '&op=ajax';

  pccheckoutRequest = jQuery.ajax({
    type: 'POST',
    url: url,
    data: data,
    success: function(data){
      form.html(jQuery('#' + form.attr('id'), data).html());
      jQuery('#block-pccart-cart').html(jQuery('#block-pccart-cart', data).html());
      Drupal.attachBehaviors(form);
    },
    complete: function (){
      form.css('cursor', 'default');
    }
  });
};


function pccheckout_gateway_callback(url){
  jQuery.fancybox.close();
  window.location = url;
}

function pccheckout_gateway_cancel(url){
  jQuery.fancybox.close();
  history.go(-1);
}

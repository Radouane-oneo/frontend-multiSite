(function ($) {
  Drupal.behaviors.pcanalytics = {
    detach: function(context){
    
    },
    attach: function(context, settings){
      $('#pccart-cart-form .other a').click(function(){
        _gaq.push(['_trackEvent', 'basket', 'click', 'suggestion']);
      });
      $('#pccart-save-form input').click(function(){
        _gaq.push(['_trackEvent', 'basket', 'click', 'upgrade']);
      });

      $('#pccart-cart-form  .actions.copy a').click(function(){
        _gaq.push(['_trackEvent', 'basket', 'click', 'Verder_winkelen_boven']);
      });

      $('#pccart-cart-form  .actions.copy input').click(function(){
        _gaq.push(['_trackEvent', 'basket', 'click', 'Veilig_afrekenen_boven']);
      });
      /*
      $('#pccart-cart-form  .actions a').click(function(){
        _gaq.push(['_trackEvent', 'basket', 'click', 'Verder_winkelen_onder']);
      });

      $('#pccart-cart-form  .actions input').click(function(){
        _gaq.push(['_trackEvent', 'basket', 'click', 'Veilig_afrekenen_onder']);
      });
*/

      $('#pccart-cart-form  a.pcbpost-picker-link').click(function(){
        _gaq.push(['_trackEvent', 'basket', 'click', 'Afhaalpunt']);
      });

    }
  }
})(jQuery);;

 
function pcbpost_cart_callback(poi, html){
  jQuery('#pccart-cart-form .pup').html(html);
  jQuery('#pccart-cart-form input[name="cart[shipping][pup][id]"]').val(poi.Id);  
  jQuery('.pup').html(html);
  jQuery('input[name="cart[shipping][pup][id]"]').val(poi.Id);  
  jQuery('input[name="pcbpost[id]"]').val(poi.Id);  
  jQuery.get(Drupal.settings.basePath + 'index.php?q=pcbpost/set/pickuppoint/' + poi.Id );
  
}

function pcbpost_checkout_callback(poi, html){
  jQuery('form .pup').html(html);
  jQuery('form input[name="shipping[pickup][id]"]').val(poi.Id);  
  jQuery('input[name="pcbpost[id]"]').val(poi.Id); 
  jQuery.get(Drupal.settings.basePath + 'index.php?q=pcbpost/set/pickuppoint/' + poi.Id );
}

function pcbpost_checkout_invoiceanddelivery_callback(poi, html){  
  
  jQuery.get(Drupal.settings.basePath + 'index.php?q=pcbpost/set/pickuppoint/' + poi.Id , function(){
    location.reload();
  });
}


(function ($) {

  Drupal.behaviors.pcbpost = {
    detach: function (context) {

    },
    attach: function (context, settings) {
      if ($.fancybox){
        $('.pcbpost-picker-link', context).fancybox({
          width:980,
          height:660,
          padding: 0,
          margin: 0,
          scrolling: false,
          autoScale: false,
          hideOnOverlayClick: true,
          autoDimensions: true,
          modal: false,       
          onCleanup: function() {
          //     alert(selectedPoi.Name);
          }//,
        //        onComplete: function(){
        //          $.fancybox.hideActivity();
        //        },
        //        onStart: function(){
        //          $.fancybox.showActivity();
        //        }
        });    
      }    
    }
  }
})(jQuery);
;
(function ($) {

  Drupal.behaviors.pccart = {
    detach: function (context) {

    },
    attach: function (context, settings) {
      
      // $('#pccart-cart-form > div > .actions').once().clone().insertBefore($('#pccart-cart-form > div > fieldset'));
     
      /*
      $('#pccart-cart-form .shipping input[type="radio"]').once().change(function(){
        submitCartForm($(this));
      });
     */
      /*
      $('#pccart-cart-form .remove').once().click(function(){
        $(this).parents('.item').fadeOut();
        submitCartForm($(this));
        return false;
      });
      */
      /*
      $('#pccart-cart-form .add-discount').once().click(function(){
        submitCartForm($(this));
        return false;
      });
*/

   var count = 0;
   var visited = 0;
   var visitedControl = 0;
   var controlvalue = 4.99; 
   var livraisonvalue = 10;
   var previousVatPercentage = parseFloat($('#oldVat').html());
   var tvaSession = previousVatPercentage.toFixed(2);
   function reloadFormPcCart(){       
       var tvaActuel = 0;
       var tva = tvaSession;
       $('.cartItemsContainer > div > div').each(function(){
            var p = $(this).find('.price .value');
            var element = jQuery("<div></div>").append(p.html());
            element.find(".currency").remove();
            var price = element.text();
            price = parseFloat(price.replace(",", "."));
        
            var tvaValue = ($(this).find(".tvaCase").is(":checked"))? 0.06 : tvaSession;
            if ($(this).find(".tvaCase").is(":checked")){
                tva = 0.06;
                visited = 1;
                visitedControl = 1;
                count = count + 1;
            }
            tvaActuel = tvaActuel + price * tvaValue;
        });
        var livraison = $('#pccart-cart-form input[name="cart[shipping][type]"]:checked').val(); 
        if(livraison == 122)
            tvaActuel = tvaActuel + (livraisonvalue * tva);

        var control = $('#pccart-cart-form input[name="cart[checks][options]"]:checked').val();
        if(control == 1)
            tvaActuel = tvaActuel + (controlvalue * tva);
        //la somme total sans tva
        var totalWhole = $('#pccart-cart-form .subtotal .value .whole').text();
        var totalDecimals = $('#pccart-cart-form .subtotal .value .decimals').text();
        var total = totalWhole + '.' + totalDecimals
        total = parseFloat(total);
        
        var priceTotal = parseFloat(total) + tvaActuel; 
        priceTotal = priceTotal.toFixed(2);
        var priceTotalArray = priceTotal.split('.');        
        $('#pccart-cart-form .actions .value .whole').text(priceTotalArray[0]);
        $('#pccart-cart-form .actions .value .decimals').text(priceTotalArray[1]);
        
        tvaActuel = tvaActuel.toFixed(2);
        var tvaActuelArray = tvaActuel.split('.');
        $('#pccart-cart-form .priceblock .vat .value .whole').text(tvaActuelArray[0])
        $('#pccart-cart-form .priceblock .vat .value .decimals').text(tvaActuelArray[1]);
      //  $('#pccart-cart-form .vat').html('<span decimal_separator="," class="price"><span class="currency">€</span>&nbsp;<span class="value">'+tvaActuel +'</span></span>');
    } 
     
      function updatCartItemVat(cartItem, status) {
        $.post('cart/updatItemVat/id/'+cartItem+'/status/'+status,{},function(){
            
            
        });
        
      }
      
      $('#pccart-cart-form .tvaCase').once().click(function(){
        //recuperation de la valeur price
        var p = $(this).parents(".tva").siblings(".price").find(".value");
        var element = jQuery("<div></div>").append(p.html());
        element.find(".currency").remove();
        var price = element.text();
        price = parseFloat(price.replace(",", "."));
        p = $('#pccart-cart-form .vat .value');
        var elementTva = jQuery("<div></div>").append(p.html());
        elementTva.find(".currency").remove();
        var tvaOrigin = elementTva.text();
        tvaOrigin = parseFloat(tvaOrigin.replace(",", "."));
        if($(this).is(':checked')){
           if (confirm("Si vous choisissez le tva 6%, l'adresse de livraison sera en Belgique")) {
                updatCartItemVat($(this).attr('data-element'), 1);
                count = count + 1;
                var vat = price * 0.06;            
                var tvaActuel = tvaOrigin - (price * tvaSession) + vat;
                tvaActuel = tvaActuel.toFixed(2);
           }else{
                $(this).removeAttr("checked");
                return true;             
            } 
        }
        else
        {
            updatCartItemVat($(this).attr('data-element'), 0);
            count = count - 1;
            var vat = price * tvaSession;            
            var tvaActuel = tvaOrigin - (price * 0.06) + vat;
            tvaActuel = tvaActuel.toFixed(2);   
        }  
      
        var control = $('#pccart-cart-form input[name="cart[checks][options]"]:checked').val();
        if (count != 0 && (control == 1) && (visitedControl != 1) ){         
            tvaActuel = tvaActuel - controlvalue * tvaSession + controlvalue * 0.06;
            visitedControl = 1;
        }
        if (count == 0 && (control == 122 ) ){
            tvaActuel = tvaActuel - controlvalue * 0.06 + controlvalue * tvaSession;
            visitedControl = 0;
        }
        
        var livraison = $('#pccart-cart-form input[name="cart[shipping][type]"]:checked').val();         
        if (count != 0 && (livraison == 122) && (visited != 1) ){         
            tvaActuel = tvaActuel - livraisonvalue * tvaSession + livraisonvalue * 0.06;
            visited = 1;
        }
        if (count == 0 && (livraison == 122 ) ){
            tvaActuel = tvaActuel - livraisonvalue * 0.06 + livraisonvalue * tvaSession;
            visited = 0;
        }
        tvaActuel = parseFloat(tvaActuel).toFixed(2);
        tvaActuel = tvaActuel.toString();          
        var tvaActuelArray = tvaActuel.split('.');
        $('#pccart-cart-form .priceblock .vat .value .whole').text(tvaActuelArray[0])
        $('#pccart-cart-form .priceblock .vat .value .decimals').text(tvaActuelArray[1]);
        //la somme total sans tva
        var totalWhole = $('#pccart-cart-form .subtotal .value .whole').text();
        var totalDecimals = $('#pccart-cart-form .subtotal .value .decimals').text();
        var total = totalWhole + '.' + totalDecimals
        total = parseFloat(total);
        tvaActuel = parseFloat(tvaActuel);
        var priceTotal = parseFloat(total) + tvaActuel; 
        priceTotal = priceTotal.toFixed(2);        
        var priceTotalArray = priceTotal.split('.');
        
        $('#pccart-cart-form .actions .value .whole').text(priceTotalArray[0]);
        $('#pccart-cart-form .actions .value .decimals').text(priceTotalArray[1]);
    
      }); 
      
      
      
      $('#pccart-cart-form .discount input[type="text"]').bind("keydown", function(event) {
        var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
        if (keycode == 13) {
          event.preventDefault();
          event.stopPropagation();
          $('#pccart-cart-form .discount input[type="submit"]').click();
          return false;
        } else  {
          return true;
        }
      });
      if ($.fancybox){
        $('#pccart-cart-form .shipping .picker').fancybox({
          width: 800,
          height: 740,
          padding: 0,
          margin: 0,
          scrolling: false,
          autoScale: false,
          hideOnOverlayClick: false,
          autoDimensions: false,
          onStart: function() {
            jQuery.fancybox.showActivity();
          }
        });

        $('#pccart-cart-form .item .designtool').fancybox({
          width: 1024,
          height: 780,
          padding: 5,
          margin: 0,
          scrolling: false,
          autoScale: false,
          hideOnOverlayClick: false,
          autoDimensions: false,
          modal: false,
          onStart: function() {
          //jQuery("#fancybox-outer").append("<div id='dt_preloader'></div>");
          },
          onComplete: function(){
          //  jQuery("#fancybox-outer").find("#dt_preloader").remove();
          }
        });
      }

      $('#block-pccart-cart .description .tooltip').parent().hover(
        function () {
          $('#block-pccart-cart .tooltip').hide();
          $('.tooltip',this).fadeIn('slow');
        },
        function () {
          $('.tooltip',this).fadeOut('slow');
        }
        );

      /*
      $.fancybox({
        width: 800,
        height: 700,
        padding: 0,
        margin: 0,
        scrolling: false,
        autoScale: false,
        hideOnOverlayClick: false,
        autoDimensions: true,
        content:'#uploadrequired'
      });
*/
      //$.fancybox.init();
      //$.fancybox({'type': 'inline','content': $('.uploadrequired').html()});

      $('#pccart-cart-form input[name="message"]').once().each(function(){
        alert($(this).val());
      });

    }
  }
})(jQuery);

var pccartRequest;

function submitCartForm(triggeringElement) {
  if (pccartRequest){
    pccartRequest.abort();
  }

  var form = jQuery('#pccart-cart-form');
  var url = form.attr('action');
  var data = form.serialize();

  form.css('cursor', 'wait');
  

  if (triggeringElement) {
    data = '_triggering_element_name=' + triggeringElement.attr("name") + '&' + data;
  // data = triggeringElement.attr("name") + '=' + triggeringElement.attr("value") + '&' + data;
  }

  data = data + '&op=ajax';

  pccartRequest=jQuery.ajax({
    type: "POST",
    url: url,
    data: data,
    success: function(data){
      form.html(jQuery('#pccart-cart-form', data).html());
      jQuery('#block-pccart-cart').html(jQuery('#block-pccart-cart', data).html());
      jQuery('#block-pccart-save').html(jQuery('#block-pccart-save', data).html());
      jQuery('#block-pccart-indicator').html(jQuery('#block-pccart-indicator', data).html());

      Drupal.attachBehaviors(form);
      Drupal.attachBehaviors(jQuery('#block-pccart-cart'));
      Drupal.attachBehaviors(jQuery('#block-pccart-save'));
      Drupal.attachBehaviors(jQuery('#block-pccart-indicator'));
    },
    complete: function (){
      form.css('cursor', 'default');
    }
  });
}

function refreshCartForm(triggeringElement) {
  var form = jQuery('#pccart-cart-form');
  var url = form.attr('action');
  jQuery.ajax({
    type: "GET",
    url: url,
    success: function(data){
      form.html(jQuery('#pccart-cart-form', data).html());
      Drupal.attachBehaviors(form);
    }
  });
}

function pccartPickerCallback(pup){
  /*
  var picker = jQuery('#pccart-cart-form .shipping');
  jQuery('input[name="pup[id]"]', picker).val(pup.id);
  jQuery('input[name="pup[countryCode]"]', picker).val(pup.countryCode);
  var radio =  jQuery('input.pup', picker);
  //var radio = jQuery('#edit-cart-shipping-type-29');
  radio.attr("checked", "checked");
  submitCartForm(radio);
  jQuery.fancybox.close() ;
  */
  /*
  var picker = jQuery('#pccart-cart-form  .pup');
  jQuery('.id', picker).val(pup.id);
  jQuery('.country-code', picker).val(pup.countryCode);
  jQuery('.name', picker).html(pup.name);
  jQuery('.address', picker).html(pup.address  + '<br/>' + pup.postalCode + ' ' + pup.city);
  jQuery('.openinghours-container', picker).html(jQuery(pup.openingHours));
  Drupal.attachBehaviors(picker);

  picker.show();
  jQuery('#pccart-cart-form  .nopup').hide();
  */
  jQuery('#pccart-cart-form .pup').replaceWith(pup.html);
  jQuery('#pccart-cart-form input[name="cart[shipping][pup][id]"]').val(pup.id);
  jQuery('#pccart-cart-form input[name="cart[shipping][pup][countryCode]"]').val(pup.countryCode);
  

  jQuery.fancybox.close() ;
  
// jQuery('#pccart-cart-form #edit-cart-shipping-type-29').click();
  
  
}

function designtoolCallback(){
  //jQuery.fancybox.close() ;

  //refreshCartForm();
  window.location.href = window.location.href;
}
;
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
      if(typeof $("#isUserCompany")[0] != "undefined"){
          
          if($("#companyInput").val() != ''){
              $("#isUserCompany")[0].checked = true;
              $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").show();
          }else {
              $("#isUserCompany")[0].checked = false;
              $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").hide();
          }
      }
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
       jQuery('#pccheckout-invoiceanddelivery-form fieldset.tohiding legend').hide();
       jQuery('#pccheckout-invoiceanddelivery-form fieldset.tohiding div').hide();
       var hash = location.hash;
       if(hash!=""){
        jQuery("#pccheckout-invoiceanddelivery-form fieldset.tohiding" + hash + " legend").show();
        jQuery("#pccheckout-invoiceanddelivery-form fieldset.tohiding" + hash + " div").show();
       }
      $('#pccheckout-invoiceanddelivery-form .summary .toggle').once().click(function(){
        var url = jQuery(this).attr('href');
       var target = url.substring(url.indexOf('#'));
       jQuery('form fieldset.tohiding legend').hide();
       jQuery('form fieldset.tohiding div').hide();
       jQuery(target + " legend").show();
       jQuery(target + " div").show();
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
;
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


;
(function ($) {

  Drupal.behaviors.pcdesigner = {
    detach: function (context) {

    },
    attach: function (context, settings) {
      $('input[name="cart[designer][email]"]').change(function(){
        var href = "js/upload-design/designer/email/" + $(this).val(); 
        alert (href);
        $.getJSON(href, function(data){          
          
        })
      })
    }
  }
})(jQuery);

;
(function ($) {

  Drupal.behaviors.pcdesigns = {
    detach: function (context) {

    },
    attach: function (context, settings) {  
     
      if ($.fancybox){
        $('#pcdesigns-saveddesigns-form .designtool').fancybox({
          width: 815,
          height: 610,
          padding: 5,
          margin: 0,
          scrolling: false,
          autoScale: false,
          hideOnOverlayClick: false,
          autoDimensions: false,
          modal: true,
          onStart: function() {
           // jQuery("#fancybox-outer").append("<div id='dt_preloader'></div>");
          },
          onComplete: function(){
          //  jQuery("#fancybox-outer").find("#dt_preloader").remove();
          }
        });
      }
      
    }
  }
})(jQuery);;
(function ($) {

  Drupal.behaviors.pcdesigntool = {
    detach: function (context) {

    },
    attach: function (context, settings) {
      /*
      $('.designtool').fancybox({
        width: 815,
        height: 630,
        padding: 5,
        margin: 0,
        scrolling: false,
        autoScale: false,
        hideOnOverlayClick: false,
        autoDimensions: false,
        modal: false,
        onStart: function() {
        //jQuery("#fancybox-outer").append("<div id='dt_preloader'></div>");
        },
        onComplete: function(){
        //  jQuery("#fancybox-outer").find("#dt_preloader").remove();
        }
      });
*/
      if ($.fancybox){
                $('.designtool').fancybox({
                    width: 1024,
                    height: 780,
                    padding: 5,
                    margin: 0,
                    scrolling: false,
                    autoScale: false,
                    hideOnOverlayClick: false,
                    autoDimensions: false,
                    modal: false,
                    onStart: function() {

                        jQuery("#fancybox-outer").append("<div id='dt_preloader' class='dt_preloader'></div>");
                    },
                    onComplete: function() {
                        $("#fancybox-overlay").addClass("designtool");
                        $("#fancybox-wrap").find("#fancybox-content").css({"margin": "auto"});
                        $("#fancybox-wrap").find("#fancybox-frame").css({"width": "1024px", "margin": "0px auto"});
                        jQuery("#fancybox-outer").find("#dt_preloader").remove();
                        $("#fancybox-wrap").css("width", "1024px");
                        var vague = jQuery("#canvas").Vague({intensity: 9});
                        vague.blur();
		    },
		    onClosed: function() {
                        $("#canvas").attr("style","");
                        $("#fancybox-overlay").removeClass("designtool");
                    }
                });
      }
    }
  }
})(jQuery);
;
function chooseMarker(id) {
    var id = id;
    var func = 'parent.' + Drupal.settings.callback + '(id)';
    eval(func);
    parent.jQuery.fancybox.close();
    return false;
}

(function($) {
    Drupal.behaviors.pcflyerstore_map = {
        detach: function(context) {

        },
        attach: function(context, settings) {
	var torun = 1;
	$("#map-selector").bind("keypress", function(e) {
              if (e.keyCode == 13) {
                 $( "#btnsearch" ).trigger( "click" );
		return false;
              }
        });
	$('#btnsearch').click(function() {
	    if ($('#map-selector').val().length > 0) {
	    $('#map-selector').css('border-color', '');
	    var postalCodes = $.parseJSON($('#zipcod').html());
	    var citiesLocation = $.parseJSON($('#location').html());
	    var input = $('#map-selector').val();
	    var previousTop = $('#items_').attr('top');
	    if (input.length > 0) {
	       $('#items_').css('top', '0px');
	    } else {
		$('#items_').css('top', previousTop);
	    }
	    var attr = 'city';
	    if ($.isNumeric($('#map-selector').val())) {
		var attr = 'postalCode';
	    }
 	    $('#items_ li').each(function() {
	        if ($(this).find('span').attr(attr).toLowerCase().indexOf(input.toLowerCase()) < 0) {
		  $(this).css('display', 'none');
		} else {
		  $(this).css('display', '');
		}
	    });
	    if ($('#items_ li:not(:hidden)').length == 0 && attr == 'postalCode') {
	       $.each(postalCodes, function(code, Bposition) {
		   if (input == code) {
			console.log('yess '+Bposition);
			var targetPosition = Bposition.split('_');
			var latLng = new google.maps.LatLng(targetPosition[0], targetPosition[1]); // returns LatLng object
                        map.setCenter(latLng);
			map.setZoom(10);
			auZommMap();
		   }
	       }); 
	    } else if ($('#items_ li:not(:hidden)').length == 0 && attr == 'city') {
		$.each(citiesLocation, function(code, cityposition) {
                   if (input.toLowerCase() == code.toLowerCase()) {
                        var targetPosition = cityposition.split('_');
                        var latLng = new google.maps.LatLng(targetPosition[0], targetPosition[1]); // returns LatLng object
                        map.setCenter(latLng);
			map.setZoom(10);
			auZommMap();
                   }
               });
	    } else if ($('#items_ li:not(:hidden)').length > 0) {
		var duplicatePosition = [];
		$('#items_ li:not(:hidden)').each(function(){
		    var po = $(this).find('span').attr('po');
		   if ($('#items_ li span[po='+po+']:not(:hidden)').length > 1) {
			$('#items_ li span[po='+po+']:not(:hidden)').parents('li').last().hide();
		   }    
		});

		var bounds = new google.maps.LatLngBounds();
		var closestMarker = [];
		$('#items_ li:not(:hidden)').each(function(){
		    var positions = $(this).find('.place').attr('position');
		    positions = positions.split('_');
	            var latLng = new google.maps.LatLng(positions[1], positions[0]);
		    var distance = google.maps.geometry.spherical.computeDistanceBetween(latLng, map.getCenter());
		    bounds.extend(latLng);
		});
		map.fitBounds(bounds);
		for (var j=0; j < markerObjects.length ; j++) {
		    var distance = google.maps.geometry.spherical.computeDistanceBetween( markerObjects[j].getPosition(), map.getCenter());
		    closestMarker.push({'id':parseFloat(distance),'value': markerObjects[j].getPosition()});
   		}
		closestMarker.sort(function(a, b){return a.id-b.id});
		bounds = new google.maps.LatLngBounds();
		for(var j=0; j < 10; j++) {
    		    bounds.extend(closestMarker[j].value);
		}
		map.fitBounds(bounds);
	      }
	    } else {
		$('#items_ li').each(function() {
                  $(this).css('display', '');
                });
		$('#map-selector').css('border-color', 'red');
		var pos = new google.maps.LatLng(50.503887, 4.509936);
		map.setCenter(pos);
		map.setZoom(7);
	    }
	});
	function auZommMap() {
                var bounds = new google.maps.LatLngBounds();
                var closestMarker = [];
		var objecttarget = $('#items_ li');
		if ($('#items_ li:not(:hidden)').length > 0) {
		    objecttarget = $('#items_ li:not(:hidden)');
		}
                objecttarget.each(function(){
                   var positions = $(this).find('.place').attr('position');
                   positions = positions.split('_');
                   var latLng = new google.maps.LatLng(positions[1], positions[0]);
                   var distance = google.maps.geometry.spherical.computeDistanceBetween(latLng, map.getCenter());
		   if ($('#items_ li:not(:hidden)').length > 0) {
		        bounds.extend(latLng);
		   }
                   
                });
		if ($('#items_ li:not(:hidden)').length > 0) {
                    map.fitBounds(bounds);
		}
                for (var j=0; j < markerObjects.length ; j++) {
                    var distance = google.maps.geometry.spherical.computeDistanceBetween( markerObjects[j].getPosition(), map.getCenter());
                    closestMarker.push({'id':parseFloat(distance),'value': markerObjects[j].getPosition()});
                }
                closestMarker.sort(function(a, b){return a.id-b.id});
                bounds = new google.maps.LatLngBounds();
                for(var j=0; j < 10; j++) {
                    bounds.extend(closestMarker[j].value);
                }
                map.fitBounds(bounds); 

	}
        var targetStore;
        var map;
	var markers;
	var markerObjects =[];
	var infoWindowContent;
	var openInfoWindow  =false;
        var mapOptions = {
              center: new google.maps.LatLng(50.503887, 4.509936),
              zoom: 7
            };
            var infos = $.parseJSON($('#jsonContainer').html());
            function fillMarkers() {
                var markerData = new Array();
                $.each(infos.data, function(i, item) {
                    if (item.longitude != null && item.latitude != null) {
                        var obj = [item.name, item.longitude, item.latitude, item.postalCode, item.id, item.address];
                        markerData.push(obj);
                    }
                });
                return markerData;
            }
	    $('.pcflyerstores-store-link').live('click', function(){
		return false;
	    });
	    $('.pcflyerstores-store-link').live('mousedown', function(){
		var ids = $(this).find('.place').attr('id').split('_');
		console.log(ids);
               if (openInfoWindow) openInfoWindow.close();
               google.maps.event.trigger(markerObjects[$(this).find('.place').attr('po')], 'click');
		return false;
	    });
	    
	    $('.pcflyerstores-store-link').live('mouseover', function(){
		var position = $(this).find('.place').attr('position').split('_');
                var latLng = new google.maps.LatLng(position[1], position[0]); // returns LatLng object
                google.maps.event.trigger(markerObjects[$(this).find('.place').attr('po')], 'mouseover');
		if (torun == 1) {
                    map.setZoom(10);
                    map.setCenter(latLng);
		}
	    });
	   
	    $('.pcflyerstores-store-link').mouseout(function(){
                var position = $(this).find('.place').attr('position').split('_');
                var latLng = new google.maps.LatLng(position[1], position[0]); // returns LatLng object
                google.maps.event.trigger(markerObjects[$(this).find('.place').attr('po')], 'mouseout');
            });
 
            $('.zoneaccordion').click(function(){
                $("#postal-selector").val($(this).attr('postalcode'));
                jQuery("#BttSearch").trigger("mousedown");
            });
            
            function fillInfosWindows() {
                data = infos.data;
                var infoWindowContents = new Array();
                $.each(data, function(id, store) {
                    if (store.longitude != null && store.latitude != null) {
                        var info = '';
                        if (store.address != null) {
                            info = store.address;
                        }
			var txtBtn = '';
			if ($('#pcflyerstores-picker-form').length > 0) {
			   if (store.vacations != null ) {
			        var vacations = store.vacations[0];
				var startDate = new Date(vacations.startDate);
				var endDate = new Date(vacations.endDate);
				var currentDate = new Date($('#cartDate').html());
				console.log('startDate is :'+startDate);
				console.log('endDate is :'+endDate);
				console.log('cu is '+currentDate);
				if (currentDate.getTime() >= startDate.getTime() && endDate.getTime() >= currentDate.getTime()) {
				    txtBtn =  '<p style="text-align: right;  margin: 10px 0 0; width: 231px;"><img style="height: 34px; float:left; margin-right:10px; width:auto;" src="/sites/all/modules/printconnect/pcflyerstores/images/logo.png"><a href="/flyerstores/'+id+'" ><span class="Slink">'+$('#storeLink').html()+'</span></a></p>';
				} else {
	     			    txtBtn =  '<p style="text-align: right;  margin: 10px 0 0; width: 231px;"><img style="height: 34px; float:left; width:auto; margin-right:10px;" src="/sites/all/modules/printconnect/pcflyerstores/images/logo.png"><a href="/flyerstores/'+id+'" target="blank"><span class="Slink">'+$('#storeLink').html()+'</span></a></p>'+
                                '<p><a href="/stores/'+id+'" onClick="chooseMarker('+id+');return false" class="pcstores-store-link button jquery-once-1-processed ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" id="'+id+'" role="button"><span class="ui-button-text">'+$('#selectStore').html()+'</span></a></p>';
				}
			    } else {
				txtBtn =  '<p style="text-align: right; width:auto; margin: 10px 0 0; wwidth: 231px;"><img style="height: 34px; float:left; width:auto;  margin-right:10px;" src="/sites/all/modules/printconnect/pcflyerstores/images/logo.png"><a href="/flyerstores/'+id+'" target="blank"><span class="Slink">'+$('#storeLink').html()+'</span></a></p>'+
                                '<p><a href="/stores/'+id+'" onClick="chooseMarker('+id+');return false" class="pcstores-store-link button jquery-once-1-processed ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" id="'+id+'" role="button"><span class="ui-button-text">'+$('#selectStore').html()+'</span></a></p>';
			    }
			} else {
			   txtBtn =  '<p style="text-align: right; width:auto; margin: 10px 0 0; width: 231px;"><img style="height: 34px;width:auto; float:left; margin-right:10px" src="/sites/all/modules/printconnect/pcflyerstores/images/logo.png"><a href="/flyerstores/'+id+'" ><span class="Slink">'+$('#storeLink').html()+'</span></a></p>';
			}
			var pr = '<table style="width:100%; font-size: 10px;"><tbody style="background-color:transparent">';
			var faxtext = "";
                        if (store.fax != 'NAN' && store.fax != '' && store.fax.length > 2) {
                            faxtext = '<p style="overflow:hidden; text-align: left; margin: 0px;"><img style="margin: 0; float:left" src="/sites/all/themes/printconnect/flyer/print.jpg"><strong style="margin-left: 10px;  float: left; line-height: 15px; color: #6f6f6f; font-weight: normal;">'+store.fax+'</strong></p>';
                        }
                        $.each(store.openingHours, function(i, item) {
			    if (item != '') {
                                pr += '<tr><td style="border-bottom:1px solid grey; text-align:left"><span style="color:#f60">'+i+'</span> : </td><td style="text-align:right ;border-bottom:1px solid grey"><span style="color: #6f6f6f;">'+item+'</span></td></tr>';
			    }
                        });
                        pr += '</tbody></table>';
			var obj = ['<div style="max-width:245px;"class="info_content">' +
                                '<img src="/sites/all/modules/printconnect/pcflyerstores/images/store-item.png" style="float: left; margin-right: 5px; margin-bottom: 5px;"><h3 style="font-weight: bold;line-height: 15px; margin-bottom: 5px;">' + store.name + '</h3>' +
                                '<p style="margin: 0 0 2px;clear:both;">' + info + '</p>' +
				'<p style="overflow:hidden; text-align: left; margin: 0px; clear:both;"><img style="margin: 0; float:left" src="/sites/all/themes/printconnect/flyer/phone.jpg"><strong style="margin-left: 10px; float: left; line-height: 15px; color: #6f6f6f; font-weight: normal;">'+store.phone+'</strong></p>'+
				'<p style="overflow:hidden; text-align: left; margin: 0px;"><img style="margin: 0; float:left" src="/sites/all/themes/printconnect/flyer/mail.jpg"><strong style="margin-left: 10px;  float: left; line-height: 15px; color: #6f6f6f; font-weight: normal; color:#ff6500;">'+store.email+'</strong></p>'+
				faxtext+
				pr + txtBtn +				
                                '</div>'
                        ];
                        infoWindowContents.push(obj);
                    }
                });
                return infoWindowContents;
            }
            
            function toggleBounce(marker) {
                if (marker.getAnimation() != null) {
                  marker.setAnimation(null);
                } else {
                  marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            }
            
            function simpleMap() {
		$('#Mapimg').css('height', '300px').css('width','400px');
		var simplePosition = $('#Mapimg').attr('position').split('_');
		var mapOptions = {
    			zoom: 10,
    			center: new google.maps.LatLng(simplePosition[1], simplePosition[0])
  		}
		var image = '/sites/all/themes/printconnect/flyer/store.png';
		  var map = new google.maps.Map(document.getElementById('Mapimg'),
                                mapOptions);

  		var myLatLng = new google.maps.LatLng(simplePosition[1], simplePosition[0]);
  		var beachMarker = new google.maps.Marker({
      			position: myLatLng,
      			map: map,
			icon: image
  		});
            }
            
            function initialize() {
		$('#map-canvas').parent().css('height', '100%');
                var bounds = new google.maps.LatLngBounds();
                map = new google.maps.Map(document.getElementById("map-canvas"),
                    mapOptions);
                markers = fillMarkers();
		
                infoWindowContent = fillInfosWindows();
                // Loop through our array of markers & place each one on the map  
                for (var i = 0; i < markers.length; i++) {
                    var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
                    bounds.extend(position);
		    var infoWindow = new google.maps.InfoWindow();
                    var image = '/sites/all/themes/printconnect/flyer/store.png';
                    var marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: markers[i][0],
                        icon: image,
                        animation: google.maps.Animation.DROP
                    });
                    marker.postalCode = markers[i][3];
		    marker.myposition = i;
		    google.maps.event.addListener(infoWindow,'closeclick',function(){
   			torun = 1; //removes the marker
   // then, remove the infowindows name from the array
		     });
                    // Allow each marker to have an info window    
                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
		            torun = 0;
			    openInfoWindow  = infoWindow;
                            infoWindow.setContent(infoWindowContent[i][0]);
                            infoWindow.open(map, marker);
			}
                    })(marker, i));
		    
		    google.maps.event.addListener(marker, 'mouseout', (function(marker, i) {
                        return function() {
                            marker.setIcon('/sites/all/themes/printconnect/flyer/store.png');
			}
                    })(marker, i));	
		    google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
                        return function() {
                            marker.setIcon('/sites/all/themes/printconnect/flyer/store2.png');
                        }
                    })(marker, i));
		    markerObjects[i] = marker;
                   // map.fitBounds(bounds);
                }
            }
	    if ($('#map-canvas').length > 0) {
		google.maps.event.addDomListener(window, 'load', initialize);	
	    } else {
		google.maps.event.addDomListener(window, 'load', simpleMap);
	    }
        }
    };
})(jQuery);

;
(function ($) { 

  Drupal.behaviors.pcflyerstores = {
    detach: function (context) {

    },
    attach: function (context, settings) {
        
                
		var storesNumber = $('#edit-results .fieldset-wrapper').find('.item-list li').length;
		if(storesNumber >= 5) {
			$('a.storeUp , a.storeDown').show();	
			$('#edit-results .fieldset-wrapper').find('.item-list').jCarouselLite({
				btnNext: ".storeDown",
				btnPrev: ".storeUp",
				vertical: true
			});
		
		}
		else {
			$('a.storeUp , a.storeDown').hide();	
		}


                $('#map-selector').keydown(function()
                {
                    if( $(this).val().length >= 2 ) {
                     $('.storeDown').hide();
                     $('.storeUp').hide();
                    }else{
                         $('.storeDown').show();
                     $('.storeUp').show();
                    }
                });                

    	var code = $('.pcflyerstores-store-link.button').clone();
   		$('.pcflyerstores-store-link.button').remove();
   		$('.description .mapContainer').before(code);

      $('#pcflyerstores-picker-form area' ).hover(function(e){
        var id = $(this).attr('id');
        var img = $('#pcflyerstores-picker-form #map_' + id );
        $('#pcflyerstores-picker-form .images img').hide();
        img.show();
      },
      function(e){
        var img = $('#pcflyerstores-picker-form #map');
        $('#pcflyerstores-picker-form .images img').hide();
        img.show();
      
      });
       
      $('#pcflyerstores-picker-form .countries a').once().click(function(e){
        var href = $(this).attr('href');
        e.stopPropagation();
        href = href.replace("stores/picker", "js/stores/picker"); 
        $.getJSON(href, function(data){
          $('#pcflyerstores-picker-form .results .item-list').replaceWith(data.list);
          $('#pcflyerstores-picker-form map').replaceWith(data.map);
          $('#pcflyerstores-picker-form #map').replaceWith(data.image);
          $('#pcflyerstores-picker-form .images').replaceWith(data.images);
          $('#pcflyerstores-picker-form .countries').replaceWith(data.countries);
          $('#pcflyerstores-picker-form .detail').replaceWith(data.info);
          Drupal.attachBehaviors(context);
        })
        return false;
      });
      
      $('#pcflyerstores-picker-form .results li a').click(function(e){
        
	return false;
      });
      
      $('#pcflyerstores-picker-form .detail .pcflyerstores-store-link').once().click(function(e){
        var id = $(this).attr('id');
        var func = 'parent.' + Drupal.settings.callback + '(id)';
        eval(func);
        parent.jQuery.fancybox.close();
        return false;
      });
      
      if ($.fancybox){
        $('.pcflyerstores-picker-link').fancybox({
          width: 980,
          height: 650,
          padding: 0,
          margin: 0,
          scrolling: false,
          autoScale: false,
          hideOnOverlayClick: false,
          autoDimensions: false,
          onStart: function() {
            jQuery.fancybox.showActivity();
          }
        });
      }
      /*animation block isotope serache flyerstor*/
      
    $('#edit-stores').isotope({
        masonry: {
          columnWidth: 1
        },
        itemSelector: '.stores-form'
      })
/*animation block isotope serache jcarousel*/
   

    $(function() {
        
                $('[data-jcarousel]').each(function() {
                    var el = $(this);
                    el.jcarousel(el.data());
                });

                $('[data-jcarousel-control]').each(function() {
                    var el = $(this);
                    el.jcarouselControl(el.data());
                });
        
                $('.[data-jcarousel]').jcarouselAutoscroll({
                    interval: 3000,
                    target: '+=1',
                    autostart: true
                })
            ;
            });
    
    
}
  }
  
})(jQuery);
function pcflyerstores_callback(id){
  var url =Drupal.settings.basePath + 'index.php?q=/js/stores/picker/cart/set/' + id;
  jQuery('input[name="pcflyerstores[id]"]').val(id);
  jQuery.getJSON(url, function(data){
    jQuery('.store').html(data.info);
    Drupal.attachBehaviors();
  });
}
;
/*!
 * Isotope PACKAGED v2.0.0
 * Filter & sort magical layouts
 * http://isotope.metafizzy.co
 */

(function(t){function e(){}function i(t){function i(e){e.prototype.option||(e.prototype.option=function(e){t.isPlainObject(e)&&(this.options=t.extend(!0,this.options,e))})}function n(e,i){t.fn[e]=function(n){if("string"==typeof n){for(var s=o.call(arguments,1),a=0,u=this.length;u>a;a++){var p=this[a],h=t.data(p,e);if(h)if(t.isFunction(h[n])&&"_"!==n.charAt(0)){var f=h[n].apply(h,s);if(void 0!==f)return f}else r("no such method '"+n+"' for "+e+" instance");else r("cannot call methods on "+e+" prior to initialization; "+"attempted to call '"+n+"'")}return this}return this.each(function(){var o=t.data(this,e);o?(o.option(n),o._init()):(o=new i(this,n),t.data(this,e,o))})}}if(t){var r="undefined"==typeof console?e:function(t){console.error(t)};return t.bridget=function(t,e){i(e),n(t,e)},t.bridget}}var o=Array.prototype.slice;"function"==typeof define&&define.amd?define("jquery-bridget/jquery.bridget",["jquery"],i):i(t.jQuery)})(window),function(t){function e(e){var i=t.event;return i.target=i.target||i.srcElement||e,i}var i=document.documentElement,o=function(){};i.addEventListener?o=function(t,e,i){t.addEventListener(e,i,!1)}:i.attachEvent&&(o=function(t,i,o){t[i+o]=o.handleEvent?function(){var i=e(t);o.handleEvent.call(o,i)}:function(){var i=e(t);o.call(t,i)},t.attachEvent("on"+i,t[i+o])});var n=function(){};i.removeEventListener?n=function(t,e,i){t.removeEventListener(e,i,!1)}:i.detachEvent&&(n=function(t,e,i){t.detachEvent("on"+e,t[e+i]);try{delete t[e+i]}catch(o){t[e+i]=void 0}});var r={bind:o,unbind:n};"function"==typeof define&&define.amd?define("eventie/eventie",r):"object"==typeof exports?module.exports=r:t.eventie=r}(this),function(t){function e(t){"function"==typeof t&&(e.isReady?t():r.push(t))}function i(t){var i="readystatechange"===t.type&&"complete"!==n.readyState;if(!e.isReady&&!i){e.isReady=!0;for(var o=0,s=r.length;s>o;o++){var a=r[o];a()}}}function o(o){return o.bind(n,"DOMContentLoaded",i),o.bind(n,"readystatechange",i),o.bind(t,"load",i),e}var n=t.document,r=[];e.isReady=!1,"function"==typeof define&&define.amd?(e.isReady="function"==typeof requirejs,define("doc-ready/doc-ready",["eventie/eventie"],o)):t.docReady=o(t.eventie)}(this),function(){function t(){}function e(t,e){for(var i=t.length;i--;)if(t[i].listener===e)return i;return-1}function i(t){return function(){return this[t].apply(this,arguments)}}var o=t.prototype,n=this,r=n.EventEmitter;o.getListeners=function(t){var e,i,o=this._getEvents();if(t instanceof RegExp){e={};for(i in o)o.hasOwnProperty(i)&&t.test(i)&&(e[i]=o[i])}else e=o[t]||(o[t]=[]);return e},o.flattenListeners=function(t){var e,i=[];for(e=0;t.length>e;e+=1)i.push(t[e].listener);return i},o.getListenersAsObject=function(t){var e,i=this.getListeners(t);return i instanceof Array&&(e={},e[t]=i),e||i},o.addListener=function(t,i){var o,n=this.getListenersAsObject(t),r="object"==typeof i;for(o in n)n.hasOwnProperty(o)&&-1===e(n[o],i)&&n[o].push(r?i:{listener:i,once:!1});return this},o.on=i("addListener"),o.addOnceListener=function(t,e){return this.addListener(t,{listener:e,once:!0})},o.once=i("addOnceListener"),o.defineEvent=function(t){return this.getListeners(t),this},o.defineEvents=function(t){for(var e=0;t.length>e;e+=1)this.defineEvent(t[e]);return this},o.removeListener=function(t,i){var o,n,r=this.getListenersAsObject(t);for(n in r)r.hasOwnProperty(n)&&(o=e(r[n],i),-1!==o&&r[n].splice(o,1));return this},o.off=i("removeListener"),o.addListeners=function(t,e){return this.manipulateListeners(!1,t,e)},o.removeListeners=function(t,e){return this.manipulateListeners(!0,t,e)},o.manipulateListeners=function(t,e,i){var o,n,r=t?this.removeListener:this.addListener,s=t?this.removeListeners:this.addListeners;if("object"!=typeof e||e instanceof RegExp)for(o=i.length;o--;)r.call(this,e,i[o]);else for(o in e)e.hasOwnProperty(o)&&(n=e[o])&&("function"==typeof n?r.call(this,o,n):s.call(this,o,n));return this},o.removeEvent=function(t){var e,i=typeof t,o=this._getEvents();if("string"===i)delete o[t];else if(t instanceof RegExp)for(e in o)o.hasOwnProperty(e)&&t.test(e)&&delete o[e];else delete this._events;return this},o.removeAllListeners=i("removeEvent"),o.emitEvent=function(t,e){var i,o,n,r,s=this.getListenersAsObject(t);for(n in s)if(s.hasOwnProperty(n))for(o=s[n].length;o--;)i=s[n][o],i.once===!0&&this.removeListener(t,i.listener),r=i.listener.apply(this,e||[]),r===this._getOnceReturnValue()&&this.removeListener(t,i.listener);return this},o.trigger=i("emitEvent"),o.emit=function(t){var e=Array.prototype.slice.call(arguments,1);return this.emitEvent(t,e)},o.setOnceReturnValue=function(t){return this._onceReturnValue=t,this},o._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},o._getEvents=function(){return this._events||(this._events={})},t.noConflict=function(){return n.EventEmitter=r,t},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return t}):"object"==typeof module&&module.exports?module.exports=t:this.EventEmitter=t}.call(this),function(t){function e(t){if(t){if("string"==typeof o[t])return t;t=t.charAt(0).toUpperCase()+t.slice(1);for(var e,n=0,r=i.length;r>n;n++)if(e=i[n]+t,"string"==typeof o[e])return e}}var i="Webkit Moz ms Ms O".split(" "),o=document.documentElement.style;"function"==typeof define&&define.amd?define("get-style-property/get-style-property",[],function(){return e}):"object"==typeof exports?module.exports=e:t.getStyleProperty=e}(window),function(t){function e(t){var e=parseFloat(t),i=-1===t.indexOf("%")&&!isNaN(e);return i&&e}function i(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0,i=s.length;i>e;e++){var o=s[e];t[o]=0}return t}function o(t){function o(t){if("string"==typeof t&&(t=document.querySelector(t)),t&&"object"==typeof t&&t.nodeType){var o=r(t);if("none"===o.display)return i();var n={};n.width=t.offsetWidth,n.height=t.offsetHeight;for(var h=n.isBorderBox=!(!p||!o[p]||"border-box"!==o[p]),f=0,c=s.length;c>f;f++){var d=s[f],l=o[d];l=a(t,l);var y=parseFloat(l);n[d]=isNaN(y)?0:y}var m=n.paddingLeft+n.paddingRight,g=n.paddingTop+n.paddingBottom,v=n.marginLeft+n.marginRight,_=n.marginTop+n.marginBottom,I=n.borderLeftWidth+n.borderRightWidth,L=n.borderTopWidth+n.borderBottomWidth,z=h&&u,S=e(o.width);S!==!1&&(n.width=S+(z?0:m+I));var b=e(o.height);return b!==!1&&(n.height=b+(z?0:g+L)),n.innerWidth=n.width-(m+I),n.innerHeight=n.height-(g+L),n.outerWidth=n.width+v,n.outerHeight=n.height+_,n}}function a(t,e){if(n||-1===e.indexOf("%"))return e;var i=t.style,o=i.left,r=t.runtimeStyle,s=r&&r.left;return s&&(r.left=t.currentStyle.left),i.left=e,e=i.pixelLeft,i.left=o,s&&(r.left=s),e}var u,p=t("boxSizing");return function(){if(p){var t=document.createElement("div");t.style.width="200px",t.style.padding="1px 2px 3px 4px",t.style.borderStyle="solid",t.style.borderWidth="1px 2px 3px 4px",t.style[p]="border-box";var i=document.body||document.documentElement;i.appendChild(t);var o=r(t);u=200===e(o.width),i.removeChild(t)}}(),o}var n=t.getComputedStyle,r=n?function(t){return n(t,null)}:function(t){return t.currentStyle},s=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];"function"==typeof define&&define.amd?define("get-size/get-size",["get-style-property/get-style-property"],o):"object"==typeof exports?module.exports=o(require("get-style-property")):t.getSize=o(t.getStyleProperty)}(window),function(t,e){function i(t,e){return t[a](e)}function o(t){if(!t.parentNode){var e=document.createDocumentFragment();e.appendChild(t)}}function n(t,e){o(t);for(var i=t.parentNode.querySelectorAll(e),n=0,r=i.length;r>n;n++)if(i[n]===t)return!0;return!1}function r(t,e){return o(t),i(t,e)}var s,a=function(){if(e.matchesSelector)return"matchesSelector";for(var t=["webkit","moz","ms","o"],i=0,o=t.length;o>i;i++){var n=t[i],r=n+"MatchesSelector";if(e[r])return r}}();if(a){var u=document.createElement("div"),p=i(u,"div");s=p?i:r}else s=n;"function"==typeof define&&define.amd?define("matches-selector/matches-selector",[],function(){return s}):window.matchesSelector=s}(this,Element.prototype),function(t){function e(t,e){for(var i in e)t[i]=e[i];return t}function i(t){for(var e in t)return!1;return e=null,!0}function o(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}function n(t,n,r){function a(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}var u=r("transition"),p=r("transform"),h=u&&p,f=!!r("perspective"),c={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"}[u],d=["transform","transition","transitionDuration","transitionProperty"],l=function(){for(var t={},e=0,i=d.length;i>e;e++){var o=d[e],n=r(o);n&&n!==o&&(t[o]=n)}return t}();e(a.prototype,t.prototype),a.prototype._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},a.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},a.prototype.getSize=function(){this.size=n(this.element)},a.prototype.css=function(t){var e=this.element.style;for(var i in t){var o=l[i]||i;e[o]=t[i]}},a.prototype.getPosition=function(){var t=s(this.element),e=this.layout.options,i=e.isOriginLeft,o=e.isOriginTop,n=parseInt(t[i?"left":"right"],10),r=parseInt(t[o?"top":"bottom"],10);n=isNaN(n)?0:n,r=isNaN(r)?0:r;var a=this.layout.size;n-=i?a.paddingLeft:a.paddingRight,r-=o?a.paddingTop:a.paddingBottom,this.position.x=n,this.position.y=r},a.prototype.layoutPosition=function(){var t=this.layout.size,e=this.layout.options,i={};e.isOriginLeft?(i.left=this.position.x+t.paddingLeft+"px",i.right=""):(i.right=this.position.x+t.paddingRight+"px",i.left=""),e.isOriginTop?(i.top=this.position.y+t.paddingTop+"px",i.bottom=""):(i.bottom=this.position.y+t.paddingBottom+"px",i.top=""),this.css(i),this.emitEvent("layout",[this])};var y=f?function(t,e){return"translate3d("+t+"px, "+e+"px, 0)"}:function(t,e){return"translate("+t+"px, "+e+"px)"};a.prototype._transitionTo=function(t,e){this.getPosition();var i=this.position.x,o=this.position.y,n=parseInt(t,10),r=parseInt(e,10),s=n===this.position.x&&r===this.position.y;if(this.setPosition(t,e),s&&!this.isTransitioning)return this.layoutPosition(),void 0;var a=t-i,u=e-o,p={},h=this.layout.options;a=h.isOriginLeft?a:-a,u=h.isOriginTop?u:-u,p.transform=y(a,u),this.transition({to:p,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},a.prototype.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},a.prototype.moveTo=h?a.prototype._transitionTo:a.prototype.goTo,a.prototype.setPosition=function(t,e){this.position.x=parseInt(t,10),this.position.y=parseInt(e,10)},a.prototype._nonTransition=function(t){this.css(t.to),t.isCleaning&&this._removeStyles(t.to);for(var e in t.onTransitionEnd)t.onTransitionEnd[e].call(this)},a.prototype._transition=function(t){if(!parseFloat(this.layout.options.transitionDuration))return this._nonTransition(t),void 0;var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);var o=this.element.offsetHeight;o=null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0};var m=p&&o(p)+",opacity";a.prototype.enableTransition=function(){this.isTransitioning||(this.css({transitionProperty:m,transitionDuration:this.layout.options.transitionDuration}),this.element.addEventListener(c,this,!1))},a.prototype.transition=a.prototype[u?"_transition":"_nonTransition"],a.prototype.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},a.prototype.onotransitionend=function(t){this.ontransitionend(t)};var g={"-webkit-transform":"transform","-moz-transform":"transform","-o-transform":"transform"};a.prototype.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,o=g[t.propertyName]||t.propertyName;if(delete e.ingProperties[o],i(e.ingProperties)&&this.disableTransition(),o in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[o]),o in e.onEnd){var n=e.onEnd[o];n.call(this),delete e.onEnd[o]}this.emitEvent("transitionEnd",[this])}},a.prototype.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(c,this,!1),this.isTransitioning=!1},a.prototype._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var v={transitionProperty:"",transitionDuration:""};return a.prototype.removeTransitionStyles=function(){this.css(v)},a.prototype.removeElem=function(){this.element.parentNode.removeChild(this.element),this.emitEvent("remove",[this])},a.prototype.remove=function(){if(!u||!parseFloat(this.layout.options.transitionDuration))return this.removeElem(),void 0;var t=this;this.on("transitionEnd",function(){return t.removeElem(),!0}),this.hide()},a.prototype.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options;this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0})},a.prototype.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options;this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:{opacity:function(){this.isHidden&&this.css({display:"none"})}}})},a.prototype.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},a}var r=t.getComputedStyle,s=r?function(t){return r(t,null)}:function(t){return t.currentStyle};"function"==typeof define&&define.amd?define("outlayer/item",["eventEmitter/EventEmitter","get-size/get-size","get-style-property/get-style-property"],n):(t.Outlayer={},t.Outlayer.Item=n(t.EventEmitter,t.getSize,t.getStyleProperty))}(window),function(t){function e(t,e){for(var i in e)t[i]=e[i];return t}function i(t){return"[object Array]"===f.call(t)}function o(t){var e=[];if(i(t))e=t;else if(t&&"number"==typeof t.length)for(var o=0,n=t.length;n>o;o++)e.push(t[o]);else e.push(t);return e}function n(t,e){var i=d(e,t);-1!==i&&e.splice(i,1)}function r(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()}function s(i,s,f,d,l,y){function m(t,i){if("string"==typeof t&&(t=a.querySelector(t)),!t||!c(t))return u&&u.error("Bad "+this.constructor.namespace+" element: "+t),void 0;this.element=t,this.options=e({},this.constructor.defaults),this.option(i);var o=++g;this.element.outlayerGUID=o,v[o]=this,this._create(),this.options.isInitLayout&&this.layout()}var g=0,v={};return m.namespace="outlayer",m.Item=y,m.defaults={containerStyle:{position:"relative"},isInitLayout:!0,isOriginLeft:!0,isOriginTop:!0,isResizeBound:!0,isResizingContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}},e(m.prototype,f.prototype),m.prototype.option=function(t){e(this.options,t)},m.prototype._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),e(this.element.style,this.options.containerStyle),this.options.isResizeBound&&this.bindResize()},m.prototype.reloadItems=function(){this.items=this._itemize(this.element.children)},m.prototype._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,o=[],n=0,r=e.length;r>n;n++){var s=e[n],a=new i(s,this);o.push(a)}return o},m.prototype._filterFindItemElements=function(t){t=o(t);for(var e=this.options.itemSelector,i=[],n=0,r=t.length;r>n;n++){var s=t[n];if(c(s))if(e){l(s,e)&&i.push(s);for(var a=s.querySelectorAll(e),u=0,p=a.length;p>u;u++)i.push(a[u])}else i.push(s)}return i},m.prototype.getItemElements=function(){for(var t=[],e=0,i=this.items.length;i>e;e++)t.push(this.items[e].element);return t},m.prototype.layout=function(){this._resetLayout(),this._manageStamps();var t=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;this.layoutItems(this.items,t),this._isLayoutInited=!0},m.prototype._init=m.prototype.layout,m.prototype._resetLayout=function(){this.getSize()},m.prototype.getSize=function(){this.size=d(this.element)},m.prototype._getMeasurement=function(t,e){var i,o=this.options[t];o?("string"==typeof o?i=this.element.querySelector(o):c(o)&&(i=o),this[t]=i?d(i)[e]:o):this[t]=0},m.prototype.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},m.prototype._getItemsForLayout=function(t){for(var e=[],i=0,o=t.length;o>i;i++){var n=t[i];n.isIgnored||e.push(n)}return e},m.prototype._layoutItems=function(t,e){function i(){o.emitEvent("layoutComplete",[o,t])}var o=this;if(!t||!t.length)return i(),void 0;this._itemsOn(t,"layout",i);for(var n=[],r=0,s=t.length;s>r;r++){var a=t[r],u=this._getItemLayoutPosition(a);u.item=a,u.isInstant=e||a.isLayoutInstant,n.push(u)}this._processLayoutQueue(n)},m.prototype._getItemLayoutPosition=function(){return{x:0,y:0}},m.prototype._processLayoutQueue=function(t){for(var e=0,i=t.length;i>e;e++){var o=t[e];this._positionItem(o.item,o.x,o.y,o.isInstant)}},m.prototype._positionItem=function(t,e,i,o){o?t.goTo(e,i):t.moveTo(e,i)},m.prototype._postLayout=function(){this.resizeContainer()},m.prototype.resizeContainer=function(){if(this.options.isResizingContainer){var t=this._getContainerSize();t&&(this._setContainerMeasure(t.width,!0),this._setContainerMeasure(t.height,!1))}},m.prototype._getContainerSize=h,m.prototype._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},m.prototype._itemsOn=function(t,e,i){function o(){return n++,n===r&&i.call(s),!0}for(var n=0,r=t.length,s=this,a=0,u=t.length;u>a;a++){var p=t[a];p.on(e,o)}},m.prototype.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},m.prototype.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},m.prototype.stamp=function(t){if(t=this._find(t)){this.stamps=this.stamps.concat(t);for(var e=0,i=t.length;i>e;e++){var o=t[e];this.ignore(o)}}},m.prototype.unstamp=function(t){if(t=this._find(t))for(var e=0,i=t.length;i>e;e++){var o=t[e];n(o,this.stamps),this.unignore(o)}},m.prototype._find=function(t){return t?("string"==typeof t&&(t=this.element.querySelectorAll(t)),t=o(t)):void 0},m.prototype._manageStamps=function(){if(this.stamps&&this.stamps.length){this._getBoundingRect();for(var t=0,e=this.stamps.length;e>t;t++){var i=this.stamps[t];this._manageStamp(i)}}},m.prototype._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},m.prototype._manageStamp=h,m.prototype._getElementOffset=function(t){var e=t.getBoundingClientRect(),i=this._boundingRect,o=d(t),n={left:e.left-i.left-o.marginLeft,top:e.top-i.top-o.marginTop,right:i.right-e.right-o.marginRight,bottom:i.bottom-e.bottom-o.marginBottom};return n},m.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},m.prototype.bindResize=function(){this.isResizeBound||(i.bind(t,"resize",this),this.isResizeBound=!0)},m.prototype.unbindResize=function(){this.isResizeBound&&i.unbind(t,"resize",this),this.isResizeBound=!1},m.prototype.onresize=function(){function t(){e.resize(),delete e.resizeTimeout}this.resizeTimeout&&clearTimeout(this.resizeTimeout);var e=this;this.resizeTimeout=setTimeout(t,100)},m.prototype.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},m.prototype.needsResizeLayout=function(){var t=d(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},m.prototype.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},m.prototype.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},m.prototype.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},m.prototype.reveal=function(t){var e=t&&t.length;if(e)for(var i=0;e>i;i++){var o=t[i];o.reveal()}},m.prototype.hide=function(t){var e=t&&t.length;if(e)for(var i=0;e>i;i++){var o=t[i];o.hide()}},m.prototype.getItem=function(t){for(var e=0,i=this.items.length;i>e;e++){var o=this.items[e];if(o.element===t)return o}},m.prototype.getItems=function(t){if(t&&t.length){for(var e=[],i=0,o=t.length;o>i;i++){var n=t[i],r=this.getItem(n);r&&e.push(r)}return e}},m.prototype.remove=function(t){t=o(t);var e=this.getItems(t);if(e&&e.length){this._itemsOn(e,"remove",function(){this.emitEvent("removeComplete",[this,e])});for(var i=0,r=e.length;r>i;i++){var s=e[i];s.remove(),n(s,this.items)}}},m.prototype.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="";for(var e=0,i=this.items.length;i>e;e++){var o=this.items[e];o.destroy()}this.unbindResize(),delete this.element.outlayerGUID,p&&p.removeData(this.element,this.constructor.namespace)},m.data=function(t){var e=t&&t.outlayerGUID;return e&&v[e]},m.create=function(t,i){function o(){m.apply(this,arguments)}return Object.create?o.prototype=Object.create(m.prototype):e(o.prototype,m.prototype),o.prototype.constructor=o,o.defaults=e({},m.defaults),e(o.defaults,i),o.prototype.settings={},o.namespace=t,o.data=m.data,o.Item=function(){y.apply(this,arguments)},o.Item.prototype=new y,s(function(){for(var e=r(t),i=a.querySelectorAll(".js-"+e),n="data-"+e+"-options",s=0,h=i.length;h>s;s++){var f,c=i[s],d=c.getAttribute(n);try{f=d&&JSON.parse(d)}catch(l){u&&u.error("Error parsing "+n+" on "+c.nodeName.toLowerCase()+(c.id?"#"+c.id:"")+": "+l);continue}var y=new o(c,f);p&&p.data(c,t,y)}}),p&&p.bridget&&p.bridget(t,o),o},m.Item=y,m}var a=t.document,u=t.console,p=t.jQuery,h=function(){},f=Object.prototype.toString,c="object"==typeof HTMLElement?function(t){return t instanceof HTMLElement}:function(t){return t&&"object"==typeof t&&1===t.nodeType&&"string"==typeof t.nodeName},d=Array.prototype.indexOf?function(t,e){return t.indexOf(e)}:function(t,e){for(var i=0,o=t.length;o>i;i++)if(t[i]===e)return i;return-1};"function"==typeof define&&define.amd?define("outlayer/outlayer",["eventie/eventie","doc-ready/doc-ready","eventEmitter/EventEmitter","get-size/get-size","matches-selector/matches-selector","./item"],s):t.Outlayer=s(t.eventie,t.docReady,t.EventEmitter,t.getSize,t.matchesSelector,t.Outlayer.Item)}(window),function(t){function e(t){function e(){t.Item.apply(this,arguments)}return e.prototype=new t.Item,e.prototype._create=function(){this.id=this.layout.itemGUID++,t.Item.prototype._create.call(this),this.sortData={}},e.prototype.updateSortData=function(){if(!this.isIgnored){this.sortData.id=this.id,this.sortData["original-order"]=this.id,this.sortData.random=Math.random();var t=this.layout.options.getSortData,e=this.layout._sorters;for(var i in t){var o=e[i];this.sortData[i]=o(this.element,this)}}},e}"function"==typeof define&&define.amd?define("isotope/js/item",["outlayer/outlayer"],e):(t.Isotope=t.Isotope||{},t.Isotope.Item=e(t.Outlayer))}(window),function(t){function e(t,e){function i(t){this.isotope=t,t&&(this.options=t.options[this.namespace],this.element=t.element,this.items=t.filteredItems,this.size=t.size)}return function(){function t(t){return function(){return e.prototype[t].apply(this.isotope,arguments)}}for(var o=["_resetLayout","_getItemLayoutPosition","_manageStamp","_getContainerSize","_getElementOffset","needsResizeLayout"],n=0,r=o.length;r>n;n++){var s=o[n];i.prototype[s]=t(s)}}(),i.prototype.needsVerticalResizeLayout=function(){var e=t(this.isotope.element),i=this.isotope.size&&e;return i&&e.innerHeight!==this.isotope.size.innerHeight},i.prototype._getMeasurement=function(){this.isotope._getMeasurement.apply(this,arguments)},i.prototype.getColumnWidth=function(){this.getSegmentSize("column","Width")},i.prototype.getRowHeight=function(){this.getSegmentSize("row","Height")},i.prototype.getSegmentSize=function(t,e){var i=t+e,o="outer"+e;if(this._getMeasurement(i,o),!this[i]){var n=this.getFirstItemSize();this[i]=n&&n[o]||this.isotope.size["inner"+e]}},i.prototype.getFirstItemSize=function(){var e=this.isotope.filteredItems[0];return e&&e.element&&t(e.element)},i.prototype.layout=function(){this.isotope.layout.apply(this.isotope,arguments)},i.prototype.getSize=function(){this.isotope.getSize(),this.size=this.isotope.size},i.modes={},i.create=function(t,e){function o(){i.apply(this,arguments)}return o.prototype=new i,e&&(o.options=e),o.prototype.namespace=t,i.modes[t]=o,o},i}"function"==typeof define&&define.amd?define("isotope/js/layout-mode",["get-size/get-size","outlayer/outlayer"],e):(t.Isotope=t.Isotope||{},t.Isotope.LayoutMode=e(t.getSize,t.Outlayer))}(window),function(t){function e(t,e){var o=t.create("masonry");return o.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns();var t=this.cols;for(this.colYs=[];t--;)this.colYs.push(0);this.maxY=0},o.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],i=t&&t.element;this.columnWidth=i&&e(i).outerWidth||this.containerWidth}this.columnWidth+=this.gutter,this.cols=Math.floor((this.containerWidth+this.gutter)/this.columnWidth),this.cols=Math.max(this.cols,1)},o.prototype.getContainerWidth=function(){var t=this.options.isFitWidth?this.element.parentNode:this.element,i=e(t);this.containerWidth=i&&i.innerWidth},o.prototype._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,o=e&&1>e?"round":"ceil",n=Math[o](t.size.outerWidth/this.columnWidth);n=Math.min(n,this.cols);for(var r=this._getColGroup(n),s=Math.min.apply(Math,r),a=i(r,s),u={x:this.columnWidth*a,y:s},p=s+t.size.outerHeight,h=this.cols+1-r.length,f=0;h>f;f++)this.colYs[a+f]=p;return u},o.prototype._getColGroup=function(t){if(2>t)return this.colYs;for(var e=[],i=this.cols+1-t,o=0;i>o;o++){var n=this.colYs.slice(o,o+t);e[o]=Math.max.apply(Math,n)}return e},o.prototype._manageStamp=function(t){var i=e(t),o=this._getElementOffset(t),n=this.options.isOriginLeft?o.left:o.right,r=n+i.outerWidth,s=Math.floor(n/this.columnWidth);s=Math.max(0,s);var a=Math.floor(r/this.columnWidth);a-=r%this.columnWidth?0:1,a=Math.min(this.cols-1,a);for(var u=(this.options.isOriginTop?o.top:o.bottom)+i.outerHeight,p=s;a>=p;p++)this.colYs[p]=Math.max(u,this.colYs[p])},o.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this.options.isFitWidth&&(t.width=this._getContainerFitWidth()),t},o.prototype._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},o.prototype.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!==this.containerWidth},o}var i=Array.prototype.indexOf?function(t,e){return t.indexOf(e)}:function(t,e){for(var i=0,o=t.length;o>i;i++){var n=t[i];if(n===e)return i}return-1};"function"==typeof define&&define.amd?define("masonry/masonry",["outlayer/outlayer","get-size/get-size"],e):t.Masonry=e(t.Outlayer,t.getSize)}(window),function(t){function e(t,e){for(var i in e)t[i]=e[i];return t}function i(t,i){var o=t.create("masonry"),n=o.prototype._getElementOffset,r=o.prototype.layout,s=o.prototype._getMeasurement;e(o.prototype,i.prototype),o.prototype._getElementOffset=n,o.prototype.layout=r,o.prototype._getMeasurement=s;var a=o.prototype.measureColumns;o.prototype.measureColumns=function(){this.items=this.isotope.filteredItems,a.call(this)};var u=o.prototype._manageStamp;return o.prototype._manageStamp=function(){this.options.isOriginLeft=this.isotope.options.isOriginLeft,this.options.isOriginTop=this.isotope.options.isOriginTop,u.apply(this,arguments)},o}"function"==typeof define&&define.amd?define("isotope/js/layout-modes/masonry",["../layout-mode","masonry/masonry"],i):i(t.Isotope.LayoutMode,t.Masonry)}(window),function(t){function e(t){var e=t.create("fitRows");return e.prototype._resetLayout=function(){this.x=0,this.y=0,this.maxY=0},e.prototype._getItemLayoutPosition=function(t){t.getSize(),0!==this.x&&t.size.outerWidth+this.x>this.isotope.size.innerWidth&&(this.x=0,this.y=this.maxY);var e={x:this.x,y:this.y};return this.maxY=Math.max(this.maxY,this.y+t.size.outerHeight),this.x+=t.size.outerWidth,e},e.prototype._getContainerSize=function(){return{height:this.maxY}},e}"function"==typeof define&&define.amd?define("isotope/js/layout-modes/fit-rows",["../layout-mode"],e):e(t.Isotope.LayoutMode)}(window),function(t){function e(t){var e=t.create("vertical",{horizontalAlignment:0});return e.prototype._resetLayout=function(){this.y=0},e.prototype._getItemLayoutPosition=function(t){t.getSize();var e=(this.isotope.size.innerWidth-t.size.outerWidth)*this.options.horizontalAlignment,i=this.y;return this.y+=t.size.outerHeight,{x:e,y:i}},e.prototype._getContainerSize=function(){return{height:this.y}},e}"function"==typeof define&&define.amd?define("isotope/js/layout-modes/vertical",["../layout-mode"],e):e(t.Isotope.LayoutMode)}(window),function(t){function e(t,e){for(var i in e)t[i]=e[i];return t}function i(t){return"[object Array]"===h.call(t)}function o(t){var e=[];if(i(t))e=t;else if(t&&"number"==typeof t.length)for(var o=0,n=t.length;n>o;o++)e.push(t[o]);else e.push(t);return e}function n(t,e){var i=f(e,t);-1!==i&&e.splice(i,1)}function r(t,i,r,u,h){function f(t,e){return function(i,o){for(var n=0,r=t.length;r>n;n++){var s=t[n],a=i.sortData[s],u=o.sortData[s];if(a>u||u>a){var p=void 0!==e[s]?e[s]:e,h=p?1:-1;return(a>u?1:-1)*h}}return 0}}var c=t.create("isotope",{layoutMode:"masonry",isJQueryFiltering:!0,sortAscending:!0});c.Item=u,c.LayoutMode=h,c.prototype._create=function(){this.itemGUID=0,this._sorters={},this._getSorters(),t.prototype._create.call(this),this.modes={},this.filteredItems=this.items,this.sortHistory=["original-order"];for(var e in h.modes)this._initLayoutMode(e)},c.prototype.reloadItems=function(){this.itemGUID=0,t.prototype.reloadItems.call(this)},c.prototype._itemize=function(){for(var e=t.prototype._itemize.apply(this,arguments),i=0,o=e.length;o>i;i++){var n=e[i];n.id=this.itemGUID++}return this._updateItemsSortData(e),e},c.prototype._initLayoutMode=function(t){var i=h.modes[t],o=this.options[t]||{};this.options[t]=i.options?e(i.options,o):o,this.modes[t]=new i(this)},c.prototype.layout=function(){return!this._isLayoutInited&&this.options.isInitLayout?(this.arrange(),void 0):(this._layout(),void 0)},c.prototype._layout=function(){var t=this._getIsInstant();this._resetLayout(),this._manageStamps(),this.layoutItems(this.filteredItems,t),this._isLayoutInited=!0},c.prototype.arrange=function(t){this.option(t),this._getIsInstant(),this.filteredItems=this._filter(this.items),this._sort(),this._layout()},c.prototype._init=c.prototype.arrange,c.prototype._getIsInstant=function(){var t=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;return this._isInstant=t,t},c.prototype._filter=function(t){function e(){f.reveal(n),f.hide(r)}var i=this.options.filter;i=i||"*";for(var o=[],n=[],r=[],s=this._getFilterTest(i),a=0,u=t.length;u>a;a++){var p=t[a];if(!p.isIgnored){var h=s(p);h&&o.push(p),h&&p.isHidden?n.push(p):h||p.isHidden||r.push(p)}}var f=this;return this._isInstant?this._noTransition(e):e(),o},c.prototype._getFilterTest=function(t){return s&&this.options.isJQueryFiltering?function(e){return s(e.element).is(t)}:"function"==typeof t?function(e){return t(e.element)}:function(e){return r(e.element,t)}},c.prototype.updateSortData=function(t){this._getSorters(),t=o(t);var e=this.getItems(t);e=e.length?e:this.items,this._updateItemsSortData(e)
},c.prototype._getSorters=function(){var t=this.options.getSortData;for(var e in t){var i=t[e];this._sorters[e]=d(i)}},c.prototype._updateItemsSortData=function(t){for(var e=0,i=t.length;i>e;e++){var o=t[e];o.updateSortData()}};var d=function(){function t(t){if("string"!=typeof t)return t;var i=a(t).split(" "),o=i[0],n=o.match(/^\[(.+)\]$/),r=n&&n[1],s=e(r,o),u=c.sortDataParsers[i[1]];return t=u?function(t){return t&&u(s(t))}:function(t){return t&&s(t)}}function e(t,e){var i;return i=t?function(e){return e.getAttribute(t)}:function(t){var i=t.querySelector(e);return i&&p(i)}}return t}();c.sortDataParsers={parseInt:function(t){return parseInt(t,10)},parseFloat:function(t){return parseFloat(t)}},c.prototype._sort=function(){var t=this.options.sortBy;if(t){var e=[].concat.apply(t,this.sortHistory),i=f(e,this.options.sortAscending);this.filteredItems.sort(i),t!==this.sortHistory[0]&&this.sortHistory.unshift(t)}},c.prototype._mode=function(){var t=this.options.layoutMode,e=this.modes[t];if(!e)throw Error("No layout mode: "+t);return e.options=this.options[t],e},c.prototype._resetLayout=function(){t.prototype._resetLayout.call(this),this._mode()._resetLayout()},c.prototype._getItemLayoutPosition=function(t){return this._mode()._getItemLayoutPosition(t)},c.prototype._manageStamp=function(t){this._mode()._manageStamp(t)},c.prototype._getContainerSize=function(){return this._mode()._getContainerSize()},c.prototype.needsResizeLayout=function(){return this._mode().needsResizeLayout()},c.prototype.appended=function(t){var e=this.addItems(t);if(e.length){var i=this._filterRevealAdded(e);this.filteredItems=this.filteredItems.concat(i)}},c.prototype.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps();var o=this._filterRevealAdded(e);this.layoutItems(i),this.filteredItems=o.concat(this.filteredItems)}},c.prototype._filterRevealAdded=function(t){var e=this._noTransition(function(){return this._filter(t)});return this.layoutItems(e,!0),this.reveal(e),t},c.prototype.insert=function(t){var e=this.addItems(t);if(e.length){var i,o,n=e.length;for(i=0;n>i;i++)o=e[i],this.element.appendChild(o.element);var r=this._filter(e);for(this._noTransition(function(){this.hide(r)}),i=0;n>i;i++)e[i].isLayoutInstant=!0;for(this.arrange(),i=0;n>i;i++)delete e[i].isLayoutInstant;this.reveal(r)}};var l=c.prototype.remove;return c.prototype.remove=function(t){t=o(t);var e=this.getItems(t);if(l.call(this,t),e&&e.length)for(var i=0,r=e.length;r>i;i++){var s=e[i];n(s,this.filteredItems)}},c.prototype._noTransition=function(t){var e=this.options.transitionDuration;this.options.transitionDuration=0;var i=t.call(this);return this.options.transitionDuration=e,i},c}var s=t.jQuery,a=String.prototype.trim?function(t){return t.trim()}:function(t){return t.replace(/^\s+|\s+$/g,"")},u=document.documentElement,p=u.textContent?function(t){return t.textContent}:function(t){return t.innerText},h=Object.prototype.toString,f=Array.prototype.indexOf?function(t,e){return t.indexOf(e)}:function(t,e){for(var i=0,o=t.length;o>i;i++)if(t[i]===e)return i;return-1};"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size","matches-selector/matches-selector","isotope/js/item","isotope/js/layout-mode","isotope/js/layout-modes/masonry","isotope/js/layout-modes/fit-rows","isotope/js/layout-modes/vertical"],r):t.Isotope=r(t.Outlayer,t.getSize,t.matchesSelector,t.Isotope.Item,t.Isotope.LayoutMode)}(window);;
/*! jCarousel - v0.3.1 - 2014-04-26
* http://sorgalla.com/jcarousel
* Copyright (c) 2014 Jan Sorgalla; Licensed MIT */
(function(t){"use strict";var i=t.jCarousel={};i.version="0.3.1";var s=/^([+\-]=)?(.+)$/;i.parseTarget=function(t){var i=!1,e="object"!=typeof t?s.exec(t):null;return e?(t=parseInt(e[2],10)||0,e[1]&&(i=!0,"-="===e[1]&&(t*=-1))):"object"!=typeof t&&(t=parseInt(t,10)||0),{target:t,relative:i}},i.detectCarousel=function(t){for(var i;t.length>0;){if(i=t.filter("[data-jcarousel]"),i.length>0)return i;if(i=t.find("[data-jcarousel]"),i.length>0)return i;t=t.parent()}return null},i.base=function(s){return{version:i.version,_options:{},_element:null,_carousel:null,_init:t.noop,_create:t.noop,_destroy:t.noop,_reload:t.noop,create:function(){return this._element.attr("data-"+s.toLowerCase(),!0).data(s,this),!1===this._trigger("create")?this:(this._create(),this._trigger("createend"),this)},destroy:function(){return!1===this._trigger("destroy")?this:(this._destroy(),this._trigger("destroyend"),this._element.removeData(s).removeAttr("data-"+s.toLowerCase()),this)},reload:function(t){return!1===this._trigger("reload")?this:(t&&this.options(t),this._reload(),this._trigger("reloadend"),this)},element:function(){return this._element},options:function(i,s){if(0===arguments.length)return t.extend({},this._options);if("string"==typeof i){if(s===void 0)return this._options[i]===void 0?null:this._options[i];this._options[i]=s}else this._options=t.extend({},this._options,i);return this},carousel:function(){return this._carousel||(this._carousel=i.detectCarousel(this.options("carousel")||this._element),this._carousel||t.error('Could not detect carousel for plugin "'+s+'"')),this._carousel},_trigger:function(i,e,r){var n,o=!1;return r=[this].concat(r||[]),(e||this._element).each(function(){n=t.Event((s+":"+i).toLowerCase()),t(this).trigger(n,r),n.isDefaultPrevented()&&(o=!0)}),!o}}},i.plugin=function(s,e){var r=t[s]=function(i,s){this._element=t(i),this.options(s),this._init(),this.create()};return r.fn=r.prototype=t.extend({},i.base(s),e),t.fn[s]=function(i){var e=Array.prototype.slice.call(arguments,1),n=this;return"string"==typeof i?this.each(function(){var r=t(this).data(s);if(!r)return t.error("Cannot call methods on "+s+" prior to initialization; "+'attempted to call method "'+i+'"');if(!t.isFunction(r[i])||"_"===i.charAt(0))return t.error('No such method "'+i+'" for '+s+" instance");var o=r[i].apply(r,e);return o!==r&&o!==void 0?(n=o,!1):void 0}):this.each(function(){var e=t(this).data(s);e instanceof r?e.reload(i):new r(this,i)}),n},r}})(jQuery),function(t,i){"use strict";var s=function(t){return parseFloat(t)||0};t.jCarousel.plugin("jcarousel",{animating:!1,tail:0,inTail:!1,resizeTimer:null,lt:null,vertical:!1,rtl:!1,circular:!1,underflow:!1,relative:!1,_options:{list:function(){return this.element().children().eq(0)},items:function(){return this.list().children()},animation:400,transitions:!1,wrap:null,vertical:null,rtl:null,center:!1},_list:null,_items:null,_target:null,_first:null,_last:null,_visible:null,_fullyvisible:null,_init:function(){var t=this;return this.onWindowResize=function(){t.resizeTimer&&clearTimeout(t.resizeTimer),t.resizeTimer=setTimeout(function(){t.reload()},100)},this},_create:function(){this._reload(),t(i).on("resize.jcarousel",this.onWindowResize)},_destroy:function(){t(i).off("resize.jcarousel",this.onWindowResize)},_reload:function(){this.vertical=this.options("vertical"),null==this.vertical&&(this.vertical=this.list().height()>this.list().width()),this.rtl=this.options("rtl"),null==this.rtl&&(this.rtl=function(i){if("rtl"===(""+i.attr("dir")).toLowerCase())return!0;var s=!1;return i.parents("[dir]").each(function(){return/rtl/i.test(t(this).attr("dir"))?(s=!0,!1):void 0}),s}(this._element)),this.lt=this.vertical?"top":"left",this.relative="relative"===this.list().css("position"),this._list=null,this._items=null;var i=this._target&&this.index(this._target)>=0?this._target:this.closest();this.circular="circular"===this.options("wrap"),this.underflow=!1;var s={left:0,top:0};return i.length>0&&(this._prepare(i),this.list().find("[data-jcarousel-clone]").remove(),this._items=null,this.underflow=this._fullyvisible.length>=this.items().length,this.circular=this.circular&&!this.underflow,s[this.lt]=this._position(i)+"px"),this.move(s),this},list:function(){if(null===this._list){var i=this.options("list");this._list=t.isFunction(i)?i.call(this):this._element.find(i)}return this._list},items:function(){if(null===this._items){var i=this.options("items");this._items=(t.isFunction(i)?i.call(this):this.list().find(i)).not("[data-jcarousel-clone]")}return this._items},index:function(t){return this.items().index(t)},closest:function(){var i,e=this,r=this.list().position()[this.lt],n=t(),o=!1,l=this.vertical?"bottom":this.rtl&&!this.relative?"left":"right";return this.rtl&&this.relative&&!this.vertical&&(r+=this.list().width()-this.clipping()),this.items().each(function(){if(n=t(this),o)return!1;var a=e.dimension(n);if(r+=a,r>=0){if(i=a-s(n.css("margin-"+l)),!(0>=Math.abs(r)-a+i/2))return!1;o=!0}}),n},target:function(){return this._target},first:function(){return this._first},last:function(){return this._last},visible:function(){return this._visible},fullyvisible:function(){return this._fullyvisible},hasNext:function(){if(!1===this._trigger("hasnext"))return!0;var t=this.options("wrap"),i=this.items().length-1;return i>=0&&!this.underflow&&(t&&"first"!==t||i>this.index(this._last)||this.tail&&!this.inTail)?!0:!1},hasPrev:function(){if(!1===this._trigger("hasprev"))return!0;var t=this.options("wrap");return this.items().length>0&&!this.underflow&&(t&&"last"!==t||this.index(this._first)>0||this.tail&&this.inTail)?!0:!1},clipping:function(){return this._element["inner"+(this.vertical?"Height":"Width")]()},dimension:function(t){return t["outer"+(this.vertical?"Height":"Width")](!0)},scroll:function(i,s,e){if(this.animating)return this;if(!1===this._trigger("scroll",null,[i,s]))return this;t.isFunction(s)&&(e=s,s=!0);var r=t.jCarousel.parseTarget(i);if(r.relative){var n,o,l,a,h,u,c,f,d=this.items().length-1,_=Math.abs(r.target),p=this.options("wrap");if(r.target>0){var g=this.index(this._last);if(g>=d&&this.tail)this.inTail?"both"===p||"last"===p?this._scroll(0,s,e):t.isFunction(e)&&e.call(this,!1):this._scrollTail(s,e);else if(n=this.index(this._target),this.underflow&&n===d&&("circular"===p||"both"===p||"last"===p)||!this.underflow&&g===d&&("both"===p||"last"===p))this._scroll(0,s,e);else if(l=n+_,this.circular&&l>d){for(f=d,h=this.items().get(-1);l>f++;)h=this.items().eq(0),u=this._visible.index(h)>=0,u&&h.after(h.clone(!0).attr("data-jcarousel-clone",!0)),this.list().append(h),u||(c={},c[this.lt]=this.dimension(h),this.moveBy(c)),this._items=null;this._scroll(h,s,e)}else this._scroll(Math.min(l,d),s,e)}else if(this.inTail)this._scroll(Math.max(this.index(this._first)-_+1,0),s,e);else if(o=this.index(this._first),n=this.index(this._target),a=this.underflow?n:o,l=a-_,0>=a&&(this.underflow&&"circular"===p||"both"===p||"first"===p))this._scroll(d,s,e);else if(this.circular&&0>l){for(f=l,h=this.items().get(0);0>f++;){h=this.items().eq(-1),u=this._visible.index(h)>=0,u&&h.after(h.clone(!0).attr("data-jcarousel-clone",!0)),this.list().prepend(h),this._items=null;var v=this.dimension(h);c={},c[this.lt]=-v,this.moveBy(c)}this._scroll(h,s,e)}else this._scroll(Math.max(l,0),s,e)}else this._scroll(r.target,s,e);return this._trigger("scrollend"),this},moveBy:function(t,i){var e=this.list().position(),r=1,n=0;return this.rtl&&!this.vertical&&(r=-1,this.relative&&(n=this.list().width()-this.clipping())),t.left&&(t.left=e.left+n+s(t.left)*r+"px"),t.top&&(t.top=e.top+n+s(t.top)*r+"px"),this.move(t,i)},move:function(i,s){s=s||{};var e=this.options("transitions"),r=!!e,n=!!e.transforms,o=!!e.transforms3d,l=s.duration||0,a=this.list();if(!r&&l>0)return a.animate(i,s),void 0;var h=s.complete||t.noop,u={};if(r){var c=a.css(["transitionDuration","transitionTimingFunction","transitionProperty"]),f=h;h=function(){t(this).css(c),f.call(this)},u={transitionDuration:(l>0?l/1e3:0)+"s",transitionTimingFunction:e.easing||s.easing,transitionProperty:l>0?function(){return n||o?"all":i.left?"left":"top"}():"none",transform:"none"}}o?u.transform="translate3d("+(i.left||0)+","+(i.top||0)+",0)":n?u.transform="translate("+(i.left||0)+","+(i.top||0)+")":t.extend(u,i),r&&l>0&&a.one("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd",h),a.css(u),0>=l&&a.each(function(){h.call(this)})},_scroll:function(i,s,e){if(this.animating)return t.isFunction(e)&&e.call(this,!1),this;if("object"!=typeof i?i=this.items().eq(i):i.jquery===void 0&&(i=t(i)),0===i.length)return t.isFunction(e)&&e.call(this,!1),this;this.inTail=!1,this._prepare(i);var r=this._position(i),n=this.list().position()[this.lt];if(r===n)return t.isFunction(e)&&e.call(this,!1),this;var o={};return o[this.lt]=r+"px",this._animate(o,s,e),this},_scrollTail:function(i,s){if(this.animating||!this.tail)return t.isFunction(s)&&s.call(this,!1),this;var e=this.list().position()[this.lt];this.rtl&&this.relative&&!this.vertical&&(e+=this.list().width()-this.clipping()),this.rtl&&!this.vertical?e+=this.tail:e-=this.tail,this.inTail=!0;var r={};return r[this.lt]=e+"px",this._update({target:this._target.next(),fullyvisible:this._fullyvisible.slice(1).add(this._visible.last())}),this._animate(r,i,s),this},_animate:function(i,s,e){if(e=e||t.noop,!1===this._trigger("animate"))return e.call(this,!1),this;this.animating=!0;var r=this.options("animation"),n=t.proxy(function(){this.animating=!1;var t=this.list().find("[data-jcarousel-clone]");t.length>0&&(t.remove(),this._reload()),this._trigger("animateend"),e.call(this,!0)},this),o="object"==typeof r?t.extend({},r):{duration:r},l=o.complete||t.noop;return s===!1?o.duration=0:t.fx.speeds[o.duration]!==void 0&&(o.duration=t.fx.speeds[o.duration]),o.complete=function(){n(),l.call(this)},this.move(i,o),this},_prepare:function(i){var e,r,n,o,l=this.index(i),a=l,h=this.dimension(i),u=this.clipping(),c=this.vertical?"bottom":this.rtl?"left":"right",f=this.options("center"),d={target:i,first:i,last:i,visible:i,fullyvisible:u>=h?i:t()};if(f&&(h/=2,u/=2),u>h)for(;;){if(e=this.items().eq(++a),0===e.length){if(!this.circular)break;if(e=this.items().eq(0),i.get(0)===e.get(0))break;if(r=this._visible.index(e)>=0,r&&e.after(e.clone(!0).attr("data-jcarousel-clone",!0)),this.list().append(e),!r){var _={};_[this.lt]=this.dimension(e),this.moveBy(_)}this._items=null}if(o=this.dimension(e),0===o)break;if(h+=o,d.last=e,d.visible=d.visible.add(e),n=s(e.css("margin-"+c)),u>=h-n&&(d.fullyvisible=d.fullyvisible.add(e)),h>=u)break}if(!this.circular&&!f&&u>h)for(a=l;;){if(0>--a)break;if(e=this.items().eq(a),0===e.length)break;if(o=this.dimension(e),0===o)break;if(h+=o,d.first=e,d.visible=d.visible.add(e),n=s(e.css("margin-"+c)),u>=h-n&&(d.fullyvisible=d.fullyvisible.add(e)),h>=u)break}return this._update(d),this.tail=0,f||"circular"===this.options("wrap")||"custom"===this.options("wrap")||this.index(d.last)!==this.items().length-1||(h-=s(d.last.css("margin-"+c)),h>u&&(this.tail=h-u)),this},_position:function(t){var i=this._first,s=i.position()[this.lt],e=this.options("center"),r=e?this.clipping()/2-this.dimension(i)/2:0;return this.rtl&&!this.vertical?(s-=this.relative?this.list().width()-this.dimension(i):this.clipping()-this.dimension(i),s+=r):s-=r,!e&&(this.index(t)>this.index(i)||this.inTail)&&this.tail?(s=this.rtl&&!this.vertical?s-this.tail:s+this.tail,this.inTail=!0):this.inTail=!1,-s},_update:function(i){var s,e=this,r={target:this._target||t(),first:this._first||t(),last:this._last||t(),visible:this._visible||t(),fullyvisible:this._fullyvisible||t()},n=this.index(i.first||r.first)<this.index(r.first),o=function(s){var o=[],l=[];i[s].each(function(){0>r[s].index(this)&&o.push(this)}),r[s].each(function(){0>i[s].index(this)&&l.push(this)}),n?o=o.reverse():l=l.reverse(),e._trigger(s+"in",t(o)),e._trigger(s+"out",t(l)),e["_"+s]=i[s]};for(s in i)o(s);return this}})}(jQuery,window),function(t){"use strict";t.jcarousel.fn.scrollIntoView=function(i,s,e){var r,n=t.jCarousel.parseTarget(i),o=this.index(this._fullyvisible.first()),l=this.index(this._fullyvisible.last());if(r=n.relative?0>n.target?Math.max(0,o+n.target):l+n.target:"object"!=typeof n.target?n.target:this.index(n.target),o>r)return this.scroll(r,s,e);if(r>=o&&l>=r)return t.isFunction(e)&&e.call(this,!1),this;for(var a,h=this.items(),u=this.clipping(),c=this.vertical?"bottom":this.rtl?"left":"right",f=0;;){if(a=h.eq(r),0===a.length)break;if(f+=this.dimension(a),f>=u){var d=parseFloat(a.css("margin-"+c))||0;f-d!==u&&r++;break}if(0>=r)break;r--}return this.scroll(r,s,e)}}(jQuery),function(t){"use strict";t.jCarousel.plugin("jcarouselControl",{_options:{target:"+=1",event:"click",method:"scroll"},_active:null,_init:function(){this.onDestroy=t.proxy(function(){this._destroy(),this.carousel().one("jcarousel:createend",t.proxy(this._create,this))},this),this.onReload=t.proxy(this._reload,this),this.onEvent=t.proxy(function(i){i.preventDefault();var s=this.options("method");t.isFunction(s)?s.call(this):this.carousel().jcarousel(this.options("method"),this.options("target"))},this)},_create:function(){this.carousel().one("jcarousel:destroy",this.onDestroy).on("jcarousel:reloadend jcarousel:scrollend",this.onReload),this._element.on(this.options("event")+".jcarouselcontrol",this.onEvent),this._reload()},_destroy:function(){this._element.off(".jcarouselcontrol",this.onEvent),this.carousel().off("jcarousel:destroy",this.onDestroy).off("jcarousel:reloadend jcarousel:scrollend",this.onReload)},_reload:function(){var i,s=t.jCarousel.parseTarget(this.options("target")),e=this.carousel();if(s.relative)i=e.jcarousel(s.target>0?"hasNext":"hasPrev");else{var r="object"!=typeof s.target?e.jcarousel("items").eq(s.target):s.target;i=e.jcarousel("target").index(r)>=0}return this._active!==i&&(this._trigger(i?"active":"inactive"),this._active=i),this}})}(jQuery),function(t){"use strict";t.jCarousel.plugin("jcarouselPagination",{_options:{perPage:null,item:function(t){return'<a href="#'+t+'">'+t+"</a>"},event:"click",method:"scroll"},_carouselItems:null,_pages:{},_items:{},_currentPage:null,_init:function(){this.onDestroy=t.proxy(function(){this._destroy(),this.carousel().one("jcarousel:createend",t.proxy(this._create,this))},this),this.onReload=t.proxy(this._reload,this),this.onScroll=t.proxy(this._update,this)},_create:function(){this.carousel().one("jcarousel:destroy",this.onDestroy).on("jcarousel:reloadend",this.onReload).on("jcarousel:scrollend",this.onScroll),this._reload()},_destroy:function(){this._clear(),this.carousel().off("jcarousel:destroy",this.onDestroy).off("jcarousel:reloadend",this.onReload).off("jcarousel:scrollend",this.onScroll),this._carouselItems=null},_reload:function(){var i=this.options("perPage");if(this._pages={},this._items={},t.isFunction(i)&&(i=i.call(this)),null==i)this._pages=this._calculatePages();else for(var s,e=parseInt(i,10)||0,r=this._getCarouselItems(),n=1,o=0;;){if(s=r.eq(o++),0===s.length)break;this._pages[n]=this._pages[n]?this._pages[n].add(s):s,0===o%e&&n++}this._clear();var l=this,a=this.carousel().data("jcarousel"),h=this._element,u=this.options("item"),c=this._getCarouselItems().length;t.each(this._pages,function(i,s){var e=l._items[i]=t(u.call(l,i,s));e.on(l.options("event")+".jcarouselpagination",t.proxy(function(){var t=s.eq(0);if(a.circular){var e=a.index(a.target()),r=a.index(t);parseFloat(i)>parseFloat(l._currentPage)?e>r&&(t="+="+(c-e+r)):r>e&&(t="-="+(e+(c-r)))}a[this.options("method")](t)},l)),h.append(e)}),this._update()},_update:function(){var i,s=this.carousel().jcarousel("target");t.each(this._pages,function(t,e){return e.each(function(){return s.is(this)?(i=t,!1):void 0}),i?!1:void 0}),this._currentPage!==i&&(this._trigger("inactive",this._items[this._currentPage]),this._trigger("active",this._items[i])),this._currentPage=i},items:function(){return this._items},reloadCarouselItems:function(){return this._carouselItems=null,this},_clear:function(){this._element.empty(),this._currentPage=null},_calculatePages:function(){for(var t,i=this.carousel().data("jcarousel"),s=this._getCarouselItems(),e=i.clipping(),r=0,n=0,o=1,l={};;){if(t=s.eq(n++),0===t.length)break;l[o]=l[o]?l[o].add(t):t,r+=i.dimension(t),r>=e&&(o++,r=0)}return l},_getCarouselItems:function(){return this._carouselItems||(this._carouselItems=this.carousel().jcarousel("items")),this._carouselItems}})}(jQuery),function(t){"use strict";t.jCarousel.plugin("jcarouselAutoscroll",{_options:{target:"+=1",interval:3e3,autostart:!0},_timer:null,_init:function(){this.onDestroy=t.proxy(function(){this._destroy(),this.carousel().one("jcarousel:createend",t.proxy(this._create,this))},this),this.onAnimateEnd=t.proxy(this.start,this)},_create:function(){this.carousel().one("jcarousel:destroy",this.onDestroy),this.options("autostart")&&this.start()},_destroy:function(){this.stop(),this.carousel().off("jcarousel:destroy",this.onDestroy)},start:function(){return this.stop(),this.carousel().one("jcarousel:animateend",this.onAnimateEnd),this._timer=setTimeout(t.proxy(function(){this.carousel().jcarousel("scroll",this.options("target"))},this),this.options("interval")),this},stop:function(){return this._timer&&(this._timer=clearTimeout(this._timer)),this.carousel().off("jcarousel:animateend",this.onAnimateEnd),this}})}(jQuery);;
(function ($) {

  Drupal.behaviors.pcpayments = {
    detach: function (context) {

    },
    attach: function (context, settings) {
      var request;

      var submitRequestForm = function(triggeringElement) {
        if (request){
          request.abort();
        }

        var form = $('#pcpayments-request-form');
        var url = form.attr('action');
        var data = form.serialize();
        form.css('cursor', 'wait');

        if (triggeringElement) {
          data = '_triggering_element_name=' + triggeringElement.attr("name") + '&' + data;
        }

        data = data + '&op=ajax';

        request = $.ajax({
          type: "POST",
          url: url,
          data: data,
          success: function(data){
            form.html(jQuery('#pcpayments-request-form', data).html());
            Drupal.attachBehaviors(form);
          },
          complete: function (){
            form.css('cursor', 'default');
          }
        });
      }

//      $('#pcpayments-request-form input[type="radio"]').once().change(function(){
//        submitRequestForm($(this));
//      });
    }
  }
})(jQuery);

;
jQuery(document).ready(function(e) {
    jQuery('#pcsegments_products_products .item-list').find('a')
	    .each(function (index, element) {
        id=jQuery(this).attr("class");
	    jQuery(this).parent().prepend('<span />');
		jQuery(this).parent().find('span').addClass('itemClass-'+id );
    });
	
	jQuery('#pctemplates-selection-form .form-item').eq(0).addClass('ieMargin');
	jQuery('#pctemplates-selection-form .form-item').eq(2).addClass('ieMargin');
	jQuery('#pctemplates-selection-form .form-item').eq(4).addClass('ieMargin');
});

(function ($) {
    Drupal.behaviors.pcsegments = {
        detach: function (context) {

        },
        attach: function (context, settings) {
            $('.page-segments .region-content fieldset').eq(0)
			    .find('.item-list ul').addClass('editedItemList');
            
        /****Template / Segement => Pages PopUps************/

		$('.templates').find('li a').each(function() {
			$(this).qtip({
				content: "<img src='" + $(this).find("img").attr("src") + "' />",
				position: {
					my: 'top left',
					target: 'mouse',
					viewport: $(window),
					adjust: {
						x: 10, y: 10
					}
				},
				hide: {
					fixed: true
				},
				style: 'qtip-shadow'
			});
		});
		
		$(function() {
			$('.editedItemList li a').each(function() {
				$(this).qtip({
					content: "<img src='" + $(this).find("img").attr("src") + "' />",
					position: {
						my: 'top left',
						target: 'mouse',
						viewport: $(window),
						adjust: {
							x: 10, y: 10
						}
					},
					hide: {
						fixed: true
					},
					style: 'qtip-shadow'
				});
			});
		});
	   

		/*********End Popups****************/

		if (settings.pcsegments.selected) {
			$('#block-pcsegments-products .content').tabs({
				selected: settings.pcsegments.selected
			});
		} else {
			$('#block-pcsegments-products .content').tabs();
		}

		$('#block-pcsegments-products li').once().click(function (event) {
			event.stopPropagation();
			if ($(this).children('a').next().length > 0) {
				$(this).children('a').next().slideToggle();
				return false;
			}
		}).children('a').next().hide();

		$('#block-pcsegments-templates li').once().click(function (event) {
			event.stopPropagation();
			if ($(this).children('a').next().length > 0) {
				$(this).children('a').next().slideToggle();
				return false;
			}
		}).children('a').next().hide();

		$('#block-pcsegments-menu .dropdown').each(function () {
			$(this).position({
				my: 'top left',
				at: 'bottom left',
				of: '#block-pcsegments-menu'
			});
		});

		$('#block-pcsegments-menu li').hover(function () {
			$('.dropdown', this).addClass('open');
			return false;
		}, function () {
			$('.dropdown', this).removeClass('open');
			return false;
		});

		$('.page-segments .region-content fieldset').eq(1).find('.item-list ul').imagesLoaded(function () {
			$(this).masonry({
				itemSelector: 'li',
				isAnimated: true,
				gutterWidth: 10,
				isFitWidth: true
			});

		});
	

        }
    }
})(jQuery);;
/*
 * jQuery UI Position 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Position
 */
(function(c){c.ui=c.ui||{};var n=/left|center|right/,o=/top|center|bottom/,t=c.fn.position,u=c.fn.offset;c.fn.position=function(b){if(!b||!b.of)return t.apply(this,arguments);b=c.extend({},b);var a=c(b.of),d=a[0],g=(b.collision||"flip").split(" "),e=b.offset?b.offset.split(" "):[0,0],h,k,j;if(d.nodeType===9){h=a.width();k=a.height();j={top:0,left:0}}else if(d.setTimeout){h=a.width();k=a.height();j={top:a.scrollTop(),left:a.scrollLeft()}}else if(d.preventDefault){b.at="left top";h=k=0;j={top:b.of.pageY,
left:b.of.pageX}}else{h=a.outerWidth();k=a.outerHeight();j=a.offset()}c.each(["my","at"],function(){var f=(b[this]||"").split(" ");if(f.length===1)f=n.test(f[0])?f.concat(["center"]):o.test(f[0])?["center"].concat(f):["center","center"];f[0]=n.test(f[0])?f[0]:"center";f[1]=o.test(f[1])?f[1]:"center";b[this]=f});if(g.length===1)g[1]=g[0];e[0]=parseInt(e[0],10)||0;if(e.length===1)e[1]=e[0];e[1]=parseInt(e[1],10)||0;if(b.at[0]==="right")j.left+=h;else if(b.at[0]==="center")j.left+=h/2;if(b.at[1]==="bottom")j.top+=
k;else if(b.at[1]==="center")j.top+=k/2;j.left+=e[0];j.top+=e[1];return this.each(function(){var f=c(this),l=f.outerWidth(),m=f.outerHeight(),p=parseInt(c.curCSS(this,"marginLeft",true))||0,q=parseInt(c.curCSS(this,"marginTop",true))||0,v=l+p+parseInt(c.curCSS(this,"marginRight",true))||0,w=m+q+parseInt(c.curCSS(this,"marginBottom",true))||0,i=c.extend({},j),r;if(b.my[0]==="right")i.left-=l;else if(b.my[0]==="center")i.left-=l/2;if(b.my[1]==="bottom")i.top-=m;else if(b.my[1]==="center")i.top-=m/2;
i.left=Math.round(i.left);i.top=Math.round(i.top);r={left:i.left-p,top:i.top-q};c.each(["left","top"],function(s,x){c.ui.position[g[s]]&&c.ui.position[g[s]][x](i,{targetWidth:h,targetHeight:k,elemWidth:l,elemHeight:m,collisionPosition:r,collisionWidth:v,collisionHeight:w,offset:e,my:b.my,at:b.at})});c.fn.bgiframe&&f.bgiframe();f.offset(c.extend(i,{using:b.using}))})};c.ui.position={fit:{left:function(b,a){var d=c(window);d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();b.left=
d>0?b.left-d:Math.max(b.left-a.collisionPosition.left,b.left)},top:function(b,a){var d=c(window);d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();b.top=d>0?b.top-d:Math.max(b.top-a.collisionPosition.top,b.top)}},flip:{left:function(b,a){if(a.at[0]!=="center"){var d=c(window);d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();var g=a.my[0]==="left"?-a.elemWidth:a.my[0]==="right"?a.elemWidth:0,e=a.at[0]==="left"?a.targetWidth:-a.targetWidth,h=-2*a.offset[0];b.left+=
a.collisionPosition.left<0?g+e+h:d>0?g+e+h:0}},top:function(b,a){if(a.at[1]!=="center"){var d=c(window);d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();var g=a.my[1]==="top"?-a.elemHeight:a.my[1]==="bottom"?a.elemHeight:0,e=a.at[1]==="top"?a.targetHeight:-a.targetHeight,h=-2*a.offset[1];b.top+=a.collisionPosition.top<0?g+e+h:d>0?g+e+h:0}}}};if(!c.offset.setOffset){c.offset.setOffset=function(b,a){if(/static/.test(c.curCSS(b,"position")))b.style.position="relative";var d=c(b),
g=d.offset(),e=parseInt(c.curCSS(b,"top",true),10)||0,h=parseInt(c.curCSS(b,"left",true),10)||0;g={top:a.top-g.top+e,left:a.left-g.left+h};"using"in a?a.using.call(b,g):d.css(g)};c.fn.offset=function(b){var a=this[0];if(!a||!a.ownerDocument)return null;if(b)return this.each(function(){c.offset.setOffset(this,b)});return u.call(this)}}})(jQuery);
;
/*
 * jQuery UI Autocomplete 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Autocomplete
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 */
(function(d){d.widget("ui.autocomplete",{options:{appendTo:"body",delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null},_create:function(){var a=this,b=this.element[0].ownerDocument,f;this.element.addClass("ui-autocomplete-input").attr("autocomplete","off").attr({role:"textbox","aria-autocomplete":"list","aria-haspopup":"true"}).bind("keydown.autocomplete",function(c){if(!(a.options.disabled||a.element.attr("readonly"))){f=false;var e=d.ui.keyCode;switch(c.keyCode){case e.PAGE_UP:a._move("previousPage",
c);break;case e.PAGE_DOWN:a._move("nextPage",c);break;case e.UP:a._move("previous",c);c.preventDefault();break;case e.DOWN:a._move("next",c);c.preventDefault();break;case e.ENTER:case e.NUMPAD_ENTER:if(a.menu.active){f=true;c.preventDefault()}case e.TAB:if(!a.menu.active)return;a.menu.select(c);break;case e.ESCAPE:a.element.val(a.term);a.close(c);break;default:clearTimeout(a.searching);a.searching=setTimeout(function(){if(a.term!=a.element.val()){a.selectedItem=null;a.search(null,c)}},a.options.delay);
break}}}).bind("keypress.autocomplete",function(c){if(f){f=false;c.preventDefault()}}).bind("focus.autocomplete",function(){if(!a.options.disabled){a.selectedItem=null;a.previous=a.element.val()}}).bind("blur.autocomplete",function(c){if(!a.options.disabled){clearTimeout(a.searching);a.closing=setTimeout(function(){a.close(c);a._change(c)},150)}});this._initSource();this.response=function(){return a._response.apply(a,arguments)};this.menu=d("<ul></ul>").addClass("ui-autocomplete").appendTo(d(this.options.appendTo||
"body",b)[0]).mousedown(function(c){var e=a.menu.element[0];d(c.target).closest(".ui-menu-item").length||setTimeout(function(){d(document).one("mousedown",function(g){g.target!==a.element[0]&&g.target!==e&&!d.ui.contains(e,g.target)&&a.close()})},1);setTimeout(function(){clearTimeout(a.closing)},13)}).menu({focus:function(c,e){e=e.item.data("item.autocomplete");false!==a._trigger("focus",c,{item:e})&&/^key/.test(c.originalEvent.type)&&a.element.val(e.value)},selected:function(c,e){var g=e.item.data("item.autocomplete"),
h=a.previous;if(a.element[0]!==b.activeElement){a.element.focus();a.previous=h;setTimeout(function(){a.previous=h;a.selectedItem=g},1)}false!==a._trigger("select",c,{item:g})&&a.element.val(g.value);a.term=a.element.val();a.close(c);a.selectedItem=g},blur:function(){a.menu.element.is(":visible")&&a.element.val()!==a.term&&a.element.val(a.term)}}).zIndex(this.element.zIndex()+1).css({top:0,left:0}).hide().data("menu");d.fn.bgiframe&&this.menu.element.bgiframe()},destroy:function(){this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup");
this.menu.element.remove();d.Widget.prototype.destroy.call(this)},_setOption:function(a,b){d.Widget.prototype._setOption.apply(this,arguments);a==="source"&&this._initSource();if(a==="appendTo")this.menu.element.appendTo(d(b||"body",this.element[0].ownerDocument)[0])},_initSource:function(){var a=this,b,f;if(d.isArray(this.options.source)){b=this.options.source;this.source=function(c,e){e(d.ui.autocomplete.filter(b,c.term))}}else if(typeof this.options.source==="string"){f=this.options.source;this.source=
function(c,e){a.xhr&&a.xhr.abort();a.xhr=d.ajax({url:f,data:c,dataType:"json",success:function(g,h,i){i===a.xhr&&e(g);a.xhr=null},error:function(g){g===a.xhr&&e([]);a.xhr=null}})}}else this.source=this.options.source},search:function(a,b){a=a!=null?a:this.element.val();this.term=this.element.val();if(a.length<this.options.minLength)return this.close(b);clearTimeout(this.closing);if(this._trigger("search",b)!==false)return this._search(a)},_search:function(a){this.element.addClass("ui-autocomplete-loading");
this.source({term:a},this.response)},_response:function(a){if(a&&a.length){a=this._normalize(a);this._suggest(a);this._trigger("open")}else this.close();this.element.removeClass("ui-autocomplete-loading")},close:function(a){clearTimeout(this.closing);if(this.menu.element.is(":visible")){this.menu.element.hide();this.menu.deactivate();this._trigger("close",a)}},_change:function(a){this.previous!==this.element.val()&&this._trigger("change",a,{item:this.selectedItem})},_normalize:function(a){if(a.length&&
a[0].label&&a[0].value)return a;return d.map(a,function(b){if(typeof b==="string")return{label:b,value:b};return d.extend({label:b.label||b.value,value:b.value||b.label},b)})},_suggest:function(a){var b=this.menu.element.empty().zIndex(this.element.zIndex()+1);this._renderMenu(b,a);this.menu.deactivate();this.menu.refresh();b.show();this._resizeMenu();b.position(d.extend({of:this.element},this.options.position))},_resizeMenu:function(){var a=this.menu.element;a.outerWidth(Math.max(a.width("").outerWidth(),
this.element.outerWidth()))},_renderMenu:function(a,b){var f=this;d.each(b,function(c,e){f._renderItem(a,e)})},_renderItem:function(a,b){return d("<li></li>").data("item.autocomplete",b).append(d("<a></a>").text(b.label)).appendTo(a)},_move:function(a,b){if(this.menu.element.is(":visible"))if(this.menu.first()&&/^previous/.test(a)||this.menu.last()&&/^next/.test(a)){this.element.val(this.term);this.menu.deactivate()}else this.menu[a](b);else this.search(null,b)},widget:function(){return this.menu.element}});
d.extend(d.ui.autocomplete,{escapeRegex:function(a){return a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")},filter:function(a,b){var f=new RegExp(d.ui.autocomplete.escapeRegex(b),"i");return d.grep(a,function(c){return f.test(c.label||c.value||c)})}})})(jQuery);
(function(d){d.widget("ui.menu",{_create:function(){var a=this;this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({role:"listbox","aria-activedescendant":"ui-active-menuitem"}).click(function(b){if(d(b.target).closest(".ui-menu-item a").length){b.preventDefault();a.select(b)}});this.refresh()},refresh:function(){var a=this;this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","menuitem").children("a").addClass("ui-corner-all").attr("tabindex",
-1).mouseenter(function(b){a.activate(b,d(this).parent())}).mouseleave(function(){a.deactivate()})},activate:function(a,b){this.deactivate();if(this.hasScroll()){var f=b.offset().top-this.element.offset().top,c=this.element.attr("scrollTop"),e=this.element.height();if(f<0)this.element.attr("scrollTop",c+f);else f>=e&&this.element.attr("scrollTop",c+f-e+b.height())}this.active=b.eq(0).children("a").addClass("ui-state-hover").attr("id","ui-active-menuitem").end();this._trigger("focus",a,{item:b})},
deactivate:function(){if(this.active){this.active.children("a").removeClass("ui-state-hover").removeAttr("id");this._trigger("blur");this.active=null}},next:function(a){this.move("next",".ui-menu-item:first",a)},previous:function(a){this.move("prev",".ui-menu-item:last",a)},first:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},last:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},move:function(a,b,f){if(this.active){a=this.active[a+"All"](".ui-menu-item").eq(0);
a.length?this.activate(f,a):this.activate(f,this.element.children(b))}else this.activate(f,this.element.children(b))},nextPage:function(a){if(this.hasScroll())if(!this.active||this.last())this.activate(a,this.element.children(".ui-menu-item:first"));else{var b=this.active.offset().top,f=this.element.height(),c=this.element.children(".ui-menu-item").filter(function(){var e=d(this).offset().top-b-f+d(this).height();return e<10&&e>-10});c.length||(c=this.element.children(".ui-menu-item:last"));this.activate(a,
c)}else this.activate(a,this.element.children(".ui-menu-item").filter(!this.active||this.last()?":first":":last"))},previousPage:function(a){if(this.hasScroll())if(!this.active||this.first())this.activate(a,this.element.children(".ui-menu-item:last"));else{var b=this.active.offset().top,f=this.element.height();result=this.element.children(".ui-menu-item").filter(function(){var c=d(this).offset().top-b+f-d(this).height();return c<10&&c>-10});result.length||(result=this.element.children(".ui-menu-item:first"));
this.activate(a,result)}else this.activate(a,this.element.children(".ui-menu-item").filter(!this.active||this.first()?":last":":first"))},hasScroll:function(){return this.element.height()<this.element.attr("scrollHeight")},select:function(a){this._trigger("selected",a,{item:this.active})}})})(jQuery);
;
;
(function ($) {
        Drupal.behaviors.pctemplates = {
            detach: function (context) {},
            attach: function (context, settings) {
                $(".item-list ul.type-1 li a").toggle(function () {
                        $(this).addClass("designSelectedColor");
                        $(this).attr('isselected', true);
                    }, function () {
                        $(this).removeClass("designSelectedColor");
                        $(this).removeAttr('isselected');
                    });
                $('.page-templates .filters fieldset').each(function (index, element) {
                        var titles = $(this).find('legend').html();
                        $(this).find('legend').unwrap();
                        $(this).find('legend span').wrap('<a>');
                    });
                $('.page-templates .filters').find('legend span')
                    .wrap('<a href="#"></a>');
                $('.page-templates .filters').find('legend a')
                    .unwrap().wrap('<h3></h3>');
                $('.page-templates .filters').find('h3 , div.fieldset-wrapper').wrapAll('<div id="accordion"></div>');
                var bloc = $('#pctemplates-selection-form').find('ul.selected').parent().clone();
                $('#pctemplates-selection-form').find('ul.selected').parent().remove();
                $('#edit-colors').after(bloc);
                var ownDesignBloc = $('.owndesigntop').parent().clone();
                $('.owndesigntop').parent().remove();
                $('#pctemplates-selection-form').before(ownDesignBloc);
                $('.owndesigntop').parent().addClass('newDesignUpload');
                $('.rectoThumb').hover(function () {
                        var position = jQuery(this).position();
                        $(this).find('.rectoLarge').css('position', 'absolute')
                            .css('left', position.left - 150)
                            .css('top', position.top - 40)
                            .addClass('borderShownImage')
                            .stop()
                            .fadeIn(500)
                            .show();
                    }, function () {
                        $(this).find('.rectoLarge')
                            .removeAttr('style')
                            .removeClass('borderShownImage')
                            .stop()
                            .fadeOut(500)
                            .hide();
                    });
                $('.versoThumb').hover(function () {
                        var position = jQuery(this).position();
                        $(this).find('.versoLarge').css('position', 'absolute')
                            .css('left', position.left - 400)
                            .css('top', position.top - 40)
                            .addClass('borderShownImage')
                            .stop()
                            .fadeIn(500)
                            .show();
                    }, function () {
                        $(this).find('.versoLarge').removeAttr('style')
                            .removeClass('borderShownImage')
                            .stop()
                            .fadeOut(500)
                            .hide();
                    });
                $("#pctemplates-configblock-form").ajaxStart(function () {
                        $(this).css('cursor', 'progress');
                    });
                $("#pctemplates-configblock-form").ajaxStop(function () {
                        $(this).css('cursor', 'default');
                    });
                $('#pctemplates-configblock-form tr.custom td.qty').html($('#pctemplates-configblock-form .form-item-custom-quantity'));
                $('#pctemplates-configblock-form .form-item-custom-quantity label').once(function () {
                        var row = $('<tr></tr>');
                        var cell = $('<td colspan="3"></td>');
                        $(this).appendTo(cell);
                        cell.appendTo(row);
                        row.insertBefore('#pctemplates-configblock-form tr.custom');
                    });
                $('#pctemplates-configblock-form .form-item-custom-quantity input').keyup(function () {
                        $('#pctemplates-configblock-form table tr.custom input').attr('checked', true);
                    }).blur(function () {
                        $('#pctemplates-configblock-form table tr.custom input').trigger('change');
                    });
                if ($.fancybox) {
                    $('#pctemplates-configblock-form .fancybox').fancybox({
                            padding: 0,
                            margin: 0,
                            scrolling: false,
                            autoScale: false,
                            hideOnOverlayClick: false,
                            autoDimensions: true
                        });
                    $('#pctemplates-configblock-form .designtool').fancybox({
                            width: 815,
                            height: 610,
                            padding: 5,
                            margin: 0,
                            scrolling: false,
                            autoScale: false,
                            hideOnOverlayClick: false,
                            autoDimensions: false,
                            modal: true,
                            onStart: function () {
                                jQuery("#fancybox-outer").append("<div id='dt_preloader'></div>");
                            },
                            onComplete: function () {}
                        });
                }
                $('#pctemplates-config-form .page', context).click(function () {
                        $('#pctemplates-configblock-form .designtool').first().click();
                    });
                $('#pctemplates-config-form2 input[type="text"]').once().click(function () {
                        return false;
                    });
                $('#block-pctemplates-specifications', context).once('movespecstoblock', function () {
                        var specs = $('#pctemplates-config-form2 .specifications');
                        $('.content *', this).remove();
                        specs.clone().appendTo($('.content', this));
                        $('#pctemplates-selection-form').children('div').prepend(specs);
                    });
                $('#block-pctemplates-selection').once('moveselectiontoblock', function () {
                        var filters = $('#pctemplates-selection-form .filters');
                        var form = $('#pctemplates-selection-form');
                        $('#pctemplates-selection-form').children('div').prepend(filters);
                        $('input[type="submit"]', this).click(function () {
                                var value = $('#block-pctemplates-selection input[type="text"]').val();
                                $('input[type="text"]', form).val(value);
                                form.submit();
                            });
                    });
                $('#edit-submit').click(function () {
                        $('#edit-colors').find('li a[isselected="true"]').each(function () {
                                $("<input>").attr({
                                        'type': 'hidden',
                                        'name': $(this).attr('parent-id') + '' + $(this).attr('data-id')
                                    }).val($(this).attr('data-id')).appendTo($('#pctemplates-selection-form'));
                            });
                        $('#pctemplates-selection-form').submit();
                    });
                $('#pctemplates-config-form2 input[type="text"]').once().click(function () {
                        $(this).parents('tr').find('input[type=radio]').attr('checked', true);
                        return false;
                    }).keypress(function (e) {
                        if (e.which == 13) {
                            $(this).blur();
                            return false;
                        }
                        if (e.which == 13) e.preventDefault();
                    });
                $('#pctemplates-config-form2 .dropdown').once().each(function () {
                        var item = $(this).prev();
                        var select = $('select', item);
                        var selected = $('option:selected', select);
                        var replacement = $('<a href="#" class="text"/>');
                        var dropdown = $(this);
                        select.hide();
                        replacement.html(selected.text());
                        item.append(replacement);
                        dropdown.hide();
                        item.click(function () {
                                item.toggleClass('expanded');
                                dropdown.slideToggle(function () {
                                        item.toggleClass('open');
                                    });
                                return false;
                            });
                        $('a', dropdown).click(function () {
                                var val = $(this).attr('id');
                                select.val(val).trigger('change');
                                replacement.html($('option:selected', select).text());
                                $('input[type="radio"]', this).attr('checked', true);
                                dropdown.slideUp(function () {
                                        item.removeClass('open');
                                    });
                                return false;
                            });
                    });
                    
        var segments = [];   
        $('select#edit-segments').find('option').each(function() {
                 segments.push($(this).text());
    	});
       
       if($('#edit-inputsegments').length){
	$("#edit-inputsegments").autocomplete({	
            source: segments,
            select: function( event, ui ) {                  
                $("select#edit-segments option").filter(function() {
                    return $(this).text() == ui.item.value; 
                }).attr('selected', true);                  
            },
	});
     }
                        
                        
                    
            }
        }
    })(jQuery);;
(function ($) {

  var pcvatRequest;

  $.fn.vatfieldValidate = function(change){

    if ($(this).length){
      if (pcvatRequest){
        //pcvatRequest.abort();
      }

      var control = $(this);
      var number = $('.number', control);
      var country = $('.country', control); 

      number.removeClass('error');
      number.removeClass('validated');

      if (number.val() !='' && country.val() != '') {
        //pcvatRequest = $.getJSON('http://isvat.appspot.com/' + country.val() + '/' + number.val() + '/?callback=?', function(data){
        pcvatRequest = $.getJSON(Drupal.settings.basePath + 'index.php?q=/js/pcvat/' + country.val() + '/' + number.val(), function(data){
          if (data == false){
            number.addClass('error');
          }
          else{
            number.addClass('validated');
          }
          if (change){
            control.trigger('changed');
          }
        });
      }
    }
  }

  Drupal.behaviors.pcvat = {
    detach: function (context) {
    },
    attach: function (context, settings) {

      $('.form-type-vatfield').once('vat-validation').each(function(){
        var control = $(this);
        $(control).vatfieldValidate(false);

        $('.number, .country', this).once('vat-validation-change').change(function (){
          //control.trigger('change');
          $(control).vatfieldValidate(true);
        });

         //$('.number', this).trigger('change');
      });
    }
  }
})(jQuery);;

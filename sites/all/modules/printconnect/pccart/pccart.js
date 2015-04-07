(function ($) {
  Drupal.behaviors.pccart = {
    detach: function (context) {

    },
    attach: function (context, settings) {
   $('.page-products .all-products .item-list li:nth-child(3n)').addClass('right-item');
      
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
          height: '100%',
          padding: 5,
          margin: 0,
          scrolling: false,
          autoScale: false,
          hideOnOverlayClick: false,
          autoDimensions: false,
          modal: false,
          onStart: function() {
            jQuery("#fancybox-wrap").css("height","100%");
             jQuery(".fancybox-bg").css("background-image","none");
          },
          onComplete: function(){
            jQuery("#fancybox-wrap").css("height","100%");
            jQuery(".fancybox-bg").css("background-image","none");
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
     // remove control 
    $('#pccart-cart-form .removecontrol').once().click(function(){
        if (confirm("Voulez-vous supprimer le controle  professionnel ?")) {              
            $.post('cart/controlprof/'+$(this).attr('rel')+'/delete',{},function(){             
            }).done(function() {
                 location.reload();
            });
            return false;             
        }else{             
            return false;        
        } 
      });

        $("#pccart-cart-form input.targetPrice").mousedown(function () {
           if ($(this).is(":not(:checked)")){
                if($(this).val() ==  84){
               var shpping = '<input type="hidden" name="shpping" value="14.99">';
              $("#pccart-cart-form #hiddenPrices").append(shpping);
                }else{
                    $("input[name='shpping']").remove();
                }
                PriceCallback();
           }
         });


           /* ------------Remove items------------*/ 

        $("#pccart-cart-form .removecart").once().click(function () {
            itemid = $(this).siblings('.itemID').text();
            $(this).parents('.item').fadeOut("slow");
            var url = "cart/" + itemid + "/delete";
            var nameitemid = "cart[items][hidden][" + itemid + "]";
            var form = jQuery('#pccart-cart-form');
            $.ajax({
                type: "POST",
                url: url,
                success: function (data) {
                    form.html(jQuery('#pccart-cart-form', data).html());
                    Drupal.attachBehaviors(form);
                }
            });
            $("input[name='"+nameitemid+"']").remove();
             PriceCallback();
        });

            /* ------------------------------*/ 
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


function PriceCallback(){
    var map = [];
    var totalprice = 0;
    jQuery("#pccart-cart-form #hiddenPrices input").each(function() {
        map.push(parseFloat(jQuery(this).val()));
    });
    map.forEach(function(Price) {
        totalprice += Price;
    });
    var whole = (totalprice.toFixed(2) +"").split(".")[0];
    var decPart = (totalprice.toFixed(2) +"").split(".")[1];
    jQuery("#pccart-cart-form .subtotal .value").html(
    "<span class='whole'>"+ whole +"</span><span class='decimalpoint'>,</span><span class='decimals'>"+decPart+"</span><span class='currency'> €</span>");
       
    var vat = 0.21 ;
    vatprice = totalprice * vat ;
    
    var wholevat = (vatprice.toFixed(2) +"").split(".")[0];
    var decPartvat = (vatprice.toFixed(2) +"").split(".")[1];
    jQuery("#pccart-cart-form .vat .value").html(
    "<span class='whole'>"+ wholevat +"</span><span class='decimalpoint'>,</span><span class='decimals'>"+decPartvat+"</span><span class='currency'> €</span>");
   

    total = vatprice + totalprice;
    
    var wholevat = (total.toFixed(2) +"").split(".")[0];
    var decPartvat = (total.toFixed(2) +"").split(".")[1];
    jQuery("#pccart-cart-form #price .value").html(
    "<span class='whole'>"+ wholevat +"</span><span class='decimalpoint'>,</span><span class='decimals'>"+decPartvat+"</span><span class='currency'> €</span>");
   

}




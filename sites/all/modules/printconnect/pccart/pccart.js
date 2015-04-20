
(function ($) {
  Drupal.behaviors.pccart = {
    detach: function (context) {
    },
    attach: function (context, settings) {
 
    $("#pccart-cart-form input.targetPrice").mousedown(function () {
           if ($(this).is(":not(:checked)")){
               if($(this).val() ==  84){
               var shpping = '<input type="hidden" name="shpping" value="14.99">';
               $("#pccart-cart-form #hiddenPrices").append(shpping);
                }else{
                    $("input[name='shpping']").remove();
                }
                PriceCallback();
                $.post('cart/'+$(this).val()+'/submit');
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
    
    
    
    }}
})(jQuery);

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
   if(total == 0){
    jQuery("#pccart-cart-form").find(jQuery('input[type="submit"]')).attr('disabled','disabled');
   }
}


jQuery(document).ready(function(){
    jQuery("#edit-cart-discount-add").click(function (event) {
     event.preventDefault();
      var disocuntname = jQuery("#pccart-cart-form #edit-cart-discount-code").val();
        jQuery.ajax({
            type: "POST",
            url :'cart/discount',
            data : {
                code :disocuntname
            },
            dataType : 'json',
            success: function (data) {
                if (!isNaN(data.discountAmount)){
                    var disocunt = '<input type="hidden" name="disocunt" value="-' + data.discountAmount+  '">';
                    jQuery("#pccart-cart-form #hiddenPrices").append(disocunt);
                    PriceCallback();
                    if (jQuery(".lodediscounts")[0]) {
                        jQuery("#pccart-cart-form .lodediscounts #edit-cart-discounts .fieldset-wrapper").append("<div class='form-wrapper'><div class='prefix form-wrapper'>Promo</div><div class='description form-wrapper'><span class='styleprice price'><span class='value'><span class='whole'>"+data.discountAmount+"</span><span class='decimalpoint'>,</span><span class='decimals'>00</span>&nbsp;<span class='currency'>€</span></span></span><div class='form-wrapper'>Vous utilisez:" + disocuntname + "</div></div></div>");
                    }else{
                        if (jQuery("#fieldsetjsDiscount")[0]) {
                            jQuery("#pccart-cart-form .jsDiscount #fieldsetjsDiscount #edit-cart-discounts .fieldset-wrapper").append("<div  class='form-wrapper'><div class='prefix form-wrapper'>Promo</div><div class='description form-wrapper'><span class='styleprice price'><span class='value'><span class='whole'>"+data.discountAmount+"</span><span class='decimalpoint'>,</span><span class='decimals'>00</span>&nbsp;<span class='currency'>€</span></span></span><div class='form-wrapper'>Vous utilisez:" + disocuntname + "</div></div></div>");
                        } else {
                            jQuery("#pccart-cart-form .jsDiscount").append("<div id='fieldsetjsDiscount'><fieldset class='discounts item form-wrappersss' id='edit-cart-discounts'><legend><span class='fieldset-legend'>Réductions</span></legend><div class='fieldset-wrapper'><div  class='form-wrapper'><div class='prefix form-wrapper'>Promo</div><div class='description form-wrapper'><span class='styleprice price'><span class='value'><span class='whole'>"+data.discountAmount+"</span><span class='decimalpoint'>,</span><span class='decimals'>00</span>&nbsp;<span class='currency'>€</span></span></span><div class='form-wrapper'>Vous utilisez:" + disocuntname + "</div></div></div></div></fieldset></div>");

                        }
                    }
                }
            }
        });

     
    });

});
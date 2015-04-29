
(function ($) {
  Drupal.behaviors.pccart = {
    detach: function (context) {
    },
    attach: function (context, settings) {

   $('.refCustomer').blur(function() {
	$.post('cart/customer/ref/'+$(this).attr('cart'),{'ref' : $(this).val()});       
   });

   $('.refjobTxt').blur(function(){
       $.post('cart/job/ref/'+$(this).attr('orderItem'),{'ref' : $(this).val()});
   }); 
   
   $('.removecontrol').click(function(){
	$.post('cart/controlprof/'+$(this).attr('rel')+'/delete');
	$(this).parent().fadeOut("slow");
	$(this).parent().remove();
	$('.itemfile-'+$(this).attr('rel')).remove();
	PriceCallback();
		
	return false;
   });

   $('.deletedesign').click(function(e){
	$.post(Drupal.settings.basePath+'/designdelete/'+$(this).attr('itemFileId').val());
	PriceCallback();
        return false;
   });
   
    $('table.targetPrice tr').each(function(){
	if ($(this).find('input.targetPrice').is(":checked") && $(this).find('.storeLink').length > 0){
		$(this).find('.storeLink').show();
	}
	
   });
   $('table.targetPrice tr').mousedown(function () {
	   $('.storeLink').hide();
	   if ($(this).find('.storeLink').length > 0) {
	       $(this).find('.storeLink').show();
	   }
           if ($(this).find('input.targetPrice').is(":not(:checked)")){
               if($(this).find('input.targetPrice').val() ==  84){
               var shpping = '<input type="hidden" name="shpping" value="14.99">';
               $("#pccart-cart-form #hiddenPrices").append(shpping);
                }else{
                    $("input[name='shpping']").remove();
                }
                PriceCallback();
                $.post('cart/'+$(this).find('input.targetPrice').val()+'/submit');
           }
   });

    /* ------------Remove items------------*/ 

        $("#pccart-cart-form .removecart").live('click',function () {
	    var targetItem = $(this);
            itemid = $(this).siblings('.itemID').text();
            $(this).parents('.item').fadeOut("slow");
            var url = "cart/" + itemid + "/delete";
            var nameitemid = "cart[items][hidden][" + itemid + "]";
            var form = jQuery('#pccart-cart-form');
            $.ajax({
                type: "POST",
                url: url,
                success: function (data) {
                    //form.html(jQuery('#pccart-cart-form', data).html());
                    //Drupal.attachBehaviors(form);
		    targetItem.parents('job').remove();
                }
            });
            $("input[name='"+nameitemid+"']").remove();
	    $('.item-' + itemid).remove();
	    if ($('.fotolia-items-'+itemid).length < $('.fotolia-items').length) {
		$('.fotolia-items-'+itemid).parent().remove();
	    } else if ($('.fotolia-items-'+itemid).length == $('.fotolia-items').length) {
		$('.fotolia-items-'+itemid).parents('fieldset').remove();
	    }
	    var baseText = $('.cartCounter').attr('translatedtext');
	    var number = $('.cartCounter').attr('number') - 1;
	    $('.cartCounter').attr('number', number);
	    $('.cartCounter span').html(baseText+ ' ('+number+')');
	    if (number <= 0) {
		window.location.replace('/products/');
	    }
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
                        jQuery("#pccart-cart-form .lodediscounts #edit-cart-discounts .fieldset-wrapper").append("<div class='form-wrapper'><div class='prefix form-wrapper'>Promo</div><div class='description form-wrapper'><span class='styleprice price'><span class='value'><span class='whole'>- "+data.discountAmount+"</span><span class='decimalpoint'>,</span><span class='decimals'>00</span>&nbsp;<span class='currency'>€</span></span></span><div class='form-wrapper'>Vous utilisez:" + data.orderItemDiscount.discountId + "</div><div id='edit-cart-discounts-20272-description-items-description' class='form-wrapper'>Code de test pour "+data.orderItemDiscount.productName+"</div></div></div>");
                    }else{
                        if (jQuery("#fieldsetjsDiscount")[0]) {
                            jQuery("#pccart-cart-form .jsDiscount #fieldsetjsDiscount #edit-cart-discounts .fieldset-wrapper").append("<div  class='form-wrapper'><div class='prefix form-wrapper'>Promo</div><div class='description form-wrapper'><span class='styleprice price'><span class='value'><span class='whole'>- "+data.discountAmount+"</span><span class='decimalpoint'>,</span><span class='decimals'>00</span>&nbsp;<span class='currency'>€</span></span></span><div class='form-wrapper'>Vous utilisez:" + data.orderItemDiscount.discountId + "</div><div id='edit-cart-discounts-20272-description-items-description' class='form-wrapper'>Code de test pour "+data.orderItemDiscount.productName+"</div></div></div>");
                        } else {
                            jQuery("#pccart-cart-form .jsDiscount").append("<div id='fieldsetjsDiscount'><fieldset class='discounts item form-wrappersss' id='edit-cart-discounts'><legend><span class='fieldset-legend'>Réductions</span></legend><div class='fieldset-wrapper'><div  class='form-wrapper'><div class='prefix form-wrapper'>Promo</div><div class='description form-wrapper'><span class='styleprice price'><span class='value'><span class='whole'>- "+data.discountAmount+"</span><span class='decimalpoint'>,</span><span class='decimals'>00</span>&nbsp;<span class='currency'>€</span></span></span><div class='form-wrapper'>Vous utilisez:" + data.orderItemDiscount.discountId + "</div><div id='edit-cart-discounts-20272-description-items-description' class='form-wrapper'>Code de test pour "+data.orderItemDiscount.productName+"</div></div></div></div></fieldset></div>");

                        }
                    }
                }
            }
        });

     
    });

});

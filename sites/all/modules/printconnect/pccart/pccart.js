(function ($) {
    Drupal.behaviors.pccart = {
        detach: function (context) {
        },
        attach: function (context, settings) {
            try{document.domain = 'flyer.fr';}
            catch(e){console.log(e);}


    updateDomain();

   $('.refCustomer').blur(function() {
	$.post('cart/customer/ref/'+$(this).attr('cart'),{'ref' : $(this).val()});       
   });

   $('.refjobTxt').blur(function(){
       $.post('cart/job/ref/'+$(this).attr('orderItem'),{'ref' : $(this).val()});
   }); 
   
   $('.removecontrol').click(function(){
	$.post('cart/controlprof/'+$(this).attr('rel')+'/delete', function(response){
      updateDiscounts();
  });
	$(this).parent().fadeOut("slow");
	$(this).parent().remove();
	$('.itemfile-'+$(this).attr('rel')).remove();
	PriceCallback();
		
	return false;
   });

   $('.deletedesign').click(function(e){
	$('.item-hide-'+$(this).attr('itemFileId')).fadeIn("slow");
	$(this).parents('.job').fadeOut("slow"); 		
	$.post('cart/deletedesign/'+$(this).attr('itemFileId'),{},function(){
	   $(this).parents('.job').remove(); 
      updateDiscounts();
	});
	if ($('.fotolia-items-'+$(this).attr('itemFileId')).length < $('.fotolia-items').length) {
            $('.fotolia-items-'+$(this).attr('itemFileId')).parent().remove();
        } else if ($('.fotolia-items-'+$(this).attr('itemFileId')).length == $('.fotolia-items').length) {
            $('.fotolia-items-'+$(this).attr('itemFileId')).parents('fieldset').remove();
        }
	$('.item-'+$(this).attr('itemFileId')).remove();
	PriceCallback();	
	return false;
	/*$.post(Drupal.settings.basePath+'/designdelete/'+$(this).attr('itemFileId').val());
	PriceCallback();
        return false;*/
   });
   
/*    $('table.targetPrice tr').each(function(){
      	if ($(this).find('input.targetPrice').is(":checked") && $(this).find('.storeLink').length > 0){
      		  $(this).find('.storeLink').show();
      	}
      	if ($(this).find('input.targetPrice').is(":checked")) {
      	    $.post('cart/'+$(this).find('input.targetPrice').val()+'/submit');
      	}
	  });*/
    

   $('table.targetPrice input.targetPrice').click(function () {
        $('.storeLink').hide();
        if ($(this).parents('tr').find('.storeLink').length > 0) {
           $(this).parents('tr').find('.storeLink').show();
        }

        if($(this).val() ==  84){
            var shpping = '<input type="hidden" name="shpping" value="14.99">';
            $("#pccart-cart-form #hiddenPrices").append(shpping);
        }else{
            $("input[name='shpping']").remove();
        }
        PriceCallback();
        $.post('cart/'+$(this).val()+'/submit', function (response){
          updateDiscounts();
        });
           
   });

   $('table.targetPrice input.targetPrice:checked').click();

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
                updateDiscounts();

                targetItem.parents('job').remove();
                if (number <= 0) {
                  $('.jsDiscount').remove();
                  window.location.replace('/products/');
                }
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
        PriceCallback();
      });
    }}
})(jQuery);

function updateDiscounts() {
  if(typeof jQuery(".hidden-discount:first")[0] != "undefined"){
      applyDiscount(jQuery(".hidden-discount:first").attr('discount-code'), 1);
  }  
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

    jQuery("#pccart-cart-form .subtotal .value").html(buildPriceHtml(totalprice, false));
       
    var vat = 0.21 ;
    vatprice = totalprice * vat ;
    
    jQuery("#pccart-cart-form .vat .value").html(buildPriceHtml(vatprice, false));

    total = vatprice + totalprice;
   
    jQuery("#pccart-cart-form #price .value").html(buildPriceHtml(total, false));
   if(total == 0){
    jQuery("#pccart-cart-form").find(jQuery('input[type="submit"]')).attr('disabled','disabled');
   }
}

function renderDiscount(data)
{
  var disocunt = '<input type="hidden" class="hidden-discount" discount-code="'+data.code+'" id="discount-hidden-'+data.code.toLowerCase()+'" name="disocunt" value="-' + data.discountAmount+  '">';
  if(jQuery("#edit-cart-discounts-"+data.code.toLowerCase())[0]) {
      jQuery("#discount-hidden-"+data.code.toLowerCase()).val("-"+data.discountAmount);
      jQuery("#edit-cart-discounts-"+data.code.toLowerCase()).html("<div class='prefix form-wrapper'>Promo</div><div class='description form-wrapper'><span class='styleprice price'>"+buildPriceHtml(data.discountAmount, true)+"</span><div class='form-wrapper'>Vous utilisez: <span id='discountCodeVal'>" + data.code + "</span></div><div id='edit-cart-discounts-20272-description-items-description' class='form-wrapper'>Code de test pour "+data.orderItemDiscount.productName+"</div></div>");
  }else if (jQuery(".lodediscounts")[0]) {
      jQuery("#pccart-cart-form #hiddenPrices").append(disocunt);
      jQuery("#pccart-cart-form .lodediscounts #edit-cart-discounts .fieldset-wrapper").append("<div id='edit-cart-discounts-"+data.code.toLowerCase()+"' class='form-wrapper'><div class='prefix form-wrapper'>Promo</div><div class='description form-wrapper'><span class='styleprice price'>"+buildPriceHtml(data.discountAmount, true)+"</span><div class='form-wrapper'>Vous utilisez: <span id='discountCodeVal'>" + data.code + "</span></div><div id='edit-cart-discounts-20272-description-items-description' class='form-wrapper'>Code de test pour "+data.orderItemDiscount.productName+"</div></div></div>");
  }else{
      jQuery("#pccart-cart-form #hiddenPrices").append(disocunt);
      if (jQuery("#fieldsetjsDiscount")[0]) {
          jQuery("#pccart-cart-form .jsDiscount #fieldsetjsDiscount #edit-cart-discounts .fieldset-wrapper").append("<div id='edit-cart-discounts-"+data.code.toLowerCase()+"' class='form-wrapper'><div class='prefix form-wrapper'>Promo</div><div class='description form-wrapper'><span class='styleprice price'>"+buildPriceHtml(data.discountAmount, true)+"</span><div class='form-wrapper'>Vous utilisez: <span id='discountCodeVal'>" + data.code.toLowerCase() + "</span></div><div id='edit-cart-discounts-20272-description-items-description' class='form-wrapper'>Code de test pour "+data.orderItemDiscount.productName+"</div></div></div>");
      } else {
          jQuery("#pccart-cart-form .jsDiscount").append("<div id='fieldsetjsDiscount'><fieldset class='discounts item form-wrappersss' id='edit-cart-discounts'><legend><span class='fieldset-legend'>Réductions</span></legend><div  class='fieldset-wrapper'><div id='edit-cart-discounts-"+data.code.toLowerCase()+"' class='form-wrapper'><div class='prefix form-wrapper'>Promo</div><div class='description form-wrapper'><span class='styleprice price'>"+buildPriceHtml(data.discountAmount, true)+"</span><div class='form-wrapper'>Vous utilisez: <span id='discountCodeVal'>" + data.code + "</span></div><div id='edit-cart-discounts-20272-description-items-description' class='form-wrapper'>Code de test pour "+data.orderItemDiscount.productName+"</div></div></div></div></fieldset></div>");
      }
  }

  PriceCallback();
}

function buildPriceHtml(price, isDiscount) 
{
    var wholevat = (price.toFixed(2) +"").split(".")[0];
    var decPartvat = (price.toFixed(2) +"").split(".")[1];

    if(isDiscount) {
      wholevat = '- ' + wholevat;
    }

    var htmlPrice = '<span class="value"><span class="whole">'+wholevat+'</span><span class="decimalpoint">,</span><span class="decimals">'+decPartvat+'</span><span class="currency"> €</span></span>';

    return htmlPrice;
}

function applyDiscount(code, force)
{
  if(force == 1 && typeof jQuery(".hidden-discount")[0] == "undefined") {
      return false;
  }
  if(force == 0) {
    jQuery("#edit-cart-discount-add").after("<img id='loading-ajax-tmp' style='top:8px;left:-4px;position:relative' src='/sites/all/themes/printconnect/flyer/ajax-loading.gif'>");
  }
  jQuery.ajax({
      type: "POST",
      url :'cart/discount',
      data : {
          'code' :code,
          'force' : force
      },
      dataType : 'json',
      success: function (data) {
          jQuery("#loading-ajax-tmp").remove();
          if(typeof data.code != "undefined" && force == 1 && jQuery("#discount-hidden-"+data.code.toLowerCase()).next()[0] && jQuery("#discount-hidden-"+data.code.toLowerCase()).next().hasClass('hidden-discount')) {
              applyDiscount(jQuery("#discount-hidden-"+data.code.toLowerCase()).next().attr('discount-code'), 1);
          }
          if (typeof data.discountAmount != "undefined"){
              renderDiscount(data);
              return;
          }else if(force == 1){
              jQuery('#edit-cart-discounts-'+code.toLowerCase()).remove();
              jQuery('#discount-hidden-'+code.toLowerCase()).remove();
              PriceCallback();
              return;
          }
          jQuery('#edit-cart-discount').before('<p id="tmp-error-msg" style=" color: #F00; font-weight: 600; font-size: 13px; "> Désolé, ce code promotionnel a déjà été utilisé ou non validé</p>');
          setTimeout(function(){
            jQuery("#tmp-error-msg").remove();
          }, 6000);
      }
  });
}

jQuery(document).ready(function(){
    jQuery("#edit-cart-discount-add").click(function (event) {
        event.preventDefault();
        var disocuntname = jQuery("#pccart-cart-form #edit-cart-discount-code").val();

        applyDiscount(disocuntname, 0);
    });
});

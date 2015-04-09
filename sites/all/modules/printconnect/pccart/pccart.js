(function ($) {
  Drupal.behaviors.pccart = {
    detach: function (context) {
    },
    attach: function (context, settings) {
        
//      console.log(Drupal.settings.pccart.testvar);
//        console.log(Drupal.settings.pccart.ley);
        

// function updatCartItemVat(cartItem, status) {
// $.post('cart/updatItemVat/id/'+cartItem+'/status/'+status,{},function(){
//});
// }
//      
//      
//   $('#pccart-cart-form .discount input[type="text"]').bind("keydown", function(event) {
//     var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
//     if (keycode === 13) {
//       event.preventDefault();
//        event.stopPropagation();
//       $('#pccart-cart-form .discount input[type="submit"]').click();
//        return false;
//      } else  {
//            return true;
//    }
// });
//      
//// remove control 
//   $('#pccart-cart-form .removecontrol').once().click(function(){
//       if (confirm("Voulez-vous supprimer le controle  professionnel ?")) {              
//            $.post('cart/controlprof/'+$(this).attr('rel')+'/delete',{},function(){             
//            }).done(function() {
//                location.reload();
//           });
//           return false;             
//       }else{             
//           return false;        
//       } 
//     });
//     

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




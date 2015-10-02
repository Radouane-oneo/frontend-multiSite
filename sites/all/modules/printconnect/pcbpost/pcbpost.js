
 
function pcbpost_cart_callback(poi, html){
  jQuery('#pccart-cart-form .pup').html(html);
  jQuery('#pccart-cart-form input[name="cart[shipping][pup][id]"]').val(poi.Id);  
  jQuery('.pup').html(html);
  jQuery('input[name="cart[shipping][pup][id]"]').val(poi.Id);  
  jQuery('input[name="pcbpost[id]"]').val(poi.Id);  
  jQuery.get(Drupal.settings.basePath + 'index.php?q=pcbpost/set/pickuppoint/' + poi.Id , function(data){
      if(data.code == 200) {
          myCart.changeShipping(data.data.orderItemShipping);
      }
  });
  
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

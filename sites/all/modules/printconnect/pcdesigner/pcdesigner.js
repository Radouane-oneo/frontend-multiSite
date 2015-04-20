(function ($) {

  Drupal.behaviors.pcdesigner = {
    detach: function (context) {

    },
    attach: function (context, settings) {
      $('#pccart-cart-form .inputdesigneremail').change(function(){
      var href = "js/upload-design/designer/email/" + $(this).val(); 
      var  id = $(this).attr('id');
      var wopper = '#pccart-cart-form #' + id  ;
        $.getJSON(href, function(data){          
         if(!data){
             
         $(wopper).css({ "border":"1px solid red"});
         }
        });
      });
   
       if ($("#pccart-cart-form .inputdesigner")[0]){
         $(".inputdesigner ").hide();
        }  
     
     
       $('#pccart-cart-form .form-checkbox').change(function(){
      if ($(this).is(':checked')) {
               $(this).parent().siblings(".inputdesigner").show();
               $(this).parent().siblings(".prodactTemplates").hide();
            } else {
               $(this).parent().siblings(".inputdesigner").hide();
                  $(this).parent().siblings(".prodactTemplates").show();
            }
      })

            

     
      
    }
  }
})(jQuery);


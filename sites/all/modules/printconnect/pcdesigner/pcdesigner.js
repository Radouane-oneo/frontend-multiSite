(function ($) {
    $(document).ready(function () {
           if($('.error')[0]){
                $('#pccart-cart-form .form-checkbox').attr('checked', false);
           }
     });
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
         }else{
              $(wopper).css({ "border":"1px solid #77b800"});
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
        $('#edit-remove').click(function(e){
            orderitem = $('#jobIdDesiger').val();    	
            console.log("/cart/ajax/removedesign/" + orderitem);
            $.post('/cart/ajax/removedesign/'+orderitem,{},function(){
                                        location.href=location.href;
                                    });
            $.post("changestatus/" + orderitem+"/WaitingForFile",{},function(){
                                        location.href=location.href;
                                    });
                if ($('.fotolia-items-'+$(this).attr('itemFileId')).length < $('.fotolia-items').length) {
                        $('.fotolia-items-'+$(this).attr('itemFileId')).parent().remove();
                } else if ($('.fotolia-items-'+$(this).attr('itemFileId')).length == $('.fotolia-items').length) {
                        $('.fotolia-items-'+$(this).attr('itemFileId')).parents('fieldset').remove();
                }
                $('.item-'+$(this).attr('itemFileId')).remove();
                //PriceCallback();
                return false;
        })
        $('#changeStatusUpprove').click(function(){ 
           orderitem = $('#jobIdDesiger').val();console.log(orderitem);
           var href = "changestatus/" + orderitem+"/ToApproved"; 
           $.getJSON(href, function(data){                  
                if(!data){
                    return false;
                    //dfgd
                }else{
                    //srfdrg
                 return false;
                }
               });
               return false;
        });

     $('#changeStatusConfirm').click(function(){ 
           orderitem = $('#jobIdDesiger').val();console.log(orderitem);
           var href = "/upload-design/changestatus/" + orderitem+"/Confirm"; 
           $.getJSON(href, function(data){                  
                if(!data){
                //console.log('non data'+orderitem);
                
                }else{
                 //console.log('non data'+orderitem);
                 return false;
                }
               });
               return false;
       });
      
    }
  }
})(jQuery);


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
            $.post('/cart/ajax/removedesign/'+orderitem,{},function(){
                $.post("changestatus/" + orderitem+"/WaitingForFile",{},function(){
                                        location.href=location.href; 
                                    });
                 });
            
//                if ($('.fotolia-items-'+$(this).attr('itemFileId')).length < $('.fotolia-items').length) {
//                        $('.fotolia-items-'+$(this).attr('itemFileId')).parent().remove();
//                } else if ($('.fotolia-items-'+$(this).attr('itemFileId')).length == $('.fotolia-items').length) {
//                        $('.fotolia-items-'+$(this).attr('itemFileId')).parents('fieldset').remove();
//                }
//                $('.item-'+$(this).attr('itemFileId')).remove();
                //PriceCallback();
                return false;
        })
        $('#changeStatusUpprove').click(function(){ 
           orderitem = $('#jobIdDesiger').val();console.log(orderitem);
           $.post("changestatus/" + orderitem+"/ToApproved",{},function(){
               //$('#designerMessage').text();
               $('#changeStatusUpprove').replaceWith('<div class="cadreGris"></div>');
               $('.messageUploadDesigner').css({"display":"block"});
              // $('#designerMessage .linesUploadDesign').css({"display":"none"});
           });
               return false;
        });

     $('.changeStatusConfirm').click(function(){
		   element = $(this);
           orderitem = element.parents(".designerConfirm").find('#jobIdDesiger').val();
		   console.log(orderitem);
           $.post("/upload-design/changestatus/" + orderitem+"/Confirm",{},function(){
				element.replaceWith('<div class="greyButton">'+Drupal.t('Approved')+'</div>');
                $('.messageConfirmDesign').css({"display":"block"});
                element.parents(".designerConfirm").find('#designerleft').css({"display":"none"});
            });
               return false;
       });
      
    }
  }
})(jQuery);


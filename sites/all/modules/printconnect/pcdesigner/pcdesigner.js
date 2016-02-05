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

       $('#changeStatusUpprove').click(function(){ 
           orderitem = $('#jobIdDesiger').val();console.log(orderitem);
           var href = "setstatusapprove/" + orderitem; 
           $.getJSON(href, function(data){   
               
                if(!data){
                //$(wopper).css({ "border":"1px solid red"});
                console.log('non data'+orderitem);
                
                }else{
                 console.log('non data'+orderitem);
                 return false;
                }
               });
               return false;
//	    		ajaxCaller.call("cart/ajax/setemaildesigner",{
//	    			'id':orderitem,
//	    			'email': value
//	    		},'POST').done(function(result){
//	                if (result.code == '200') {
//	                	_this.setDesignerEmailToModel(orderitem, value);
//	                };
//	            });	
       });

     
      
    }
  }
})(jQuery);


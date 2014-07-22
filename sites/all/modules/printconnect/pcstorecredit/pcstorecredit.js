var $ = jQuery;

$(document).ready(function(){
   $(".form-item-payment-credit-use input").each(function(){
      if($(this).val() == 'no'){
          this.checked = true;
      } 
   });
});
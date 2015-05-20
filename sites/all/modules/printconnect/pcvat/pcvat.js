(function ($) {

  var validate;
  $.fn.vatfieldValidate = function(change){

    if ($(this).length){
      var control = $(this);
      var number = $('.number', control);
      var country = $('.country', control); 

      number.removeClass('error');
      number.removeClass('validated');

      if (number.val() !='' && country.val() != '') {
       $.getJSON(Drupal.settings.basePath + 'index.php?q=/js/pcvat/' + country.val() + '/' + number.val(), function(data){
          if (data.status == "Inactive"){
            number.addClass('error');
            number.val('');
          }else{
              validate = "validated";
          }
        });
        
        if(validate == "validated"){
          $.getJSON(Drupal.settings.basePath + 'index.php?q=/billingAccountVat/' + country.val() + number.val(), function(dataset){
           if(dataset.status == "exicte"){
             $('#fademe').removeClass('black_overlay');
             $('#fademe').addClass('black_overlay2');
         }
        });
       } 
      }
    }
  }

  Drupal.behaviors.pcvat = {
    detach: function (context) {
    },
    attach: function (context, settings) {
      $('.form-type-vatfield').once('vat-validation').each(function(){
        var control = $(this);
        $(control).vatfieldValidate(false);
        $('.number, .country', this).once('vat-validation-change').change(function (){
          $(control).vatfieldValidate(true);
        });
      });
    }
  }
})(jQuery);
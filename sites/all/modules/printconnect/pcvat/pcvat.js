(function ($) {

  var pcvatRequest;

  $.fn.vatfieldValidate = function(change){

    if ($(this).length){
      if (pcvatRequest){
        //pcvatRequest.abort();
      }

      var control = $(this);
      var number = $('.number', control);
      var country = $('.country', control); 

      number.removeClass('error');
      number.removeClass('validated');

      if (number.val() !='' && country.val() != '') {
        //pcvatRequest = $.getJSON('http://isvat.appspot.com/' + country.val() + '/' + number.val() + '/?callback=?', function(data){
        pcvatRequest = $.getJSON(Drupal.settings.basePath + 'index.php?q=/js/pcvat/' + country.val() + '/' + number.val(), function(data){
          if (data == false){
            number.addClass('error');
          }
          else{
            number.addClass('validated');
          }
          if (change){
            control.trigger('changed');
          }
        });
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
          //control.trigger('change');
          $(control).vatfieldValidate(true);
        });

         //$('.number', this).trigger('change');
      });
    }
  }
})(jQuery);
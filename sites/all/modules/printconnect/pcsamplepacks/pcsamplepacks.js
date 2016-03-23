(function ($) {

  Drupal.behaviors.pcsamplepacks = {
    detach: function (context) {

    },
    attach: function(context, settings) {
      $('#pcsamplepacks-request-form #edit-address').once().change(function(){
        var id = $(this).val();
        if (id == 0) {
          $('#pcsamplepacks-request-form #edit-firstname').val('');
          $('#pcsamplepacks-request-form #edit-lastname').val('');
          $('#pcsamplepacks-request-form #edit-company').val('');
          $('#pcsamplepacks-request-form #edit-country').val('');
          $('#pcsamplepacks-request-form #edit-street').val('');
          $('#pcsamplepacks-request-form #edit-postalcodeS').val('');
          $('#pcsamplepacks-request-form #edit-city').val('');
          $('#pcsamplepacks-request-form #edit-phone').val('');
        }
        else{
          var url = '/js/myprintconnect/address/' + id;
       
          $.getJSON(url, null, function (data){
            $('#pcsamplepacks-request-form #edit-firstname').val(data.name);
            $('#pcsamplepacks-request-form #edit-lastname').val(data.name);
            $('#pcsamplepacks-request-form #edit-company').val(data.company);
            $('#pcsamplepacks-request-form #edit-country').val(data.country);
            $('#pcsamplepacks-request-form #edit-street').val(data.street);
            $('#pcsamplepacks-request-form #edit-postalcodeS').val(data.postalCodeS);
            $('#pcsamplepacks-request-form #edit-city').val(data.city);
            $('#pcsamplepacks-request-form #edit-phone').val(data.phone);
          });
        }

     });
   }
 }

})(jQuery);
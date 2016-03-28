(function ($) {

  Drupal.behaviors.pcpayments = {
    detach: function (context) {

    },
    attach: function (context, settings) {
      var request;

      var submitRequestForm = function(triggeringElement) {
        if (request){
          request.abort();
        }

        var form = $('#pcpayments-request-form');
        var url = form.attr('action');
        var data = form.serialize();
        form.css('cursor', 'wait');

        if (triggeringElement) {
          data = '_triggering_element_name=' + triggeringElement.attr("name") + '&' + data;
        }

        data = data + '&op=ajax';

        request = $.ajax({
          type: "POST",
          url: url,
          data: data,
          success: function(data){
            form.html(jQuery('#pcpayments-request-form', data).html());
            Drupal.attachBehaviors(form);
          },
          complete: function (){
            form.css('cursor', 'default');
          }
        });
      }

//      $('#pcpayments-request-form input[type="radio"]').once().change(function(){
//        submitRequestForm($(this));
//      });
    }
  }

  /* Payement mothodes image for payement request page */
  $(document).ready(function () { 
    var lang = Drupal.settings.pathPrefix.substr(0 , 4);
    
      switch (lang) {
          case "benl": $('.page-paymentrequest #edit-aboutmethode').css('background-image' , "url('https://s3-eu-west-1.amazonaws.com/pc-images/images.flyer.eu/payment_be.jpg')");
          break;
          case "befr" : $('.page-paymentrequest #edit-aboutmethode').css('background-image' , "url('https://s3-eu-west-1.amazonaws.com/pc-images/images.flyer.eu/payment_be.jpg')");
          break;
          case "nlnl" : $('.page-paymentrequest #edit-aboutmethode').css('background-image' , "url('https://s3-eu-west-1.amazonaws.com/pc-images/images.flyer.eu/payment_nl.jpg')");
          break;
          case "frfr" : $('.page-paymentrequest #edit-aboutmethode').css('background-image' , "url('https://s3-eu-west-1.amazonaws.com/pc-images/images.flyer.eu/payment_fr.jpg')");
          break;
          case "lufr" : $('.page-paymentrequest #edit-aboutmethode').css('background-image' , "url('https://s3-eu-west-1.amazonaws.com/pc-images/images.flyer.eu/payment_lu.jpg')");
      }
  });

})(jQuery);


(function ($) {

  var validate;
  $.fn.vatfieldValidate = function(change){
    var vatFormats = [{'BE': 10},{'NL' : 12},{'LU' : 8},{'FR' : 11}];	
    if ($(this).length){
      var control = $(this);
      var number = $('.number', control);
      var country = $('.country', control); 

      number.removeClass('error');
      number.removeClass('validated');
      if (number.val() !='' && country.val() != '') {
	var vatNumberBA = $("#edit-vatnumber-number").val().replace(/\./g, "").replace(/ /g,"");
	var decision = false;
	$.each(vatFormats, function(c, obj){
	    $.each(obj, function(t, dt){
	        if (t == $('#edit-vatnumber-country').val() && $("#edit-vatnumber-number").val().length == dt) {
		    decision = true;
	        }
	    });
	});
	if (decision == false) {
	    number.addClass('error');
            number.val('');
            var vatplaceholder = Drupal.t('insert a valid vat number please');
            number.attr("placeholder", vatplaceholder);
	 } else {
	    $.get(Drupal.settings.basePath +'index.php?q=/checkout/getBillingAccoutFromVat/vatNumber/'+$('#edit-vatnumber-country').val()+vatNumberBA,
		function(data){
		console.log(data);
		}
	        
	    );
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
        $('.number, .country', this).blur(function (){
          $(control).vatfieldValidate(true);
        });
      });
    }
  }
})(jQuery);

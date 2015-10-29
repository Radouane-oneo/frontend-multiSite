(function ($) {

  var validate;
  $.fn.vatfieldValidate = function(change){
    $('#edit-vatnumber-country').val('');
    var vatFormats = [{'BE': 10},{'NL' : 12},{'LU' : 8},{'FR' : 11}];
    if ($(this).length){
      var control = $(this);
      var number = $('.number', control);
      var country = $('.country', control); 

      number.removeClass('error');
      number.removeClass('validated');
      if (number.val() !='' && country.val() != '' && $('#companyInput').val() != '') {
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
	    $.ajax({ 
    		type: 'GET', 
    		url: Drupal.settings.basePath +'checkout/getBillingAccoutFromVat', 
    		data: { 'vatNumber': $('#edit-vatnumber-country').val()+vatNumberBA }, 
    		dataType: 'json',
    		success: function (data){
		    if (data.code == 200 && $.isEmptyObject(data.data) == false) {
			number.addClass('error');
            		number.val('');
			var vatplaceholder = Drupal.t('Vat already used.. please contact customer service');
            		number.attr("placeholder", vatplaceholder);
		    }
    		}
		});
	 }
      } else if (number.val() !='' && $('#companyInput').val() != ''){
	$('.country').addClass('error');
	$('.country').parents('form').find('select').addClass('error');
	$('#edit-vatnumber-number').val('');
	$('#countryDropDown').addClass('error');
      } else if (number.val() !='' && $('#companyInput').val() == '') {
	var vatplaceholder = Drupal.t('company name is required');
	$('#companyInput').attr("placeholder", vatplaceholder);
      }
    }
  }

  Drupal.behaviors.pcvat = {
    detach: function (context) {
    },
    attach: function (context, settings) {
      $('#edit-vatnumber-country').val('');
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

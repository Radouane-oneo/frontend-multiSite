(function ($) {

  var validate;
  $.fn.vatfieldValidate = function(change){
    if ($('#edit-country').val() == '') {
        $('#edit-vatnumber-country').val('');
    }
    var vatFormats = [{'BE': 10},{'NL' : 12},{'LU' : 8},{'FR' : 11}];
    if ($(this).length){
      var control = $(this);
      var number = $('.number', control);
      var country = $('.country', control); 

      number.removeClass('error');
      number.removeClass('validated');
	$('.vatAlreadyUsed').parent().hide();
      if (number.val() !='' && country.val() != '' && $('#companyInput').val() != '') {
	var vatNumberBA = $("#edit-vatnumber-number").val().replace(/\./g, "").replace(/ /g,"");
	$("#edit-vatnumber-number").val(vatNumberBA);
	var decision = false;
	switch($('#edit-vatnumber-country').val()) {
            case 'BE':
                decision = (vatNumberBA.charAt(0) == 0) ? true : false;
            break;
            case 'LU':
                decision = ($.isNumeric(vatNumberBA)) ? true : false;
            break;
	    case 'NL':
                var re = /^[0-9]{9}B[0-9]{2}$/;
                decision = re.test(vatNumberBA);
            break;
	    case 'FR':
                var re = /^[0-9A-Z]{2}[0-9]{9}$/;
                decision = re.test(vatNumberBA);
            break;
            default:
                decision = true;
            break;
         }
	$.each(vatFormats, function(i, format){
	    $.each(format,function(j, leng){
		if (j == $('#edit-vatnumber-country').val() && leng != vatNumberBA.length) {
		    decision = false;
		}
	    })
	});
	if (decision == false) {
	    number.addClass('error');
	    //$('.messages.error').remove();
            number.val('');
            var vatplaceholder = Drupal.t('insert a valid vat number please');
	    $('.customErrors').remove();
	    if ($('.messages.error ul li').length == 0) {
		$('.messages.error').remove();
	    }
	    if ($('.messages').length == 0){
	        $('.region-content').before('<div class="messages error"><ul><li class="customErrors">'+vatplaceholder+'</li></ul></div>');
	    } else {
		$('.messages ul').append('<li class="customErrors">'+vatplaceholder+'</li>');
	    }
	    $('html, body').animate({
              scrollTop:$(".messages.error").offset().top
            }, 'slow');
	 } else { 
	    $('.messages.error').each(function(){
	      if(!$(this).hasClass('vatAlreadyUsed') && $(this).hasClass('customErrors')) {
	          $(this).remove();
	      }
	    });
	    if ($('.messages.error ul li').length == 0) {
                $('.messages.error').remove();
            }
	    $.ajax({ 
    		type: 'GET', 
    		url: Drupal.settings.basePath +'checkout/getBillingAccoutFromVat', 
    		data: { 'vatNumber': $('#edit-vatnumber-country').val()+vatNumberBA }, 
    		dataType: 'json',
    		success: function (data){
  		    if (data.code == 200 && $.isEmptyObject(data.data) == false) {
    			  number.addClass('error');
            	     	  number.val('');
			  $('.vatAlreadyUsed').parent().show();
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
	$('.customErrors').remove();
        if ($('.messages').length == 0){
            $('.region-content').before('<div class="messages error"><ul><li class="customErrors">'+vatplaceholder+'</li></ul></div>');
        } else {
            $('.messages ul').append('<li class="customErrors">'+vatplaceholder+'</li>');
        }
        $('html, body').animate({
          scrollTop:$(".messages.error").offset().top
        }, 'slow');
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
      $('#edit-country').change(function(){
        $('#edit-vatnumber-number').val('');
      });
    }
  }
})(jQuery);

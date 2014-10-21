	// Get la liste des competences selon domaine d'intervention	

jQuery(document).ready(function (e) {
    
    
    if(window.location.search == "?contentonly" ){
        jQuery('body').css("background","none");
    }

    jQuery('#pccontact_general_form').submit(function (e) {
        var name = jQuery('#pccontact_general_form').find('#edit-name').val();
        var phone = jQuery('#pccontact_general_form').find('#edit-phone').val();
        var email = jQuery('#pccontact_general_form').find('#edit-email').val();
        var comment = jQuery('#pccontact_general_form').find('#edit-comment').val();
	var emailReg = /^^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i;
        var phoneReg = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
		
		

		if (name === "" || phone === "" || email === "" || comment === "") {
			var GlobalError = jQuery('#pccontact_general_form').attr('data-GlobalError');
			 jQuery(document).find('.errorForms').remove();
			 jQuery(document).find('#pccontact_general_form #edit-actions')
				.append('<p class="errorForms">'+GlobalError+'</p>').hide().fadeIn().show();
			return false;
		}
		else if ( !emailReg.test( email ) ) {
			var MailError = jQuery('#pccontact_general_form').find('#edit-email').attr('data-MailError');
			jQuery(document).find('.errorForms').remove();
			jQuery(document).find('#pccontact_general_form #edit-actions')
				.append('<p class="errorForms">'+MailError+'</p>').hide().fadeIn().show();
            return false;
         }
		else if (!phoneReg.test( phone ) ) {
			var PhoneError = jQuery('#pccontact_general_form').find('#edit-phone').attr('data-PhoneError');
			jQuery(document).find('.errorForms').remove();
			jQuery(document).find('#pccontact_general_form #edit-actions')
				.append('<p class="errorForms"> '+PhoneError+'</p>').hide().fadeIn().show();
            return false;
         } 
		 else{
			 return true;
	}		
		
    });
   
        // hide all error span message
      
        jQuery("#callme").live('click', function(){
            
            jQuery('#edit-nom').val('');
            jQuery('#edit-prenom').val('');
            jQuery('#edit-telephone').val('');
            jQuery('#edit-email').val('');
            
            jQuery('.info-bloc #popup_overlay2 #messageSent').hide();
            jQuery('.info-bloc #popup_overlay2 span.required').hide();
            jQuery('.info-bloc #popup_overlay2 span.required2').hide();
            jQuery('.info-bloc #popup_overlay2 input:text').removeClass('error');
            jQuery('.info-bloc #popup_overlay2').show();
            jQuery('.info-bloc #popup_overlay2 #popupContent').show(); 
            jQuery('.info-bloc #popup_overlay2 #edit-actions').show();
            
        });
         jQuery(".info-bloc #popup_overlay2 .close").live('click', function(){
            jQuery('.info-bloc #popup_overlay2').hide(); 
            jQuery('.info-bloc #popup_overlay2 #edit-actions').hide(); 
        });
        jQuery('#pccontact_popup_form').submit(function () {
	
            nameRes =  errorInput('edit-nom');
            prenomRes = errorInput('edit-prenom');
            telRes = errorInput('edit-telephone');
            emailRes =  errorInput('edit-email');

            if (nameRes  && prenomRes && telRes && emailRes ) { 

                        jQuery.ajax({			
                        type: "GET",
                        url:Drupal.settings.basePath+'popup/ajax',
                        dataType: 'json',	
                        data: 'nom='+jQuery('#edit-nom').val()+'&prenom='+jQuery('#edit-prenom').val()+'&phone='+jQuery('#edit-telephone').val()+'&email='+jQuery('#edit-email').val(),
                        contentType: "application/json",
                        success: function(res) {		
                               if(res.data){
                                   
                                    jQuery('#popupContent').hide(); 
                                    jQuery('.info-bloc #popup_overlay2 #edit-actions').hide();
                                    jQuery('.info-bloc #popup_overlay2 #messageSent').show();
  
                               }else{   
                        
                                    jQuery(document).find('.errorForms').remove();
                                    jQuery(document).find('#pccontact_popup_form #edit-actions').append('<p class="errorForms">Erreur d\'envoi, merci de r&#233;essayer ult&#233;rieurement</p>').hide().fadeIn().show();                                  
                               }
                        },
                        error: function(xhr, status) {  			
                                alert('Unknown ' + status); 
                                jQuery('#popupContent').hide(); 
                                jQuery('.info-bloc #popup_overlay2 #edit-actions').hide();
                                jQuery('.info-bloc #popup_overlay2 #messageSent').show();
                        }
                        });
  
            }	
               return false;  
    });
    
     var errorInput = function (id){
 
        if( jQuery("#"+id).val() === ""){            
            jQuery("#"+id).addClass('error');
            jQuery("."+id+' span.required2').hide();
            jQuery("."+id+' span.required').show();
            return false;
        }else{   
            var mail = true; 
            var tel = true;
            var emailReg = /^^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i;
            var phoneReg = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
            jQuery("#"+id).removeClass('error');
            jQuery("."+id+' span.required').hide();
            // test tel valid
            if( id === "edit-telephone"){ 
                if (!phoneReg.test( jQuery("#"+id).val() ) ) {                                   
                    jQuery('#edit-telephone').addClass('error'); 
                    jQuery('.edit-telephone span.required2').show();
                    tel = false;
                }else {  
                    jQuery('.edit-telephone span.required2').hide();
                    tel = true;
                }
            }
            // test email valid
            if( id === "edit-email"){ 
                if ( !emailReg.test( jQuery("#"+id).val() )  ) {                                     
                    jQuery('#edit-email').addClass('error');  
                    jQuery('.edit-email span.required2').show(); 
                    mail = false;
                }else {
                    jQuery('.edit-email span.required2').hide();
                    mail = true;
                }
            }
            if(mail && tel) return true;
            else return false;
            
        }
    };
    
     jQuery('#pccontact_stors_form').submit(function (e) {
        var name = jQuery('#pccontact_stors_form').find('#edit-name').val();
        var phone = jQuery('#pccontact_stors_form').find('#edit-phone').val();
        var email = jQuery('#pccontact_stors_form').find('#edit-email').val();
        var socity = jQuery('#pccontact_stors_form').find('#edit-socity').val();
        var activity = jQuery('#pccontact_stors_form').find('#edit-activity').val();
        var vatnumber = jQuery('#pccontact_stors_form').find('#edit-vatnumber').val();
        var comment = jQuery('#pccontact_stors_form').find('#edit-comment').val();
	var emailReg = /^^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i;
        var phoneReg = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
		
		

       if (name === "" || phone === "" || email === "" || comment === "") {
            var GlobalError = jQuery('#pccontact_stors_form').attr('data-GlobalError');
            jQuery(document).find('.errorForms').remove();
            jQuery(document).find('#pccontact_stors_form #edit-actions')
            .append('<p class="errorForms">'+GlobalError+'</p>').hide().fadeIn().show();
            return false;
        }
        else if (!emailReg.test( email )) {
            var MailError = jQuery('#pccontact_stors_form').find('#edit-email').attr('data-MailError');
            jQuery(document).find('.errorForms').remove();
            jQuery(document).find('#pccontact_stors_form #edit-actions')
            .append('<p class="errorForms">'+MailError+'</p>').hide().fadeIn().show();
            return false;
        }
          else if (socity === "") {
            var socityError = jQuery('#pccontact_stors_form').find('#edit-socity').attr('data-socityError');
            jQuery(document).find('.errorForms').remove();
            jQuery(document).find('#pccontact_stors_form #edit-actions')
            .append('<p class="errorForms">'+socityError+'</p>').hide().fadeIn().show();
            return false;
        }
          else if (activity === "") {
            var activityError = jQuery('#pccontact_stors_form').find('#edit-activity').attr('data-activityError');
            jQuery(document).find('.errorForms').remove();
            jQuery(document).find('#pccontact_stors_form #edit-actions')
            .append('<p class="errorForms">'+activityError+'</p>').hide().fadeIn().show();
            return false;
        }
         else if (vatnumber === "") {
            var vatnumberError = jQuery('#pccontact_stors_form').find('#edit-vatnumber').attr('data-vatnumberError');
            jQuery(document).find('.errorForms').remove();
            jQuery(document).find('#pccontact_stors_form #edit-actions')
            .append('<p class="errorForms">'+vatnumberError+'</p>').hide().fadeIn().show();
            return false;
        }
        else if (!phoneReg.test( phone ) ) {
            var PhoneError = jQuery('#pccontact_stors_form').find('#edit-phone').attr('data-PhoneError');
            jQuery(document).find('.errorForms').remove();
            jQuery(document).find('#pccontact_stors_form #edit-actions')
            .append('<p class="errorForms"> '+PhoneError+'</p>').hide().fadeIn().show();
            return false;
        }else{
	 return true;
	}		
			
    });

});


;
(function ($) {
  $.fn.overlay = function(overlay)  {
    $(this).once(function(){

      overlay = overlay.clone();
      overlay.show();

      overlay.css('display', 'block');
      overlay.css('position', 'absolute');
      overlay.css('z-index', '1000');

      overlay.css('top', $(this).attr('offsetTop'));
      overlay.css('left', $(this).attr('offsetLeft') );
      overlay.css('width', $(this).outerWidth());
      overlay.css('height', $(this).outerHeight());


      $('.filler', overlay).css('width', $(this).outerWidth());
      $('.filler', overlay).css('height', $(this).outerHeight());

      $(this).parent().append(overlay);
      overlay.position($(this).position());
    });
  }

  var pcproductsRequest;

var submitProductForm= function(callback) {
    if (pcproductsRequest){
      pcproductsRequest.abort();
    }
    var $form = $('#pcproducts-product-form');
    var url = $form.attr('action');

    pcproductsRequest = $.ajax({
      type: "POST",
      url: url,
      data: $form.serialize() + '&op=ajax',
      success: function(data){
        $form.html($($form, data).html());
        var $blockTemplates = $('#block-pcproducts-templates');
        $blockTemplates.html($($blockTemplates, data).html());
        Drupal.attachBehaviors($form);
        Drupal.attachBehaviors($blockTemplates);
      }
    });
  }

  Drupal.behaviors.pcproducts = {
    detach: function (context) {

    },
    attach: function (context, settings) {
      var $productForm = $('#pcproducts-product-form');
      var productConfigForm = $('#pcproducts-productconfig-form');
      var isNumber = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n) && (parseFloat(n) > 0);
      }

      var padLeft = function(value, length, oneChar){
        if (oneChar == undefined) {
            oneChar = '0';
        }
        if (length == undefined) {
            length = 2;
        }
        value = value.toString();
        var max = (length - value.length);
        for (var i = 0; i < max; i++) {
            value = oneChar + value;
        }
        return value;
      }

      var decimalPart = function(value){
        var decimals = value - Math.floor(value) ;
        decimals *= 100;
        return padLeft(Math.round(decimals));


        var stringValue = value.toString();
        var startIndex = stringValue.indexOf(".")-1;
        if (startIndex >=0){
          var resultvalue = parseFloat(stringValue.substring(startIndex));
          resultvalue*=100;
          return padLeft(Math.round(resultvalue, 2));
        }else{
          return '00';
        }
        
      }

      var recalculate = function(){
        var qty = $($productForm, '.step-2 .grid input[type="radio"]:checked').val();

        var price = parseFloat($('input[name="price[' + qty + ']"]').val());
        var vatpercentage = parseFloat($('input[name="vatpercentage"]').val());


        $($productForm, '.step-2 .form-item-options :checked').each(function(){
          var id = $(this).val();
          var start = parseFloat($('input[name="option[' + id + '][start]"]').val());
          var unit = parseInt($('input[name="option[' + id + '][unit]"]').val());
          var unitPrice = parseFloat($('input[name="option[' + id + '][price]"]').val());

          var optionPrice = start;
          for (var i=0;i<qty; i+=unit){
            optionPrice+=unitPrice;
          }
          price+=optionPrice;
        });

        var totalexvat = price;
        var vat = totalexvat * vatpercentage;
        var total = totalexvat * (1 + vatpercentage);

        $($productForm, '.priceblock .totalexvat .price .value').html(totalexvat.toFixed(2).replace('.', $($productForm, '.priceblock .totalexvat .price').attr('decimal_separator')));
        $($productForm, '.priceblock .vat .price .value').html(vat.toFixed(2).replace('.', $($productForm, '.priceblock .vat .price').attr('decimal_separator')));
        $($productForm, '.priceblock .total .price .value').html(total.toFixed(2).replace('.', $($productForm, '.priceblock .total .price').attr('decimal_separator')));
      }


      if (!isNumber($($productForm, 'input[type="text"]').val())){
        $($productForm, '.custom .price').hide();
        $($productForm, '.custom .priceperpiece').hide();
        $($productForm, '.custom .select').hide();
        $($productForm, '.custom .save').hide();
        $($productForm, '.custom td').hide();
        $($productForm, '.custom .text').show();
        $($productForm, '.custom .quantity').show();
      }
      else{
        $($productForm, '.custom .text').hide();
      }

      $($productForm).submit(function(){
        if (pcproductsRequest){
          pcproductsRequest.abort();
        }
      });

      $($productForm, 'input[type="text"]').once().keyup(function(){
        if (pcproductsRequest){
          pcproductsRequest.abort();
        }

        if (isNumber($(this).val())){
          $($productForm, '.custom .select input').val($(this).val());
          $($productForm, '.custom .select input').attr('checked', true);

          var form = $('#pcproducts-product-form');
          var postData = form.serialize();
          pcproductsRequest = $.getJSON(Drupal.settings.basePath + '?q=/js/products', postData, function(data){

            $($productForm).append('<input type="hidden" name="price[' + data.quantity + ']" value="' + data.price + '"/>');
            $($productForm, '.custom .price .value').html(data.price.toFixed(2).replace('.', ','));

            $($productForm, '.custom .priceperpiece .value').html(data.priceperpiece.toFixed(2).replace('.', ','));
            $($productForm, '.custom .price').show();
            $($productForm, '.custom .priceperpiece').show();
            $($productForm, '.custom .select').show();
            $($productForm, '.custom .save').show();
            $($productForm, '.custom td').show();
            $($productForm, '.custom .text').hide();

            recalculate();
            submitProductForm();
          });
        } else {
          $('#quantity-custom-radio').val('');
          $('#quantity-custom-radio').attr('checked', false);
          
          $('#edit-quantity-custom-price').html('');
          $('#edit-quantity-custom-priceperpiece').html('');

          $($productForm, '.custom .price').hide();
          $($productForm, '.custom .select').hide();
          $($productForm, '.custom .priceperpiece').hide();
          $($productForm, '.custom .save').hide();
          $($productForm, '.custom td').hide();
          $($productForm, '.custom .text').show();
          $($productForm, '.custom .quantity').show();
          $($productForm, '.custom .currency').hide();
        }
       
        return false;
      });

      $($productForm, '.step-1 select').change(function(){
        //$($productForm, '.step-1 .fieldset-wrapper').overlay();
        $($productForm, '.step-2 .grid').overlay($('.grid-overlay'));
        $($productForm, '.step-2 .form-item-options').overlay($('.overlay'));
        $($productForm, '.step-2 .footer').overlay($('.overlay'));
        submitProductForm();
      });

      $($productForm, '.step-2 .grid input[type="radio"]').once().click(function(event){
        recalculate();
        submitProductForm();
      });

      $($productForm, '.step-2 .form-item-options input[type="checkbox"]').once().change(function(){
        recalculate();
        submitProductForm();
      });
      
      $($productForm, 'input[type="checkbox"]').once().change(function(){
        recalculate();
        submitProductForm();
      });

      $('#pcproducts-product-form input[type="radio"], #pcproducts-product-form input[type="checkbox"], #pcproducts-product-form select, #pcproducts-product-form input[type="text"]').once().change(function(){
        });

      $($productForm, 'input[name=quantity]').once(function(){
        var radio= $(this);
        radio.parents('tbody tr').once().click(function(){
          radio.attr('checked', true);
          recalculate();
          submitProductForm();

        });
      });
     
      if ($.fancybox){
        $($productForm, '.deadlines a').fancybox({
          width: 500,
          height: 400,
          padding: 0,
          margin: 0,
          scrolling: false,
          autoScale: false,
          hideOnOverlayClick: true,
          autoDimensions: false
        });
      }

      $( '.deadlines a', productConfigForm).once('slideToggle').click(function(){
        $('.content', $(this).parent()).slideToggle('slow');
        return false;
      });
      
      $($productForm, '#toolboxitems').hide();
      $($productForm, 'select').once(function (){
       // var cls = $(this).attr('class');
        var id = $(this).attr('id') + '-replacement';
        var dropdownId = $(this).attr('id') + '-dropdown';
        var select = $(this);
        var control = $('<div id="' + id + '" class="' + cls + ' select-replacement"/>');

        $(this).wrap(control);


        var dropdown = $('<div class="dropdown"/>').hide();
        dropdown.append('<div class="dropdown-content"/>');
        dropdown.find('.dropdown-content').append($('#dropdowns #' + dropdownId))
        var input = $('<a class="select"/>');
        input.html($('option:selected',select).text());
        input.click(function(){
          dropdown.slideDown();
          return false;
        });

        var table = $('<table/>');
        var row = $('<tr/>');
        var i = 1;
        $('option', this).each(function (){
          var option = $(this);
          var value = option.attr('value');

          var content = $($productForm, '#toolboxitems #' + value).html();

          if(content) {
            var newOption = $('<td>' + content + '</td>');

            newOption.click(function(){
              $('select', $('#' + id)).val(value).change();
              dropdown.slideUp();
            });


            row.append(newOption);
            if (!(i % 4)) {
              table.append(row);
              row = $('<tr/>');
            }
          }
          i++;
        });

        table.append(row);

        dropdown.find('.fieldset-wrapper').append(table);

        $($productForm, '#' + id).append(input);
        $($productForm, '#' + id).append(dropdown);
        $($productForm, '#' + id).once().keyup(function(event){
          switch (event.keyCode) {
            case 27:
              dropdown.slideUp();
              return true;
          }
        });

        $('#' + id).hover(
          function(){
          },
          function(){
          }
          );

        $(this).hide();

      });


      $($productForm, '.select-replacement > select').change(function (){
        $('.select', $(this).parent()).html($('option:selected',this).text());
      });


      $($productForm, '.select-replacement .dropdown .close').click(function (){
        $(this).parents('.dropdown').slideUp();
      });

      $('#block-pcproducts-templates').each(function(){
        $('#pcproducts-productconfig-form #templates .fieldset-wrapper').once('moveblock', function() {
          $(this).replaceAll($('#block-pcproducts-templates .content *'));
          $('#pcproducts-productconfig-form #templates').remove();
        });
      });
            
      if ($( '.form-item-step2-custom-quantity input', productConfigForm).val()){
        $('table.grid tbody tr.custom', productConfigForm).show();
      }
      else{
        $( 'table.grid tbody tr.custom', productConfigForm).hide();
      }
      
      $( 'tr:not(:first-child)',productConfigForm).once('rowclick').click(function(){
        var radio = $('input[type=radio]', this);
      });
     
      $('input[name="step1[title]"]', productConfigForm).once('replace-title', function(){
        $('h1').html($(this).val());
      });
     
    
      $('#pcproducts-config-form .form-type-select').once().each(function() {
        var label = $('label' ,this);
        var select = $('select' ,this);
        var selected = $('option:selected',select);
        var replacement = $('<a href="#" class="text"/>');
        var item = $(this);
        var dropdown = $(this).next();
        
        select.hide();
        
        replacement.html(selected.text());
        
        item.append(replacement);
        
        dropdown.hide();
        
        item.click(function() {
          dropdown.slideToggle(function() {
            item.toggleClass('expanded');
          });
          return false;
        });
      });
      
      $('#pcproducts-productconfig-form .configuration .replacement').once().each(function() {
        var item =  $(this).prev();
        var select = $('select' ,item);
        var dropdown = $('.dropdown',this);
        var link = $('a.select',this);
        item.addClass('replaced');
        link.click(function() {
          dropdown.toggleClass('open');
          return false;
        });
        dropdown.hover(
          function(){},
          function(){
            dropdown.removeClass('open');
          });
     
        $('legend', dropdown).click(function() {
          dropdown.removeClass('open');
          return false;
        });
        
        $('a', dropdown).click(function() {
          var val = $(this).attr('id');
          select.val(val).trigger('change');
          link.html($('option:selected', select).text());
          
          dropdown.removeClass('open');
          return false;
        });
      });
      
      $('#pcproducts-config-form .form-type-select .item').once().each(function() {
        var dropdown = $(this).parent().next();
        var item = $(this).parent();
        var select = $(this);
        var replacement = $(this).next();
        $('a', dropdown).click(function() {
          var val = $(this).attr('id');
          $("input[name='selectedToolBoxItem']").val(val);
          select.val(val).trigger('change');
          replacement.html($('option:selected', select).text());
          $('input[type="radio"]', this).attr('checked', true);
          dropdown.slideUp(function() {
            item.removeClass('expanded');
          });
          return false;
        });
      });

      $('#pcproducts-config-form .form-type-checkboxes').once().each(function() {
        var item = $(this);
        var options = $('.form-checkboxes', this);
        var checked = $('input:checked', options);
        var texts = [];
        checked.each(function() {
          var item = $(this).parent();
          texts.push($('label', item).html()) ;
        });

        if (texts.length == 0) {
          var defaultText = $('#default-options-text').html();
          texts.push(defaultText);
        }
        var text = $('<a href="#" class="text"/>');
        text.html(texts.join('<br />'));
        item.append(text);
        
        options.hide();
        
        item.click(function() {
          options.slideToggle(function() {
            item.toggleClass('expanded');
          });
          return false;
        });

        $(options.parent()).after(options);
      });
      
        $('#pcproducts-config-form table tr td input').each(function() {
            var radio = $(this);
            $(this).parents('tr').click(function(e) {
                if (radio.parents('tr').find('input[type="text"]').val() == "") {
                    e.stopPropagation();
                    return false;
                }
                radio.attr('checked', true);
                radio.trigger('change');
            })
        });
      
       
        var destinationLink = $('#pcproducts-config-formImage2').find('a').length;
        if (destinationLink > 0) {
          $('#pcproducts-config-formImage2 img').css('cursor', 'pointer');
        }
      
      $('#pcproducts-config-formImage2 img').click(function(){
          if (destinationLink > 0) {
             window.location = $('#pcproducts-config-formImage2').find('a').attr('href');
          }
      });
      
      $('#pcproducts-config-form input[type="text"]').once().click(function() {
        $(this).parents('tr').find('input[type=radio]').attr('checked', true);
        return false;
        
      }).keypress(function(e){
        if ( e.which == 13 ){
          $(this).blur();
          return false;
        }
        if ( e.which == 13 ) e.preventDefault();
      });
      
      $('.type_product').change(function(){
        var url = $(this).val();
        window.location.href= url;
        });
    }
  }
})(jQuery);
;
/*! qTip2  (includes: svg ajax tips modal viewport imagemap ie6 / basic css3) | qtip2.com | Licensed MIT, GPL | Sun Jun 02 2013 14:19:53 */
(function(a,b,c){(function(a){"use strict",typeof define=="function"&&define.amd?define(["jquery"],a):jQuery&&!jQuery.fn.qtip&&a(jQuery)})(function(d){function G(c){v={pageX:c.pageX,pageY:c.pageY,type:"mousemove",scrollX:a.pageXOffset||b.body.scrollLeft||b.documentElement.scrollLeft,scrollY:a.pageYOffset||b.body.scrollTop||b.documentElement.scrollTop}}function H(a){var b=function(a){return a===g||"object"!=typeof a},c=function(a){return!d.isFunction(a)&&(!a&&!a.attr||a.length<1||"object"==typeof a&&!a.jquery&&!a.then)};if(!a||"object"!=typeof a)return f;b(a.metadata)&&(a.metadata={type:a.metadata});if("content"in a){if(b(a.content)||a.content.jquery)a.content={text:a.content};c(a.content.text||f)&&(a.content.text=f),"title"in a.content&&(b(a.content.title)&&(a.content.title={text:a.content.title}),c(a.content.title.text||f)&&(a.content.title.text=f))}return"position"in a&&b(a.position)&&(a.position={my:a.position,at:a.position}),"show"in a&&b(a.show)&&(a.show=a.show.jquery?{target:a.show}:{event:a.show}),"hide"in a&&b(a.hide)&&(a.hide=a.hide.jquery?{target:a.hide}:{event:a.hide}),"style"in a&&b(a.style)&&(a.style={classes:a.style}),d.each(u,function(){this.sanitize&&this.sanitize(a)}),a}function I(h,i,j,k){function O(a){var b=0,c,d=i,e=a.split(".");while(d=d[e[b++]])b<e.length&&(c=d);return[c||i,e.pop()]}function P(a){return y.concat("").join(a?"-"+a+" ":" ")}function Q(){var a=i.style.widget,b=J.hasClass(L);J.removeClass(L),L=a?"ui-state-disabled":"qtip-disabled",J.toggleClass(L,b),J.toggleClass("ui-helper-reset "+P(),a).toggleClass(A,i.style.def&&!a),M.content&&M.content.toggleClass(P("content"),a),M.titlebar&&M.titlebar.toggleClass(P("header"),a),M.button&&M.button.toggleClass(w+"-icon",!a)}function R(a){M.title&&(M.titlebar.remove(),M.titlebar=M.title=M.button=g,a!==f&&q.reposition())}function S(){var a=i.content.title.button,b=typeof a=="string",c=b?a:"Close tooltip";M.button&&M.button.remove(),a.jquery?M.button=a:M.button=d("<a />",{"class":"qtip-close "+(i.style.widget?"":w+"-icon"),title:c,"aria-label":c}).prepend(d("<span />",{"class":"ui-icon ui-icon-close",html:"&times;"})),M.button.appendTo(M.titlebar||J).attr("role","button").click(function(a){return J.hasClass(L)||q.hide(a),f})}function T(){var a=s+"-title";M.titlebar&&R(),M.titlebar=d("<div />",{"class":w+"-titlebar "+(i.style.widget?P("header"):"")}).append(M.title=d("<div />",{id:a,"class":w+"-title","aria-atomic":e})).insertBefore(M.content).delegate(".qtip-close","mousedown keydown mouseup keyup mouseout",function(a){d(this).toggleClass("ui-state-active ui-state-focus",a.type.substr(-4)==="down")}).delegate(".qtip-close","mouseover mouseout",function(a){d(this).toggleClass("ui-state-hover",a.type==="mouseover")}),i.content.title.button&&S()}function U(a){var b=M.button;if(!q.rendered)return f;a?S():b.remove()}function V(a,b){var c=M.title;if(!q.rendered||!a)return f;d.isFunction(a)&&(a=a.call(h,N.event,q));if(a===f||!a&&a!=="")return R(f);a.jquery&&a.length>0?c.empty().append(a.css({display:"block"})):c.html(a),b!==f&&q.rendered&&J[0].offsetWidth>0&&q.reposition(N.event)}function W(a){a&&d.isFunction(a.done)&&a.done(function(a){X(a,null,f)})}function X(a,b,e){function j(a){function i(c){c&&(delete h[c.src],clearTimeout(q.timers.img[c.src]),d(c).unbind(K)),d.isEmptyObject(h)&&(b!==f&&q.reposition(N.event),a())}var e,h={};if((e=g.find("img[src]:not([height]):not([width])")).length===0)return i();e.each(function(a,b){if(h[b.src]!==c)return;var e=0,f=3;(function g(){if(b.height||b.width||e>f)return i(b);e+=1,q.timers.img[b.src]=setTimeout(g,700)})(),d(b).bind("error"+K+" load"+K,function(){i(this)}),h[b.src]=b})}var g=M.content;return!q.rendered||!a?f:(d.isFunction(a)&&(a=a.call(h,N.event,q)||""),e!==f&&W(i.content.deferred),a.jquery&&a.length>0?g.empty().append(a.css({display:"block"})):g.html(a),q.rendered<0?J.queue("fx",j):(I=0,j(d.noop)),q)}function Y(){function m(a){if(J.hasClass(L))return f;clearTimeout(q.timers.show),clearTimeout(q.timers.hide);var b=function(){q.toggle(e,a)};i.show.delay>0?q.timers.show=setTimeout(b,i.show.delay):b()}function n(a){if(J.hasClass(L)||D||I)return f;var b=d(a.relatedTarget||a.target),e=b.closest(z)[0]===J[0],h=b[0]===g.show[0];clearTimeout(q.timers.show),clearTimeout(q.timers.hide);if(c.target==="mouse"&&e||i.hide.fixed&&/mouse(out|leave|move)/.test(a.type)&&(e||h)){try{a.preventDefault(),a.stopImmediatePropagation()}catch(j){}return}i.hide.delay>0?q.timers.hide=setTimeout(function(){q.hide(a)},i.hide.delay):q.hide(a)}function o(a){if(J.hasClass(L))return f;clearTimeout(q.timers.inactive),q.timers.inactive=setTimeout(function(){q.hide(a)},i.hide.inactive)}function p(a){q.rendered&&J[0].offsetWidth>0&&q.reposition(a)}var c=i.position,g={show:i.show.target,hide:i.hide.target,viewport:d(c.viewport),document:d(b),body:d(b.body),window:d(a)},k={show:d.trim(""+i.show.event).split(" "),hide:d.trim(""+i.hide.event).split(" ")},l=d.browser.msie&&parseInt(d.browser.version,10)===6;J.bind("mouseenter"+K+" mouseleave"+K,function(a){var b=a.type==="mouseenter";b&&q.focus(a),J.toggleClass(C,b)}),/mouse(out|leave)/i.test(i.hide.event)&&i.hide.leave==="window"&&g.window.bind("mouseout"+K+" blur"+K,function(a){!/select|option/.test(a.target.nodeName)&&!a.relatedTarget&&q.hide(a)}),i.hide.fixed?(g.hide=g.hide.add(J),J.bind("mouseover"+K,function(){J.hasClass(L)||clearTimeout(q.timers.hide)})):/mouse(over|enter)/i.test(i.show.event)&&g.hide.bind("mouseleave"+K,function(a){clearTimeout(q.timers.show)}),(""+i.hide.event).indexOf("unfocus")>-1&&c.container.closest("html").bind("mousedown"+K+" touchstart"+K,function(a){var b=d(a.target),c=q.rendered&&!J.hasClass(L)&&J[0].offsetWidth>0,e=b.parents(z).filter(J[0]).length>0;b[0]!==h[0]&&b[0]!==J[0]&&!e&&!h.has(b[0]).length&&!b.attr("disabled")&&q.hide(a)}),"number"==typeof i.hide.inactive&&(g.show.bind("qtip-"+j+"-inactive",o),d.each(t.inactiveEvents,function(a,b){g.hide.add(M.tooltip).bind(b+K+"-inactive",o)})),d.each(k.hide,function(a,b){var c=d.inArray(b,k.show),e=d(g.hide);c>-1&&e.add(g.show).length===e.length||b==="unfocus"?(g.show.bind(b+K,function(a){J[0].offsetWidth>0?n(a):m(a)}),delete k.show[c]):g.hide.bind(b+K,n)}),d.each(k.show,function(a,b){g.show.bind(b+K,m)}),"number"==typeof i.hide.distance&&g.show.add(J).bind("mousemove"+K,function(a){var b=N.origin||{},c=i.hide.distance,d=Math.abs;(d(a.pageX-b.pageX)>=c||d(a.pageY-b.pageY)>=c)&&q.hide(a)}),c.target==="mouse"&&(g.show.bind("mousemove"+K,G),c.adjust.mouse&&(i.hide.event&&(J.bind("mouseleave"+K,function(a){(a.relatedTarget||a.target)!==g.show[0]&&q.hide(a)}),M.target.bind("mouseenter"+K+" mouseleave"+K,function(a){N.onTarget=a.type==="mouseenter"})),g.document.bind("mousemove"+K,function(a){q.rendered&&N.onTarget&&!J.hasClass(L)&&J[0].offsetWidth>0&&q.reposition(a||v)}))),(c.adjust.resize||g.viewport.length)&&(d.event.special.resize?g.viewport:g.window).bind("resize"+K,p),g.window.bind("scroll"+K,p)}function Z(){var c=[i.show.target[0],i.hide.target[0],q.rendered&&M.tooltip[0],i.position.container[0],i.position.viewport[0],i.position.container.closest("html")[0],a,b];q.rendered?d([]).pushStack(d.grep(c,function(a){return typeof a=="object"})).unbind(K):i.show.target.unbind(K+"-create")}var q=this,r=b.body,s=w+"-"+j,D=0,I=0,J=d(),K=".qtip-"+j,L="qtip-disabled",M,N;q.id=j,q.rendered=f,q.destroyed=f,q.elements=M={target:h},q.timers={img:{}},q.options=i,q.checks={},q.plugins={},q.cache=N={event:{},target:d(),disabled:f,attr:k,onTarget:f,lastClass:""},q.checks.builtin={"^id$":function(a,b,c){var g=c===e?t.nextid:c,h=w+"-"+g;g!==f&&g.length>0&&!d("#"+h).length&&(J[0].id=h,M.content[0].id=h+"-content",M.title[0].id=h+"-title")},"^content.text$":function(a,b,c){X(i.content.text)},"^content.deferred$":function(a,b,c){W(i.content.deferred)},"^content.title.text$":function(a,b,c){if(!c)return R();!M.title&&c&&T(),V(c)},"^content.title.button$":function(a,b,c){U(c)},"^position.(my|at)$":function(a,b,c){"string"==typeof c&&(a[b]=new u.Corner(c))},"^position.container$":function(a,b,c){q.rendered&&J.appendTo(c)},"^show.ready$":function(){q.rendered?q.toggle(e):q.render(1)},"^style.classes$":function(a,b,c){J.attr("class",w+" qtip "+c)},"^style.width|height":function(a,b,c){J.css(b,c)},"^style.widget|content.title":Q,"^events.(render|show|move|hide|focus|blur)$":function(a,b,c){J[(d.isFunction(c)?"":"un")+"bind"]("tooltip"+b,c)},"^(show|hide|position).(event|target|fixed|inactive|leave|distance|viewport|adjust)":function(){var a=i.position;J.attr("tracking",a.target==="mouse"&&a.adjust.mouse),Z(),Y()}},d.extend(q,{_triggerEvent:function(a,b,c){var e=d.Event("tooltip"+a);return e.originalEvent=(c?d.extend({},c):g)||N.event||g,J.trigger(e,[q].concat(b||[])),!e.isDefaultPrevented()},render:function(a){if(q.rendered)return q;var b=i.content.text,c=i.content.title,g=i.position;return d.attr(h[0],"aria-describedby",s),J=M.tooltip=d("<div/>",{id:s,"class":[w,A,i.style.classes,w+"-pos-"+i.position.my.abbrev()].join(" "),width:i.style.width||"",height:i.style.height||"",tracking:g.target==="mouse"&&g.adjust.mouse,role:"alert","aria-live":"polite","aria-atomic":f,"aria-describedby":s+"-content","aria-hidden":e}).toggleClass(L,N.disabled).data("qtip",q).appendTo(i.position.container).append(M.content=d("<div />",{"class":w+"-content",id:s+"-content","aria-atomic":e})),q.rendered=-1,D=1,c.text?(T(),d.isFunction(c.text)||V(c.text,f)):c.button&&S(),(!d.isFunction(b)||b.then)&&X(b,f),q.rendered=e,Q(),d.each(i.events,function(a,b){d.isFunction(b)&&J.bind(a==="toggle"?"tooltipshow tooltiphide":"tooltip"+a,b)}),d.each(u,function(){this.initialize==="render"&&this(q)}),Y(),J.queue("fx",function(b){q._triggerEvent("render"),D=0,(i.show.ready||a)&&q.toggle(e,N.event,f),b()}),q},get:function(a){var b,c;switch(a.toLowerCase()){case"dimensions":b={height:J.outerHeight(f),width:J.outerWidth(f)};break;case"offset":b=u.offset(J,i.position.container);break;default:c=O(a.toLowerCase()),b=c[0][c[1]],b=b.precedance?b.string():b}return b},set:function(a,b){function m(a,b){var c,d,e;for(c in k)for(d in k[c])if(e=(new RegExp(d,"i")).exec(a))b.push(e),k[c][d].apply(q,b)}var c=/^position\.(my|at|adjust|target|container)|style|content|show\.ready/i,h=/^content\.(title|attr)|style/i,j=f,k=q.checks,l;return"string"==typeof a?(l=a,a={},a[l]=b):a=d.extend(e,{},a),d.each(a,function(b,e){var f=O(b.toLowerCase()),g;g=f[0][f[1]],f[0][f[1]]="object"==typeof e&&e.nodeType?d(e):e,a[b]=[f[0],f[1],e,g],j=c.test(b)||j}),H(i),D=1,d.each(a,m),D=0,q.rendered&&J[0].offsetWidth>0&&j&&q.reposition(i.position.target==="mouse"?g:N.event),q},toggle:function(a,c){function t(){a?(d.browser.msie&&J[0].style.removeAttribute("filter"),J.css("overflow",""),"string"==typeof h.autofocus&&d(h.autofocus,J).focus(),h.target.trigger("qtip-"+j+"-inactive")):J.css({display:"",visibility:"",opacity:"",left:"",top:""}),q._triggerEvent(a?"visible":"hidden")}if(c){if(/over|enter/.test(c.type)&&/out|leave/.test(N.event.type)&&i.show.target.add(c.target).length===i.show.target.length&&J.has(c.relatedTarget).length)return q;N.event=d.extend({},c)}if(!q.rendered)return a?q.render(1):q;var g=a?"show":"hide",h=i[g],k=i[a?"hide":"show"],l=i.position,m=i.content,n=J[0].offsetWidth>0,o=a||h.target.length===1,p=!c||h.target.length<2||N.target[0]===c.target,r,s;return(typeof a).search("boolean|number")&&(a=!n),!J.is(":animated")&&n===a&&p?q:q._triggerEvent(g,[90])?(d.attr(J[0],"aria-hidden",!a),a?(N.origin=d.extend({},v),q.focus(c),d.isFunction(m.text)&&X(m.text,f),d.isFunction(m.title.text)&&V(m.title.text,f),!F&&l.target==="mouse"&&l.adjust.mouse&&(d(b).bind("mousemove.qtip",G),F=e),q.reposition(c,arguments[2]),!h.solo||d(z,h.solo).not(J).qtip("hide",d.Event("tooltipsolo"))):(clearTimeout(q.timers.show),delete N.origin,F&&!d(z+'[tracking="true"]:visible',h.solo).not(J).length&&(d(b).unbind("mousemove.qtip"),F=f),q.blur(c)),h.effect===f||o===f?(J[g](),t.call(J)):d.isFunction(h.effect)?(J.stop(1,1),h.effect.call(J,q),J.queue("fx",function(a){t(),a()})):J.fadeTo(90,a?1:0,t),a&&h.target.trigger("qtip-"+j+"-inactive"),q):q},show:function(a){return q.toggle(e,a)},hide:function(a){return q.toggle(f,a)},focus:function(a){if(!q.rendered)return q;var b=d(z),c=parseInt(J[0].style.zIndex,10),e=t.zindex+b.length,f=d.extend({},a),g;return J.hasClass(B)||q._triggerEvent("focus",[e],f)&&(c!==e&&(b.each(function(){this.style.zIndex>c&&(this.style.zIndex=this.style.zIndex-1)}),b.filter("."+B).qtip("blur",f)),J.addClass(B)[0].style.zIndex=e),q},blur:function(a){return J.removeClass(B),q._triggerEvent("blur",[J.css("zIndex")],a),q},reposition:function(c,e){if(!q.rendered||D)return q;D=1;var g=i.position.target,h=i.position,j=h.my,k=h.at,r=h.adjust,s=r.method.split(" "),t=J.outerWidth(f),w=J.outerHeight(f),x=0,y=0,z=J.css("position"),A=h.viewport,B={left:0,top:0},C=h.container,E=J[0].offsetWidth>0,F=c&&c.type==="scroll",G=d(a),H,I;if(d.isArray(g)&&g.length===2)k={x:m,y:l},B={left:g[0],top:g[1]};else if(g==="mouse"&&(c&&c.pageX||N.event.pageX))k={x:m,y:l},c=v&&v.pageX&&(r.mouse||!c||!c.pageX)?{pageX:v.pageX,pageY:v.pageY}:(c&&(c.type==="resize"||c.type==="scroll")?N.event:c&&c.pageX&&c.type==="mousemove"?c:!r.mouse&&N.origin&&N.origin.pageX&&i.show.distance?N.origin:c)||c||N.event||v||{},z!=="static"&&(B=C.offset()),B={left:c.pageX-B.left,top:c.pageY-B.top},r.mouse&&F&&(B.left-=v.scrollX-G.scrollLeft(),B.top-=v.scrollY-G.scrollTop());else{g==="event"&&c&&c.target&&c.type!=="scroll"&&c.type!=="resize"?N.target=d(c.target):g!=="event"&&(N.target=d(g.jquery?g:M.target)),g=N.target,g=d(g).eq(0);if(g.length===0)return q;g[0]===b||g[0]===a?(x=u.iOS?a.innerWidth:g.width(),y=u.iOS?a.innerHeight:g.height(),g[0]===a&&(B={top:(A||g).scrollTop(),left:(A||g).scrollLeft()})):u.imagemap&&g.is("area")?H=u.imagemap(q,g,k,u.viewport?s:f):u.svg&&g[0].ownerSVGElement?H=u.svg(q,g,k,u.viewport?s:f):(x=g.outerWidth(f),y=g.outerHeight(f),B=u.offset(g,C)),H&&(x=H.width,y=H.height,I=H.offset,B=H.position);if(u.iOS>3.1&&u.iOS<4.1||u.iOS>=4.3&&u.iOS<4.33||!u.iOS&&z==="fixed")B.left-=G.scrollLeft(),B.top-=G.scrollTop();B.left+=k.x===o?x:k.x===p?x/2:0,B.top+=k.y===n?y:k.y===p?y/2:0}return B.left+=r.x+(j.x===o?-t:j.x===p?-t/2:0),B.top+=r.y+(j.y===n?-w:j.y===p?-w/2:0),u.viewport?(B.adjusted=u.viewport(q,B,h,x,y,t,w),I&&B.adjusted.left&&(B.left+=I.left),I&&B.adjusted.top&&(B.top+=I.top)):B.adjusted={left:0,top:0},q._triggerEvent("move",[B,A.elem||A],c)?(delete B.adjusted,e===f||!E||isNaN(B.left)||isNaN(B.top)||g==="mouse"||!d.isFunction(h.effect)?J.css(B):d.isFunction(h.effect)&&(h.effect.call(J,q,d.extend({},B)),J.queue(function(a){d(this).css({opacity:"",height:""}),d.browser.msie&&this.style.removeAttribute("filter"),a()})),D=0,q):q},disable:function(a){return"boolean"!=typeof a&&(a=!J.hasClass(L)&&!N.disabled),q.rendered?(J.toggleClass(L,a),d.attr(J[0],"aria-disabled",a)):N.disabled=!!a,q},enable:function(){return q.disable(f)},destroy:function(){var a=h[0],b=d.attr(a,E),c=h.data("qtip");q.destroyed=e,q.rendered&&(J.stop(1,0).remove(),d.each(q.plugins,function(){this.destroy&&this.destroy()})),clearTimeout(q.timers.show),clearTimeout(q.timers.hide),Z();if(!c||q===c)d.removeData(a,"qtip"),i.suppress&&b&&(d.attr(a,"title",b),h.removeAttr(E)),h.removeAttr("aria-describedby");return h.unbind(".qtip-"+j),delete x[q.id],h}})}function J(a,c){var h,i,j,k,l,m=d(this),n=d(b.body),o=this===b?n:m,p=m.metadata?m.metadata(c.metadata):g,q=c.metadata.type==="html5"&&p?p[c.metadata.name]:g,r=m.data(c.metadata.name||"qtipopts");try{r=typeof r=="string"?d.parseJSON(r):r}catch(s){}k=d.extend(e,{},t.defaults,c,typeof r=="object"?H(r):g,H(q||p)),i=k.position,k.id=a;if("boolean"==typeof k.content.text){j=m.attr(k.content.attr);if(k.content.attr!==f&&j)k.content.text=j;else return f}i.container.length||(i.container=n),i.target===f&&(i.target=o),k.show.target===f&&(k.show.target=o),k.show.solo===e&&(k.show.solo=i.container.closest("body")),k.hide.target===f&&(k.hide.target=o),k.position.viewport===e&&(k.position.viewport=i.container),i.container=i.container.eq(0),i.at=new u.Corner(i.at),i.my=new u.Corner(i.my);if(d.data(this,"qtip"))if(k.overwrite)m.qtip("destroy");else if(k.overwrite===f)return f;return k.suppress&&(l=d.attr(this,"title"))&&d(this).removeAttr("title").attr(E,l).attr("title",""),h=new I(m,k,a,!!j),d.data(this,"qtip",h),m.bind("remove.qtip-"+a+" removeqtip.qtip-"+a,function(){h.destroy()}),h}function K(a){var b=this,c=a.elements.tooltip,g=a.options.content.ajax,h=t.defaults.content.ajax,i=".qtip-ajax",j=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,k=e,l=f,m;a.checks.ajax={"^content.ajax":function(a,d,e){d==="ajax"&&(g=e),d==="once"?b.init():g&&g.url?b.load():c.unbind(i)}},d.extend(b,{init:function(){return g&&g.url&&c.unbind(i)[g.once?"one":"bind"]("tooltipshow"+i,b.load),b},load:function(c){function r(){var b;if(a.destroyed)return;k=f,p&&(l=e,a.show(c.originalEvent)),(b=h.complete||g.complete)&&d.isFunction(b)&&b.apply(g.context||a,arguments)}function s(b,c,e){var f;if(a.destroyed)return;o&&"string"==typeof b&&(b=d("<div/>").append(b.replace(j,"")).find(o)),(f=h.success||g.success)&&d.isFunction(f)?f.call(g.context||a,b,c,e):a.set("content.text",b)}function t(b,c,d){if(a.destroyed||b.status===0)return;a.set("content.text",c+": "+d)}if(l){l=f;return}var i=g.url.lastIndexOf(" "),n=g.url,o,p=!g.loading&&k;if(p)try{c.preventDefault()}catch(q){}else if(c&&c.isDefaultPrevented())return b;m&&m.abort&&m.abort(),i>-1&&(o=n.substr(i),n=n.substr(0,i)),m=d.ajax(d.extend({error:h.error||t,context:a},g,{url:n,success:s,complete:r}))},destroy:function(){m&&m.abort&&m.abort(),a.destroyed=e}}),b.init()}function L(a,b,c){var d=Math.ceil(b/2),e=Math.ceil(c/2),f={bottomright:[[0,0],[b,c],[b,0]],bottomleft:[[0,0],[b,0],[0,c]],topright:[[0,c],[b,0],[b,c]],topleft:[[0,0],[0,c],[b,c]],topcenter:[[0,c],[d,0],[b,c]],bottomcenter:[[0,0],[b,0],[d,c]],rightcenter:[[0,0],[b,e],[0,c]],leftcenter:[[b,0],[b,c],[0,e]]};return f.lefttop=f.bottomright,f.righttop=f.bottomleft,f.leftbottom=f.topright,f.rightbottom=f.topleft,f[a.string()]}function M(a,b){function D(a){var b=v.is(":visible");v.show(),a(),v.toggle(b)}function E(){x.width=r.height,x.height=r.width}function F(){x.width=r.width,x.height=r.height}function G(b,d,g,j){if(!t.tip)return;var k=q.corner.clone(),u=g.adjusted,v=a.options.position.adjust.method.split(" "),x=v[0],y=v[1]||v[0],z={left:f,top:f,x:0,y:0},A,B={},C;q.corner.fixed!==e&&(x===s&&k.precedance===h&&u.left&&k.y!==p?k.precedance=k.precedance===h?i:h:x!==s&&u.left&&(k.x=k.x===p?u.left>0?m:o:k.x===m?o:m),y===s&&k.precedance===i&&u.top&&k.x!==p?k.precedance=k.precedance===i?h:i:y!==s&&u.top&&(k.y=k.y===p?u.top>0?l:n:k.y===l?n:l),k.string()!==w.corner.string()&&(w.top!==u.top||w.left!==u.left)&&q.update(k,f)),A=q.position(k,u),A[k.x]+=I(k,k.x),A[k.y]+=I(k,k.y),A.right!==c&&(A.left=-A.right),A.bottom!==c&&(A.top=-A.bottom),A.user=Math.max(0,r.offset);if(z.left=x===s&&!!u.left)k.x===p?B["margin-left"]=z.x=A["margin-left"]:(C=A.right!==c?[u.left,-A.left]:[-u.left,A.left],(z.x=Math.max(C[0],C[1]))>C[0]&&(g.left-=u.left,z.left=f),B[A.right!==c?o:m]=z.x);if(z.top=y===s&&!!u.top)k.y===p?B["margin-top"]=z.y=A["margin-top"]:(C=A.bottom!==c?[u.top,-A.top]:[-u.top,A.top],(z.y=Math.max(C[0],C[1]))>C[0]&&(g.top-=u.top,z.top=f),B[A.bottom!==c?n:l]=z.y);t.tip.css(B).toggle(!(z.x&&z.y||k.x===p&&z.y||k.y===p&&z.x)),g.left-=A.left.charAt?A.user:x!==s||z.top||!z.left&&!z.top?A.left:0,g.top-=A.top.charAt?A.user:y!==s||z.left||!z.left&&!z.top?A.top:0,w.left=u.left,w.top=u.top,w.corner=k.clone()}function H(){var b=r.corner,c=a.options.position,d=c.at,g=c.my.string?c.my.string():c.my;return b===f||g===f&&d===f?f:(b===e?q.corner=new u.Corner(g):b.string||(q.corner=new u.Corner(b),q.corner.fixed=e),w.corner=new u.Corner(q.corner.string()),q.corner.string()!=="centercenter")}function I(a,b,c){b=b?b:a[a.precedance];var d=t.titlebar&&a.y===l,e=d?t.titlebar:v,f="border-"+b+"-width",g=function(a){return parseInt(a.css(f),10)},h;return D(function(){h=(c?g(c):g(t.content)||g(e)||g(v))||0}),h}function J(a){var b=t.titlebar&&a.y===l,c=b?t.titlebar:t.content,e=d.browser.mozilla,f=e?"-moz-":d.browser.webkit?"-webkit-":"",g="border-radius-"+a.y+a.x,h="border-"+a.y+"-"+a.x+"-radius",i=function(a){return parseInt(c.css(a),10)||parseInt(v.css(a),10)},j;return D(function(){j=i(h)||i(f+h)||i(f+g)||i(g)||0}),j}function K(a){function z(a,b,c){var d=a.css(b)||n;return c&&d===a.css(c)?f:j.test(d)?f:d}var b,c,g,h=t.tip.css("cssText",""),i=a||q.corner,j=/rgba?\(0, 0, 0(, 0)?\)|transparent|#123456/i,k="border-"+i[i.precedance]+"-color",m="background-color",n="transparent",o=" !important",s=t.titlebar,u=s&&(i.y===l||i.y===p&&h.position().top+x.height/2+r.offset<s.outerHeight(e)),w=u?s:t.content;D(function(){y.fill=z(h,m)||z(w,m)||z(t.content,m)||z(v,m)||h.css(m),y.border=z(h,k,"color")||z(w,k,"color")||z(t.content,k,"color")||z(v,k,"color")||v.css(k),d("*",h).add(h).css("cssText",m+":"+n+o+";border:0"+o+";")})}function M(a){var b=a.precedance===i,c=x[b?j:k],d=x[b?k:j],e=a.string().indexOf(p)>-1,f=c*(e?.5:1),g=Math.pow,h=Math.round,l,m,n,o=Math.sqrt(g(f,2)+g(d,2)),q=[z/f*o,z/d*o];return q[2]=Math.sqrt(g(q[0],2)-g(z,2)),q[3]=Math.sqrt(g(q[1],2)-g(z,2)),l=o+q[2]+q[3]+(e?0:q[0]),m=l/o,n=[h(m*d),h(m*c)],{height:n[b?0:1],width:n[b?1:0]}}function N(a,b,c){return"<qvml:"+a+' xmlns="urn:schemas-microsoft.com:vml" class="qtip-vml" '+(b||"")+' style="behavior: url(#default#VML); '+(c||"")+'" />'}var q=this,r=a.options.style.tip,t=a.elements,v=t.tooltip,w={top:0,left:0},x={width:r.width,height:r.height},y={},z=r.border||0,A=".qtip-tip",B=!!(d("<canvas />")[0]||{}).getContext,C;q.corner=g,q.mimic=g,q.border=z,q.offset=r.offset,q.size=x,a.checks.tip={"^position.my|style.tip.(corner|mimic|border)$":function(){q.init()||q.destroy(),a.reposition()},"^style.tip.(height|width)$":function(){x={width:r.width,height:r.height},q.create(),q.update(),a.reposition()},"^content.title.text|style.(classes|widget)$":function(){t.tip&&t.tip.length&&q.update()}},d.extend(q,{init:function(){var a=H()&&(B||d.browser.msie);return a&&(q.create(),q.update(),v.unbind(A).bind("tooltipmove"+A,G)),a},create:function(){var a=x.width,b=x.height,c;t.tip&&t.tip.remove(),t.tip=d("<div />",{"class":"qtip-tip"}).css({width:a,height:b}).prependTo(v),B?d("<canvas />").appendTo(t.tip)[0].getContext("2d").save():(c=N("shape",'coordorigin="0,0"',"position:absolute;"),t.tip.html(c+c),d("*",t.tip).bind("click mousedown",function(a){a.stopPropagation()}))},update:function(a,b){var c=t.tip,j=c.children(),k=x.width,s=x.height,A=r.mimic,C=Math.round,D,G,H,J,O;a||(a=w.corner||q.corner),A===f?A=a:(A=new u.Corner(A),A.precedance=a.precedance,A.x==="inherit"?A.x=a.x:A.y==="inherit"?A.y=a.y:A.x===A.y&&(A[a.precedance]=a[a.precedance])),D=A.precedance,a.precedance===h?E():F(),t.tip.css({width:k=x.width,height:s=x.height}),K(a),y.border!=="transparent"?(z=I(a,g),r.border===0&&z>0&&(y.fill=y.border),q.border=z=r.border!==e?r.border:z):q.border=z=0,H=L(A,k,s),q.size=O=M(a),c.css(O).css("line-height",O.height+"px"),a.precedance===i?J=[C(A.x===m?z:A.x===o?O.width-k-z:(O.width-k)/2),C(A.y===l?O.height-s:0)]:J=[C(A.x===m?O.width-k:0),C(A.y===l?z:A.y===n?O.height-s-z:(O.height-s)/2)],B?(j.attr(O),G=j[0].getContext("2d"),G.restore(),G.save(),G.clearRect(0,0,3e3,3e3),G.fillStyle=y.fill,G.strokeStyle=y.border,G.lineWidth=z*2,G.lineJoin="miter",G.miterLimit=100,G.translate(J[0],J[1]),G.beginPath(),G.moveTo(H[0][0],H[0][1]),G.lineTo(H[1][0],H[1][1]),G.lineTo(H[2][0],H[2][1]),G.closePath(),z&&(v.css("background-clip")==="border-box"&&(G.strokeStyle=y.fill,G.stroke()),G.strokeStyle=y.border,G.stroke()),G.fill()):(H="m"+H[0][0]+","+H[0][1]+" l"+H[1][0]+","+H[1][1]+" "+H[2][0]+","+H[2][1]+" xe",J[2]=z&&/^(r|b)/i.test(a.string())?parseFloat(d.browser.version,10)===8?2:1:0,j.css({coordsize:k+z+" "+(s+z),antialias:""+(A.string().indexOf(p)>-1),left:J[0],top:J[1],width:k+z,height:s+z}).each(function(a){var b=d(this);b[b.prop?"prop":"attr"]({coordsize:k+z+" "+(s+z),path:H,fillcolor:y.fill,filled:!!a,stroked:!a}).toggle(!!z||!!a),!a&&b.html()===""&&b.html(N("stroke",'weight="'+z*2+'px" color="'+y.border+'" miterlimit="1000" joinstyle="miter"'))})),b!==f&&q.position(a)},position:function(a){var b=t.tip,c={},e=Math.max(0,r.offset),g,n,o;return r.corner===f||!b?f:(a=a||q.corner,g=a.precedance,n=M(a),o=[a.x,a.y],g===h&&o.reverse(),d.each(o,function(b,d){var f,h,o;d===p?(f=g===i?m:l,c[f]="50%",c["margin-"+f]=-Math.round(n[g===i?j:k]/2)+e):(f=I(a,d),h=I(a,d,t.content),o=J(a),c[d]=b?h:e+(o>f?o:-f))}),c[a[g]]-=n[g===h?j:k],b.css({top:"",bottom:"",left:"",right:"",margin:""}).css(c),c)},destroy:function(){t.tip&&t.tip.remove(),t.tip=!1,v.unbind(A)}}),q.init()}function N(c){function s(){q=d(p,j).not("[disabled]").map(function(){return typeof this.focus=="function"?this:null})}function t(a){q.length<1&&a.length?a.not("body").blur():q.first().focus()}function v(a){var b=d(a.target),c=b.closest(".qtip"),e;e=c.length<1?f:parseInt(c[0].style.zIndex,10)>parseInt(j[0].style.zIndex,10),!e&&d(a.target).closest(z)[0]!==j[0]&&t(b)}var g=this,h=c.options.show.modal,i=c.elements,j=i.tooltip,k="#qtip-overlay",l=".qtipmodal",m=l+c.id,n="is-modal-qtip",o=d(b.body),p=u.modal.focusable.join(","),q={},r;c.checks.modal={"^show.modal.(on|blur)$":function(){g.init(),i.overlay.toggle(j.is(":visible"))},"^content.text$":function(){s()}},d.extend(g,{init:function(){return h.on?(r=g.create(),j.attr(n,e).css("z-index",u.modal.zindex+d(z+"["+n+"]").length).unbind(l).unbind(m).bind("tooltipshow"+l+" tooltiphide"+l,function(a,b,c){var e=a.originalEvent;if(a.target===j[0])if(e&&a.type==="tooltiphide"&&/mouse(leave|enter)/.test(e.type)&&d(e.relatedTarget).closest(r[0]).length)try{a.preventDefault()}catch(f){}else(!e||e&&!e.solo)&&g[a.type.replace("tooltip","")](a,c)}).bind("tooltipfocus"+l,function(a){if(a.isDefaultPrevented()||a.target!==j[0])return;var b=d(z).filter("["+n+"]"),c=u.modal.zindex+b.length,e=parseInt(j[0].style.zIndex,10);r[0].style.zIndex=c-2,b.each(function(){this.style.zIndex>e&&(this.style.zIndex-=1)}),b.end().filter("."+B).qtip("blur",a.originalEvent),j.addClass(B)[0].style.zIndex=c;try{a.preventDefault()}catch(f){}}).bind("tooltiphide"+l,function(a){a.target===j[0]&&d("["+n+"]").filter(":visible").not(j).last().qtip("focus",a)}),h.escape&&d(b).unbind(m).bind("keydown"+m,function(a){a.keyCode===27&&j.hasClass(B)&&c.hide(a)}),h.blur&&i.overlay.unbind(m).bind("click"+m,function(a){j.hasClass(B)&&c.hide(a)}),s(),g):g},create:function(){function e(){r.css({height:c.height(),width:c.width()})}var b=d(k),c=d(a);return b.length?i.overlay=b.insertAfter(d(z).last()):(r=i.overlay=d("<div />",{id:k.substr(1),html:"<div></div>",mousedown:function(){return f}}).hide().insertAfter(d(z).last()),c.unbind(l).bind("resize"+l,e),e(),r)},toggle:function(a,b,c){if(a&&a.isDefaultPrevented())return g;var i=h.effect,k=b?"show":"hide",l=r.is(":visible"),p=d("["+n+"]").filter(":visible").not(j),q;return r||(r=g.create()),r.is(":animated")&&l===b&&r.data("toggleState")!==f||!b&&p.length?g:(b?(r.css({left:0,top:0}),r.toggleClass("blurs",h.blur),h.stealfocus!==f&&(o.bind("focusin"+m,v),t(d("body :focus")))):o.unbind("focusin"+m),r.stop(e,f).data("toggleState",b),d.isFunction(i)?i.call(r,b):i===f?r[k]():r.fadeTo(parseInt(c,10)||90,b?1:0,function(){b||d(this).hide()}),b||r.queue(function(a){r.css({left:"",top:""}).removeData("toggleState"),a()}),g)},show:function(a,b){return g.toggle(a,e,b)},hide:function(a,b){return g.toggle(a,f,b)},destroy:function(){var a=r;return a&&(a=d("["+n+"]").not(j).length<1,a?(i.overlay.remove(),d(b).unbind(l)):i.overlay.unbind(l+c.id),o.unbind("focusin"+m)),j.removeAttr(n).unbind(l)}}),g.init()}function O(c){var g=this,h=c.elements,i=c.options,l=h.tooltip,m=".ie6-"+c.id,n=d("select, object").length<1,o=0,p=f,q;c.checks.ie6={"^content|style$":function(a,b,c){redraw()}},d.extend(g,{init:function(){var c=d(a),f;n&&(h.bgiframe=d('<iframe class="qtip-bgiframe" frameborder="0" tabindex="-1" src="javascript:\'\';"  style="display:block; position:absolute; z-index:-1; filter:alpha(opacity=0); -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";"></iframe>'),h.bgiframe.appendTo(l),l.bind("tooltipmove"+m,g.adjustBGIFrame)),q=d("<div/>",{id:"qtip-rcontainer"}).appendTo(b.body),g.redraw(),h.overlay&&!p&&(f=function(){h.overlay[0].style.top=c.scrollTop()+"px"},c.bind("scroll.qtip-ie6, resize.qtip-ie6",f),f(),h.overlay.addClass("qtipmodal-ie6fix"),p=e)},adjustBGIFrame:function(){var a=c.get("dimensions"),b=c.plugins.tip,d=h.tip,e,f;f=parseInt(l.css("border-left-width"),10)||0,f={left:-f,top:-f},b&&d&&(e=b.corner.precedance==="x"?["width","left"]:["height","top"],f[e[1]]-=d[e[0]]()),h.bgiframe.css(f).css(a)},redraw:function(){if(c.rendered<1||o)return g;var a=i.style,b=i.position.container,d,e,f,h;return o=1,a.height&&l.css(k,a.height),a.width?l.css(j,a.width):(l.css(j,"").appendTo(q),e=l.width(),e%2<1&&(e+=1),f=l.css("max-width")||"",h=l.css("min-width")||"",d=(f+h).indexOf("%")>-1?b.width()/100:0,f=(f.indexOf("%")>-1?d:1)*parseInt(f,10)||e,h=(h.indexOf("%")>-1?d:1)*parseInt(h,10)||0,e=f+h?Math.min(Math.max(e,h),f):e,l.css(j,Math.round(e)).appendTo(b)),o=0,g},destroy:function(){n&&h.bgiframe.remove(),l.unbind(m)}}),g.init()}var e=!0,f=!1,g=null,h="x",i="y",j="width",k="height",l="top",m="left",n="bottom",o="right",p="center",q="flip",r="flipinvert",s="shift",t,u,v,w="qtip",x={},y=["ui-widget","ui-tooltip"],z="div.qtip."+w,A=w+"-default",B=w+"-focus",C=w+"-hover",D="_replacedByqTip",E="oldtitle",F;t=d.fn.qtip=function(a,b,h){var i=(""+a).toLowerCase(),j=g,k=d.makeArray(arguments).slice(1),l=k[k.length-1],m=this[0]?d.data(this[0],"qtip"):g;if(!arguments.length&&m||i==="api")return m;if("string"==typeof a)return this.each(function(){var a=d.data(this,"qtip");if(!a)return e;l&&l.timeStamp&&(a.cache.event=l);if(i!=="option"&&i!=="options"||!b)a[i]&&a[i].apply(a[i],k);else if(d.isPlainObject(b)||h!==c)a.set(b,h);else return j=a.get(b),f}),j!==g?j:this;if("object"==typeof a||!arguments.length)return m=H(d.extend(e,{},a)),t.bind.call(this,m,l)},t.bind=function(a,b){return this.each(function(g){function n(a){function b(){l.render(typeof a=="object"||h.show.ready),i.show.add(i.hide).unbind(k)}if(l.cache.disabled)return f;l.cache.event=d.extend({},a),l.cache.target=a?d(a.target):[c],h.show.delay>0?(clearTimeout(l.timers.show),l.timers.show=setTimeout(b,h.show.delay),j.show!==j.hide&&i.hide.bind(j.hide,function(){clearTimeout(l.timers.show)})):b()}var h,i,j,k,l,m;m=d.isArray(a.id)?a.id[g]:a.id,m=!m||m===f||m.length<1||x[m]?t.nextid++:x[m]=m,k=".qtip-"+m+"-create",l=J.call(this,m,a);if(l===f)return e;h=l.options,d.each(u,function(){this.initialize==="initialize"&&this(l)}),i={show:h.show.target,hide:h.hide.target},j={show:d.trim(""+h.show.event).replace(/ /g,k+" ")+k,hide:d.trim(""+h.hide.event).replace(/ /g,k+" ")+k},/mouse(over|enter)/i.test(j.show)&&!/mouse(out|leave)/i.test(j.hide)&&(j.hide+=" mouseleave"+k),i.show.bind("mousemove"+k,function(a){G(a),l.cache.onTarget=e}),i.show.bind(j.show,n),(h.show.ready||h.prerender)&&n(b)}).attr("data-hasqtip",e)},u=t.plugins={Corner:function(a){a=(""+a).replace(/([A-Z])/," $1").replace(/middle/gi,p).toLowerCase(),this.x=(a.match(/left|right/i)||a.match(/center/)||["inherit"])[0].toLowerCase(),this.y=(a.match(/top|bottom|center/i)||["inherit"])[0].toLowerCase();var b=a.charAt(0);this.precedance=b==="t"||b==="b"?i:h,this.string=function(){return this.precedance===i?this.y+this.x:this.x+this.y},this.abbrev=function(){var a=this.x.substr(0,1),b=this.y.substr(0,1);return a===b?a:this.precedance===i?b+a:a+b},this.invertx=function(a){this.x=this.x===m?o:this.x===o?m:a||this.x},this.inverty=function(a){this.y=this.y===l?n:this.y===n?l:a||this.y},this.clone=function(){return{x:this.x,y:this.y,precedance:this.precedance,string:this.string,abbrev:this.abbrev,clone:this.clone,invertx:this.invertx,inverty:this.inverty}}},offset:function(a,c){function l(a,b){e.left+=b*a.scrollLeft(),e.top+=b*a.scrollTop()}var e=a.offset(),f=a.closest("body"),g=d.browser.msie&&b.compatMode!=="CSS1Compat",h=c,i,j,k;if(h){do h.css("position")!=="static"&&(j=h.position(),e.left-=j.left+(parseInt(h.css("borderLeftWidth"),10)||0)+(parseInt(h.css("marginLeft"),10)||0),e.top-=j.top+(parseInt(h.css("borderTopWidth"),10)||0)+(parseInt(h.css("marginTop"),10)||0),!i&&(k=h.css("overflow"))!=="hidden"&&k!=="visible"&&(i=h));while((h=d(h[0].offsetParent)).length);(i&&i[0]!==f[0]||g)&&l(i||f,1)}return e},iOS:parseFloat((""+(/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent)||[0,""])[1]).replace("undefined","3_2").replace("_",".").replace("_",""))||f,fn:{attr:function(a,b){if(this.length){var c=this[0],e="title",f=d.data(c,"qtip");if(a===e&&f&&"object"==typeof f&&f.options.suppress)return arguments.length<2?d.attr(c,E):(f&&f.options.content.attr===e&&f.cache.attr&&f.set("content.text",b),this.attr(E,b))}return d.fn["attr"+D].apply(this,arguments)},clone:function(a){var b=d([]),c="title",e=d.fn["clone"+D].apply(this,arguments);return a||e.filter("["+E+"]").attr("title",function(){return d.attr(this,E)}).removeAttr(E),e}}},d.each(u.fn,function(a,b){if(!b||d.fn[a+D])return e;var c=d.fn[a+D]=d.fn[a];d.fn[a]=function(){return b.apply(this,arguments)||c.apply(this,arguments)}}),d.ui||(d["cleanData"+D]=d.cleanData,d.cleanData=function(a){for(var b=0,e;(e=a[b])!==c;b++)try{d(e).triggerHandler("removeqtip")}catch(f){}d["cleanData"+D](a)}),t.version="",t.nextid=0,t.inactiveEvents="click dblclick mousedown mouseup mousemove mouseleave mouseenter".split(" "),t.zindex=15e3,t.defaults={prerender:f,id:f,overwrite:e,suppress:e,content:{text:e,attr:"title",deferred:f,title:{text:f,button:f}},position:{my:"top left",at:"bottom right",target:f,container:f,viewport:f,adjust:{x:0,y:0,mouse:e,resize:e,method:"flipinvert flipinvert"},effect:function(a,b,c){d(this).animate(b,{duration:200,queue:f})}},show:{target:f,event:"mouseenter",effect:e,delay:90,solo:f,ready:f,autofocus:f},hide:{target:f,event:"mouseleave",effect:e,delay:0,fixed:f,inactive:f,leave:"window",distance:f},style:{classes:"",widget:f,width:f,height:f,def:e},events:{render:g,move:g,show:g,hide:g,toggle:g,visible:g,hidden:g,focus:g,blur:g}},u.svg=function(a,c,e,f){var g=d(b),h=c[0],i={width:0,height:0,position:{top:1e10,left:1e10}},j,k,l,m,n;while(!h.getBBox)h=h.parentNode;if(h.getBBox&&h.parentNode){j=h.getBBox(),k=h.getScreenCTM(),l=h.farthestViewportElement||h;if(!l.createSVGPoint)return i;m=l.createSVGPoint(),m.x=j.x,m.y=j.y,n=m.matrixTransform(k),i.position.left=n.x,i.position.top=n.y,m.x+=j.width,m.y+=j.height,n=m.matrixTransform(k),i.width=n.x-i.position.left,i.height=n.y-i.position.top,i.position.left+=g.scrollLeft(),i.position.top+=g.scrollTop()}return i},u.ajax=function(a){var b=a.plugins.ajax;return"object"==typeof b?b:a.plugins.ajax=new K(a)},u.ajax.initialize="render",u.ajax.sanitize=function(a){var b=a.content,c;b&&"ajax"in b&&(c=b.ajax,typeof c!="object"&&(c=a.content.ajax={url:c}),"boolean"!=typeof c.once&&c.once&&(c.once=!!c.once))},d.extend(e,t.defaults,{content:{ajax:{loading:e,once:e}}}),u.tip=function(a){var b=a.plugins.tip;return"object"==typeof b?b:a.plugins.tip=new M(a)},u.tip.initialize="render",u.tip.sanitize=function(a){var b=a.style,c;b&&"tip"in b&&(c=a.style.tip,typeof c!="object"&&(a.style.tip={corner:c}),/string|boolean/i.test(typeof c.corner)||(c.corner=e),typeof c.width!="number"&&delete c.width,typeof c.height!="number"&&delete c.height,typeof c.border!="number"&&c.border!==e&&delete c.border,typeof c.offset!="number"&&delete c.offset)},d.extend(e,t.defaults,{style:{tip:{corner:e,mimic:f,width:6,height:6,border:e,offset:0}}}),u.modal=function(a){var b=a.plugins.modal;return"object"==typeof b?b:a.plugins.modal=new N(a)},u.modal.initialize="render",u.modal.sanitize=function(a){a.show&&(typeof a.show.modal!="object"?a.show.modal={on:!!a.show.modal}:typeof a.show.modal.on=="undefined"&&(a.show.modal.on=e))},u.modal.zindex=t.zindex-200,u.modal.focusable=["a[href]","area[href]","input","select","textarea","button","iframe","object","embed","[tabindex]","[contenteditable]"],d.extend(e,t.defaults,{show:{modal:{on:f,effect:e,blur:e,stealfocus:e,escape:e}}}),u.viewport=function(c,d,e,f,g,q,t){function L(a,b,c,e,f,g,h,i,j){var k=d[f],l=x[a],m=y[a],n=c===s,o=-E.offset[f]+D.offset[f]+D["scroll"+f],q=l===f?j:l===g?-j:-j/2,t=m===f?i:m===g?-i:-i/2,u=G&&G.size?G.size[h]||0:0,v=G&&G.corner&&G.corner.precedance===a&&!n?u:0,w=o-k+v,z=k+j-D[h]-o+v,A=q-(x.precedance===a||l===x[b]?t:0)-(m===p?i/2:0);return n?(v=G&&G.corner&&G.corner.precedance===b?u:0,A=(l===f?1:-1)*q-v,d[f]+=w>0?w:z>0?-z:0,d[f]=Math.max(-E.offset[f]+D.offset[f]+(v&&G.corner[a]===p?G.offset:0),k-A,Math.min(Math.max(-E.offset[f]+D.offset[f]+D[h],k+A),d[f]))):(e*=c===r?2:0,w>0&&(l!==f||z>0)?(d[f]-=A+e,J["invert"+a](f)):z>0&&(l!==g||w>0)&&(d[f]-=(l===p?-A:A)+e,J["invert"+a](g)),d[f]<o&&-d[f]>z&&(d[f]=k,J=x.clone())),d[f]-k}var u=e.target,v=c.elements.tooltip,x=e.my,y=e.at,z=e.adjust,A=z.method.split(" "),B=A[0],C=A[1]||A[0],D=e.viewport,E=e.container,F=c.cache,G=c.plugins.tip,H={left:0,top:0},I,J,K;if(!D.jquery||u[0]===a||u[0]===b.body||z.method==="none")return H;I=v.css("position")==="fixed",D={elem:D,height:D[(D[0]===a?"h":"outerH")+"eight"](),width:D[(D[0]===a?"w":"outerW")+"idth"](),scrollleft:I?0:D.scrollLeft(),scrolltop:I?0:D.scrollTop(),offset:D.offset()||{left:0,top:0}},E={elem:E,scrollLeft:E.scrollLeft(),scrollTop:E.scrollTop(),offset:E.offset()||{left:0,top:0}};if(B!=="shift"||C!=="shift")J=x.clone();return H={left:B!=="none"?L(h,i,B,z.x,m,o,j,f,q):0,top:C!=="none"?L(i,h,C,z.y,l,n,k,g,t):0},J&&F.lastClass!==(K=w+"-pos-"+J.abbrev())&&v.removeClass(c.cache.lastClass).addClass(c.cache.lastClass=K),H},u.imagemap=function(a,b,c,e){function v(a,b,c){var d=0,e=1,f=1,g=0,h=0,i=a.width,j=a.height;while(i>0&&j>0&&e>0&&f>0){i=Math.floor(i/2),j=Math.floor(j/2),c.x===m?e=i:c.x===o?e=a.width-i:e+=Math.floor(i/2),c.y===l?f=j:c.y===n?f=a.height-j:f+=Math.floor(j/2),d=b.length;while(d--){if(b.length<2)break;g=b[d][0]-a.position.left,h=b[d][1]-a.position.top,(c.x===m&&g>=e||c.x===o&&g<=e||c.x===p&&(g<e||g>a.width-e)||c.y===l&&h>=f||c.y===n&&h<=f||c.y===p&&(h<f||h>a.height-f))&&b.splice(d,1)}}return{left:b[0][0],top:b[0][1]}}b.jquery||(b=d(b));var f=a.cache.areas={},g=(b[0].shape||b.attr("shape")).toLowerCase(),h=b[0].coords||b.attr("coords"),i=h.split(","),j=[],k=d('img[usemap="#'+b.parent("map").attr("name")+'"]'),q=k.offset(),r={width:0,height:0,position:{top:1e10,right:0,bottom:0,left:1e10}},s=0,t=0,u;q.left+=Math.ceil((k.outerWidth()-k.width())/2),q.top+=Math.ceil((k.outerHeight()-k.height())/2);if(g==="poly"){s=i.length;while(s--)t=[parseInt(i[--s],10),parseInt(i[s+1],10)],t[0]>r.position.right&&(r.position.right=t[0]),t[0]<r.position.left&&(r.position.left=t[0]),t[1]>r.position.bottom&&(r.position.bottom=t[1]),t[1]<r.position.top&&(r.position.top=t[1]),j.push(t)}else{s=-1;while(s++<i.length)j.push(parseInt(i[s],10))}switch(g){case"rect":r={width:Math.abs(j[2]-j[0]),height:Math.abs(j[3]-j[1]),position:{left:Math.min(j[0],j[2]),top:Math.min(j[1],j[3])}};break;case"circle":r={width:j[2]+2,height:j[2]+2,position:{left:j[0],top:j[1]}};break;case"poly":r.width=Math.abs(r.position.right-r.position.left),r.height=Math.abs(r.position.bottom-r.position.top),c.abbrev()==="c"?r.position={left:r.position.left+r.width/2,top:r.position.top+r.height/2}:(f[c+h]||(r.position=v(r,j.slice(),c),e&&(e[0]==="flip"||e[1]==="flip")&&(r.offset=v(r,j.slice(),{x:c.x===m?o:c.x===o?m:p,y:c.y===l?n:c.y===n?l:p}),r.offset.left-=r.position.left,r.offset.top-=r.position.top),f[c+h]=r),r=f[c+h]),r.width=r.height=0}return r.position.left+=q.left,r.position.top+=q.top,r},u.ie6=function(a){var b=d.browser,c=a.plugins.ie6;return!b.msie||(""+b.version).charAt(0)!=="6"?f:"object"==typeof c?c:a.plugins.ie6=new O(a)},u.ie6.initialize="render"})})(window,document);;
;
window.alert = function(arg) {
  if (window.console && console.log) {
    console.log(arg);
  }
};


(function ($) {

  Drupal.behaviors.printconnect = {
    detach: function (context) {

    },
    attach: function (context, settings) {
      
      $(document).ajaxStart(function() {
        $('body',this).css('cursor','progress');
        $(':submit').attr('disabled', 'disabled');
        $('.loading').slideDown();
        
      });
      
      $(document).ajaxStop(function() {
        $('body', this).css('cursor','default');
        $(':submit').removeAttr('disabled');
        $('.loading').slideUp();
      });
      
      //      $('form table tr td input[type=radio]').each(function(){
      //        var radio = $(this);
      //        $(this).parents('tr').click(function(){
      //          radio.attr('checked', true);
      //          radio.trigger('change');
      //        })
      //      });
      $('.contactus').click(function(){
          
      });
      if ($.fancybox){
          var targetElement = null;
        $('.fancybox').each(function(){
            targetElement = $(this);
          var h = $(this).data("height");
          if (!h){
            h = 630;
          }

          var w = $(this).data("width");
          if (!w){
            w = 815;
          }
            
          $(this).fancybox({
            width: w,
            height: h,
            padding: 5,
            margin: 0,
            scrolling: false,
            top:1515,
            autoScale: false,
            hideOnOverlayClick: true,
            showCloseButton   : true,
            autoDimensions: false,
            modal: false,
            onStart: function() {
              jQuery("#fancybox-outer").append("<div id='fancybox_preloader' class='fancybox_preloader'></div>");
            },
            onComplete: function(){
            if (targetElement.hasClass('contactus') || targetElement.hasClass('contactusUrl')) {
                //$("#fancybox-wrap").css({'top':targetElement.attr('elementTop')});
                $('#fancybox-overlay').css('height', '2597px');
                jQuery('#fancybox-frame').load(function(){
                    jQuery('#fancybox-close').css('right', targetElement.attr('closeposition')+'px');
                    jQuery("#fancybox_preloader").remove();
                    jQuery('#fancybox-frame').css('overflow', 'hidden');
                    //jQuery('#fancybox-frame').css('border-radius', '1px');
                    jQuery('#fancybox-frame').contents().css('border-radius', '10px');
                    jQuery('#fancybox-frame').contents().find('body').css('overflow', 'hidden');
                    //jQuery('#fancybox-frame').contents().find('.whitebox').last().css('margin-top', '-68px');
                    //jQuery('#fancybox-frame').contents().find('.whitebox').last().css('background-color', '#f1f1f1');
                    jQuery('#fancybox-frame').contents().find('#messages .error').hide();
                    jQuery("iframe[src*='contact']").parents("#fancybox-content").css("margin-left","26px");
                    jQuery("iframe[src*='contact']").parents('#fancybox-outer').find(".fancybox-bg").css("background","none");
                    if (jQuery('#fancybox-frame').contents().find('#messages').attr('id') !== undefined) {
                       var msgs = jQuery('#fancybox-frame').contents().find('#messages');
                       jQuery('#fancybox-frame').contents().find('#fieldContainer,.form-actions').hide();
                       jQuery('#fancybox-frame').contents().find('#infoContainer').append(msgs.html());
                       jQuery('#fancybox-content').css('height','259px');
                       jQuery('#fancybox-frame').contents().find('#shopIco > img').css('padding-top','0');
                    }
                });
             }
            }
          });
        })
      }
    }
  }
})(jQuery);;

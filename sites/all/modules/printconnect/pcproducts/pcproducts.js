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

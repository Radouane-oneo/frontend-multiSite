(function ($) {
  Drupal.behaviors.pccalculator = {
    detach: function (context) {

    },
    attach: function (context, settings) {
      $("#pccalculator-calculator-form").ajaxStart(function(){
        $(this).css('cursor', 'progress');
      });

      $("#pccalculator-calculator-form").ajaxStop(function(){
        $(this).css('cursor', 'default');
      });

      $('#pccalculator-calculator-form #edit-product').once().change(function() {
        var form = $('#pccalculator-calculator-form');
        var url = form.attr('action');
        $.ajax({
          type: "POST",
          url: url,
          data: form.serialize() + '&op=ajax',
          success: function(data){
            form.html($('#pccalculator-calculator-form', data).html());
            Drupal.attachBehaviors(form);

            $('#pccalculator-calculator-form #edit-spec-replacement .select').trigger('click');


          }
        });
        return false;

/*
        $.getJSON('/js/pccalculator/' + $(this).val(), function(data) {
          $('#pccalculator-calculator-form #edit-spec').html(data);
          
        });
*/
      });

      $('#pccalculator-calculator-form #products').hide();
      $('#pccalculator-calculator-form #items').hide();

      $('#pccalculator-calculator-form .form-item-product select').once(function (){
        var cls = $(this).attr('class');
        var id = $(this).attr('id') + '-replacement';
        var dropdownId = $(this).attr('id') + '-dropdown';
        var select = $(this);
        var control = $('<div id="' + id + '" class="' + cls + ' select-replacement"/>');

        $(this).wrap(control);


        var dropdown = $('<div class="dropdown"/>').hide();
        dropdown.append('<div class="dropdown-content"/>');
        var t = $('#pccalculator-calculator-form #product-dropdown');
        dropdown.find('.dropdown-content').append(t);
        var input = $('<a class="select"/>');

        //input.width($(this).width());
        input.html($('option:selected',this).text());

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
          if (value != 0){
            var content = $('#pccalculator-calculator-form #products .' + value).html();

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
          }
        });

        table.append(row);
        var i = $('option', this).length;
        var rest = i % 4;
        var colspan = 1;
        switch(rest){
          case 1:
            colspan = 4;
            break;
         // case 2:
         //   colspan = 2;
         //   break;
        }
        $('td', row).attr('colspan',colspan);

        dropdown.find('.fieldset-wrapper').append(table);

        $('#pccalculator-calculator-form #' + id).append(input);
        $('#pccalculator-calculator-form #' + id).append(dropdown);
        $('#pccalculator-calculator-form #' + id).once().keyup(function(event){
          switch (event.keyCode) {
            case 27:
              dropdown.slideUp();
              return true;
          }
        });

        $('#' + id).hover(
          function(){
           // dropdown.slideDown();
          },
          function(){
            dropdown.slideUp();
          }
        );

        $(this).hide();

      });

       $('#pccalculator-calculator-form .form-item-spec select').once(function (){
        var cls = $(this).attr('class');
        var id = $(this).attr('id') + '-replacement';
        var dropdownId = $(this).attr('id') + '-dropdown';
        var select = $(this);
        var control = $('<div id="' + id + '" class="' + cls + ' select-replacement"/>');

        $(this).wrap(control);


        var dropdown = $('<div class="dropdown"/>').hide();
        dropdown.append('<div class="dropdown-content"/>');
        var t = $('#pccalculator-calculator-form #specs-dropdown');
        dropdown.find('.dropdown-content').append(t);
        var input = $('<a class="select"/>');

        //input.width($(this).width());
        input.html($('option:selected',this).text());

        if (!$(this).attr('disabled')){
          input.click(function(){
            dropdown.slideDown();
            return false;
          });
        }

        var table = $('<table/>');
        var row = $('<tr/>');
        var i = 1;

        $('option', this).each(function (){
          var option = $(this);
          var value = option.attr('value');
          if (value != 0){
            var content = $('#pccalculator-calculator-form #items .' + value).html();

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
          }
        });

        table.append(row);
        var i = $('option', this).length;
        var rest = i % 4;
        var colspan = 1;
        switch(rest){
          case 1:
            colspan = 4;
            break;
          //case 2:
          //  colspan = 2;
          //  break;
        }
        $('td', row).attr('colspan',colspan);

        dropdown.find('.fieldset-wrapper').append(table);

        $('#pccalculator-calculator-form #' + id).append(input);
        $('#pccalculator-calculator-form #' + id).append(dropdown);
        $('#pccalculator-calculator-form #' + id).once().keyup(function(event){
          switch (event.keyCode) {
            case 27:
              dropdown.slideUp();
              return true;
          }
        });

        $('#' + id).hover(
          function(){
           // dropdown.slideDown();
          },
          function(){
            dropdown.slideUp();
          }
        );
        
        $(this).hide();

      });


      $('#pccalculator-calculator-form .select-replacement > select').change(function (){
        $('.select', $(this).parent()).html($('option:selected',this).text());
      });


/*
       var request;

      $('#pccalculator-calculator-form').keydown(function(event) {
        switch (event.keyCode) {
          case 40:
            var selected = $('#pccalculator-calculator-form .autocomplete li.selected').first();
            if (selected.length){
              selected = selected.removeClass('selected').next().addClass('selected');
              $('a', selected).focus();
            }
            else{
              selected = $('#pccalculator-calculator-form .autocomplete li').first();
              selected.addClass('selected');
              $('a', selected).focus();
            }

            return false;
          case 38:
            var selected = $('#pccalculator-calculator-form .autocomplete li.selected').first();
            if (selected.length){
              selected = selected.removeClass('selected').prev().addClass('selected');
              $('a', selected).focus();
            }
            else{
              selected = $('#pccalculator-calculator-form .autocomplete li').last();
              selected.addClass('selected');
              $('a', selected).focus();
            }
            return false;
          default: // All other keys.
            return true;
        }

      });


      $('#pccalculator-calculator-form').once().keyup(function(event){
        switch (event.keyCode) {
          case 16: // Shift.
          case 17: // Ctrl.
          case 18: // Alt.
          case 20: // Caps lock.
          case 33: // Page up.
          case 34: // Page down.
          case 35: // End.
          case 36: // Home.
          case 37: // Left arrow.
          case 38: // Up arrow.
          case 39: // Right arrow.
          case 40: // Down arrow.
            return true;
          case 9:  // Tab.
          case 13: // Enter.
          case 27: // Esc.
            $('#pccalculator-calculator-form .autocomplete').slideUp();
            $('#pccalculator-calculator-form input[type=text]').focus();
            return true;
        }
      });

      $('#pccalculator-calculator-form input[type=text]').once().keyup(function(event){
        if (request){
          request.abort();
        }

         switch (event.keyCode) {
          case 16: // Shift.
          case 17: // Ctrl.
          case 18: // Alt.
          case 20: // Caps lock.
          case 33: // Page up.
          case 34: // Page down.
          case 35: // End.
          case 36: // Home.
          case 37: // Left arrow.
          case 38: // Up arrow.
          case 39: // Right arrow.
          case 40: // Down arrow.
          case 9:  // Tab.
          case 13: // Enter.
          case 27: // Esc.
            return true;
          default: // All other keys.
            var textfield = $(this);
            if (this.timer) {
              clearTimeout(this.timer);
            }
            this.timer = setTimeout(function () {
              var text = textfield.val();
              //if (text.length > 2){
                var url = '/js/pccalculator/' + text;
                request = $.getJSON(url, null, function (data){
                  if (data && data.count > 0){
                    $('#pccalculator-calculator-form .autocomplete').html($(data.result));
                    $('#pccalculator-calculator-form .autocomplete').slideDown();
                  }
                  else{
                    $('#pccalculator-calculator-form .autocomplete').slideUp();
                  }
                });
            }, 100);
        }

      });
*/
/*
      $('#pccalculator-calculator-form input').change(function() {
        $.getJSON('/pccalculator/autocomplete/' + $(this).val(), function(data) {
          if (data && data.count > 0){
            $('#pccalculator-calculator-form .autocomplete').html($(data.result));
            $('#pccalculator-calculator-form .autocomplete').slideDown();
          }
          else{
            $('#pccalculator-calculator-form .autocomplete').slideUp();
          }
        });
      });
*/
    }
  }
})(jQuery);

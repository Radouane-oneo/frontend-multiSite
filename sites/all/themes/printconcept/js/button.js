(function ($) {

   Drupal.behaviors.printconceptButtons = {
    detach: function (context) {

    },
    attach: function(context, settings) {

      $('input[type=submit]:not(.noreplace)', context).once('button-replacement', function(){
        var cls = $(this).attr('class');
        var style = $(this).attr('style');
        
        $(this).wrap('<div class="button ' + cls + '" style="' + style + '" />');

        $(this).removeClass();
        $(this).addClass('content').once('button-replacement');

        $(this).mousedown(function(){
          $(this).parent().addClass('down');
        });
        
        $(this).mouseup(function(){
          $(this).parent().removeClass('down');
        });

        $(this).mouseout(function(){
          $(this).parent().removeClass('down');
        });

/*
        $(this).wrap('<div style="position:relative" class="button ' + cls + '" style="' + style + '"/>');

        var overlay = $('<div class="replacement" style="position:absolute;z-index:100;"><div class="content">' + $(this).attr('value') + '</div></div>');

        var overlay = $('<div class="replacement"><div class="content">' + $(this).attr('value') + '</div></span>');

        //overlay.css('top', $(this).attr('offsetTop'));
        //overlay.css('left', $(this).attr('offsetLeft') );

        //var left = $(this).offset().left;
        //var top = $(this).offset().top;

        //overlay.css({"left":left + "px", "top":top + "px"})

        //overlay.css('width', $(this).outerWidth());
        //overlay.css('height', $(this).outerHeight());

        //overlay.css('top',0);
        //overlay.css('left',0 );

        $(this).before(overlay);


        //$(this).removeClass();

        //$(this).once().parent().css('width', $(this).outerWidth());

        input.hide();

        overlay.click(function(){
          input.click();
        });
*/

      });


      $('a.button').once().wrapInner('<div class="content"/>');


    }
  }

})(jQuery);
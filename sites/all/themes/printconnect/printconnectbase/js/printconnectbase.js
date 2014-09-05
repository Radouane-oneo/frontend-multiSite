/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

(function ($) {

  Drupal.behaviors.pcprintconnectbase = {
    detach: function (context) {

    },
    attach: function (context, settings) {
     
      $('#main-menu > li > a').each(function(){
        var url = $(this).attr('href');
        var index = url.indexOf("#");
        if ($(this).hasClass('dropdown')){
          var dropdown = url.substring(url.indexOf("#"));
          var dropdown = $('#dropdown');
          //alert(fragment);
          
        
          $(this).after(dropdown);
        
          $(this).parent('li').hover(
            function () {
             // $(dropdown).slideDown();
              $(dropdown).addClass('open');
            },
            function () {
              $(dropdown).removeClass('open');
            }
            );
        }
      });
      $('#block-locale-language.dropdown').once('languageblock', function(){
        var content = $('.content', this);
        var block = $(this);
        var list = $('ul', content);
        var activeclass = $('li.active', list).attr('class');
        var current = $('<div/>').attr('class', activeclass).addClass('current');
       
        list.hover(
          function () {
            
          },
          function () {
            $(this).slideUp();
          }
          );

        $('li.active',list).hide();

        current.prepend($('li.active', content).html());

        content.prepend(current);

        current.click(function(){
          list.slideDown();
          return false;
        });
        
        $('li',list).width(current.width());

      });
    }    
  }
})(jQuery);
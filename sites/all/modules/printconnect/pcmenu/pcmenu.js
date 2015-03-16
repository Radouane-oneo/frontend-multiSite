//Développed by Mohamed Mouhsni
(function ($) {
  Drupal.behaviors.pcmenu = {
    detach: function (context) {

    },
    attach: function (context, settings) {
      isotopeFunction = function(elems){
          $(elems).isotope({
            itemSelector: '.item-box',
          });
      };

      //on page load 
      isotopeFunction('.isotope'); 

      //on hover of menu
      $('#block-pcmenu-main li.expandable').mouseenter(function() {
        isotopeFunction($(this).find('.isotope'));
      });
      
      $('#block-pcmenu-main li.expandable').mouseleave(function() {
        $(this).find('.item-box').css({
            'top': 0,
            'left': 0
        })
      });
       
    }
  }

})(jQuery);
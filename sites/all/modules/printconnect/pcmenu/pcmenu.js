//Développed by Mohamed Mouhsni
(function ($) {
  Drupal.behaviors.pcmenu = {
    detach: function (context) {

    },
    attach: function (context, settings) {
      isotopeFunction = function(elems){
          $(elems).isotope({
            itemSelector: '.item-box',
            /*animationOptions: {
               duration: 10,
               easing: 'linear',
               queue: false
             }*/
          });
      };

      //on page load 
      //isotopeFunction('.isotope'); 

      //on hover of menu
      /*$('#block-pcmenu-main li.expandable').mouseenter(function() {
        isotopeFunction($(this).find('.isotope'));
        var that = this;
        setTimeout(function(){
          $(that).find('.isotope').find('.item-box').css({
              'visibility': 'visible'
          });
        },310);
        
      });
      
      $('#block-pcmenu-main li.expandable').mouseleave(function() {
        $(this).find('.item-box').css({
            'visibility': 'hidden'
        });
      });*/
       
    }
  }

})(jQuery);
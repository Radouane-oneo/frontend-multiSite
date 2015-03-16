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
      $('#block-pcmenu-main li.expandable').hover(function() {
        isotopeFunction($(this).find('.isotope'));
      });

      // on filter click
      $('.filter_list li').click(function(){
        var filterValue = $(this).data('target');
        if ($(this).parents('.dropdown').find(filterValue).length<=0)  filterValue = ''; //if element not existe
        $(this).parents('.dropdown').find('.isotope').isotope({ filter: filterValue });
      });
       
    }
  }

})(jQuery);
(function ($) {

  Drupal.behaviors.pcdesigns = {
    detach: function (context) {

    },
    attach: function (context, settings) {  
     
      if ($.fancybox){
        $('#pcdesigns-saveddesigns-form .designtool').fancybox({
          width: 815,
          height: 610,
          padding: 5,
          margin: 0,
          scrolling: false,
          autoScale: false,
          hideOnOverlayClick: false,
          autoDimensions: false,
          modal: true,
          onStart: function() {
           // jQuery("#fancybox-outer").append("<div id='dt_preloader'></div>");
          },
          onComplete: function(){
          //  jQuery("#fancybox-outer").find("#dt_preloader").remove();
          }
        });
      }
      
    }
  }
})(jQuery);
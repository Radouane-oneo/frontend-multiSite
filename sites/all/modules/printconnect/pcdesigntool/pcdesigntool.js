(function ($) {

  Drupal.behaviors.pcdesigntool = {
    detach: function (context) {

    },
    attach: function (context, settings) {
      /*
      $('.designtool').fancybox({
        width: 815,
        height: 630,
        padding: 5,
        margin: 0,
        scrolling: false,
        autoScale: false,
        hideOnOverlayClick: false,
        autoDimensions: false,
        modal: false,
        onStart: function() {
        //jQuery("#fancybox-outer").append("<div id='dt_preloader'></div>");
        },
        onComplete: function(){
        //  jQuery("#fancybox-outer").find("#dt_preloader").remove();
        }
      });
*/
      if ($.fancybox){
                $('.designtool').fancybox({
                    width: 815,
                    height: 640,
                    padding: 5,
                    margin: 0,
                    scrolling: false,
                    autoScale: false,
                    hideOnOverlayClick: false,
                    autoDimensions: false,
                    modal: false,
                    onStart: function() {

                        jQuery("#fancybox-outer").append("<div id='dt_preloader' class='dt_preloader'></div>");
                    },
                    onComplete: function() {
                        $("#fancybox-wrap").find("#fancybox-content").css({"margin": "auto", "background-color": "#fff"});
                        $("#fancybox-wrap").find("#fancybox-frame").css({"width": "800px", "margin": "5px auto"});
                        jQuery("#fancybox-outer").find("#dt_preloader").remove();
                    }
                });
      }
    }
  }
})(jQuery);

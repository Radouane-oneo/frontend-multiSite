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
                    width: 1024,
                    height: 780,
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
                        $("#fancybox-overlay").addClass("designtool");
                        $("#fancybox-wrap").find("#fancybox-content").css({"margin": "auto"});
                        $("#fancybox-wrap").find("#fancybox-frame").css({"width": "1024px", "margin": "0px auto"});
                        jQuery("#fancybox-outer").find("#dt_preloader").remove();
                        $("#fancybox-wrap").css("width", "1024px");
                        var vague = jQuery("#canvas").Vague({intensity: 9});
                        vague.blur();
		    },
		    onClosed: function() {
                        $("#canvas").attr("style","");
                        $("#fancybox-overlay").removeClass("designtool");
                    }
                });
      }
    }
  }
})(jQuery);

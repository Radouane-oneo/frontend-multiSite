window.alert = function(arg) {
  if (window.console && console.log) {
    console.log(arg);
  }
};

function updateDomain() {
  var hosts = window.location.hostname.split('.').reverse();
  var domain = hosts[1] + '.' + hosts[0];
  /*if(domain == 'flyer.fr'){
      document.domain = domain;
  }*/
    
}

(function ($) {

  Drupal.behaviors.printconnect = {
    detach: function (context) {
    },
    attach: function (context, settings) {

      $(document).ajaxStart(function() {
       $(':submit').attr('disabled', true).addClass('grised');

      });

      $(document).ajaxStop(function() {
        $(':submit').attr('disabled', false).removeClass('grised');
      });

      if ($.fancybox){
          var targetElement = null;
        $('.fancybox').each(function(){
            targetElement = $(this);
          var h = $(this).data("height");
          if (!h){
            h = 630;
          }

          var w = $(this).data("width");
          if (!w){
            w = 815;
          }

          $(this).fancybox({
            width: w,
            height: h,
            padding: 5,
            margin: 0,
            scrolling: false,
            top:1515,
            autoScale: false,
            hideOnOverlayClick: true,
            showCloseButton   : true,
            autoDimensions: false,
            modal: false,
            onStart: function() {
              jQuery("#fancybox-outer").append("<div id='fancybox_preloader' class='fancybox_preloader'></div>");
            },
            onComplete: function(){
            if (targetElement.hasClass('contactus') || targetElement.hasClass('contactusUrl')) {
                //$("#fancybox-wrap").css({'top':targetElement.attr('elementTop')});
                $('#fancybox-overlay').css('height', '2597px');
                jQuery('#fancybox-frame').load(function(){
                    jQuery('#fancybox-close').css('right', targetElement.attr('closeposition')+'px');
                    jQuery("#fancybox_preloader").remove();
                    jQuery('#fancybox-frame').css('overflow', 'hidden');
                    //jQuery('#fancybox-frame').css('border-radius', '1px');
                    jQuery('#fancybox-frame').contents().css('border-radius', '10px');
                    jQuery('#fancybox-frame').contents().find('body').css('overflow', 'hidden');
                    //jQuery('#fancybox-frame').contents().find('.whitebox').last().css('margin-top', '-68px');
                    //jQuery('#fancybox-frame').contents().find('.whitebox').last().css('background-color', '#f1f1f1');
                    jQuery('#fancybox-frame').contents().find('#messages .error').hide();
                    jQuery("iframe[src*='contact']").parents("#fancybox-content").css("margin-left","26px");
                    jQuery("iframe[src*='contact']").parents('#fancybox-outer').find(".fancybox-bg").css("background","none");
                    if (jQuery('#fancybox-frame').contents().find('#messages').attr('id') !== undefined) {
                       var msgs = jQuery('#fancybox-frame').contents().find('#messages');
                       jQuery('#fancybox-frame').contents().find('#fieldContainer,.form-actions').hide();
                       jQuery('#fancybox-frame').contents().find('#infoContainer').append(msgs.html());
                       jQuery('#fancybox-content').css('height','259px');
                       jQuery('#fancybox-frame').contents().find('#shopIco > img').css('padding-top','0');
                    }
                });
             }
            }
          });
        })
      }
    }
  }
})(jQuery);

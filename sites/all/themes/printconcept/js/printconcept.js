(function ($) {
  Drupal.behaviors.printconcept = {
    detach: function (context) {

    },
    attach: function(context, settings) {
      
      
      $('#pcproducts-productconfig-form').once('ajax-overlay').ajaxStart(function(){
        var overlay = $('<div style="display:block;position:fixed;z-index:1000; top:0; left:0; height:100%; width:100%;   background-color:white;  -ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=30);  filter: alpha(opacity=30);  -moz-opacity:0.3;  -khtml-opacity: 0.3;  opacity: 0.3;" id="overlay"></div>');
        $(this).append(overlay);
        var message = $('<div style="position:fixed;top:35%;width:20%;left:30%;" id="message" > <div class="spinner"><img src="' + Drupal.settings.basePath + 'sites/all/themes/printconcept/images/ajax-loader-large.gif"/><div>' +  Drupal.t('Your prices are being calculated...') + '</div></div></div>');
        $(this).append(message);
      });
      
      $('#pcproducts-productconfig-form').ajaxStop(function(){
        $('#overlay', this).remove();
        $('#message', this).remove();
      });

    }
  }
   

})(jQuery);


function forgotpassword_callback(){
  jQuery.fancybox.close() ;
}

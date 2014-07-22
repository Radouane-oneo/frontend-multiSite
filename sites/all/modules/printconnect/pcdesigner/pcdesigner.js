(function ($) {

  Drupal.behaviors.pcdesigner = {
    detach: function (context) {

    },
    attach: function (context, settings) {
      $('input[name="cart[designer][email]"]').change(function(){
        var href = "js/upload-design/designer/email/" + $(this).val(); 
        alert (href);
        $.getJSON(href, function(data){          
          
        })
      })
    }
  }
})(jQuery);


(function ($) {
  Drupal.behaviors.pcanalytics = {
    detach: function(context){
    
    },
    attach: function(context, settings){
      $('#pccart-cart-form .other a').click(function(){
        _gaq.push(['_trackEvent', 'basket', 'click', 'suggestion']);
      });
      $('#pccart-save-form input').click(function(){
        _gaq.push(['_trackEvent', 'basket', 'click', 'upgrade']);
      });

      $('#pccart-cart-form  .actions.copy a').click(function(){
        _gaq.push(['_trackEvent', 'basket', 'click', 'Verder_winkelen_boven']);
      });

      $('#pccart-cart-form  .actions.copy input').click(function(){
        _gaq.push(['_trackEvent', 'basket', 'click', 'Veilig_afrekenen_boven']);
      });
      /*
      $('#pccart-cart-form  .actions a').click(function(){
        _gaq.push(['_trackEvent', 'basket', 'click', 'Verder_winkelen_onder']);
      });

      $('#pccart-cart-form  .actions input').click(function(){
        _gaq.push(['_trackEvent', 'basket', 'click', 'Veilig_afrekenen_onder']);
      });
*/

      $('#pccart-cart-form  a.pcbpost-picker-link').click(function(){
        _gaq.push(['_trackEvent', 'basket', 'click', 'Afhaalpunt']);
      });

    }
  }
})(jQuery);
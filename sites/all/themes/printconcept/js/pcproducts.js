(function ($) {

  Drupal.behaviors.printconcept_pcproducts = {
    detach: function (context) {

    },
    attach: function (context, settings) {
      
      // $('#pcproducts-productconfig-form .grid tr td:nth-child(2)').after($('#pcproducts-productconfig-form .grid tr td:first-child'));
      $('#pcproducts-productconfig-form .grid tr').each(function(){
        $(this).children(":eq(1)").after($(this).children(":eq(0)"));
      });
    
      $('#pcproducts-productconfig-form .dropdown').hide();
      $('#pcproducts-productconfig-form .configuration select').once(function(){
        var select = $(this);
        var id = select.attr('id');
        var selected = $('option:selected',this);
        var text = selected.text();
        var a = $('<a class="select">'  + text + '</a>');
        var dropdown = $('#pcproducts-productconfig-form #' + id + '-dropdown');
        dropdown.hide();
        select.hide();
        select.after(a);
        a.after(dropdown);
        a.click(function(){
          dropdown.slideToggle();
        })
        $('li', dropdown).click(function(){
          var val = $(this).attr('id');
          select.val(val).trigger('change');
          a.text($('option:selected', select).text());
          dropdown.slideUp();
        });
        dropdown.mouseleave(function(){
          dropdown.slideUp();
        })
      });
   
    }
  }
})(jQuery);

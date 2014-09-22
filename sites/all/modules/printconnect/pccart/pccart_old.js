(function ($) {
  Drupal.behaviors.pccart = {
    detach: function (context) {

    },
    attach: function (context, settings) {

      $("#pccart-cartblock-form").ajaxStart(function(){
        $(this).css('cursor', 'progress');
      });

      $("#pccart-cartblock-form").ajaxStop(function(){
        $(this).css('cursor', 'default');
      });

      $('#pccart-cartblock-form .description .tooltip').parent().hover(
        function () {
          $('.tooltip').hide();
          $('.tooltip',this).fadeIn('slow');
        },
        function () {
          $('.tooltip',this).fadeOut('slow');
        }
      );

      $('#pccart-cartblock-form :radio, #pccart-cartblock-form :checkbox, #ppccart-cartblock-form select, #pccart-cartblock-form :text').once().change(function(){
        submitCartBlockForm($(this));
      });

      $('#pccart-cartblock-form .remove').once().click(function(){
        return submitCartBlockForm($(this));
      });

      $('#pccart-cartblock-form .open').fancybox({
        width: 800,
        height: 700,
        padding: 0,
        margin: 0,
        scrolling: false,
        autoScale: false,
        hideOnOverlayClick: false,
        autoDimensions: false,
      });

/*
      $('#pccart-cartblock-form a.remove').click(function(){
        //return submitCartBlockForm($(this));
        var form = $('#pccart-cartblock-form');
        jQuery.ajax({
            type: 'GET',
            url: $(this).attr('href'),
            async: true,
            success: function(data, textStatus, XMLHttpRequest){
              form.html($('#pccart-cartblock-form', data));
              $('#block-pccart-cart-indicator').html($('#block-pccart-cart-indicator', data));
              Drupal.attachBehaviors();
            }
          });
        return false;
      });
*/

      $('#pccart-cartblock-form .upload').uploader(function (){pccart_cartblock_refresh();});

      $('#pccart-cartblock-form .designtool').fancybox({
        width: 820,
        height: 640,
        padding: 0,
        margin: 0,
        scrolling: false,
        autoScale: false,
        hideOnOverlayClick: false,
        //onClosed: function(){location.reload(true)},
        autoDimensions: false,
        onStart: function(){
        //    jQuery(window).bind('beforeunload', function() {return ''});
        },
        onCleanup: function(){
/*
            if(designtool != undefined && designtool.editor != undefined && designtool.editor.filename != undefined){
                var filename = designtool.editor.filename;

                handleOrder(filename);
            }*/
        },
        onClosed: function(){
          //  jQuery(window).unbind('beforeunload');
        }
      });

    }
  }

  function submitCartBlockForm(triggeringElement){
    var form = $('#pccart-cartblock-form');
    var url = form.attr('action');
    $.ajax({
      type: "POST",
      url: url,
      data: triggeringElement.attr("name") + '=' + triggeringElement.val() + '&' + form.serialize() + '&op=ajax',
      success: function(data){
        form.html($('#pccart-cartblock-form', data).html());
        Drupal.attachBehaviors(form);
      }
    });
    return false;
  }

 
})(jQuery);

function designtool_callback(){
  submitCartBlockForm();
}

function pccart_picker_callback(pup){
  var picker = jQuery('#pccart-cartblock-form');
  jQuery('input[name="pup[id]"]', picker).val(pup.id);
  jQuery('input[name="pup[countryCode]"]', picker).val(pup.countryCode);
  var radio =  jQuery('input.pup', picker);
  radio.attr("checked", "checked");
 
  jQuery.fancybox.close() ;
}
/*
function pccart_cartblock_refresh(){
  var form = jQuery('#pccart-cartblock-form');
  jQuery.fancybox.close() ;
  jQuery.ajax({
    type: 'GET',
    url: 'cartblock',
    async: true,
    success: function(data, textStatus, XMLHttpRequest){
      form.html(jQuery(data));
      Drupal.attachBehaviors(form);
    }
  });
}
*/
(function ($) { 

  Drupal.behaviors.pcflyerstores = {
    detach: function (context) {

    },
    attach: function (context, settings) {
        
                
		var storesNumber = $('#edit-results .fieldset-wrapper').find('.item-list li').length;
		if(storesNumber >= 9) {
			$('a.storeUp , a.storeDown').show();	
			$('#edit-results .fieldset-wrapper').find('.item-list').jCarouselLite({
				btnNext: ".storeDown",
				btnPrev: ".storeUp",
				vertical: true
			});
		
		}
		else {
			$('a.storeUp , a.storeDown').hide();	
		}


                $('#map-selector').keydown(function()
                {
                    if( $(this).val().length >= 2 ) {
                     $('.storeDown').hide();
                     $('.storeUp').hide();
                    }else{
                         $('.storeDown').show();
                     $('.storeUp').show();
                    }
                });                

    	var code = $('.pcflyerstores-store-link.button').clone();
   		$('.pcflyerstores-store-link.button').remove();
   		$('.description .mapContainer').before(code);

      $('#pcflyerstores-picker-form area' ).hover(function(e){
        var id = $(this).attr('id');
        var img = $('#pcflyerstores-picker-form #map_' + id );
        $('#pcflyerstores-picker-form .images img').hide();
        img.show();
      },
      function(e){
        var img = $('#pcflyerstores-picker-form #map');
        $('#pcflyerstores-picker-form .images img').hide();
        img.show();
      
      });
       
      $('#pcflyerstores-picker-form .countries a').once().click(function(e){
        var href = $(this).attr('href');
        e.stopPropagation();
        href = href.replace("stores/picker", "js/stores/picker"); 
        $.getJSON(href, function(data){
          $('#pcflyerstores-picker-form .results .item-list').replaceWith(data.list);
          $('#pcflyerstores-picker-form map').replaceWith(data.map);
          $('#pcflyerstores-picker-form #map').replaceWith(data.image);
          $('#pcflyerstores-picker-form .images').replaceWith(data.images);
          $('#pcflyerstores-picker-form .countries').replaceWith(data.countries);
          $('#pcflyerstores-picker-form .detail').replaceWith(data.info);
          Drupal.attachBehaviors(context);
        })
        return false;
      });
      
      $('#pcflyerstores-picker-form .results li a').click(function(e){
        
	return false;
      });
      
      $('#pcflyerstores-picker-form .detail .pcflyerstores-store-link').once().click(function(e){
        var id = $(this).attr('id');
        var func = 'parent.' + Drupal.settings.callback + '(id)';
        eval(func);
        parent.jQuery.fancybox.close();
        return false;
      });
      
      if ($.fancybox){
        $('.pcflyerstores-picker-link').fancybox({
          width: 993,
          height: 780,
          padding: 0,
          margin: 0,
          scrolling: false,
          autoScale: false,
          hideOnOverlayClick: false,
          autoDimensions: false,
          onStart: function() {
            jQuery.fancybox.showActivity();
          }
        });
      }
      /*animation block isotope serache flyerstor*/
      
    $('#edit-stores').isotope({
        masonry: {
          columnWidth: 1
        },
        itemSelector: '.stores-form'
      })
/*animation block isotope serache jcarousel*/
   

    $(function() {
        
                $('[data-jcarousel]').each(function() {
                    var el = $(this);
                    el.jcarousel(el.data());
                });

                $('[data-jcarousel-control]').each(function() {
                    var el = $(this);
                    el.jcarouselControl(el.data());
                });
        
                $('.[data-jcarousel]').jcarouselAutoscroll({
                    interval: 3000,
                    target: '+=1',
                    autostart: true
                })
            ;
            });
    
    
}
  }
  
})(jQuery);
function pcflyerstores_callback(id){
  var url =Drupal.settings.basePath + 'index.php?q=/js/stores/picker/cart/set1/' + id;
  jQuery('input[name="pcflyerstores[id]"]').val(id);
  jQuery.getJSON(url, function(data){
    jQuery('.store').html(data.info);
    if (jQuery('#pccheckout-invoiceanddelivery-form  input[name="pcflyerstores[id]"]').val() != ''){
            jQuery('#allresault').show();
            jQuery('#pccheckout-invoiceanddelivery-form #edit-summary-shipping h6').html(jQuery('#pccheckout-invoiceanddelivery-form .storcomande h2').html());
            jQuery('#pccheckout-invoiceanddelivery-form #edit-summary-shipping .address').html(jQuery('#pccheckout-invoiceanddelivery-form  .storcomande .address').html());
            jQuery('#pccheckout-invoiceanddelivery-form #edit-summary-shipping .phone').html(jQuery('#pccheckout-invoiceanddelivery-form  .storcomande .phone').html());
            jQuery('#pccheckout-invoiceanddelivery-form #edit-summary-shipping .fax').html(jQuery('#pccheckout-invoiceanddelivery-form  .storcomande .fax').html());
            jQuery('#pccheckout-invoiceanddelivery-form #edit-summary-shipping .email').html(jQuery('#pccheckout-invoiceanddelivery-form  .storcomande .email').html());
           }
    Drupal.attachBehaviors();
  });
}

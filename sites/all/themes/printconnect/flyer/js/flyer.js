jQuery(document).ready(function(e) {
    
    jQuery('select:not(#pcproducts-calculator-form select)').select2(); 

    if (jQuery('#homeSlider').length) {
        jQuery('#homeSlider ul').cycle({
            pager:'#pagerSliderHolder',
            fx:'scrollUp'
        });
    }

    if (jQuery('#slideIside ul').length) {
        setTimeout(function(){
            jQuery('#slideIside ul').cycle({
                pager:'#sliderPager',
                fx:'turnDown',
                timeout: 5300
            });
        }, 4000);   
    }
    
    jQuery('#helppanel').find('.center-wrapper').eq(0).remove();
	jQuery( "#accordion-list" ).accordion({autoHeight: false, collapsible: true});

    /*if (jQuery('#countlandingpage').length) {
        setTimeout(function(){
            jQuery('.jquery-countdown-timer-processed').clone().prependTo('#countlandingpage');
        }, 2000);
    };*/

    /* Remove flyerstrap class from Edit and translate page */
    /*jQuery('body.page-node-edit , .page-node-translate').removeClass('flyerstrap');*/
	

    // Script qui execute le plugin GridLoadingEffects (Animation des grid)
    
    /*new AnimOnScroll( document.getElementById( 'GridLoadingEffects' ), {
        minDuration : 0.4,
        maxDuration : 0.7,
        viewportFactor : 0.2
    } );*/
});

(function ($) {
	
	////////////////////**///////////////
	
	
	Drupal.behaviors.textarea = {
  attach: function (context, settings) {
      $("#pcsamplepacks-request-form #edit-country").select2({
          placeholder: "Maak je keuze",
          allowClear: true
        });
    $(".fancybox-media").click(function() {
    $.fancybox({
            'padding'       : 0,
            'autoScale'     : false,
            'transitionIn'  : 'none',
            'transitionOut' : 'none',
            'title'         : this.title,
            'width'     : 680,
            'height'        : 495,
            'href'          : this.href.replace(new RegExp("watch\\?v=", "i"), 'v/'),
            'type'          : 'swf',
            'swf'           : {
                 'wmode'        : 'transparent',
                'allowfullscreen'   : 'true'
            }
        });

    return false;
    });
      
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        var  before = textarea.height();
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        var after = textarea.height();
        if (parent.jQuery('#fancybox-content').length > 0) {
            parent.jQuery('#fancybox-content').height(parent.jQuery('#fancybox-content').height() + (after - before));
        }
        
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};
	
	
	
	//////////////////////***////////////////
    Drupal.behaviors.flyer = {
        detach: function (context) {},
        attach: function (context, settings) {
            $('.page-templates .filters').accordion({
                header: "h3",
                autoHeight: false
            });
			
    $(".videoutub").click(function() {
        $.fancybox({
			'padding'		: 0,
			'transitionIn'	: 'none',
			'transitionOut'	: 'none',
			'title'			: this.title,
			'href'			: this.href,
		    'type'			: 'iframe',
		    onComplete: function (links, index) {  
			    var id = $('#fancybox-content').find('iframe').attr('id');
			    var player = new YT.Player(id, {
				    events: {
				        'onReady':onPlayerReady,
				    }
			    });
				   
			},
			onClosed : function(){
		        console.log('Closed');
			}	   
    });
	return false;
});
		   $("a.iframe").click(function(e) {
            return false;
           });
		

            $('.videosOptionsBar li a').click(function (e) {
                return false;
            });
            /*$('#SliderCreaHomePage').jCarouselLite({
                btnPrev: ".nextCrea",
                btnNext: ".prevCrea",
                visible: 4,
                speed: 500,
                circular: true
            });*/
            $('a.nextCrea ,a.prevCrea').click(function (e) {
                return false;
            });
            $('a.nextCrea ,a.prevCrea').hover(function () {
                $(this).animate({
                    opacity: 0.5
                }, 300);
            }, function () {
                $(this).animate({
                    opacity: 1
                }, 300);
            });
       
            $(".button,input[type=submit]").button();
            $('#pcproducts-calculator-form select').selectBox();             
            $('table tr td input:checked').each(function () {
                $(this).parents('tr').addClass('checked');
            });
            $('table > tbody > tr > td input[type=radio]').each(function () {
                var radio = $(this);
                var tr = $(this).parents('tr');
                tr.click(function (e) {
                    radio.attr('checked', true);
                    radio.trigger('change');
                })
                $('a', tr).click(function (e) {
                    e.stopPropagation();
                })
            });
            $('.form-type-textfield, .form-type-password', context)
			    .has('.description').each(function () {
                    $('input, select', this).attr('title', $('.description', this)
					    .html());
                    $('input, select', this)
					    .attr('placeholder', $('.description', this).html());
                    $('.description', this).hide();
            });
        }
	}
})(jQuery);

var timerSaveP= false;
jQuery(function($) {
    var val= 0;
    var doAnim = function($pVal, wD) {
        $pVal.stop(true).animate({width: wD + '%'},800);
    }
    var Animateprogresse = function(){

        var $pVal = $("#save-progress-bar").find("div");
        timerSaveP=setInterval(function(){
            var step = (val<60)?10:3;
            val = val + step;
            doAnim($pVal, val);
            if(val >= 90)
            clearInterval(timerSaveP);
        }, 800);
    }

    Animateprogresse();

});
jQuery(document).ready(function(e) {
    jQuery('#pcsegments_products_products .item-list').find('a')
	    .each(function (index, element) {
        id=jQuery(this).attr("class");
	    jQuery(this).parent().prepend('<span />');
		jQuery(this).parent().find('span').addClass('itemClass-'+id );
    });
	
	jQuery('#pctemplates-selection-form .form-item').eq(0).addClass('ieMargin');
	jQuery('#pctemplates-selection-form .form-item').eq(2).addClass('ieMargin');
	jQuery('#pctemplates-selection-form .form-item').eq(4).addClass('ieMargin');
});

(function ($) {
    Drupal.behaviors.pcsegments = {
        detach: function (context) {

        },
        attach: function (context, settings) {
            $('.page-segments .region-content fieldset').eq(0)
			    .find('.item-list ul').addClass('editedItemList');
            
        /****Template / Segement => Pages PopUps************/

		$('.templates').find('li a').each(function() {
			$(this).qtip({
				content: "<img src='" + $(this).find("img").attr("src") + "' />",
				position: {
					my: 'top left',
					target: 'mouse',
					viewport: $(window),
					adjust: {
						x: 10, y: 10
					}
				},
				hide: {
					fixed: true
				},
				style: 'qtip-shadow'
			});
		});
		
		$(function() {
			$('.editedItemList li a').each(function() {
				$(this).qtip({
					content: "<img src='" + $(this).find("img").attr("src") + "' />",
					position: {
						my: 'top left',
						target: 'mouse',
						viewport: $(window),
						adjust: {
							x: 10, y: 10
						}
					},
					hide: {
						fixed: true
					},
					style: 'qtip-shadow'
				});
			});
		});
	   

		/*********End Popups****************/

		if (settings.pcsegments.selected) {
			$('#block-pcsegments-products .content').tabs({
				selected: settings.pcsegments.selected
			});
		} else {
			$('#block-pcsegments-products .content').tabs();
		}

		$('#block-pcsegments-products li').once().click(function (event) {
			event.stopPropagation();
			if ($(this).children('a').next().length > 0) {
				$(this).children('a').next().slideToggle();
				return false;
			}
		}).children('a').next().hide();

		$('#block-pcsegments-templates li').once().click(function (event) {
			event.stopPropagation();
			if ($(this).children('a').next().length > 0) {
				$(this).children('a').next().slideToggle();
				return false;
			}
		}).children('a').next().hide();

		$('#block-pcsegments-menu .dropdown').each(function () {
			$(this).position({
				my: 'top left',
				at: 'bottom left',
				of: '#block-pcsegments-menu'
			});
		});

		$('#block-pcsegments-menu li').hover(function () {
			$('.dropdown', this).addClass('open');
			return false;
		}, function () {
			$('.dropdown', this).removeClass('open');
			return false;
		});

		$('.page-segments .region-content fieldset').eq(1).find('.item-list ul').imagesLoaded(function () {
			$(this).masonry({
				itemSelector: 'li',
				isAnimated: true,
				gutterWidth: 10,
				isFitWidth: true
			});

		});
	

        }
    }
})(jQuery);
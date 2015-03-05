(function ($) {
        Drupal.behaviors.pctemplates = {
            detach: function (context) {},
            attach: function (context, settings) {
                $(".item-list ul.type-1 li a").toggle(function () {
                        $(this).addClass("designSelectedColor");
                        $(this).attr('isselected', true);
                    }, function () {
                        $(this).removeClass("designSelectedColor");
                        $(this).removeAttr('isselected');
                    });
                $('.page-templates .filters fieldset').each(function (index, element) {
                        var titles = $(this).find('legend').html();
                        $(this).find('legend').unwrap();
                        $(this).find('legend span').wrap('<a>');
                    });
                $('.page-templates .filters').find('legend span')
                    .wrap('<a href="#"></a>');
                $('.page-templates .filters').find('legend a')
                    .unwrap().wrap('<h3></h3>');
                $('.page-templates .filters').find('h3 , div.fieldset-wrapper').wrapAll('<div id="accordion"></div>');
                var bloc = $('#pctemplates-selection-form').find('ul.selected').parent().clone();
                $('#pctemplates-selection-form').find('ul.selected').parent().remove();
                $('#edit-colors').after(bloc);
                var ownDesignBloc = $('.owndesigntop').parent().clone();
                $('.owndesigntop').parent().remove();
                $('#pctemplates-selection-form').before(ownDesignBloc);
                $('.owndesigntop').parent().addClass('newDesignUpload');
                $('.rectoThumb').hover(function () {
                        var position = jQuery(this).position();
                        $(this).find('.rectoLarge').css('position', 'absolute')
                            .css('left', position.left - 150)
                            .css('top', position.top - 40)
                            .addClass('borderShownImage')
                            .stop()
                            .fadeIn(500)
                            .show();
                    }, function () {
                        $(this).find('.rectoLarge')
                            .removeAttr('style')
                            .removeClass('borderShownImage')
                            .stop()
                            .fadeOut(500)
                            .hide();
                    });
                $('.versoThumb').hover(function () {
                        var position = jQuery(this).position();
                        $(this).find('.versoLarge').css('position', 'absolute')
                            .css('left', position.left - 400)
                            .css('top', position.top - 40)
                            .addClass('borderShownImage')
                            .stop()
                            .fadeIn(500)
                            .show();
                    }, function () {
                        $(this).find('.versoLarge').removeAttr('style')
                            .removeClass('borderShownImage')
                            .stop()
                            .fadeOut(500)
                            .hide();
                    });
                $("#pctemplates-configblock-form").ajaxStart(function () {
                        $(this).css('cursor', 'progress');
                    });
                $("#pctemplates-configblock-form").ajaxStop(function () {
                        $(this).css('cursor', 'default');
                    });
                $('#pctemplates-configblock-form tr.custom td.qty').html($('#pctemplates-configblock-form .form-item-custom-quantity'));
                $('#pctemplates-configblock-form .form-item-custom-quantity label').once(function () {
                        var row = $('<tr></tr>');
                        var cell = $('<td colspan="3"></td>');
                        $(this).appendTo(cell);
                        cell.appendTo(row);
                        row.insertBefore('#pctemplates-configblock-form tr.custom');
                    });
                $('#pctemplates-configblock-form .form-item-custom-quantity input').keyup(function () {
                        $('#pctemplates-configblock-form table tr.custom input').attr('checked', true);
                    }).blur(function () {
                        $('#pctemplates-configblock-form table tr.custom input').trigger('change');
                    });
                if ($.fancybox) {
                    $('#pctemplates-configblock-form .fancybox').fancybox({
                            padding: 0,
                            margin: 0,
                            scrolling: false,
                            autoScale: false,
                            hideOnOverlayClick: false,
                            autoDimensions: true
                        });
                    $('#pctemplates-configblock-form .designtool').fancybox({
                            width: 815,
                            height: 610,
                            padding: 5,
                            margin: 0,
                            scrolling: false,
                            autoScale: false,
                            hideOnOverlayClick: false,
                            autoDimensions: false,
                            modal: true,
                            onStart: function () {
                                jQuery("#fancybox-outer").append("<div id='dt_preloader'></div>");
                            },
                            onComplete: function () {}
                        });
                }
                $('#pctemplates-config-form .page', context).click(function () {
                        $('#pctemplates-configblock-form .designtool').first().click();
                    });
                $('#pctemplates-config-form2 input[type="text"]').once().click(function () {
                        return false;
                    });
                $('#block-pctemplates-specifications', context).once('movespecstoblock', function () {
                        var specs = $('#pctemplates-config-form2 .specifications');
                        $('.content *', this).remove();
                        specs.clone().appendTo($('.content', this));
                        $('#pctemplates-selection-form').children('div').prepend(specs);
                    });
                $('#block-system-main,#block-pctemplates-selection').once('moveselectiontoblock', function () {
                        var filters = $('#pctemplates-selection-form .filters');
                        var form = $('#pctemplates-selection-form');
                        $('#pctemplates-selection-form').children('div').prepend(filters);
                        $('input[type="submit"]', this).click(function () {
                                var value = $('#block-pctemplates-selection input[type="text"]').val();
                                $('input[type="text"]', form).val(value);
                                form.submit();
                            });
                    });
                $('#edit-submit').click(function () {
                        $('#edit-colors').find('li a[isselected="true"]').each(function () {
                                $("<input>").attr({
                                        'type': 'hidden',
                                        'name': $(this).attr('parent-id') + '' + $(this).attr('data-id')
                                    }).val($(this).attr('data-id')).appendTo($('#pctemplates-selection-form'));
                            });
                        $('#pctemplates-selection-form').submit();
                    });
                $('#pctemplates-config-form2 input[type="text"]').once().click(function () {
                        $(this).parents('tr').find('input[type=radio]').attr('checked', true);
                        return false;
                    }).keypress(function (e) {
                        if (e.which == 13) {
                            $(this).blur();
                            return false;
                        }
                        if (e.which == 13) e.preventDefault();
                    });
                $('#pctemplates-config-form2 .dropdown').once().each(function () {
                        var item = $(this).prev();
                        var select = $('select', item);
                        var selected = $('option:selected', select);
                        var replacement = $('<a href="#" class="text"/>');
                        var dropdown = $(this);
                        select.hide();
                        replacement.html(selected.text());
                        item.append(replacement);
                        dropdown.hide();
                        item.click(function () {
                                item.toggleClass('expanded');
                                dropdown.slideToggle(function () {
                                        item.toggleClass('open');
                                    });
                                return false;
                            });
                        $('a', dropdown).click(function () {
                                var val = $(this).attr('id');
                                select.val(val).trigger('change');
                                replacement.html($('option:selected', select).text());
                                $('input[type="radio"]', this).attr('checked', true);
                                dropdown.slideUp(function () {
                                        item.removeClass('open');
                                    });
                                return false;
                            });
                    });

                  $('#pctemplates-config-form2 .form-type-checkboxes').once().each(function() {
                    var item = $(this);
                    var options = $('.form-checkboxes', this);
                    var checked = $('input:checked', options);
                    var texts = [];
                    var productId = $("#productIdValue").val();
                    checked.each(function() {
                        if(productId == 5) {
                           $(this).attr("disabled", true); 
                        }
                      var item = $(this).parent();
                      texts.push($('label', item).html()) ;
                    });

                    if (texts.length == 0) {
                      var defaultText = $('#default-options-text').html();
                      texts.push(defaultText);
                    }
                    var text = $('<a href="#" class="text"/>');
                    text.html(texts.join('<br />'));
                    item.append(text);
                    
                    options.hide();
                    
                    item.click(function() {
                      options.slideToggle(function() {
                        item.toggleClass('expanded');
                      });
                      return false;
                    });

                    $(options.parent()).after(options);
                  });
            }
        }
    })(jQuery);